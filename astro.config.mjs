// @ts-check
import { defineConfig } from 'astro/config';

// SITE_BASE: 公開するディレクトリ。テスト公開で /new/ に置くときは "/new" を指定。本番は "/"。
const base = process.env.SITE_BASE || '/';
const prefix = base.replace(/\/$/, '');

// Markdown 本文中の「/」で始まる画像・リンク(/uploads/..., /images/... など)に公開ディレクトリを付ける。
// これで管理画面から入れた画像も、テスト公開(/new/)とプレビューの両方で表示される。
function rehypeBasePath() {
  const fix = (v) => (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && prefix && !v.startsWith(prefix + '/') ? prefix + v : v);
  const walk = (node) => {
    if (node.type === 'element' && node.properties) {
      if (node.tagName === 'img') node.properties.src = fix(node.properties.src);
      if (node.tagName === 'a') node.properties.href = fix(node.properties.href);
    }
    (node.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://kit-sugahara-lab.net',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [rehypeBasePath] },
});
