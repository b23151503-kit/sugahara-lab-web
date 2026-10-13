#!/usr/bin/env python3
"""
Issue やプルリクエストに貼り付けた画像(github.com/user-attachments/... など)が
原稿にそのまま書かれていたら、ダウンロードして public/uploads/YYYY/ に保存し、
原稿の中のアドレスを /uploads/YYYY/xxx.jpg に書き換える。

GitHub の添付画像のアドレスは研究室のサーバーからは表示できないため。
GitHub Actions(ワークフロー)の中で実行する。GITHUB_TOKEN があれば使う。
"""
import os
import re
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

ROOT = Path(sys.argv[sys.argv.index('--root') + 1]) if '--root' in sys.argv else Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'src' / 'content'
UPLOADS = ROOT / 'public' / 'uploads'
PATTERN = re.compile(
    r'https://(?:github\.com/user-attachments/(?:assets|files)/[A-Za-z0-9._/-]+'
    r'|user-images\.githubusercontent\.com/[A-Za-z0-9._/%-]+'
    r'|private-user-images\.githubusercontent\.com/[A-Za-z0-9._/%?=&-]+)'
)
EXT = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp'}


def fetch(url: str, token: str | None) -> tuple[str, str, bytes]:
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        out = tmp.name
    cmd = ['curl', '-sSL', '--retry', '2', '-o', out, '-w', '%{http_code} %{content_type}', '-A', 'Mozilla/5.0']
    if token:
        cmd += ['-H', f'Authorization: Bearer {token}']  # 別ホストへの転送時には curl が自動で外す
    cmd.append(url)
    res = subprocess.run(cmd, capture_output=True, text=True)
    code, _, ctype = res.stdout.partition(' ')
    data = Path(out).read_bytes()
    os.unlink(out)
    return code, ctype.split(';')[0].strip().lower(), data


def download(url: str) -> tuple[bytes, str] | None:
    # 公開リポジトリの添付画像は認証なしで取れる。だめなら GITHUB_TOKEN 付きでもう一度
    tokens = [None]
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if token and url.startswith('https://github.com/'):
        tokens.append(token)
    for t in tokens:
        code, ctype, data = fetch(url, t)
        if code == '200' and ctype in EXT:
            return data, EXT[ctype]
    print(f'::warning::画像を取得できませんでした({code} {ctype}): {url}')
    return None


def shrink(path: Path, limit: int = 1600) -> None:
    """スマホ写真は大きすぎるので、長い辺を limit px に縮める(Pillow があるときだけ)"""
    try:
        from PIL import Image, ImageOps
    except ImportError:
        return
    try:
        im = ImageOps.exif_transpose(Image.open(path))
        if max(im.size) <= limit and path.stat().st_size < 600_000:
            return
        im.thumbnail((limit, limit))
        if path.suffix == '.jpg':
            im.convert('RGB').save(path, quality=84, optimize=True, progressive=True)
        else:
            im.save(path, optimize=True)
    except Exception as e:  # 縮小に失敗しても元の画像はそのまま使う
        print(f'::warning::画像の縮小に失敗: {path.name} ({e})')


def year_of(path: Path) -> str:
    m = re.match(r'(20\d\d)-', path.name)
    return m.group(1) if m else str(date.today().year)


def main() -> int:
    changed = 0
    for f in sorted(list(CONTENT.rglob('*.md')) + list(CONTENT.rglob('*.yml')) + list(CONTENT.rglob('*.yaml'))):
        text = f.read_text(encoding='utf-8')
        urls = list(dict.fromkeys(PATTERN.findall(text)))
        if not urls:
            continue
        year = year_of(f)
        stem = re.sub(r'^20\d\d-\d\d-\d\d-', '', f.stem)
        stem = re.sub(r'[^A-Za-z0-9_-]+', '-', stem).strip('-').lower() or 'image'
        (UPLOADS / year).mkdir(parents=True, exist_ok=True)
        for url in urls:
            got = download(url)
            if not got:
                continue
            data, ext = got
            n = 1
            while True:
                name = f'{stem}.{ext}' if n == 1 else f'{stem}-{n}.{ext}'
                dest = UPLOADS / year / name
                if not dest.exists():
                    break
                n += 1
            dest.write_bytes(data)
            shrink(dest)
            text = text.replace(url, f'/uploads/{year}/{name}')
            print(f'{url} → /uploads/{year}/{name}')
            changed += 1
        f.write_text(text, encoding='utf-8')
    print(f'書き換えた画像: {changed} 件')
    return 0


if __name__ == '__main__':
    sys.exit(main())
