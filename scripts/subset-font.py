"""ビルド後の dist/ で使われている文字だけを集めて、モナポ(Monapo)フォントを軽い woff2 に切り出す。

使い方: python3 scripts/subset-font.py <monapo.ttf> <dist>
出力:   <dist>/fonts/monapo.woff2 と、ライセンス文書 <dist>/fonts/LICENSE-monapo.txt
"""
import html, os, re, shutil, subprocess, sys

ttf, dist = sys.argv[1], sys.argv[2]
chars = set()
for root, _, files in os.walk(dist):
    for f in files:
        if f.endswith('.html'):
            t = open(os.path.join(root, f), encoding='utf-8', errors='ignore').read()
            t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S)
            chars.update(html.unescape(re.sub(r'<[^>]+>', ' ', t)))
# 管理画面などで後から入る文字に備えて、基本的な文字はいつも含める
base = ''.join(chr(c) for c in range(0x20, 0x7f))
base += ''.join(chr(c) for c in range(0x3041, 0x3097)) + ''.join(chr(c) for c in range(0x30a1, 0x30fb))
base += '、。・「」『』（）【】〜ー―…：；！？％＆＠＃'
chars.update(base)
text_file = os.path.join(dist, '.font-chars.txt')
open(text_file, 'w', encoding='utf-8').write(''.join(sorted(c for c in chars if c.strip())))
os.makedirs(os.path.join(dist, 'fonts'), exist_ok=True)
out = os.path.join(dist, 'fonts', 'monapo.woff2')
subprocess.run(['pyftsubset', ttf, f'--text-file={text_file}', '--flavor=woff2', f'--output-file={out}', '--layout-features=*'], check=True)
os.remove(text_file)
lic = os.environ.get('MONAPO_LICENSE')
if lic and os.path.exists(lic):
    shutil.copy(lic, os.path.join(dist, 'fonts', 'LICENSE-monapo.txt'))
print(f'{len(chars)} chars -> {out} ({os.path.getsize(out) // 1024} KB)')
