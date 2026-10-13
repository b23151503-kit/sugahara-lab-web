// メンバーと業績(publications)の著者名を結びつける。
// 著者欄の「桂 章皓」「Akihiro Katsura」「A. Katsura」のどれでも同じ人として扱う。
// 表記が特殊な場合は、メンバーの YAML に aliases(別表記)を書けば一致させられる。

export const norm = (s: string) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s.・,]/g, '');

/** メンバー1人ぶんの、著者欄で使われうる表記(正規化済み)の一覧 */
export function nameKeys(m: { data: { name: string; name_en?: string; aliases?: string[] } }): string[] {
  const keys = new Set<string>();
  keys.add(norm(m.data.name));
  const en = m.data.name_en?.trim();
  if (en) {
    const parts = en.split(/\s+/);
    keys.add(norm(en)); // Akihiro Katsura
    if (parts.length >= 2) {
      const first = parts[0];
      const last = parts[parts.length - 1];
      keys.add(norm(`${first[0]}${last}`)); // A. Katsura
      keys.add(norm(`${last}${first}`)); // Katsura Akihiro
    }
  }
  for (const a of m.data.aliases ?? []) keys.add(norm(a));
  return [...keys];
}

/** 業績の著者に含まれるメンバーの id 一覧 */
export function authorsToMembers(authors: string[], members: any[]): string[] {
  const authorKeys = new Set(authors.map(norm));
  return members.filter((m) => nameKeys(m).some((k) => authorKeys.has(k))).map((m) => m.id);
}

/** その業績の筆頭著者(著者欄の1人目)がメンバーなら、その id */
export function firstAuthorMember(authors: string[], members: any[]): string | undefined {
  if (!authors.length) return undefined;
  const k = norm(authors[0]);
  return members.find((m) => nameKeys(m).includes(k))?.id;
}

/** その人が筆頭著者か(著者欄の1人目) */
export function isFirstAuthor(pub: any, member: any): boolean {
  const a = pub.data.authors[0];
  return !!a && nameKeys(member).includes(norm(a));
}

/**
 * その業績を「誰の実績」として数えるか。
 * 受賞は受賞者本人だけ(recipients があればその人、なければ著者欄の1人目=発表者)。
 * それ以外は著者全員。
 */
export function pubMembers(p: any, members: any[]): string[] {
  if (p.data.type === '受賞') {
    const who = p.data.recipients?.length ? p.data.recipients : p.data.authors.slice(0, 1);
    return authorsToMembers(who, members);
  }
  return authorsToMembers(p.data.authors, members);
}

/** メンバー id → その人の業績一覧 */
export function pubsByMember(pubs: any[], members: any[]): Map<string, any[]> {
  const map = new Map<string, any[]>(members.map((m) => [m.id, []]));
  for (const p of pubs) {
    for (const id of pubMembers(p, members)) map.get(id)!.push(p);
  }
  return map;
}

export const pubKey = (p: any) => p.data.date ?? String(p.data.year);
export const sortPubs = (pubs: any[]) => [...pubs].sort((a, b) => pubKey(b).localeCompare(pubKey(a)));

/** 研究テーマを考えるときに見る業績の種類(筆頭著者・筆頭発表者のもの) */
export const THEME_TYPES = ['論文', '総説・解説', '書籍', '特許', '国際学会', '国内学会', '招待講演'];

/**
 * 研究テーマ(theme)の見直しが必要な在籍メンバーを返す。
 * 筆頭著者・筆頭発表者の業績のうち、theme_basis(テーマを書いたときに考慮した最新の業績の日付)より
 * 新しいものがあれば「見直し候補」。theme が無いのに筆頭の業績がある人も候補。
 */
export function themeReview(members: any[], pubs: any[]) {
  const out: { member: any; reason: string; newer: any[] }[] = [];
  for (const m of members) {
    if (m.data.status !== '在籍') continue;
    const mine = sortPubs(pubs.filter((p) => THEME_TYPES.includes(p.data.type) && isFirstAuthor(p, m)));
    if (!mine.length) continue;
    const basis = m.data.theme_basis ? String(m.data.theme_basis) : '';
    if (!m.data.theme) {
      out.push({ member: m, reason: '研究テーマが未記入', newer: mine.slice(0, 5) });
      continue;
    }
    const newer = basis ? mine.filter((p) => pubKey(p) > basis) : mine.slice(0, 5);
    if (newer.length) out.push({ member: m, reason: basis ? `${basis} 以降の筆頭業績あり` : 'theme_basis が未記入', newer });
  }
  return out;
}

/** 卒業生の区分表示(修士課程 → 修士課程修了 など) */
export function alumniLabel(role: string): string {
  if (role === '学部生') return '学部卒業';
  if (role === '修士課程' || role === '博士課程') return `${role}修了`;
  if (role === '研究室生') return '元研究室生';
  return role;
}
