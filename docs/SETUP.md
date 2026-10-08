# 初期設定ガイド(はじめての人向け)

上から順番にやれば、新しいホームページがテスト用のアドレス
`https://kit-sugahara-lab.net/new/` に公開され、AI で原稿を更新できるようになります。
所要時間の目安は 30〜40 分です。

> この画面の GitHub は、リポジトリ `b23151503-kit/sugahara-lab-web` のページのことです。

---

## ステップ 1. エックスサーバーで SSH を使えるようにする

1. エックスサーバーの **サーバーパネル** にログインする。
2. 「アカウント」の中の **「SSH設定」** を開く。
3. **SSH設定を「ON」** にする(「変更」→ ON)。
4. 同じ画面の **「アクセス制限」**(国外IPアクセス制限)を **OFF** にする。
   - GitHub のサーバーは海外にあるため、ON のままだと配信できません。
   - 鍵(ステップ 2)を持っている人しか入れないので、OFF でも安全性は保たれます。
5. **「+公開鍵を登録」** を押す。
   - ラベル: `github-actions` など何でも可
   - **パスフレーズは設定しない**(空のまま)
   - 「登録して秘密鍵をダウンロードする」を押すと、`サーバーID.key` というファイルがダウンロードされる。
6. 画面のどこかに出ている **サーバーID**(`xabc1234` のような英数字)をメモしておく。

> ダウンロードした `.key` ファイルはサーバーに入るための鍵です。他人に渡したり、メールやチャットに貼ったりしないでください。

### 公開先のフォルダを確認する

サーバーパネルの **「ファイル管理」** を開き、
`kit-sugahara-lab.net` → `public_html` があることを確認します。
この中に WordPress のファイル(`wp-content` など)があれば OK です。
新サイトはこの中の `new` フォルダに置きます(フォルダは自動で作られます)。

---

## ステップ 2. GitHub にサーバー情報を登録する(Secrets)

1. GitHub のリポジトリページ上部の **「Settings」** を開く。
2. 左のメニューの **「Secrets and variables」→「Actions」** を開く。
3. **下の方の「Repository secrets」の緑のボタン「New repository secret」** を押す。
   - 上の「Environment secrets」は使いません。もし作ってしまっていても害はないので、そのままで大丈夫です。
4. 「Name」と「Secret」を入れて **「Add secret」**。これを下の表の 5 つぶん繰り返す。

| Name(そのまま入力) | Secret(入れる値) |
|---|---|
| `SSH_HOST` | `サーバーID.xsrv.jp`(例: `xabc1234.xsrv.jp`) |
| `SSH_PORT` | `10022` |
| `SSH_USER` | サーバーID(例: `xabc1234`) |
| `SSH_KEY` | ダウンロードした `.key` ファイルをメモ帳で開き、**中身を全部**コピーして貼る(`-----BEGIN` の行から `-----END ...-----` の行まで全部) |
| `DEPLOY_PATH` | `/home/サーバーID/kit-sugahara-lab.net/public_html/new`(例: `/home/xabc1234/kit-sugahara-lab.net/public_html/new`) |

5. 同じ画面の **「Variables」タブ** → **「New repository variable」** で 1 つ登録する。

| Name | Value |
|---|---|
| `SITE_BASE` | `/new` |

---

## ステップ 3. 試しに配信してみる

1. リポジトリ上部の **「Actions」** を開く。
2. 左の一覧から **「Build & Deploy」** を選ぶ。
3. 右側の **「Run workflow」→ 緑の「Run workflow」** を押す。
4. 1〜3 分待つ。行の左が **緑のチェック ✓** になれば成功。
5. ブラウザで `https://kit-sugahara-lab.net/new/` を開いて、新しいサイトが出れば完了です。

赤い ✗ になったら、その行をクリック → 赤くなっている項目を開くとエラーが読めます。
よくある原因:

- `Permission denied (publickey)` → `SSH_KEY` の貼り付けが途中で切れている / SSH 設定が OFF
- `Connection timed out` → 国外IPアクセス制限が ON のまま / `SSH_PORT` が 10022 になっていない
- `No such file or directory` → `DEPLOY_PATH` のサーバーIDやドメイン名の打ち間違い

