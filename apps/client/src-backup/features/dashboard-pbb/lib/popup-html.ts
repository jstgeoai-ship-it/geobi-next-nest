/** Port of persilPopupHTML() in dashboard.blade.php — shared by map-click and search-result popups. */
export function persilPopupHTML(p: Record<string, any>): string {
  const st = String(p.status_pem ?? '').trim().toUpperCase();
  let bc = 'background:rgba(59,130,246,.12);color:#3b82f6;border:1px solid rgba(59,130,246,.25);';
  if (st === 'SUDAH BAYAR') bc = 'background:rgba(34,197,94,.12);color:#4ade80;border:1px solid rgba(34,197,94,.25);';
  else if (st.includes('BELUM')) bc = 'background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.25);';
  else if (st.includes('0 RUPIAH')) bc = 'background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.25);';

  const fmt = (v: any, d = 2) => (v == null || v === '' || isNaN(parseFloat(v)) ? '—' : parseFloat(v).toLocaleString('id-ID', { maximumFractionDigits: d }));
  const rp2 = (v: any) => (v == null || v === '' || isNaN(parseFloat(v)) ? '—' : 'Rp ' + parseFloat(v).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
  const teks = (v: any) => (v == null || v === '' ? '—' : v);
  const alamatJalan = p.alamat ? String(p.alamat).split(', RT')[0] : '—';
  const luasGeom = p.shape_area ?? p.luas_geometri;

  return `
    <div class="pop-head">
      <div style="font-size:10px;color:#ffffff;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Detail Persil</div>
      <div style="font-size:13px;color:#22d3ee;font-weight:700;margin-top:4px;line-height:1.25;">${teks(p.nama_wajib_pajak)}</div>
      <span class="pop-badge" style="${bc}">${p.status_pem ?? '—'}</span>
    </div>
    <div class="pop-body" style="max-height:320px; overflow-y:auto;">
      <div class="pop-row"><span class="pop-k">Nama Wajib Pajak</span><span class="pop-v">${teks(p.nama_wajib_pajak)}</span></div>
      <div class="pop-row"><span class="pop-k">ID Objek Pajak</span><span class="pop-v">${teks(p.idobjekpaj)}</span></div>
      <div class="pop-row"><span class="pop-k">PBB Harus Bayar</span><span class="pop-v">${rp2(p.pbb_yang_dibayar)}</span></div>
      <div class="pop-row"><span class="pop-k">PBB Terutang</span><span class="pop-v">${rp2(p.pbb_terutang)}</span></div>
      <div class="pop-row"><span class="pop-k">NJOP Total</span><span class="pop-v">${rp2(p.njop_total)}</span></div>
      <div class="pop-row"><span class="pop-k">NJOP Bumi</span><span class="pop-v">${rp2(p.njop_bumi)}</span></div>
      <div class="pop-row"><span class="pop-k">NJOP Bangunan</span><span class="pop-v">${rp2(p.njop_bangunan)}</span></div>
      <div class="pop-row"><span class="pop-k">Luas Bumi</span><span class="pop-v">${fmt(p.luas_tanah)} m²</span></div>
      <div class="pop-row"><span class="pop-k">Luas Bangunan</span><span class="pop-v">${fmt(p.luas_bangu)} m²</span></div>
      <div class="pop-row"><span class="pop-k">Luas Geometri</span><span class="pop-v">${fmt(luasGeom)} m²</span></div>
      <div class="pop-row"><span class="pop-k">Jenis Bumi</span><span class="pop-v">${teks(p.jenis_bumi)}</span></div>
      <div class="pop-row"><span class="pop-k">JPB</span><span class="pop-v">${teks(p.jpb)}</span></div>
      <div class="pop-row"><span class="pop-k">Alamat</span><span class="pop-v" style="text-align:right; max-width:170px; white-space:normal;">${alamatJalan}</span></div>
      <div class="pop-row"><span class="pop-k">RT</span><span class="pop-v">${teks(p.rt)}</span></div>
      <div class="pop-row"><span class="pop-k">RW</span><span class="pop-v">${teks(p.rw)}</span></div>
      <div class="pop-row"><span class="pop-k">Kelurahan</span><span class="pop-v">${teks(p.kelurahan)}</span></div>
      <div class="pop-row"><span class="pop-k">Kecamatan</span><span class="pop-v">${teks(p.kecamatan)}</span></div>
      <div class="pop-row"><span class="pop-k">Kota</span><span class="pop-v">${teks(p.kota)}</span></div>
    </div>
  `;
}

/** Port of the inline kelurahan-click popup HTML. */
export function kelurahanPopupHTML(p: Record<string, any>): string {
  const luas = p.luas != null ? parseFloat(p.luas).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' km²' : '—';
  return `
    <div class="pop-head">
      <div style="font-size:10px;color:#ffffff;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Kelurahan</div>
      <span class="pop-badge" style="background:rgba(255,255,255,.1);color:#e2e8f0;border:1px solid rgba(255,255,255,.2);">${p.namobj ?? '—'}</span>
    </div>
    <div class="pop-body">
      <div class="pop-row"><span class="pop-k">Kecamatan</span><span class="pop-v">${p.wadmkc ?? '—'}</span></div>
      <div class="pop-row"><span class="pop-k">Kota/Kab</span><span class="pop-v">${p.wadmkk ?? '—'}</span></div>
      <div class="pop-row"><span class="pop-k">Provinsi</span><span class="pop-v">${p.wadmpr ?? '—'}</span></div>
      <div class="pop-row"><span class="pop-k">Luas</span><span class="pop-v">${luas}</span></div>
    </div>
  `;
}
