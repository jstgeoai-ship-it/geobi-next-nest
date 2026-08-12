import type { IControl, Map as MaplibreMap } from 'maplibre-gl';

const HOME_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
const LOC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;
const PLUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const MINUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const COMPASS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15 11 12 13 12 2" fill="#f87171"/><polygon points="12 22 9 13 12 11 12 22" fill="#e2e8f0"/></svg>`;

interface Options {
  showTour: boolean;
  onHome: () => void;
  onLocate: (btn: HTMLButtonElement) => void;
  onTour: () => void;
}

/** Home/Locate/Help(?) + Zoom/Compass, laid out as two compact horizontal rows — replaces
 *  MapLibre's default NavigationControl (a single tall vertical stack) plus the separately
 *  floating TourHelpControl, both of which made the bottom-right cluster tall enough to
 *  collide with other floating panels on short screens. Row width matches
 *  MapToolsControl's collapsed "BaseMap" pill so the two stacked widgets read as one
 *  consistent column. */
export class MapNavControl implements IControl {
  private el?: HTMLDivElement;
  private map?: MaplibreMap;
  private onRotate = () => {
    const needle = this.el?.querySelector<HTMLElement>('.map-nav-compass-needle');
    if (needle && this.map) needle.style.transform = `rotate(${-this.map.getBearing()}deg)`;
  };

  constructor(private opts: Options) {}

  onAdd(map: MaplibreMap): HTMLElement {
    this.map = map;
    this.el = document.createElement('div');
    this.el.className = 'maplibregl-ctrl map-nav-ctrl';
    this.el.innerHTML = `
      <div class="map-nav-row">
        <button class="map-nav-btn" data-a="home" type="button" title="Kembali ke tampilan awal" aria-label="Home">${HOME_ICON}</button>
        <button class="map-nav-btn" data-a="locate" type="button" title="Lokasi saya" aria-label="My Location">${LOC_ICON}</button>
        ${this.opts.showTour ? `<button class="map-nav-btn" data-a="tour" type="button" title="Panduan penggunaan dashboard" aria-label="Bantuan">?</button>` : ''}
      </div>
      <div class="map-nav-row">
        <button class="map-nav-btn" data-a="zoomin" type="button" title="Perbesar" aria-label="Zoom in">${PLUS_ICON}</button>
        <button class="map-nav-btn" data-a="zoomout" type="button" title="Perkecil" aria-label="Zoom out">${MINUS_ICON}</button>
        <button class="map-nav-btn" data-a="compass" type="button" title="Set ulang arah utara" aria-label="Reset bearing"><span class="map-nav-compass-needle">${COMPASS_ICON}</span></button>
      </div>
    `;

    this.el.querySelector<HTMLButtonElement>('[data-a="home"]')!.addEventListener('click', () => this.opts.onHome());
    const locBtn = this.el.querySelector<HTMLButtonElement>('[data-a="locate"]')!;
    locBtn.addEventListener('click', () => this.opts.onLocate(locBtn));
    this.el.querySelector<HTMLButtonElement>('[data-a="tour"]')?.addEventListener('click', () => this.opts.onTour());
    this.el.querySelector<HTMLButtonElement>('[data-a="zoomin"]')!.addEventListener('click', () => map.zoomIn());
    this.el.querySelector<HTMLButtonElement>('[data-a="zoomout"]')!.addEventListener('click', () => map.zoomOut());
    this.el.querySelector<HTMLButtonElement>('[data-a="compass"]')!.addEventListener('click', () => map.easeTo({ bearing: 0, pitch: 0 }));

    map.on('rotate', this.onRotate);
    this.onRotate();
    return this.el;
  }

  onRemove(): void {
    this.map?.off('rotate', this.onRotate);
    this.el?.remove();
  }

  getDefaultPosition() {
    return 'bottom-right' as const;
  }
}
