# 菅原研究室ホームページ

京都工芸繊維大学 集積材料・異相界面科学研究分野 菅原研究室のホームページ。
WordPress をやめ、**GitHub に置いた原稿から静的サイトを自動で組み立てて研究室のサーバーへ送る**仕組みにしたもの。

```
 書く人                          GitHub                             研究室のサーバー
 ─────                           ──────                             ───────────────
 管理画面(/admin/)  ─┐
 inbox/ にメモを置く  ─┼→ src/content/(原稿) → Actions がビルド → rsync で配信
 Issue に @ai         ─┘        ↑                       (HTML だけ。PHP・DB なし)
                         AI(Gemini / Copilot / Claude)が整えて PR を作る
                         → プレビュー(GitHub Pages)で確認してからマージ
```

**はじめての設定は [docs/SETUP.md](docs/SETUP.md)、ふだんの更新は [docs/HOW-TO-UPDATE.md](docs/HOW-TO-UPDATE.md) を見てください。**

## 更新のしかた(3通り)

1. **管理画面** — `https://(サイト)/admin/` を開き、GitHub でログインしてフォームから書く。
2. **inbox に置く** — `inbox/` にメモ・写真・BibTeX を置いて push。AI が記事や業績に整えたプルリクエストを作るので、確認してマージ。
3. **Issue で頼む** — Issue に「@ai 〜を追加して」と書く(Copilot Pro なら Assignees で Copilot を選ぶ)。AI がプルリクエストを作る。

どの方法でも、main に入るとサイトが自動で更新される(2〜3分)。

## 初期設定

[docs/SETUP.md](docs/SETUP.md) に、エックスサーバーの SSH 設定から AI キーの登録まで、画面の開き方つきで書いてあります。

## 使う AI

| AI | 必要なもの | 使い方 |
|---|---|---|
| Gemini(無料枠あり) | Secrets `GEMINI_API_KEY` | inbox に置く / Issue に `@ai` |
| GitHub Copilot Pro | Copilot Pro の契約 | Issue の Assignees で Copilot を選ぶ |
| Claude | Secrets `ANTHROPIC_API_KEY` | inbox に置く / Issue に `@ai` |

どの AI も、ルールファイル [`AGENTS.md`](AGENTS.md) を読んで同じ書き方で編集します(`CLAUDE.md`・`GEMINI.md`・`.github/copilot-instructions.md` は AGENTS.md を指しているだけ)。

## 原稿の置き場所

| 場所 | 中身 |
|---|---|
| `src/content/news/` | お知らせ(1記事1ファイル) |
| `src/content/publications/` | 業績(1件1ファイルの YAML) |
| `src/content/members/` | メンバー(1人1ファイル) |
| `src/content/research/` | 研究テーマ |
| `src/content/pages/about.md` | 研究室について |

書き方のルールは [`AGENTS.md`](AGENTS.md)。AI もこのルールに従って編集する。

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
