// ビルド結果を本番へ送る前の安全確認。足りないものがあれば失敗させて配信を止める。
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const required = ['index.html', 'news/index.html', 'research/index.html', 'members/index.html', 'publications/index.html', 'contact/index.html', 'about/index.html', 'images/hero.jpg', 'admin/index.html', 'admin/config.yml', '.htaccess'];
const missing = required.filter((f) => !existsSync(join(dist, f)));

let pages = 0;
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages++;
  }
};
walk(dist);

const MIN_PAGES = 10;
console.log(`HTML pages: ${pages}`);
if (missing.length) {
  console.error('必須ファイルがありません:', missing.join(', '));
  process.exit(1);
}
if (pages < MIN_PAGES) {
  console.error(`生成ページ数が少なすぎます (${pages} < ${MIN_PAGES})`);
  process.exit(1);
}
console.log('OK');
