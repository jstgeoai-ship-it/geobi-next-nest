import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

const UPTS = [
  { code: 'MDS FL', label: 'UPT MDS FL', color: '#f97316', name: 'Fifik Zulfikar', unit: 'Unit Pelaksana Teknis Manajemen Data Spasial Frontline' },
  { code: 'STS', label: 'UPT STS', color: '#22d3ee', name: 'Firdaus', unit: 'Unit Pelaksana Teknis Spasial Tax Survey' },
  { code: 'SSS', label: 'UPT SSS', color: '#22c55e', name: 'Asyari Adisaputra', unit: 'Unit Pelaksana Teknis Spasial Support Survey' },
  { code: 'MDS BL', label: 'UPT MDS BL', color: '#94a3b8', name: 'Rachmat Dwinanto', unit: 'Unit Pelaksana Teknis Manajemen Data Spasial Backline' },
  { code: 'AK', label: 'UPT AK', color: '#a855f7', name: 'Riky Hermansyah', unit: 'Unit Pelaksana Teknis AK' },
];

function Avatar({ size = 100, height = 120, fontSize = '1.8rem' }: { size?: number; height?: number; fontSize?: string }) {
  return (
    <div style={{ width: size, height, borderRadius: 10, background: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ fontSize, color: '#334155' }}>👤</div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color?: 'orange' | 'green' | 'purple' | 'dark' }) {
  const colors: Record<string, string> = {
    orange: 'background:rgba(249,115,22,.15);color:#fb923c;border-color:rgba(249,115,22,.25)',
    green: 'background:rgba(34,197,94,.12);color:#4ade80;border-color:rgba(34,197,94,.2)',
    purple: 'background:rgba(168,85,247,.12);color:#c084fc;border-color:rgba(168,85,247,.2)',
    dark: 'background:rgba(30,41,59,.6);color:#64748b;border-color:rgba(71,85,105,.3)',
  };
  const base = { fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.04em', padding: '4px 10px', borderRadius: 20, marginTop: 5, textAlign: 'center' as const, lineHeight: 1.3, maxWidth: 140, border: '1px solid' };
  if (!color) return <div style={{ ...base, background: 'rgba(34,211,238,0.12)', color: '#67e8f9', borderColor: 'rgba(34,211,238,0.2)' }}>{children}</div>;
  const [bg, fg, bc] = colors[color].split(';').map((s) => s.split(':')[1]);
  return <div style={{ ...base, background: bg, color: fg, borderColor: bc }}>{children}</div>;
}

export default function StrukturPage() {
  return (
    <div style={{ background: '#0a0f1e', color: '#e2e8f0', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', marginBottom: 24 }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Beranda</Link>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span style={{ color: '#f97316', fontWeight: 500 }}>Struktur Organisasi</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, marginBottom: 4 }}>
          Struktur Organisasi <span style={{ color: '#22d3ee' }}>Jakarta SmartTax</span>
        </h1>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 32 }}>Bapenda DKI Jakarta</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ background: 'linear-gradient(160deg, #0f1e35 0%, #0a1628 60%, #0d1f1a 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '40px 32px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' }}>
                Struktur<br />
                <span style={{ color: '#22d3ee', display: 'block' }}>Organisasi</span>
                Tahun 2026
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3ee' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3ee' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 20px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Bapenda" style={{ height: 36, width: 'auto' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar size={110} height={130} />
              <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>Lusiana Herawati</div>
              <Badge>Kepala Badan Pendapatan Daerah</Badge>
            </div>

            <div style={{ width: 2, height: 28, background: 'rgba(34,211,238,0.3)', margin: '0 auto' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar />
              <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>Elvarinsa</div>
              <Badge>Wakil Kepala Badan Pendapatan Daerah</Badge>
            </div>

            <div style={{ width: 2, height: 28, background: 'rgba(34,211,238,0.3)', margin: '0 auto' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar />
              <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>Mulyo Susongko</div>
              <Badge>Kepala Bidang Pendapatan Pajak I</Badge>
            </div>

            <div style={{ width: 2, height: 28, background: 'rgba(34,211,238,0.3)', margin: '0 auto' }} />

            <div style={{ display: 'flex', position: 'relative', width: '100%', maxWidth: 680 }}>
              {[
                { name: 'Koko Karyono', title: 'Kepala Sub Bidang Pengendalian Pajak I', color: 'orange' as const },
                { name: 'Sutan Imam', title: 'Kepala Sub Bidang Potensi dan Ekstensifikasi Pajak I (Pejabat Pelaksana Teknis Kegiatan)', color: undefined },
                { name: 'Heri Supriono', title: 'Kepala Sub Bidang Pemeriksaan dan Penagihan Pajak I', color: 'green' as const },
              ].map((n) => (
                <div key={n.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 2, height: 24, background: 'rgba(34,211,238,0.3)' }} />
                  <Avatar size={80} height={96} fontSize="1.4rem" />
                  <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>{n.name}</div>
                  <Badge color={n.color}>{n.title}</Badge>
                </div>
              ))}
            </div>

            <div style={{ width: 2, height: 28, background: 'rgba(34,211,238,0.3)', margin: '16px auto 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, width: '100%', position: 'relative', marginTop: 8 }}>
              {UPTS.map((upt) => (
                <div key={upt.code} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, position: 'relative' }}>
                  <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, width: '100%', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${upt.color}20`, border: `1px solid ${upt.color}30` }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: upt.color }}>{upt.code.slice(0, 2)}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#e2e8f0' }}>{upt.label}</span>
                  </div>

                  <div style={{ width: 2, height: 16, background: 'rgba(34,211,238,0.3)' }} />
                  <Avatar size={72} height={86} fontSize="1.3rem" />
                  <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600, marginTop: 6 }}>{upt.name}</div>
                  <Badge color="orange">Project Manager</Badge>
                  <div style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 4, maxWidth: 110, lineHeight: 1.3 }}>{upt.unit}</div>

                  <div style={{ width: 2, height: 16, background: 'rgba(34,211,238,0.3)' }} />
                  <div style={{ width: '100%', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 6, textAlign: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>Co-Project Manager</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter
        maxWidth={900}
        description="Geoportal Pajak Daerah untuk repositori dan visualisasi data geospasial perpajakan daerah Provinsi DKI Jakarta yang terintegrasi dengan Portal Jakarta Satu."
      />
    </div>
  );
}
