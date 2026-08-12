import type { IControl } from 'maplibre-gl';
import { ATTR_TEXTS, type Basemap } from '../basemap-styles';

/** Basemap switcher (DARK/OSM/SAT) + attribution toggle — port of MapToolsControl in dashboard.blade.php. */
export class MapToolsControl implements IControl {
  private el?: HTMLDivElement;
  private attrVisible = false;

  constructor(
    private currentBasemap: Basemap,
    private onSwitch: (key: Basemap) => void,
  ) {}

  onAdd(): HTMLElement {
    this.el = document.createElement('div');
    this.el.className = 'maplibregl-ctrl map-tools-ctrl';
    this.el.innerHTML = `
      <div class="bm-ctrl">
        <button class="bm-btn${this.currentBasemap === 'dark' ? ' bm-active' : ''}" data-bm="dark" type="button">DARK</button>
        <button class="bm-btn${this.currentBasemap === 'osm' ? ' bm-active' : ''}" data-bm="osm" type="button">OSM</button>
        <button class="bm-btn${this.currentBasemap === 'satellite' ? ' bm-active' : ''}" data-bm="satellite" type="button">SAT</button>
        <button class="bm-btn${this.currentBasemap === 'positron' ? ' bm-active' : ''}" data-bm="positron" type="button">POSITRON</button>
        <span class="bm-label">BaseMap</span>
        <span id="attr-text" style="display:none;font-size:10px;color:#475569;background:rgba(2,6,23,.88);border:1px solid rgba(255,255,255,.09);border-radius:5px;padding:2px 8px;white-space:nowrap;"></span>
        <button id="attr-btn" title="Toggle attribution" type="button" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:rgba(2,6,23,.88);color:#ffffff;font-size:14px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;flex-shrink:0;">&#9432;</button>
      </div>
    `;

    const btn = this.el.querySelector<HTMLButtonElement>('#attr-btn')!;
    const txt = this.el.querySelector<HTMLSpanElement>('#attr-text')!;
    btn.addEventListener('click', () => {
      this.attrVisible = !this.attrVisible;
      txt.style.display = this.attrVisible ? 'inline-block' : 'none';
      btn.style.color = this.attrVisible ? '#22d3ee' : '#ffffff';
    });

    this.el.querySelectorAll<HTMLButtonElement>('.bm-btn').forEach((b) => {
      b.addEventListener('click', () => this.onSwitch(b.dataset.bm as Basemap));
    });

    this.updateText(this.currentBasemap);
    return this.el;
  }

  onRemove(): void {
    this.el?.remove();
  }

  setActive(key: Basemap) {
    this.currentBasemap = key;
    this.el?.querySelectorAll<HTMLButtonElement>('.bm-btn').forEach((b) => {
      b.classList.toggle('bm-active', b.dataset.bm === key);
    });
    this.updateText(key);
  }

  private updateText(key: Basemap) {
    const t = this.el?.querySelector<HTMLSpanElement>('#attr-text');
    if (t) t.textContent = ATTR_TEXTS[key] ?? '';
  }

  getDefaultPosition() {
    return 'bottom-right' as const;
  }
}

/** Round "?" button that opens the guided tour — port of TourHelpControl. */
export class TourHelpControl implements IControl {
  private el?: HTMLButtonElement;

  constructor(private onOpen: () => void) {}

  onAdd(): HTMLElement {
    this.el = document.createElement('button');
    this.el.type = 'button';
    this.el.className = 'maplibregl-ctrl tour-help-ctrl';
    this.el.title = 'Panduan penggunaan dashboard';
    this.el.textContent = '?';
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onOpen();
    });
    return this.el;
  }

  onRemove(): void {
    this.el?.remove();
  }

  getDefaultPosition() {
    return 'bottom-right' as const;
  }
}
