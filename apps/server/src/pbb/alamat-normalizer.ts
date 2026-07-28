import { ALAMAT_ABBR } from '@geobi/shared';

/**
 * Port of PetaPbbController::normAlamat(). Lowercase, punctuation -> space,
 * expand/drop abbreviations token-by-token, rejoin. Must stay in lockstep
 * with normAlamatSql() below (same ALAMAT_ABBR map, same semantics).
 */
export function normAlamat(s: string): string {
  const lowered = s.toLowerCase();
  const spaced = lowered.replace(/[^a-z0-9]+/g, ' ');
  const tokens = spaced.trim().split(/\s+/).filter(Boolean);

  const out: string[] = [];
  for (const t of tokens) {
    const mapped = ALAMAT_ABBR.has(t) ? ALAMAT_ABBR.get(t)! : t;
    if (mapped !== '') out.push(mapped);
  }
  return out.join(' ');
}

/** Port of PHP's addcslashes($q, '%_\\') — escape LIKE metacharacters. */
export function escapeLikeChars(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