---

## ステップ 4. プレビュー(本番に出す前の確認用ページ)を有効にする

AI が作った変更案を、本番に出す前に見た目で確認するためのページです。

1. **Settings → 左メニューの「Pages」** を開く。
2. 「Build and deployment」の **Source を「GitHub Actions」** にする(保存ボタンはありません。選ぶだけ)。
3. **Actions → 左の「Preview」→「Run workflow」→「Run workflow」** を押す。
4. 終わったら `https://b23151503-kit.github.io/sugahara-lab-web/` を開く。左下に「プレビュー表示中」と出ていれば OK。

---

## ステップ 5. AI を使えるようにする(どれか 1 つ。無料なら A)

### A. Gemini(Google、無料枠あり)— おすすめ

1. <https://aistudio.google.com/> に Google アカウントでログインする。
2. 左下などにある **「Get API key」→「Create API key」** を押し、表示されたキー(`AIza...`)をコピーする。
3. GitHub の **Settings → Secrets and variables → Actions → New repository secret** で登録する。
   - Name: `GEMINI_API_KEY`
   - Secret: コピーしたキー
4. これで、inbox にファイルを置く/Issue に「@ai」と書くと、Gemini が変更案を作ります。

> 無料枠では、送った内容が Google のサービス改善に使われる場合があります。公開前提の原稿なら問題ありませんが、未発表の研究内容などは書かないでください。

### B. GitHub Copilot Pro を契約している場合

1. 新しい Issue を作り、やってほしいことを書く(例: 「10/4 の UbiComp での発表をお知らせと業績に追加して」)。
2. 右側の **Assignees** で **Copilot** を選ぶ。
3. 数分〜十数分で Copilot がプルリクエストを作る。ルールは `AGENTS.md` を読んで守ります。
4. Copilot のプルリクエストでは、下に「Approve and run workflows」というボタンが出ることがあります。押すと確認用のビルドが動きます。

### C. Claude(API キーを持っている場合)

Secrets に `ANTHROPIC_API_KEY` を登録すれば、A と同じ使い方で Claude が動きます。
Gemini と両方登録した場合は Gemini が優先されます(Variables の `AI_PROVIDER` に `claude` と入れると Claude 固定)。

### 共通: 設定済みの項目

**Settings → Actions → General → Workflow permissions** の
「Read and write permissions」と「Allow GitHub Actions to create and approve pull requests」は設定済みのはずです。
AI が変更案を作れないときは、ここを確認してください。

---

## ステップ 6. 管理画面にログインできるようにする

管理画面 `https://kit-sugahara-lab.net/new/admin/` は、GitHub の「トークン」でログインします。

1. GitHub 右上の自分のアイコン → **Settings** → 左メニュー一番下の **Developer settings**。
2. **Personal access tokens → Fine-grained tokens → Generate new token**。
3. 次のように設定して **Generate token**:
   - Token name: `lab-cms` など
   - Expiration: 1 年など
   - Repository access: **Only select repositories** → `sugahara-lab-web`
   - Permissions → Repository permissions → **Contents: Read and write**
4. 表示されたトークン(`github_pat_...`)をコピーし、管理画面で **「Sign In with Token」** を押して貼り付ける。

> トークンは一度しか表示されません。パスワードと同じ扱いで保管してください。学生に更新を任せるときは、各自が自分の GitHub アカウントで同じ手順でトークンを作り、リポジトリの Collaborator に招待します。

---

## 本番切り替え(テスト公開で問題がないと確認できてから)

これは WordPress を止める作業なので、やるときに改めて手順を確認してください。大まかには:

1. WordPress のファイルとデータベースをバックアップする。
2. 旧お知らせ記事の本文と画像を新サイトに移す。
3. `public_html` の WordPress のファイルを別フォルダに退避する。
4. Secrets の `DEPLOY_PATH` から末尾の `/new` を消し、Variables の `SITE_BASE` を削除して、Build & Deploy を実行する。
