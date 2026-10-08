# 菅原研究室ホームページ

京都工芸繊維大学 集積材料・異相界面科学研究分野 菅原研究室のホームページ。
WordPress をやめ、**GitHub に置いた原稿から静的サイトを自動で組み立てて研究室のサーバーへ送る**仕組みにしたもの。

```
 書く人                          GitHub                             研究室のサーバー
 ─────                           ──────                             ───────────────
 管理画面(/admin/)  ─┐
 inbox/ にメモを置く  ─┼→ src/content/(原稿) → Actions がビルド → rsync / FTPS で配信
 Issue に @claude     ─┘        ↑                       (HTML だけ。PHP・DB なし)
                         AI(Claude)が整えて PR を作る
```

## 更新のしかた(3通り)

1. **管理画面** — `https://(サイト)/admin/` を開き、GitHub でログインしてフォームから書く。
2. **inbox に置く** — `inbox/` にメモ・写真・BibTeX を置いて push。Claude が記事や業績に整えたプルリクエストを作るので、確認してマージ。
3. **Issue で頼む** — Issue に「@claude 〜を追加して」と書く。Claude がプルリクエストを作る。

どの方法でも、main に入るとサイトが自動で更新される(2〜3分)。

## 初期設定(最初に一度だけ)

### 1. サーバーへの配信設定

GitHub のリポジトリ → **Settings → Secrets and variables → Actions** に登録する。

SSH が使える場合(おすすめ):

| Secrets | 内容 |
|---|---|
| `SSH_HOST` | サーバーのホスト名 |
| `SSH_PORT` | ポート番号(22 以外のとき。例: エックスサーバーは 10022) |
| `SSH_USER` | SSH ユーザー名 |
| `SSH_KEY` | 秘密鍵の中身(配信専用に作った鍵。公開鍵をサーバーに登録) |
| `DEPLOY_PATH` | 送り先ディレクトリの絶対パス |

FTP しか使えない場合は `SSH_*` の代わりに `FTP_HOST` / `FTP_USER` / `FTP_PASSWORD` を登録する(FTPS で送る)。

**最初はテスト用ディレクトリに送る。** 今の WordPress と同じ場所に送ると WordPress が壊れるため、
`DEPLOY_PATH` を公開ディレクトリの下の `new` にし、**Variables** に `SITE_BASE` = `/new` を登録する。
→ `https://kit-sugahara-lab.net/new/` で新サイトを確認できる。

本番切り替えのときは、WordPress 一式を退避してから `DEPLOY_PATH` を公開ディレクトリに、`SITE_BASE` を削除する。

### 2. AI 編集の設定

- Secrets に `ANTHROPIC_API_KEY`(または `CLAUDE_CODE_OAUTH_TOKEN`)を登録する。
- **Settings → Actions → General → Workflow permissions** で「Read and write permissions」と
  「Allow GitHub Actions to create and approve pull requests」を有効にする。

### 3. 管理画面のログイン

管理画面(Sveltia CMS)は「Sign In with Token」で、GitHub の **Fine-grained personal access token** を使う。
対象リポジトリをこのリポジトリだけにし、権限は Contents: Read and write を付ける。書く人がそれぞれ自分のトークンを作る。

## 原稿の置き場所

| 場所 | 中身 |
|---|---|
| `src/content/news/` | お知らせ(1記事1ファイル) |
| `src/content/publications/` | 業績(1件1ファイルの YAML) |
| `src/content/members/` | メンバー(1人1ファイル) |
| `src/content/research/` | 研究テーマ |
| `src/content/pages/about.md` | 研究室について |

書き方のルールは [`CLAUDE.md`](CLAUDE.md)。AI もこのルールに従って編集する。

## 移行状況

- 主要ページ(トップ、研究、メンバー、業績 2025・2026年度、お知らせ一覧、問い合わせ)を移行済み。
- 旧お知らせ記事は一覧だけ移し、本文は旧サイトへリンクしている(`legacy_url`)。本番切り替え前に本文を移す。
- 2024年度以前の業績は未移行。
- 画像の一部は旧サイト(`/wp-content/uploads/`)を参照している。

## 手元で動かす

```
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に出力
```
