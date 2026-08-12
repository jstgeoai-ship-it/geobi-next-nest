/** Port of pbbp2.blade.php's inline click-popup templates (parcel + kelurahan). */

function fmtNum(val: unknown, dec = 2) {
  if (val == null || val === '') return '—';
  const n = parseFloat(String(val));
  return isNaN(n) ? String(val) : n.toLocaleString('id-ID', { maximumFractionDigits: dec });
}

export function parselPopupHTML(p: Record<string, any>): string {
  const st = String(p.status_pem ?? '').trim().toUpperCase();
  let badgeClass = 'badge-default';
  if (st === 'SUDAH BAYAR') badgeClass = 'badge-lunas';
  else if (st.includes('BELUM')) badgeClass = 'badge-belum';
  else if (st.includes('0 RUPIAH')) badgeClass = 'badge-nol';

  return `
    <div class="pop-header">
        <div class="pop-title">Detail Parsel</div>
        <span class="pop-badge ${badgeClass}">${p.status_pem ?? '—'}</span>
    </div>
    <div class="pop-body">
        <div class="pop-row"><span class="pop-key">GID</span><span class="pop-val">${p.gid ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">ID Objek Pajak</span><span class="pop-val">${p.idobjekpaj ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">Luas Tanah</span><span class="pop-val">${fmtNum(p.luas_tanah)} m²</span></div>
        <div class="pop-row"><span class="pop-key">Luas Bangunan</span><span class="pop-val">${fmtNum(p.luas_bangu)} m²</span></div>
        <div class="pop-row"><span class="pop-key">RT / RW</span><span class="pop-val">${p.rt ?? '—'} / ${p.rw ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">Rasio</span><span class="pop-val">${fmtNum(p.ratio, 4)}</span></div>
        <div class="pop-row"><span class="pop-key">Keliling (m)</span><span class="pop-val">${fmtNum(p.shape_leng)}</span></div>
        <div class="pop-row"><span class="pop-key">Luas Area</span><span class="pop-val">${fmtNum(p.shape_area)} m²</span></div>
    </div>
  `;
}

export function kelurahanPopupHTML(p: Record<string, any>): string {
  return `
    <div class="pop-header">
        <div class="pop-title">Kelurahan</div>
        <span class="pop-badge" style="background:rgba(255,255,255,.1);color:#e2e8f0;border:1px solid rgba(255,255,255,.2);">
            ${p.namobj ?? '—'}
        </span>
    </div>
    <div class="pop-body">
        <div class="pop-row"><span class="pop-key">Kecamatan</span><span class="pop-val">${p.wadmkc ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">Kota/Kab</span><span class="pop-val">${p.wadmkk ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">Provinsi</span><span class="pop-val">${p.wadmpr ?? '—'}</span></div>
        <div class="pop-row"><span class="pop-key">Luas</span><span class="pop-val">${p.luas != null ? parseFloat(p.luas).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' km²' : '—'}</span></div>
    </div>
  `;
}
