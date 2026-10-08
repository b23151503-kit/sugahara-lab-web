// @ts-check
import { defineConfig } from 'astro/config';

// SITE_BASE: 公開するディレクトリ。テスト公開で /new/ に置くときは "/new" を指定。本番は "/"。
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://kit-sugahara-lab.net',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
