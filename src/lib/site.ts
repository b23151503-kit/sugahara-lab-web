export const SITE = {
  name: 'Sugahara Lab.',
  nameJa: '菅原研究室',
  nameEn: 'Advanced IntGFC Materials Laboratory',
  affiliation: '京都工芸繊維大学 集積材料・異相界面科学研究分野',
  university: '京都工芸繊維大学',
  description:
    '京都工芸繊維大学 集積材料・異相界面科学研究分野 菅原研究室。セラミックスコーティング、半導体実装技術、熱電変換技術の研究を行っています。',
  address: '〒606-8585 京都府京都市左京区松ヶ崎上町',
  tel: '+81-75-724-7566',
  mailUser: 'sugaharathr',
  mailDomain: 'kit.ac.jp',
};

export const NAV = [
  { href: '/about/', label: 'About', ja: '研究室について' },
  { href: '/research/', label: 'Research', ja: '研究内容' },
  { href: '/news/', label: 'News', ja: 'お知らせ' },
  { href: '/members/', label: 'Members', ja: 'メンバー' },
  { href: '/publications/', label: 'Publications', ja: '業績' },
];

/** base(テスト公開ディレクトリ)を考慮したURLを返す */
export function url(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
