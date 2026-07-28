'use client';

interface Option {
  value: string;
  label: string;
  hint: string;
}

interface Props {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (v: string) => void;
  onSetAll: (checked: boolean) => void;
}

/** Generic checkbox-category panel — shared by Kategori PBB, NJOP Total/Bumi/Bangunan (all follow the same master+children pattern). */
export function CategoryPanel({ title, options, selected, onToggle, onSetAll }: Props) {
  const allChecked = selected.length === options.length;
  const someChecked = selected.length > 0 && selected.length < options.length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={allChecked}
          ref={(el) => { if (el) el.indeterminate = someChecked; }}
          onChange={(e) => onSetAll(e.target.checked)}
          title="Pilih / lepas semua kategori"
        />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '.09em' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {options.map((opt) => (
          <label key={opt.value} style={{ fontSize: 11, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => onToggle(opt.value)} />
            <span style={{ minWidth: 80, lineHeight: 1.3 }}>{opt.label}</span>
            <span style={{ color: '#ffffff', fontSize: 10 }}>{opt.hint}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
