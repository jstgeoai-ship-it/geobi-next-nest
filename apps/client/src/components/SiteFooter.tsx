const LINKS = ['Bapenda DKI Jakarta', 'Data Jakarta', 'Portal DKI Jakarta'];

export function SiteFooter({ maxWidth = 800, description }: { maxWidth?: number; description: string }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,6,23,0.6)' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '48px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Bapenda" style={{ height: 40, width: 'auto', marginBottom: 16, display: 'block' }} />
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{description}</p>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Informasi Kontak</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: '50%', background: 'rgba(249,115,22,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#f97316" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>Jl. Abdul Muis No. 66,<br />Jakarta Pusat</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: '50%', background: 'rgba(34,197,94,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <span style={{ fontSize: 13, color: '#64748b' }}>(021) 3865656</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: '50%', background: 'rgba(34,211,238,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#22d3ee" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <span style={{ fontSize: 13, color: '#64748b' }}>bapenda@jakarta.go.id</span>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Tautan Terkait</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {LINKS.map((link) => (
                <a key={link} href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '4px 0' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.5, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, textAlign: 'center', fontSize: 12, color: '#1e293b' }}>
          © {new Date().getFullYear()} Badan Pendapatan Daerah Provinsi DKI Jakarta. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
