import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

const LAW_ITEMS = [
  'Undang-Undang Nomor 4 Tahun 2011 tentang Informasi Geospasial sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 6 Tahun 2023;',
  'Peraturan Pemerintah Nomor 45 Tahun 2021 tentang Penyelenggaraan Informasi Geospasial;',
  'Peraturan Pemerintah Nomor 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah;',
  'Peraturan Daerah Provinsi DKI Jakarta Nomor 7 Tahun 2022 tentang Pengelolaan Keuangan Daerah;',
  'Peraturan Daerah Nomor 1 Tahun 2024 tentang Pajak Daerah dan Retribusi Daerah;',
  'Peraturan Gubernur Provinsi DKI Jakarta Nomor 142 Tahun 2013 sebagaimana telah diubah dengan Peraturan Gubernur Nomor 161 Tahun 2014 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah;',
  'Peraturan Gubernur Provinsi DKI Jakarta Nomor 21 Tahun 2023 tentang Pembentukan dan Pemeliharaan Basis Data Pajak Daerah Melalui Sistem Informasi Geospasial;',
  'Instruksi Gubernur Provinsi DKI Jakarta Nomor 10 Tahun 2018 tentang Pemanfaatan Data Kependudukan oleh Organisasi Perangkat Daerah (OPD);',
  'Keputusan Gubernur Nomor 277 Tahun 2023 tentang Perubahan Ketigabelas Atas Keputusan Gubernur Nomor 129 Tahun 2020 tentang Kuasa Pengguna Anggaran pada Satuan Kerja Perangkat Daerah;',
  'Keputusan Kepala Badan Pendapatan Daerah Provinsi DKI Jakarta Nomor 356 Tahun 2024 tentang Pembentukan Tim Kerja Kegiatan Pemeliharaan dan Peningkatan Kualitas Data Pajak Daerah;',
  'Keputusan Kepala Badan Pendapatan Daerah Provinsi DKI Jakarta Nomor 362 Tahun 2024 tentang Petunjuk Pelaksanaan Kegiatan Matching dan Cleansing Data Pajak Bumi dan Bangunan Perdesaan dan Perkotaan Melalui Kegiatan Jakarta SmartTax;',
  'Keputusan Kepala Badan Pendapatan Daerah Provinsi DKI Jakarta Nomor 647 Tahun 2024 tentang Petunjuk Pelaksanaan Pendataan dalam rangka Penilaian Individual Pajak Bumi dan Bangunan Perdesaan dan Perkotaan;',
  'Keputusan Kepala Badan Pendapatan Daerah Provinsi DKI Jakarta Nomor 893 Tahun 2024 tentang Penunjukan dan Pengangkatan Pejabat Pembuat Komitmen di Lingkungan Badan Pendapatan Daerah Provinsi DKI Jakarta; dan',
  'Keputusan Kepala Badan Pendapatan Daerah Provinsi DKI Jakarta Nomor 4 Tahun 2025 tentang Penetapan Pejabat Penatausahaan Keuangan dan Pejabat Pelaksana Teknis Kegiatan Badan Pendapatan Daerah Provinsi DKI Jakarta Tahun Anggaran 2025.',
];

const STATS = [
  { value: '5 & 1', label: 'Wilayah Kota / Kabupaten', color: '#22d3ee' },
  { value: '44', label: 'Kecamatan', color: '#f97316' },
  { value: '267', label: 'Kelurahan', color: '#a855f7' },
];

export default function TentangPage() {
  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--pub-muted-3)', marginBottom: 40 }}>
            <Link href="/" style={{ color: 'var(--pub-muted-3)', textDecoration: 'none' }}>Beranda</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span style={{ color: '#f97316', fontWeight: 500 }}>Tentang</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 32, height: 2, background: 'linear-gradient(90deg,#f97316,#22d3ee)', borderRadius: 2, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '.12em', textTransform: 'uppercase' }}>Tentang Kami</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-.02em' }}>
            Geoportal <span style={{ color: '#22d3ee' }}>Jakarta SmartTax</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--pub-muted)', maxWidth: 680 }}>
            Geoportal Jakarta SmartTax merupakan portal informasi geospasial perpajakan daerah yang
            dikelola oleh Bapenda Provinsi DKI Jakarta. Portal ini menyediakan visualisasi data pajak
            daerah berbasis spasial yang terintegrasi untuk mendukung monitoring, analisis, dan
            pemutakhiran basis data pajak secara akurat, handal, dan mutakhir guna mendukung
            pengambilan kebijakan berbasis data.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 0 72px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: 'var(--pub-card)', border: '1px solid var(--pub-border)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--pub-muted-2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 32, height: 2, background: 'linear-gradient(90deg,#f97316,#22d3ee)', borderRadius: 2, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '.12em', textTransform: 'uppercase' }}>Regulasi</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 10 }}>Landasan Hukum</h2>
            <p style={{ fontSize: 14, color: 'var(--pub-muted-2)', lineHeight: 1.7, maxWidth: 560 }}>
              Peraturan perundang-undangan dan ketetapan resmi yang melandasi pelaksanaan
              program penataan data geospasial pajak daerah.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {LAW_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'var(--pub-card)', border: '1px solid var(--pub-border)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: '50%', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 13, color: 'var(--pub-muted)', lineHeight: 1.65, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter
        maxWidth={800}
        description="Geoportal Pajak Daerah untuk repositori dan visualisasi data geospasial perpajakan daerah Provinsi DKI Jakarta."
      />
    </div>
  );
}
