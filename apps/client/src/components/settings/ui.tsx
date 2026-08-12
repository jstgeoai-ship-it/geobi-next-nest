'use client';

export function SettingsCard({ title, icon, children, className = '' }: { title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 light:border-gray-200 bg-slate-900 light:bg-white p-5 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-[var(--pub-text)]">
          {icon}
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

export function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? 'bg-cyan-500' : 'bg-white/15 light:bg-gray-300'
      }`}
    >
      <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-1'}`} />
    </button>
  );
}

export function ToggleRow({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-4">
      <div>
        <p className="text-sm text-[var(--pub-text)]">{label}</p>
        {hint && <p className="text-xs text-[var(--pub-muted-2)] mt-0.5">{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none focus:border-cyan-400 transition-colors';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function Badge({ tone, children }: { tone: 'green' | 'red' | 'amber' | 'gray' | 'blue'; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    green: 'bg-emerald-400/15 text-emerald-400',
    red: 'bg-red-400/15 text-red-400',
    amber: 'bg-amber-400/15 text-amber-400',
    gray: 'bg-white/10 light:bg-gray-200 text-[var(--pub-muted-2)]',
    blue: 'bg-blue-400/15 text-blue-400',
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}