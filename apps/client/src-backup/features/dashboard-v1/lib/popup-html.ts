/** Port of dashboard-v1.blade.php's inline click-popup template (simpler subset of fields than v2/v3). */
export function persilPopupHTMLV1(p: Record<string, any>): string {
  const st = String(p.status_pem ?? '').trim().toUpperCase();
  let bc = 'background:rgba(59,130,246,.12);color:#3b82f6;border:1px solid rgba(59,130,246,.25);';
  if (st === 'SUDAH BAYAR') bc = 'background:rgba(34,197,94,.12);color:#4ade80;border:1px solid rgba(34,197,94,.25);';
  else if (st.includes('BELUM')) bc = 'background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.25);';
  else if (st.includes('0 RUPIAH')) bc = 'background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.25);';

  const fmt = (v: any, d = 2) => (v == null || v === '' || isNaN(parseFloat(v)) ? '—' : parseFloat(v).toLocaleString('id-ID', { maximumFractionDigits: d }));
  const rp2 = (v: any) => (v == null || v === '' || isNaN(parseFloat(v)) ? '—' : 'Rp ' + parseFloat(v).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const teks = (v: any) => (v == null || v === '' ? '—' : v);
  const alamatJalan = p.alamat ? String(p.alamat).split(', RT')[0] : '—';

  return `
    <div class="pop-head">
      <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Detail Persil</div>
      <span class="pop-badge" style="${bc}">${p.status_pem ?? '—'}</span>
    </div>
    <div class="pop-body" style="max-height:320px; overflow-y:auto;">
      <div class="pop-row"><span class="pop-k">ID Objek Pajak</span><span class="pop-v">${teks(p.idobjekpaj)}</span></div>
      <div class="pop-row"><span class="pop-k">PBB Harus Bayar</span><span class="pop-v">${rp2(p.pbb_yang_dibayar)}</span></div>
      <div class="pop-row"><span class="pop-k">NJOP Total</span><span class="pop-v">${rp2(p.njop_total)}</span></div>
      <div class="pop-row"><span class="pop-k">Luas Bumi</span><span class="pop-v">${fmt(p.luas_tanah)} m²</span></div>
      <div class="pop-row"><span class="pop-k">Luas Bangunan</span><span class="pop-v">${fmt(p.luas_bangu)} m²</span></div>
      <div class="pop-row"><span class="pop-k">Alamat</span><span class="pop-v" style="text-align:right; max-width:170px; white-space:normal;">${alamatJalan}</span></div>
      <div class="pop-row"><span class="pop-k">RT</span><span class="pop-v">${teks(p.rt)}</span></div>
      <div class="pop-row"><span class="pop-k">RW</span><span class="pop-v">${teks(p.rw)}</span></div>
      <div class="pop-row"><span class="pop-k">Kelurahan</span><span class="pop-v">${teks(p.kelurahan)}</span></div>
      <div class="pop-row"><span class="pop-k">Kecamatan</span><span class="pop-v">${teks(p.kecamatan)}</span></div>
    </div>
  `;
}
