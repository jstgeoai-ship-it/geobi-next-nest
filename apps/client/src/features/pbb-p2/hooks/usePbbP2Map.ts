'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { IControl, Map as MaplibreMap, Marker } from 'maplibre-gl';
import { kelurahanPopupHTML, parselPopupHTML } from '../lib/popup-html';

const MARTIN = process.env.NEXT_PUBLIC_MARTIN_URL || 'http://localhost:3000';
const TABLE = 'data_tanah';

/** Port of pbbp2.blade.php's local statusColor — unlike the dashboard's COLOR_EXPR, this page
 * never had a "DI BATALKAN" branch added, so it stays a straight 3-status + default match. */
const STATUS_COLOR: maplibregl.ExpressionSpecification = [
  'match',
  ['coalesce', ['get', 'status_pem'], ''],
  'SUDAH BAYAR', '#22c55e',
  'BELUM BAYAR / BELUM LUNAS', '#ef4444',
  'PBB BAYAR 0 RUPIAH', '#f59e0b',
  '#475569',
];

const LOC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;
const HOME_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;

const ATTR_TEXTS: Record<string, string> = {
  dark: '© CARTO © OpenStreetMap',
  osm: '© OpenStreetMap contributors',
  satellite: '© Google',
};

/** Attribution toggle whose text swaps per active basemap — port of pbbp2.blade.php's AttrControl. */
class AttrControl implements IControl {
  private el?: HTMLDivElement;
  private visible = false;

  onAdd(): HTMLElement {
    this.el = document.createElement('div');
    this.el.className = 'maplibregl-ctrl';
    this.el.style.cssText = 'display:flex;align-items:center;gap:4px;padding:2px 0;justify-content:flex-end;';
    this.el.innerHTML = `
      <span id="attr-text" style="display:none;font-size:10px;color:#475569;background:rgba(2,6,23,.88);border:1px solid rgba(255,255,255,.09);border-radius:5px;padding:2px 8px;white-space:nowrap;"></span>
      <button id="attr-btn" type="button" title="Toggle attribution" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:rgba(2,6,23,.88);color:#64748b;font-size:14px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;">&#9432;</button>
    `;
    this.el.querySelector('#attr-btn')!.addEventListener('click', () => {
      this.visible = !this.visible;
      const t = this.el!.querySelector<HTMLElement>('#attr-text')!;
      t.style.display = this.visible ? 'inline-block' : 'none';
      (this.el!.querySelector('#attr-btn') as HTMLElement).style.color = this.visible ? '#22d3ee' : '#64748b';
    });
    this.updateText('dark');
    return this.el;
  }
  onRemove() { this.el?.remove(); }
  getDefaultPosition() { return 'bottom-right' as const; }
  updateText(key: string) {
    const t = this.el?.querySelector('#attr-text');
    if (t) t.textContent = ATTR_TEXTS[key] ?? '';
  }
}

type BasemapKey = 'dark' | 'osm' | 'satellite';
const BM_MAP: Record<BasemapKey, string> = { dark: 'bm-dark', osm: 'bm-osm', satellite: 'bm-sat' };

