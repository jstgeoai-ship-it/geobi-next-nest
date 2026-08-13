'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap, Marker } from 'maplibre-gl';
import { AttrControl } from '../../dashboard-pbb/lib/maplibre-controls/AttrControl';
import { COLOR_EXPR } from '../../dashboard-pbb/lib/color-expr';
import { persilPopupHTMLV1 } from '../lib/popup-html';

const MARTIN = process.env.NEXT_PUBLIC_MARTIN_URL || 'http://localhost:3000';
const TABLE = 'data_tanah_map';

const LOC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;
const HOME_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;

const STATUS_VALUE_MAP: Record<string, string> = {
  sudah: 'SUDAH BAYAR',
  belum: 'BELUM BAYAR / BELUM LUNAS',
  nol: 'PBB BAYAR 0 RUPIAH',
};

/** Simplified map hook for dashboard-v1: single-select status chip filter, no wilayah/waktu/kategori panels. */
export function useV1Map(
  containerRef: React.RefObject<HTMLDivElement | null>,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
  statChipRef: React.RefObject<HTMLDivElement | null>,
) {
  const mapRef = useRef<MaplibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchMarkerRef = useRef<Marker | null>(null);
  const initialBoundsRef = useRef<[[number, number], [number, number]] | null>(null);

  const flyTo = useCallback((lng: number, lat: number) => {
    const map = mapRef.current;
    if (!map || isNaN(lng) || isNaN(lat)) return;
    map.flyTo({ center: [lng, lat], zoom: 17, duration: 900 });
    searchMarkerRef.current?.remove();
    searchMarkerRef.current = new maplibregl.Marker({ color: '#22d3ee' }).setLngLat([lng, lat]).addTo(map);
  }, []);

  const setStatusFilter = useCallback((statusKey: string) => {
    const map = mapRef.current;
    if (!map) return;
    const filter = statusKey ? ['==', ['get', 'status_pem'], STATUS_VALUE_MAP[statusKey]] : null;
    ['tanah-fill', 'tanah-line', 'tanah-hover'].forEach((id) => { if (map.getLayer(id)) map.setFilter(id, filter as any); });
    map.once('idle', () => updateStatChipRef.current());
  }, []);

  const setLayerVisible = useCallback((layerId: 'tanah-fill' | 'tanah-line', visible: boolean) => {
    const map = mapRef.current;
    if (map?.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }, []);

  const updateStatChipRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const container = containerRef.current;

    const map = new maplibregl.Map({
      container,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [106.779, -6.276],
      zoom: 14,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new AttrControl(), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    function locateMe(btn: HTMLButtonElement) {
      if (!navigator.geolocation) { alert('Browser ini tidak mendukung geolokasi.'); return; }
      if (!window.isSecureContext) { alert('Fitur My Location memerlukan koneksi HTTPS. Buka situs ini lewat https:// lalu coba lagi.'); return; }
      btn.disabled = true;
      btn.style.opacity = '.5';
      const selesai = () => { btn.disabled = false; btn.style.opacity = ''; };
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          selesai();
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          map.flyTo({ center: [lng, lat], zoom: 17, duration: 900 });
          searchMarkerRef.current?.remove();
          searchMarkerRef.current = new maplibregl.Marker({ color: '#22d3ee' })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(
              `<div style="padding:9px 13px;font-size:11px;color:#e2e8f0;">
                <div style="font-weight:700;margin-bottom:3px;">Lokasi Anda</div>
                <div style="color:#64748b;">Akurasi &plusmn; ${Math.round(pos.coords.accuracy)} m</div>
              </div>`,
            ))
            .addTo(map);
        },
        (err) => {
          selesai();
          alert(
            { 1: 'Akses lokasi ditolak. Izinkan lokasi pada pengaturan browser lalu coba lagi.', 2: 'Lokasi tidak tersedia saat ini.', 3: 'Waktu pencarian lokasi habis. Coba lagi.' }[err.code] ??
              'Gagal mendapatkan lokasi.',
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }

    const navGroup = map.getContainer().querySelector('.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group');
    if (navGroup) {
      const homeBtn = document.createElement('button');
      homeBtn.title = 'Home';
      homeBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;color:inherit;';
      homeBtn.innerHTML = HOME_ICON;
      const zoomIn = navGroup.querySelector('.maplibregl-ctrl-zoom-in');
      if (zoomIn) navGroup.insertBefore(homeBtn, zoomIn);
      homeBtn.addEventListener('click', () => {
        if (initialBoundsRef.current) map.fitBounds(initialBoundsRef.current, { padding: 20, maxZoom: 16, duration: 800 });
      });

      const locBtn = document.createElement('button');
      locBtn.title = 'My Location';
      locBtn.setAttribute('aria-label', 'My Location');
      locBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;color:inherit;';
      locBtn.innerHTML = LOC_ICON;
      navGroup.insertBefore(locBtn, homeBtn);
      locBtn.addEventListener('click', () => locateMe(locBtn));
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

    function updateStatChip() {
      const chip = statChipRef.current;
      if (!chip || !map.getLayer('tanah-fill')) return;
      const feats = map.queryRenderedFeatures({ layers: ['tanah-fill'] });
      const n = new Set(feats.map((f) => f.id ?? f.properties?.gid)).size;
      chip.textContent = n > 0 ? `${n.toLocaleString('id-ID')} parsel tampil` : 'Tidak ada data';
    }
    updateStatChipRef.current = updateStatChip;

    map.on('load', () => {
      map.addSource('tanah', {
        type: 'vector', promoteId: 'gid',
        tiles: [`${MARTIN}/${TABLE}/{z}/{x}/{y}`],
        minzoom: 0, maxzoom: 22,
      });
      map.addLayer({ id: 'tanah-fill', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': COLOR_EXPR, 'fill-opacity': 0.35 } });
      map.addLayer({ id: 'tanah-line', type: 'line', source: 'tanah', 'source-layer': TABLE, paint: { 'line-color': COLOR_EXPR, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 15, 1.2, 18, 2] } });
      map.addLayer({ id: 'tanah-hover', type: 'fill', source: 'tanah', 'source-layer': TABLE, paint: { 'fill-color': '#fff', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.25, 0] } });
      map.on('idle', updateStatChip);
      setMapLoaded(true);
    });

    let hoveredId: string | number | null = null;
    const tooltip = tooltipRef.current;
    const fmtT = (v: unknown, d = 0) => {
      if (v == null || v === '') return '—';
      const n = parseFloat(String(v));
      return isNaN(n) ? String(v) : n.toLocaleString('id-ID', { maximumFractionDigits: d });
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
      new maplibregl.Popup({ offset: 6, maxWidth: '280px' })
        .setLngLat(e.lngLat)
        .setHTML(persilPopupHTMLV1(e.features[0].properties))
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapRef, mapLoaded, flyTo, setStatusFilter, setLayerVisible };
}
