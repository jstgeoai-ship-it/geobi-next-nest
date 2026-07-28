'use client';

import { useTahunList } from '../../../hooks/useWilayahOptions';
import { useFiltersStore } from '../../../store/filters.store';
import { LockedDatePicker } from './LockedDatePicker';

const TB_EYE_OFF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
const TB_EYE_ON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

export function WaktuPanel({ variant }: { variant: 'segmented' | 'plain' }) {
  const { data } = useTahunList();
  const daftarTahun = data?.daftarTahun ?? [];

  const tahun = useFiltersStore((s) => s.tahun);
  const periodeAwal = useFiltersStore((s) => s.periodeAwal);
  const periodeAkhir = useFiltersStore((s) => s.periodeAkhir);
  const periodeMode = useFiltersStore((s) => s.periodeMode);
  const setTahun = useFiltersStore((s) => s.setTahun);
  const setPeriodeAwal = useFiltersStore((s) => s.setPeriodeAwal);
  const setPeriodeAkhir = useFiltersStore((s) => s.setPeriodeAkhir);
  const setPeriodeMode = useFiltersStore((s) => s.setPeriodeMode);

  const awalMin = tahun ? `${tahun}-01-01` : undefined;
  const awalMax = tahun ? `${tahun}-12-31` : undefined;

  return (
    <div>
      <div className="wilayah-field">
        <label className="wilayah-field-label" htmlFor="filterTahun">Tahun Pajak</label>
        <select id="filterTahun" className="wilayah-select" value={tahun} onChange={(e) => setTahun(e.target.value)}>
          {daftarTahun.map((th) => <option key={th} value={th}>{th}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '.06em', margin: '4px 0 8px' }}>Periode Pembayaran</div>

      {variant === 'segmented' ? (
        <>
          <LockedDatePicker
            idPrefix="dpAwal"
            label="Periode Awal"
            value={periodeAwal}
            onChange={setPeriodeAwal}
            min={awalMin}
            max={awalMax}
            ket={tahun ? `Terkunci pada tahun pajak ${tahun}. Tahun lain tetap ditampilkan, tapi tidak bisa dipilih.` : undefined}
          />
          <LockedDatePicker idPrefix="dpAkhir" label="Periode Akhir" value={periodeAkhir} onChange={setPeriodeAkhir} />
        </>
      ) : (
        <>
          <div className="wilayah-field">
            <label className="wilayah-field-label" htmlFor="filterPeriodeAwal">Periode Awal</label>
            <input type="date" id="filterPeriodeAwal" className="wilayah-select" value={periodeAwal} onChange={(e) => setPeriodeAwal(e.target.value)} />
          </div>
          <div className="wilayah-field">
            <label className="wilayah-field-label" htmlFor="filterPeriodeAkhir">Periode Akhir</label>
            <input type="date" id="filterPeriodeAkhir" className="wilayah-select" value={periodeAkhir} onChange={(e) => setPeriodeAkhir(e.target.value)} />
          </div>
        </>
      )}

      {variant === 'segmented' ? (
        <div className="tb-section">
          <div className="tb-header">
            <span className="tb-title">Tampilkan Bidang</span>
            <span className="tb-info-icon" title="Menentukan bidang mana yang muncul di peta saat periode pembayaran diisi">i</span>
          </div>
          <p className="tb-desc">Menentukan bidang mana yang muncul di peta saat periode pembayaran diisi.</p>

          <div className="tb-toggle">
            <input type="radio" name="periodeMode" id="modeKetat" checked={periodeMode === 'ketat'} onChange={() => setPeriodeMode('ketat')} />
            <label htmlFor="modeKetat" className="tb-toggle-btn">Kategori Sudah Dibayar</label>
            <input type="radio" name="periodeMode" id="modeLonggar" checked={periodeMode === 'longgar'} onChange={() => setPeriodeMode('longgar')} />
            <label htmlFor="modeLonggar" className="tb-toggle-btn">Semua bidang</label>
          </div>

          <div className="tb-banner">
            <span className="tb-banner-icon" dangerouslySetInnerHTML={{ __html: periodeMode === 'longgar' ? TB_EYE_ON : TB_EYE_OFF }} />
            <span className="tb-banner-text">
              {periodeMode === 'longgar' ? (
                <>
                  <strong className="tb-banner-title">Semua bidang tetap tampil di peta</strong>
                  <span>Rentang tanggal hanya menyaring status bayar, bukan menyembunyikan bidang.</span>
                </>
              ) : (
                <span>Bidang yang belum punya tanggal bayar akan disembunyikan dari peta.</span>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Mode Periode</div>
          <label className="status-toggle" style={{ alignItems: 'flex-start' }}>
            <input type="radio" name="periodeMode" checked={periodeMode === 'ketat'} onChange={() => setPeriodeMode('ketat')} style={{ marginTop: 3 }} />
            <span>
              <span style={{ display: 'block' }}>Hanya yang dibayar di rentang</span>
              <span style={{ display: 'block', fontSize: 9, color: '#64748b', lineHeight: 1.4 }}>Versi 1 · bidang tanpa tanggal bayar disembunyikan</span>
            </span>
          </label>
          <label className="status-toggle" style={{ alignItems: 'flex-start' }}>
            <input type="radio" name="periodeMode" checked={periodeMode === 'longgar'} onChange={() => setPeriodeMode('longgar')} style={{ marginTop: 3 }} />
            <span>
              <span style={{ display: 'block' }}>Sertakan Bidang Tanpa Tanggal Direntang</span>
              <span style={{ display: 'block', fontSize: 9, color: '#64748b', lineHeight: 1.4 }}>Versi 2 · rentang hanya menyaring yang sudah bayar</span>
            </span>
          </label>
          <p style={{ fontSize: 10, color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
            Tahun Pajak menyaring bidang di peta (butuh kolom <code>tahun_pajak</code> pada vector tile).
            Periode memakai kolom <code>tgl_bayar</code>; bidang belum bayar tidak memiliki tanggal.
          </p>
        </div>
      )}
    </div>
  );
}
