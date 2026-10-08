# 菅原研究室ホームページ — AI 編集ルール

京都工芸繊維大学 集積材料・異相界面科学研究分野 菅原研究室のホームページ。
Astro で静的サイトを生成し、GitHub Actions で研究室のサーバーへ配信する。
**データ(原稿)はすべて `src/content/` にあり、ここが唯一の正本。** HTML を直接書き換えない。

## ディレクトリ

| 場所 | 中身 | 形式 |
|---|---|---|
| `src/content/news/` | お知らせ 1 記事 1 ファイル | Markdown + frontmatter |
| `src/content/publications/` | 業績 1 件 1 ファイル | YAML |
| `src/content/members/` | メンバー 1 人 1 ファイル | YAML |
| `src/content/research/` | 研究テーマ | Markdown |
| `src/content/pages/` | 固定ページ(about) | Markdown |
| `public/uploads/YYYY/` | 記事の画像 | jpg / png |
| `inbox/` | 人がメモ・写真・BibTeX を置く場所 | 何でも |

項目の定義(必須・選択肢)は `src/content.config.ts` が正。ここに無い値を入れるとビルドが失敗する。

## お知らせ(news)

ファイル名: `YYYY-MM-DD-英数字の短い名前.md`(例: `2026-10-04-ubicomp.md`)

```markdown
---
title: UbiComp 2026 で1件の発表を行いました
date: 2026-10-04
category: 学会発表   # 学会発表 / 受賞 / 論文 / プレス / 研究活動 / 研究室生活 / お知らせ
image: /uploads/2026/ubicomp.jpg   # 任意
---

本文(です・ます調、2〜5段落)。
```

- 書き方: です・ます調。誰が・いつ・どこで・何をしたかを最初の段落で書く。誇張しない。
- 学会発表の記事では、対応する業績ファイルが無ければ `publications/` にも追加する。
- 氏名は `src/content/members/` の表記(姓と名の間に半角スペース)にそろえる。
- 書かれていない事実(日付・会場・受賞名など)を推測で補わない。不明な点は本文に書かず、PR の説明に「要確認」として列挙する。

## 業績(publications)

ファイル名: `YYYY-MM-DD-筆頭著者の姓(ローマ字小文字)-連番.yml`(日付不明なら `YYYY-姓-連番.yml`)

```yaml
type: 国内学会        # 論文 / 総説・解説 / 国際学会 / 国内学会 / 招待講演 / 受賞 / 特許
authors:
  - 桂 章皓
  - 菅原 徹
title: 発表タイトル
venue: 応用物理学会 春季学術講演会(東京都目黒区)
year: 2026
date: 2026-03-16      # 分かる精度で。"2026-03" も可。不明なら書かない
volume_pages: 737, 166868   # 任意
doi: 10.1016/j.apsusc.2026.166868   # 任意。https://doi.org/ は付けない
note: 口頭発表        # 任意(受賞記念講演、注目講演など)
```

- BibTeX が渡されたら 1 エントリ 1 ファイルに変換する。英語論文の著者は BibTeX の表記に従う。
- 同じ業績(タイトル・会議・日付が同じ)がすでにあれば重複して作らない。

## メンバー(members)

ファイル名: `姓-名.yml`(ローマ字小文字、例 `katsura-akihiro.yml`)

```yaml
name: 桂 章皓
name_en: Akihiro Katsura
role: 博士課程   # 教授 / 准教授 / 助教 / 特任教員 / 研究員 / 技術補佐員 / 事務補佐員 / リサーチアシスタント / 博士課程 / 修士課程 / 学部生 / 研究生
status: 在籍     # 在籍 / 卒業・修了
order: 20        # 小さいほど上
```

- 卒業・修了したメンバーはファイルを消さず `status: 卒業・修了` と `graduated: 2026-03` にする。
- 進級(学部生→修士課程など)は `role` を書き換える。

## inbox の処理

`inbox/` に置かれたものを読み、上のルールで `src/content/` に反映する。

- メモ・箇条書き → お知らせ記事。学会発表なら業績も。
- 写真 → `public/uploads/YYYY/` に英数字のファイル名で移し、記事の `image` や本文から参照。
- BibTeX / 論文リスト → 業績ファイル。
- 新メンバー・卒業の名簿 → メンバーファイル。
- 処理したファイルは inbox から削除する(`README.md` と `.gitkeep` は残す)。
- 判断できないものは変更せず、報告に「要確認」として書く。

## してはいけないこと

- `legacy_url` のある旧記事の削除(旧サイトへのリンクとして使っている)。
- `public/.htaccess` と `.github/workflows/` の変更(頼まれたときだけ)。
- 個人の連絡先・学籍番号など、公開ページに出すべきでない情報の追加。

## 確認

変更後は `npm run build && npm run check:dist` が通ること。
