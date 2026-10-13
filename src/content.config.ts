import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// お知らせ: src/content/news/YYYY-MM-DD-xxx.md (1記事1ファイル)
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['学会発表', '受賞', '論文', 'プレス', '研究活動', '研究室生活', 'お知らせ']).default('お知らせ'),
    image: z.string().optional(),
    // 旧WordPressサイトの記事URL(本文が未移行の記事のみ)
    legacy_url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

// 業績: src/content/publications/*.yml (1件1ファイル)
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/publications' }),
  schema: z.object({
    type: z.enum(['論文', '総説・解説', '書籍', '国際学会', '国内学会', '招待講演', '受賞', 'その他', '特許']),
    authors: z.array(z.string()).min(1),
    title: z.string(),
    venue: z.string(),
    year: z.number().int(),
    date: z.string().optional(), // "2026-04" や "2026-03-15"
    volume_pages: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    note: z.string().optional(),
    subject: z.string().optional(), // 受賞の対象(発表タイトル・論文など)
    period: z.string().optional(), // 助成・共同研究などの期間(例: 2025年6月〜2028年3月)
    recipients: z.array(z.string()).optional(), // 受賞者(省略時は著者欄の1人目)
  }),
});

// メンバー: src/content/members/*.yml (1人1ファイル)
const members = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/members' }),
  schema: z.object({
    name: z.string(),
    name_en: z.string().optional(),
    role: z.enum(['教授', '准教授', '助教', '特任教員', '研究員', '技術補佐員', '事務補佐員', 'リサーチアシスタント', '博士課程', '修士課程', '学部生', '研究生', '研究室生']),
    status: z.enum(['在籍', '卒業・修了']).default('在籍'),
    order: z.number().default(100),
    photo: z.string().optional(),
    note: z.string().optional(),
    theme: z.string().optional(), // 研究テーマ(文章)
    keywords: z.array(z.string()).optional(), // 研究キーワード(名前の下に表示)
    researchmap: z.string().url().optional(), // researchmap の URL
    // 経歴(年表)。[{ date: 2022年4月, text: 京都工芸繊維大学 教授 }, ...] の形。文章1つでも可
    career: z.union([z.string(), z.array(z.object({ date: z.coerce.string(), text: z.string() }))]).optional(),
    website: z.string().url().optional(), // 個人のウェブサイト
    societies: z.string().optional(), // 所属学会
    aliases: z.array(z.string()).optional(), // 業績の著者欄での別表記(例: ミクッチ ダニエレ)
    // 卒業・修了/退職した年(例: 2026 や 2026-03)。在籍中は書かない
    graduated: z.coerce.string().optional(),
  }),
});

// 研究テーマ: src/content/research/*.md
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    title_ja: z.string(),
    order: z.number().default(10),
    summary: z.string(),
    image: z.string().optional(),
  }),
});

// 研究設備: src/content/facilities/*.yml (1台1ファイル)。name が空なら「名称準備中」と表示
const facilities = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/facilities' }),
  schema: z.object({
    name: z.string().optional().default(''), // 装置名
    model: z.string().optional().default(''), // メーカー・型番
    description: z.string().optional().default(''), // ひとこと説明
    image: z.string(),
    order: z.number().default(100),
  }),
});

// 固定ページ: src/content/pages/*.md (about など)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    lead: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { news, publications, members, research, facilities, pages };
