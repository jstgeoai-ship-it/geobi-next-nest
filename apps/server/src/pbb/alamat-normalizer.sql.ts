import { ALAMAT_ABBR } from '@geobi/shared';

/**
 * Port of PetaPbbController::normAlamatSql(). Builds a nested
 * regexp_replace(...) chain over the SAME shared ALAMAT_ABBR map, iterated in
 * the same insertion order as normAlamat() above — each replace operates on
 * the previous step's output, so order fidelity is what keeps the SQL-side
 * and JS-side normalizers producing identical results.
 */
export function normAlamatSql(col: string): string {
  let expr = `' ' || regexp_replace(lower(${col}), '[^a-z0-9]+', ' ', 'g') || ' '`;

  for (const [from, to] of ALAMAT_ABBR) {
    const rep = to === '' ? `' '` : `' ${to} '`;
    expr = `regexp_replace(${expr}, ' ${from} ', ${rep}, 'g')`;
  }

  return `regexp_replace(${expr}, ' +', ' ', 'g')`;
}
