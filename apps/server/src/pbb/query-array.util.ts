/** Normalizes an Express query param (string | string[] | undefined) into a clean string[]. */
export function toArray(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.map((v) => String(v)).filter((v) => v.length > 0);
}