export function usePbbP2Map(
  containerRef: React.RefObject<HTMLDivElement | null>,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
  statChipRef: React.RefObject<HTMLDivElement | null>,
) {
  const mapRef = useRef<MaplibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchMarkerRef = useRef<Marker | null>(null);
  const initialBoundsRef = useRef<[[number, number], [number, number]] | null>(null);
  const attrCtrlRef = useRef<AttrControl | null>(null);

  const flyToResult = useCallback((lng: number, lat: number) => {
    const map = mapRef.current;
    if (!map || isNaN(lng) || isNaN(lat)) return;
    map.flyTo({ center: [lng, lat], zoom: 17, duration: 900 });
    searchMarkerRef.current?.remove();
    searchMarkerRef.current = new maplibregl.Marker({ color: '#22d3ee' }).setLngLat([lng, lat]).addTo(map);
  }, []);

  const setBasemap = useCallback((key: BasemapKey) => {
    const map = mapRef.current;
    if (!map) return;
    (Object.keys(BM_MAP) as BasemapKey[]).forEach((k) => map.setLayoutProperty(BM_MAP[k], 'visibility', 'none'));
    map.setLayoutProperty(BM_MAP[key], 'visibility', 'visible');
    attrCtrlRef.current?.updateText(key);
  }, []);

  const setLayerVisible = useCallback((ids: string[], visible: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    ids.forEach((id) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none'); });
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const container = containerRef.current;

    const map = new maplibregl.Map({
      container,
      center: [106.779, -6.276],
      zoom: 14,
      attributionControl: false,
      style: {
        version: 8,
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
        sources: {
          'bm-dark': { type: 'raster', tileSize: 256, tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'], attribution: '© CARTO © OpenStreetMap' },
          'bm-osm': { type: 'raster', tileSize: 256, tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], attribution: '© OpenStreetMap contributors' },
          'bm-sat': { type: 'raster', tileSize: 256, tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'], attribution: '© Google' },
        },
        layers: [
          { id: 'bm-dark', type: 'raster', source: 'bm-dark' },
          { id: 'bm-osm', type: 'raster', source: 'bm-osm', layout: { visibility: 'none' } },
          { id: 'bm-sat', type: 'raster', source: 'bm-sat', layout: { visibility: 'none' } },
        ],
      },
    });
    mapRef.current = map;

    const attrCtrl = new AttrControl();
    attrCtrlRef.current = attrCtrl;
    map.addControl(attrCtrl, 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    const navGroup = map.getContainer().querySelector('.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group');
    if (navGroup) {
      const homeBtn = document.createElement('button');
      homeBtn.title = 'Home';
      homeBtn.setAttribute('aria-label', 'Home');
      homeBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;color:inherit;';
      homeBtn.innerHTML = HOME_ICON;
      homeBtn.addEventListener('click', () => {
        if (initialBoundsRef.current) map.fitBounds(initialBoundsRef.current, { padding: 80, maxZoom: 14, duration: 800 });
      });
      const zoomIn = navGroup.querySelector('.maplibregl-ctrl-zoom-in');
      if (zoomIn) navGroup.insertBefore(homeBtn, zoomIn);

      const locBtn = document.createElement('button');
      locBtn.title = 'My Location';
      locBtn.setAttribute('aria-label', 'My Location');
      locBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;color:inherit;';
      locBtn.innerHTML = LOC_ICON;
      navGroup.insertBefore(locBtn, homeBtn);
      locBtn.addEventListener('click', () => locateMe(locBtn));
    }

    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    let locMarker: Marker | null = null;
    let locReq = 0;

    function tampilkanLokasi(pos: GeolocationPosition, terbang: boolean) {
      const lng = pos.coords.longitude;
      const lat = pos.coords.latitude;
      const html = `<div style="padding:9px 13px;font-size:11px;color:#e2e8f0;">
        <div style="font-weight:700;margin-bottom:3px;">Lokasi Anda</div>
        <div style="color:#64748b;">Akurasi &plusmn; ${Math.round(pos.coords.accuracy)} m</div>
      </div>`;
      if (locMarker) {
        locMarker.setLngLat([lng, lat]);
        locMarker.getPopup()?.setHTML(html);
      } else {
        locMarker = new maplibregl.Marker({ color: '#22d3ee' }).setLngLat([lng, lat]).setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(html)).addTo(map);
      }
      if (terbang) map.flyTo({ center: [lng, lat], zoom: 17, duration: 900, maxDuration: 1200, essential: true });
      else map.easeTo({ center: [lng, lat], duration: 300 });
    }

    function perhalusLokasi(req: number, onSelesai?: () => void) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { if (req !== locReq) return; onSelesai?.(); tampilkanLokasi(pos, !!onSelesai); },
        (err) => {
          if (req !== locReq) return;
          if (onSelesai) {
            onSelesai();
            alert({ 1: 'Akses lokasi ditolak. Izinkan lokasi pada pengaturan browser lalu coba lagi.', 2: 'Lokasi tidak tersedia saat ini.', 3: 'Waktu pencarian lokasi habis. Coba lagi.' }[err.code as 1 | 2 | 3] ?? 'Gagal mendapatkan lokasi.');
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    }

    function locateMe(btn: HTMLButtonElement) {
      if (!navigator.geolocation) { alert('Browser ini tidak mendukung geolokasi.'); return; }
      if (!window.isSecureContext) { alert('Fitur My Location memerlukan koneksi HTTPS. Buka situs ini lewat https:// lalu coba lagi.'); return; }
      const req = ++locReq;
      btn.disabled = true; btn.style.opacity = '.5';
      const selesai = () => { if (req === locReq) { btn.disabled = false; btn.style.opacity = ''; } };
      navigator.geolocation.getCurrentPosition(
        (pos) => { selesai(); tampilkanLokasi(pos, true); if (pos.coords.accuracy <= 50) return; perhalusLokasi(req); },
        (err) => {
          if (req !== locReq) return;
          if (err.code === 1) { selesai(); alert('Akses lokasi ditolak. Izinkan lokasi pada pengaturan browser lalu coba lagi.'); return; }
          perhalusLokasi(req, selesai);
        },
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 },
      );
    }

    fetch(`${MARTIN}/${TABLE}`)
      .then((r) => r.json())
      .then((meta) => {
        if (meta.bounds) {
          const [w, s, e, n] = meta.bounds;
          initialBoundsRef.current = [[w, s], [e, n]];
          map.fitBounds(initialBoundsRef.current, { padding: 80, maxZoom: 14, duration: 800 });
        }
      })
      .catch(() => {});

    function updateStat() {
      const chip = statChipRef.current;
      if (!chip || !map.getLayer('tanah-fill')) return;
      const feats = map.queryRenderedFeatures({ layers: ['tanah-fill'] });
      const n = new Set(feats.map((f) => f.id ?? f.properties?.gid)).size;
      chip.textContent = n > 0 ? `${n.toLocaleString('id-ID')} parsel` : 'Tidak ada data';
    }

    map.on('load', () => {
      map.addSource('tanah', { type: 'vector', tiles: [`${MARTIN}/${TABLE}/{z}/{x}/{y}`], minzoom: 0, maxzoom: 22, promoteId: 'gid' });
      map.addLayer({ id: 'tanah-fill', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': STATUS_COLOR, 'fill-opacity': 0 } });
      map.addLayer({ id: 'tanah-line', type: 'line', source: 'tanah', 'source-layer': TABLE, paint: { 'line-color': STATUS_COLOR, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 15, 1.2, 18, 2] } });
      map.addLayer({ id: 'tanah-hover', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': '#ffffff', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.28, 0] } });

      map.addSource('kecamatan', { type: 'vector', tiles: [`${MARTIN}/administrasi_ar_kecamatan/{z}/{x}/{y}`], minzoom: 0, maxzoom: 22, promoteId: 'gid' });
      map.addLayer({ id: 'kec-fill', type: 'fill', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'fill-color': '#fbbf24', 'fill-opacity': 0.05 } });
      map.addLayer({ id: 'kec-line-casing', type: 'line', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'line-color': '#000', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 6, 12, 9, 16, 12], 'line-opacity': 0.55, 'line-blur': 2 } });
      map.addLayer({ id: 'kec-line', type: 'line', source: 'kecamatan', 'source-layer': 'administrasi_ar_kecamatan', paint: { 'line-color': '#fbbf24', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2.5, 12, 4, 16, 5.5], 'line-opacity': 1 } });

      map.addSource('kelurahan', { type: 'vector', tiles: [`${MARTIN}/administrasi_ar_desakel/{z}/{x}/{y}`], minzoom: 0, maxzoom: 22, promoteId: 'gid' });
      map.addLayer({ id: 'kel-fill', type: 'fill', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'fill-color': '#ffffff', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.12, 0] } });
      map.addLayer({ id: 'kel-line-casing', type: 'line', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'line-color': '#000', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, 5, 18, 6], 'line-opacity': 0.35, 'line-blur': 1 } });
      map.addLayer({ id: 'kel-line', type: 'line', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 14, 2, 18, 3], 'line-opacity': 0.85, 'line-dasharray': [5, 3] } });
      map.addLayer({
        id: 'kel-label', type: 'symbol', source: 'kelurahan', 'source-layer': 'administrasi_ar_desakel', minzoom: 14,
        layout: {
          'text-field': ['get', 'namobj'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 17, 13],
          'text-anchor': 'center', 'text-max-width': 8, 'text-letter-spacing': 0.04, 'symbol-placement': 'point',
        },
        paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.85)', 'text-halo-width': 1.5 },
      });

      map.on('idle', updateStat);
      setMapLoaded(true);
    });

    let hoveredId: string | number | null = null;
    const tooltip = tooltipRef.current;
    const fmtT = (val: unknown, dec = 0) => {
      if (val == null || val === '') return '—';
      const n = parseFloat(String(val));
      return isNaN(n) ? String(val) : n.toLocaleString('id-ID', { maximumFractionDigits: dec });
    };

    map.on('mousemove', 'tanah-fill', (e) => {
      if (!e.features?.length) return;
      map.getCanvas().style.cursor = 'pointer';
      if (hoveredId !== null) map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredId }, { hovered: false });
      hoveredId = e.features[0].id ?? null;
      if (hoveredId != null) map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredId }, { hovered: true });

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
      if (hoveredId !== null) { map.setFeatureState({ source: 'tanah', sourceLayer: TABLE, id: hoveredId }, { hovered: false }); hoveredId = null; }
    });
    map.on('click', 'tanah-fill', (e) => {
      if (!e.features?.length) return;
      new maplibregl.Popup({ offset: 8, maxWidth: '260px' }).setLngLat(e.lngLat).setHTML(parselPopupHTML(e.features[0].properties)).addTo(map);
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
      new maplibregl.Popup({ offset: 6, maxWidth: '240px' }).setLngLat(e.lngLat).setHTML(kelurahanPopupHTML(e.features[0].properties)).addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapRef, mapLoaded, flyToResult, setBasemap, setLayerVisible };
}
