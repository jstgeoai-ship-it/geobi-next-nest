'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap, Marker, Popup } from 'maplibre-gl';
import { BASEMAP_STYLES } from '../lib/basemap-styles';
import { COLOR_EXPR } from '../lib/color-expr';
import { AttrControl } from '../lib/maplibre-controls/AttrControl';
import { MapToolsControl } from '../lib/maplibre-controls/MapToolsControl';
import { MapNavControl } from '../lib/maplibre-controls/MapNavControl';
import { kelurahanPopupHTML, persilPopupHTML } from '../lib/popup-html';
import { useFiltersStore } from '../store/filters.store';
import { useTheme } from '@/lib/useTheme';

const MARTIN = process.env.NEXT_PUBLIC_MARTIN_URL || 'http://localhost:3000';
const TABLE = 'data_tanah_map';

/** `tanah` source tiles come from our own year-filtered endpoint (not Martin — its
 *  function-source discovery doesn't work reliably against Supabase's pooler), so the
 *  server only ever serializes one tahun_pajak's worth of features per tile. */
export function buildTanahTilesUrl(tahun: string) {
  const qs = tahun ? `?tahun=${encodeURIComponent(tahun)}` : '';
  return '/api/tiles/data-tanah-map/{z}/{x}/{y}' + qs;
}

interface Options {
  showScaleControl: boolean;
  showBasemapSwitcher: boolean;
  showStatChip: boolean;
  showTour: boolean;
  onTourOpen: () => void;
}

