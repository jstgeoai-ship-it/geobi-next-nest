/**
 * Port of dashboard.blade.php's Photon-then-Nominatim "tempat umum" geocoder
 * fallback for the alamat search mode — used only when the PBB database
 * itself doesn't cover an address (data only spans Kel. Pondok Pinang).
 */

const PHOTON_URL = 'https://photon.komoot.io/api/';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const JKT_VIEWBOX = '106.68,-6.38,107.00,-6.10';
const JKT_CENTER = { lat: -6.28, lon: 106.78 };

export interface GeoItem {
  title: string;
  detail: string;
  lng: number;
  lat: number;
  badge: 'Tempat umum';
}

const AKRONIM = new Set(['DKI', 'UPPPD', 'UPPD', 'RT', 'RW', 'RSUD', 'SD', 'SMP', 'SMA', 'SMK', 'PT', 'CV', 'BPN', 'KPP', 'DPRD']);

function rapiKapital(teks: unknown): string {
  const s = String(teks ?? '').trim();
  if (!s) return '';
  if (s !== s.toUpperCase()) return s;
  return s
    .split(/\s+/)
    .map((w) => {
      const bersih = w.replace(/[^A-Za-z]/g, '');
      if (AKRONIM.has(bersih.toUpperCase())) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

const ALIAS_TEMPAT: { cocok: (n: string) => boolean; nama: string }[] = [
  {
    cocok: (n) => /(bapenda|badan\s+pendapatan\s+daerah)/i.test(n) && /(dki|jakarta)/i.test(n),
    nama: 'Badan Pendapatan Daerah (Bapenda) Jakarta',
  },
];

function namaTempat(mentah: unknown): string {
  let s = String(mentah ?? '').trim();
  if (!s) return '';
  const alias = ALIAS_TEMPAT.find((a) => a.cocok(s));
  if (alias) return alias.nama;
  s = s.split('/')[0].trim();
  return rapiKapital(s);
}

function normProvinsi(state: unknown, kota: unknown): string {
  if (/jakarta/i.test(`${state ?? ''} ${kota ?? ''}`)) return 'Daerah Khusus Ibukota Jakarta';
  return rapiKapital(state);
}

function gabungAlamat(bagian: unknown[], kodePos?: unknown): string {
  const out: string[] = [];
  bagian
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean)
    .forEach((s) => {
      if (!out.some((x) => x.toLowerCase() === s.toLowerCase())) out.push(s);
    });
  let hasil = out.join(', ');
  if (kodePos) hasil = hasil ? `${hasil} ${kodePos}` : String(kodePos);
  return hasil;
}

function barisJalan(jalan?: unknown, nomor?: unknown): string {
  if (!jalan) return nomor ? `No.${nomor}` : '';
  return nomor ? `${jalan} No.${nomor}` : String(jalan);
}

async function fetchPhoton(q: string): Promise<GeoItem[]> {
  const url = `${PHOTON_URL}?limit=5&lat=${JKT_CENTER.lat}&lon=${JKT_CENTER.lon}&q=${encodeURIComponent(q)}`;
  const d = await fetch(url).then((r) => r.json());
  const fts = Array.isArray(d?.features) ? d.features : [];
  return fts
    .map((f: any) => {
      const p = f.properties || {};
      const brs = barisJalan(p.street, p.housenumber);
      const judul = namaTempat(p.name) || brs || '—';
      return {
        title: judul,
        detail: gabungAlamat(
          [judul === brs ? null : brs, p.locality, rapiKapital(p.district), rapiKapital(p.county), rapiKapital(p.city), normProvinsi(p.state, p.city)],
          p.postcode,
        ),
        lng: f.geometry?.coordinates?.[0],
        lat: f.geometry?.coordinates?.[1],
        badge: 'Tempat umum' as const,
      };
    })
    .filter((x: GeoItem) => x.lng != null && x.lat != null);
}

async function fetchNominatim(q: string): Promise<GeoItem[]> {
  const url = `${NOMINATIM_URL}?format=jsonv2&addressdetails=1&limit=5&countrycodes=id&viewbox=${JKT_VIEWBOX}&bounded=0&q=${encodeURIComponent(q)}`;
  const data = await fetch(url, { headers: { 'Accept-Language': 'id' } }).then((r) => r.json());
  if (!Array.isArray(data)) return [];
  return data.map((d: any) => {
    const a = d.address || {};
    const brs = barisJalan(a.road, a.house_number);
    const judul = namaTempat(d.name || String(d.display_name || '').split(',')[0]) || '—';
    return {
      title: judul,
      detail: gabungAlamat(
        [
          judul === brs ? null : brs,
          a.city_block || a.neighbourhood,
          rapiKapital(a.village),
          rapiKapital(a.suburb),
          rapiKapital(a.city_district || a.municipality),
          rapiKapital(a.city || a.town || a.county),
          normProvinsi(a.state, a.city || a.town || a.county),
        ],
        a.postcode,
      ),
      lng: parseFloat(d.lon),
      lat: parseFloat(d.lat),
      badge: 'Tempat umum' as const,
    };
  });
}

/** Photon first (understands partial words), Nominatim as fallback. */
export async function fetchExternalGeocoder(q: string): Promise<GeoItem[]> {
  try {
    const results = await fetchPhoton(q);
    if (results.length) return results;
  } catch {
    // fall through to Nominatim
  }
  try {
    return await fetchNominatim(q);
  } catch {
    return [];
  }
}
