/**
 * Address-abbreviation expansion table, ported verbatim from
 * `PetaPbbController::ALAMAT_ABBR` (Laravel). Iteration order matters: both
 * the JS-side normalizer and the SQL-side nested regexp_replace builder walk
 * this map in insertion order, and each replace operates on the previous
 * step's output — reordering entries changes normalization results.
 * Empty-string values mean "drop this token" (kel/kec/kab/kota/no prefixes).
 */
export const ALAMAT_ABBR: ReadonlyMap<string, string> = new Map([
  ['jln', 'jalan'],
  ['jl', 'jalan'],
  ['gg', 'gang'],
  ['gng', 'gang'],
  ['kel', ''],
  ['kec', ''],
  ['kab', ''],
  ['kota', ''],
  ['no', ''],
  ['rt', 'rt'],
  ['rw', 'rw'],
]);
