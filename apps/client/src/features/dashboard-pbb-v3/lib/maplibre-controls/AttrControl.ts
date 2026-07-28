import type { IControl } from 'maplibre-gl';

/** Plain attribution-toggle control (no basemap switching) — used by v1/v3, port of their AttrControl class. */
export class AttrControl implements IControl {
  private el?: HTMLDivElement;
  private visible = false;

  onAdd(): HTMLElement {
    this.el = document.createElement('div');
    this.el.className = 'maplibregl-ctrl';
    this.el.style.cssText = 'display:flex;align-items:center;gap:4px;padding:2px 0;justify-content:flex-end;';
    this.el.innerHTML = `
      <span id="attr-text" style="display:none;font-size:10px;color:#475569;background:rgba(2,6,23,.88);border:1px solid rgba(255,255,255,.09);border-radius:5px;padding:2px 8px;white-space:nowrap;">&copy; CARTO &copy; OpenStreetMap</span>
      <button id="attr-btn" title="Toggle attribution" type="button" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:rgba(2,6,23,.88);color:#64748b;font-size:14px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;">&#9432;</button>
    `;
    const btn = this.el.querySelector<HTMLButtonElement>('#attr-btn')!;
    const txt = this.el.querySelector<HTMLSpanElement>('#attr-text')!;
    btn.addEventListener('click', () => {
      this.visible = !this.visible;
      txt.style.display = this.visible ? 'inline-block' : 'none';
      btn.style.color = this.visible ? '#22d3ee' : '#64748b';
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