export function useDashboardMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
  statChipRef: React.RefObject<HTMLDivElement | null>,
  opts: Options,
) {
  const mapRef = useRef<MaplibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchMarkerRef = useRef<Marker | null>(null);
  const searchPopupRef = useRef<Popup | null>(null);
  const initialBoundsRef = useRef<[[number, number], [number, number]] | null>(null);
  const locMarkerRef = useRef<Marker | null>(null);
  const locReqRef = useRef(0);
  const mapToolsControlRef = useRef<any>(null);
  const { theme } = useTheme();

  const fitToDataBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (initialBoundsRef.current) {
      map.fitBounds(initialBoundsRef.current, { padding: 20, maxZoom: 16, duration: 800 });
      return;
    }
    fetch(`${MARTIN}/${TABLE}`)
      .then((r) => r.json())
      .then((meta) => {
        if (meta.bounds) {
          const [w, s, e, n] = meta.bounds;
          initialBoundsRef.current = [[w, s], [e, n]];
          map.fitBounds(initialBoundsRef.current, { padding: 20, maxZoom: 16, duration: 800 });
        }
      })
      .catch(() => {});
  }, []);

  /** Zooms to an arbitrary [[west,south],[east,north]] box — used by the bar chart panel to
   *  fly to whichever RT/RW's bar was clicked. */
  const flyToBounds = useCallback((bounds: [[number, number], [number, number]]) => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(bounds, { padding: 60, maxZoom: 18, duration: 900 });
  }, []);

  const flyToResult = useCallback((lng: number, lat: number, row?: Record<string, unknown>) => {
    const map = mapRef.current;
    if (!map || isNaN(lng) || isNaN(lat)) return;
    map.flyTo({ center: [lng, lat], zoom: 18, duration: 900, essential: true });

    searchMarkerRef.current?.remove();
    searchMarkerRef.current = new maplibregl.Marker({ color: '#22d3ee' }).setLngLat([lng, lat]).addTo(map);

    searchPopupRef.current?.remove();
    searchPopupRef.current = null;
    if (row) {
      searchPopupRef.current = new maplibregl.Popup({ offset: 6, maxWidth: '340px' })
        .setLngLat([lng, lat])
        .setHTML(persilPopupHTML(row))
        .addTo(map);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const container = containerRef.current;

    const map = new maplibregl.Map({
      container,
      style: theme === 'light' ? BASEMAP_STYLES.positron : BASEMAP_STYLES.dark,
      center: [106.779, -6.276],
      zoom: 14,
      maxZoom: 24,
      attributionControl: false,
    });
    mapRef.current = map;

    function addAppLayers() {
      if (map.getSource('tanah')) return;
      map.addSource('tanah', {
        type: 'vector',
        promoteId: 'gid',
        tiles: [`${MARTIN}/${TABLE}/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 22,
      });
      map.addLayer({ id: 'tanah-fill', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': COLOR_EXPR, 'fill-opacity': 0.35 } });
      map.addLayer({ id: 'tanah-line', type: 'line', source: 'tanah', 'source-layer': TABLE, paint: { 'line-color': COLOR_EXPR, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 15, 1.2, 18, 2] } });
      map.addLayer({ id: 'tanah-hover', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': '#fff', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.25, 0] } });

      map.addSource('kecamatan', { type: 'vector', promoteId: 'gid', tiles: [`${MARTIN}/administrasi_ar_kecamatan/{z}/{x}/{y}`], minzoom: 0, maxzoom: 22 });
      map.addLayer({ id: 'kec-fill', type: 'fill', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'fill-color': '#fbbf24', 'fill-opacity': 0.05 } });
      map.addLayer({ id: 'kec-line-casing', type: 'line', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'line-color': '#000', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 6, 12, 9, 16, 12], 'line-opacity': 0.55, 'line-blur': 2 } });
      map.addLayer({ id: 'kec-line', type: 'line', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'line-color': '#fbbf24', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2.5, 12, 4, 16, 5.5], 'line-opacity': 1 } });

      map.addSource('kelurahan', { type: 'vector', promoteId: 'gid', tiles: [`${MARTIN}/administrasi_ar_desakel/{z}/{x}/{y}`], minzoom: 0, maxzoom: 22 });
      map.addLayer({ id: 'kel-fill', type: 'fill', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'fill-color': '#ffffff', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.12, 0] } });
      map.addLayer({ id: 'kel-line-casing', type: 'line', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'line-color': '#000', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, 5, 18, 6], 'line-opacity': 0.35, 'line-blur': 1 } });
      map.addLayer({ id: 'kel-line', type: 'line', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 14, 2, 18, 3], 'line-opacity': 0.85, 'line-dasharray': [5, 3] } });
      map.addLayer({
        id: 'kel-label',
        type: 'symbol',
        source: 'kelurahan',
        'source-layer': 'administrasi_ar_desakel',
        minzoom: 14,
        layout: {
          'text-field': ['get', 'namobj'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 17, 13],
          'text-anchor': 'center',
          'text-max-width': 8,
          'text-letter-spacing': 0.04,
          'symbol-placement': 'point',
        },
        paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.85)', 'text-halo-width': 1.5 },
      });
    }

    function applyLayerVisibility() {
      const s = useFiltersStore.getState();
      const setVis = (ids: string[], on: boolean) =>
        ids.forEach((id) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'); });
      setVis(['tanah-fill', 'tanah-line', 'tanah-hover'], s.showLine);
      setVis(['kec-fill', 'kec-line-casing', 'kec-line'], s.showKecamatan);
      setVis(['kel-fill', 'kel-line-casing', 'kel-line', 'kel-label'], s.showKelurahan);
    }

    if (opts.showBasemapSwitcher) {
      const basemapKey = theme === 'light' ? 'positron' : 'dark';
      const mapToolsControl = new MapToolsControl(basemapKey, (key) => {
        map.setStyle(BASEMAP_STYLES[key]);
        map.once('styledata', () => {
          addAppLayers();
          applyLayerVisibility();
          applyParcelFilter(map);
        });
        mapToolsControl.setActive(key);
      });
      map.addControl(mapToolsControl, 'bottom-right');
      mapToolsControlRef.current = mapToolsControl;
    } else {
      map.addControl(new AttrControl(), 'bottom-right');
    }

    map.addControl(
      new MapNavControl({
        showTour: opts.showTour,
        onHome: fitToDataBounds,
        onLocate: (btn) => locateMe(btn),
        onTour: () => opts.onTourOpen(),
      }),
      'bottom-right',
    );
    if (opts.showScaleControl) map.addControl(new maplibregl.ScaleControl());

    function tampilkanLokasi(pos: GeolocationPosition, terbang: boolean) {
      const lng = pos.coords.longitude;
      const lat = pos.coords.latitude;
      const html = `<div style="padding:9px 13px;font-size:11px;color:#e2e8f0;">
        <div style="font-weight:700;margin-bottom:3px;">Lokasi Anda</div>
        <div style="color:#64748b;">Akurasi &plusmn; ${Math.round(pos.coords.accuracy)} m</div>
      </div>`;
      if (locMarkerRef.current) {
        locMarkerRef.current.setLngLat([lng, lat]);
        locMarkerRef.current.getPopup()?.setHTML(html);
      } else {
        locMarkerRef.current = new maplibregl.Marker({ color: '#22d3ee' })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(html))
          .addTo(map);
      }
      if (terbang) map.flyTo({ center: [lng, lat], zoom: 17, duration: 900, maxDuration: 1200, essential: true });
      else map.easeTo({ center: [lng, lat], duration: 300 });
    }

    function perhalusLokasi(req: number, onSelesai?: () => void) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (req !== locReqRef.current) return;
          onSelesai?.();
          tampilkanLokasi(pos, !!onSelesai);
        },
        (err) => {
          if (req !== locReqRef.current) return;
          if (onSelesai) {
            onSelesai();
            alert(
              { 1: 'Akses lokasi ditolak. Izinkan lokasi pada pengaturan browser lalu coba lagi.', 2: 'Lokasi tidak tersedia saat ini.', 3: 'Waktu pencarian lokasi habis. Coba lagi.' }[err.code] ??
                'Gagal mendapatkan lokasi.',
            );
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    }

    function locateMe(btn: HTMLButtonElement) {
      if (!navigator.geolocation) { alert('Browser ini tidak mendukung geolokasi.'); return; }
      if (!window.isSecureContext) { alert('Fitur My Location memerlukan koneksi HTTPS. Buka situs ini lewat https:// lalu coba lagi.'); return; }

      const req = ++locReqRef.current;
      btn.disabled = true;
      btn.style.opacity = '.5';
      const selesai = () => { if (req === locReqRef.current) { btn.disabled = false; btn.style.opacity = ''; } };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          selesai();
          tampilkanLokasi(pos, true);
          if (pos.coords.accuracy <= 50) return;
          perhalusLokasi(req);
        },
        (err) => {
          if (req !== locReqRef.current) return;
          if (err.code === 1) { selesai(); alert('Akses lokasi ditolak. Izinkan lokasi pada pengaturan browser lalu coba lagi.'); return; }
          perhalusLokasi(req, selesai);
        },
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 },
      );
    }

    function applyParcelFilter(m: MaplibreMap) {
      const combined = buildParcelFilterExpression(useFiltersStore.getState());
      ['tanah-fill', 'tanah-line', 'tanah-hover'].forEach((id) => { if (m.getLayer(id)) m.setFilter(id, combined as any); });
    }

    function updateStatChip() {
      const chip = statChipRef.current;
      if (!chip || !map.getLayer('tanah-fill')) return;
      const feats = map.queryRenderedFeatures({ layers: ['tanah-fill'] });
      const n = new Set(feats.map((f) => f.id ?? f.properties?.gid)).size;
      chip.textContent = n > 0 ? `${n.toLocaleString('id-ID')} parsel tampil` : 'Tidak ada data';
    }

    map.on('load', () => {
      addAppLayers();
      applyLayerVisibility();
      applyParcelFilter(map);
      setMapLoaded(true);
      fitToDataBounds();
      if (opts.showStatChip) map.on('idle', updateStatChip);
    });

    let hoveredParcelId: string | number | null = null;
    const tooltip = tooltipRef.current;

    const fmtT = (v: unknown, d = 0) => {
      if (v == null || v === '') return '—';
      const n = parseFloat(String(v));
      return isNaN(n) ? String(v) : n.toLocaleString('id-ID', { maximumFractionDigits: d });
    };

    map.on('mousemove', 'tanah-fill', (e) => {
      if (!e.features?.length) return;
      map.getCanvas().style.cursor = 'pointer';
      if (hoveredParcelId !== null) map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredParcelId }, { hovered: false });
      hoveredParcelId = e.features[0].id ?? null;
      if (hoveredParcelId != null) map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredParcelId }, { hovered: true });

      const p = e.features[0].properties;
      if (tooltip) {
        const idEl = tooltip.querySelector('#tt-id');
        const ltEl = tooltip.querySelector('#tt-lt');
        const lbEl = tooltip.querySelector('#tt-lb');
        if (idEl) idEl.textContent = p.idobjekpaj ?? '—';
        if (ltEl) ltEl.textContent = p.luas_tanah != null ? fmtT(p.luas_tanah) + ' m²' : '—';
        if (lbEl) lbEl.textContent = p.luas_bangu != null ? fmtT(p.luas_bangu) + ' m²' : '—';

        const rect = map.getCanvas().getBoundingClientRect();
        tooltip.style.left = e.originalEvent.clientX - rect.left + 14 + 'px';
        tooltip.style.top = e.originalEvent.clientY - rect.top - 10 + 'px';
        tooltip.style.display = 'block';
      }
    });
    map.on('mouseleave', 'tanah-fill', () => {
      map.getCanvas().style.cursor = '';
      if (tooltip) tooltip.style.display = 'none';
      if (hoveredParcelId !== null) { map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredParcelId }, { hovered: false }); hoveredParcelId = null; }
    });

    map.on('click', 'tanah-fill', (e) => {
      if (!e.features?.length) return;
      const feature = e.features[0];

      // #sidebar itu overlay absolute DI ATAS peta (bukan bikin canvas map jadi sempit),
      // jadi "tengah" yang user lihat itu tengah dari area SETELAH sidebar, bukan tengah
      // canvas penuh — makanya lebar sidebar (kalau lagi kebuka) dikurangin dari perhitungan.
      const sidebarEl = document.getElementById('sidebar');
      const sidebarWidth = sidebarEl?.getBoundingClientRect().width ?? 0;

      map.flyTo({ center: e.lngLat, offset: [sidebarWidth / 2, -130], duration: 500 });

      map.once('moveend', () => {
        new maplibregl.Popup({ offset: 6, maxWidth: '340px', draggable: true })
          .setLngLat(e.lngLat)
          .setHTML(persilPopupHTML(feature.properties))
          .addTo(map);
      });
    });

    let hoveredKelId: string | number | null = null;
    map.on('mousemove', 'kel-fill', (e) => {
      if (!e.features?.length) return;
      map.getCanvas().style.cursor = 'pointer';
      if (hoveredKelId !== null) map.setFeatureState({ source: 'kelurahan', sourceLayer: 'administrasi_ar_desakel', id: hoveredKelId }, { hovered: false });
      hoveredKelId = e.features[0].id ?? null;
      if (hoveredKelId != null) map.setFeatureState({ source: 'kelurahan', sourceLayer: 'administrasi_ar_desakel', id: hoveredKelId }, { hovered: true });
    });
    map.on('mouseleave', 'kel-fill', () => {
      map.getCanvas().style.cursor = '';
      if (hoveredKelId !== null) { map.setFeatureState({ source: 'kelurahan', sourceLayer: 'administrasi_ar_desakel', id: hoveredKelId }, { hovered: false }); hoveredKelId = null; }
    });
    map.on('click', 'kel-fill', (e) => {
      if (!e.features?.length) return;
      const parselHit = map.queryRenderedFeatures(e.point, { layers: ['tanah-fill'] });
      if (parselHit.length) return;
      new maplibregl.Popup({ offset: 6, maxWidth: '240px' })
        .setLngLat(e.lngLat)
        .setHTML(kelurahanPopupHTML(e.features[0].properties))
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respond to theme changes without remounting the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const basemapKey = theme === 'light' ? 'positron' : 'dark';
    const target = BASEMAP_STYLES[basemapKey];
    // Update map style
    map.setStyle(target);
    // Update the basemap switcher toggle state if it exists
    if (mapToolsControlRef.current) {
      mapToolsControlRef.current.setActive(basemapKey);
    }
  }, [theme]);

  return { mapRef, mapLoaded, flyToResult, fitToDataBounds, flyToBounds };
}

/** Port of applyFilters()'s MapLibre-expression half in dashboard.blade.php. */
export function buildParcelFilterExpression(s: ReturnType<typeof useFiltersStore.getState>) {
  const parts: unknown[] = [];
  if (s.kelurahan) parts.push(['==', ['get', 'kelurahan'], s.kelurahan]);
  if (s.rw) parts.push(['==', ['get', 'rw'], s.rw]);
  if (s.rt) parts.push(['==', ['get', 'rt'], s.rt]);
  if (s.tahun) parts.push(['==', ['to-string', ['get', 'tahun_pajak']], String(s.tahun)]);

  if (s.periodeAwal || s.periodeAkhir) {
    const punyaTanggal = ['all', ['has', 'tgl_bayar'], ['!=', ['to-string', ['get', 'tgl_bayar']], '']];
    const dalamRentang: unknown[] = ['all'];
    if (s.periodeAwal) dalamRentang.push(['>=', ['to-string', ['get', 'tgl_bayar']], s.periodeAwal]);
    if (s.periodeAkhir) dalamRentang.push(['<=', ['to-string', ['get', 'tgl_bayar']], s.periodeAkhir]);

    if (s.periodeMode === 'longgar') {
      parts.push(['any', ['!', punyaTanggal], ['all', punyaTanggal, dalamRentang]]);
    } else {
      parts.push(['all', punyaTanggal, dalamRentang]);
    }
  }

  const STATUS_VALUE_MAP: Record<string, string> = {
    sudah: 'SUDAH BAYAR', belum: 'BELUM BAYAR / BELUM LUNAS', nol: 'PBB BAYAR 0 RUPIAH', batal: 'DI BATALKAN',
  };
  if (s.status.length < 4) {
    const statusAktif = s.status.map((v: string) => STATUS_VALUE_MAP[v]);
    parts.push(statusAktif.length ? ['in', ['get', 'status_pem'], ['literal', statusAktif]] : ['==', ['get', 'status_pem'], '__none__']);
  }

  if (s.kategoriNjop.length < 4) parts.push(['in', ['get', 'kategori_njop_total'], ['literal', s.kategoriNjop]]);
  if (s.kategoriNjopBumi.length < 4) parts.push(['in', ['get', 'kategori_njop_bumi'], ['literal', s.kategoriNjopBumi]]);
  if (s.kategoriNjopBangunan.length < 4) parts.push(['in', ['get', 'kategori_njop_bangunan'], ['literal', s.kategoriNjopBangunan]]);

  const KATEGORI_PBB_DB_MAP: Record<string, string[]> = {
    tinggi: ['tinggi', 'Tinggi', 'TINGGI', 'PBB Tinggi', 'pbb_tinggi'],
    sedang: ['sedang', 'Sedang', 'SEDANG', 'PBB Sedang', 'pbb_sedang'],
    rendah: ['rendah', 'Rendah', 'RENDAH', 'PBB Rendah', 'pbb_rendah'],
    tidak_kena_pajak: ['tidak_kena_pajak', 'Tidak Kena Pajak', 'TIDAK KENA PAJAK', 'tidak kena pajak', 'tidak-kena-pajak', 'Tidak_Kena_Pajak', 'TKP', 'tkp'],
  };
  if (s.kategoriPbb.length < 4) {
    const expanded = s.kategoriPbb.flatMap((v: string) => KATEGORI_PBB_DB_MAP[v] ?? [v]);
    parts.push(expanded.length ? ['in', ['get', 'kategori_pbb'], ['literal', expanded]] : ['==', ['get', 'kategori_pbb'], '__none__']);
  }

  return parts.length ? ['all', ...parts] : null;
}