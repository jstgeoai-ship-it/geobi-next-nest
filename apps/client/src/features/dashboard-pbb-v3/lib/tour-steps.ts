import type { PanelId } from '../store/filters.store';

export interface TourStep {
  el?: string;
  panel?: PanelId;
  title: string;
  desc: string;
}

/** Port of TOUR_STEPS in dashboard.blade.php — v2-only guided walkthrough. */
export const TOUR_STEPS: TourStep[] = [
  {
    title: 'Selamat datang',
    desc: 'Panduan singkat mengenal dashboard PBB-P2 — <b>15 langkah, &plusmn;2 menit</b>. Gunakan <b>Lanjut</b> dan <b>Kembali</b> untuk berpindah, atau tekan <b>Esc</b> untuk keluar kapan saja.',
  },
  {
    el: '#tour-gauge',
    title: 'Capaian Realisasi Pembayaran PBB-P2',
    desc: 'Jarum menunjukkan <b>persentase realisasi</b> terhadap total PBB yang harus dibayar. Di bawahnya: nilai realisasi, PBB harus dibayar, dan sisa yang <b>belum dibayar</b>.<br><br><b>Gunanya:</b> menjawab &ldquo;sudah sejauh mana capaian pembayaran pajak?&rdquo;',
  },
  {
    el: '#tour-ringkasan',
    title: 'Ringkasan Data',
    desc: 'Jumlah <b>bidang tanah (persil)</b> per status: Sudah Bayar, Belum Bayar, PBB 0 Rupiah, dan Dibatalkan.<br><br><b>Catatan:</b> ini menghitung <b>jumlah bidang</b>, bukan nilai rupiah.',
  },
  {
    el: '#tour-distribusi',
    title: 'Distribusi Status Pembayaran',
    desc: 'Tabel menampilkan <b>nilai rupiah</b> dan persentase tiap status; diagram donat menampilkan proporsinya. Arahkan kursor ke donat untuk melihat rinciannya.<br><br><b>Gunanya:</b> membandingkan bobot rupiah antar status.',
  },
  {
    el: '#search-float',
    title: 'Pencarian Objek',
    desc: 'Pilih mode <b>Alamat</b> atau <b>Nama WP</b>, ketik kata kunci, lalu klik <b>Cari</b>. Peta akan terbang ke lokasi bidang yang cocok.<br><br><b>Gunanya:</b> menelusuri satu wajib pajak atau alamat tertentu saat rapat.',
  },
  {
    el: '#btnPanelWaktu', panel: 'panelWaktu',
    title: 'Filter Waktu',
    desc: 'Pilih <b>Tahun Pajak</b> dan/atau <b>rentang tanggal pembayaran</b>. Seluruh angka dan peta menyesuaikan otomatis.<br><br><b>Gunanya:</b> menyusun laporan periodik (bulanan/tahunan).',
  },
  {
    el: '#btnPanelWilayah', panel: 'panelWilayah',
    title: 'Filter Wilayah',
    desc: 'Penyaringan bertingkat <b>Kelurahan &rarr; RW &rarr; RT</b>. Pilihan RW muncul setelah kelurahan dipilih.<br><br><b>Gunanya:</b> menjawab &ldquo;wilayah mana yang tunggakannya paling besar?&rdquo;.',
  },
  {
    el: '#btnPanelStatus', panel: 'panelStatus',
    title: 'Status Pembayaran',
    desc: 'Centang status yang ingin ditampilkan. Hilangkan centang selain <b>Belum Bayar</b> untuk memusatkan perhatian pada tunggakan saja.<br><br><b>Gunanya:</b> menyiapkan sasaran penagihan.',
  },
  {
    el: '#btnPanelLayer', panel: 'panelLayer',
    title: 'Layer Peta',
    desc: 'Menyalakan atau mematikan <b>batas bidang, batas kelurahan,</b> dan <b>batas kecamatan</b>.<br><br><b>Gunanya:</b> menyederhanakan tampilan peta saat dipakai sebagai bahan paparan.',
  },
  {
    el: '#btnPanelKategori', panel: 'panelKategori',
    title: 'Kategori PBB',
    desc: 'Kelompok besaran PBB: <b>Tinggi, Sedang, Rendah,</b> dan <b>Tidak Kena Pajak</b>.<br><br><b>Gunanya:</b> digabung dengan status &ldquo;Belum Bayar&rdquo;, menghasilkan daftar <b>objek bernilai besar yang menunggak</b> — prioritas utama penagihan.',
  },
  {
    el: '#btnPanelNjop', panel: 'panelNjop',
    title: 'Kategori NJOP Total',
    desc: 'Penyaringan berdasarkan <b>NJOP Total</b>: Tinggi, Sedang, Rendah, dan Tidak Kena Pajak.<br><br><b>Gunanya:</b> menilai potensi wilayah berdasarkan nilai objek pajaknya secara keseluruhan.',
  },
  {
    el: '#btnPanelNjopBumi', panel: 'panelNjopBumi',
    title: 'Kategori NJOP Bumi',
    desc: 'Penyaringan berdasarkan nilai <b>NJOP Bumi</b> (nilai tanah saja, tanpa bangunan): Tinggi, Sedang, Rendah, dan Tidak Kena Pajak.<br><br><b>Gunanya:</b> menilai potensi nilai tanah per wilayah, terlepas dari bangunan di atasnya.',
  },
  {
    el: '#btnPanelNjopBangunan', panel: 'panelNjopBangunan',
    title: 'Kategori NJOP Bangunan',
    desc: 'Penyaringan berdasarkan nilai <b>NJOP Bangunan</b> saja: Tinggi, Sedang, Rendah, dan Tidak Kena Pajak.<br><br><b>Gunanya:</b> mengidentifikasi objek dengan nilai bangunan besar, terpisah dari nilai tanahnya.',
  },
  {
    el: '#map',
    title: 'Peta Sebaran',
    desc: 'Setiap poligon adalah satu bidang tanah, diwarnai menurut status: <b style="color:#22c55e">hijau</b> sudah bayar, <b style="color:#ef4444">merah</b> belum bayar, <b style="color:#f59e0b">kuning</b> PBB 0 rupiah, <b style="color:#3b82f6">biru</b> dibatalkan.<br><br><b>Klik satu bidang</b> untuk melihat detail: NJOP, PBB, luas, alamat, dan wilayah.',
  },
  {
    el: '.maplibregl-ctrl-bottom-right',
    title: 'Kontrol Peta',
    desc: 'Dari atas: <b>My Location</b>, <b>Home</b> (kembali ke tampilan awal), perbesar, perkecil, dan kompas. Di bawahnya tombol <b>BaseMap</b> — klik untuk membuka 3 pilihan latar peta (Dark / OSM / Satelit).',
  },
];
