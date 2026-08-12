'use client';

import { useState } from 'react';
import { SettingsCard, Field, TextInput, SelectInput } from '@/components/settings/ui';

/** Halaman ini murni UI — belum ada endpoint /api/settings di server buat nyimpen field-field
 *  ini, jadi state di bawah cuma lokal (gak persist kalau reload). Tombol "Simpan Perubahan"
 *  sengaja belum di-wire ke mana-mana; tinggal disambungin kalau backend-nya udah ada. */
export default function PengaturanUmumPage() {
  const [namaInstansi, setNamaInstansi] = useState('Badan Pendapatan Daerah Provinsi DKI Jakarta');
  const [kodeInstansi, setKodeInstansi] = useState('BAPENDA-DKI');
  const [alamat, setAlamat] = useState('Jl. Abdul Muis No.66, Gambir, Jakarta Pusat');
  const [email, setEmail] = useState('info@bapenda.jakarta.go.id');
  const [telepon, setTelepon] = useState('(021) 1234 5678');

  const [tahunPajak, setTahunPajak] = useState('2026');
  const [wilayah, setWilayah] = useState('Semua Wilayah');
  const [rtRw, setRtRw] = useState('Semua');
  const [dataPerHalaman, setDataPerHalaman] = useState('20');

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button type="button" className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium px-4 py-2 transition-colors">
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SettingsCard title="Informasi Instansi">
          <div className="space-y-4">
            <Field label="Nama Instansi"><TextInput value={namaInstansi} onChange={(e) => setNamaInstansi(e.target.value)} /></Field>
            <Field label="Kode Instansi"><TextInput value={kodeInstansi} onChange={(e) => setKodeInstansi(e.target.value)} /></Field>
            <Field label="Alamat"><TextInput value={alamat} onChange={(e) => setAlamat(e.target.value)} /></Field>
            <Field label="Email Instansi"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="No. Telepon"><TextInput value={telepon} onChange={(e) => setTelepon(e.target.value)} /></Field>
          </div>
        </SettingsCard>

        <SettingsCard title="Preferensi Dashboard">
          <div className="space-y-4">
            <Field label="Tahun Pajak Default">
              <SelectInput value={tahunPajak} onChange={(e) => setTahunPajak(e.target.value)}>
                {['2026', '2025', '2024'].map((y) => <option key={y} value={y}>{y}</option>)}
              </SelectInput>
            </Field>
            <Field label="Wilayah Default">
              <SelectInput value={wilayah} onChange={(e) => setWilayah(e.target.value)}>
                <option>Semua Wilayah</option>
                <option>Jakarta Pusat</option>
                <option>Jakarta Utara</option>
                <option>Jakarta Barat</option>
                <option>Jakarta Selatan</option>
                <option>Jakarta Timur</option>
              </SelectInput>
            </Field>
            <Field label="RT/RW Default">
              <SelectInput value={rtRw} onChange={(e) => setRtRw(e.target.value)}>
                <option>Semua</option>
              </SelectInput>
            </Field>
            <Field label="Data per Halaman">
              <SelectInput value={dataPerHalaman} onChange={(e) => setDataPerHalaman(e.target.value)}>
                {['10', '20', '50', '100'].map((n) => <option key={n} value={n}>{n}</option>)}
              </SelectInput>
            </Field>
            <p className="text-xs text-[var(--pub-muted-3)] pt-1">Pengaturan ini akan digunakan sebagai default saat Anda membuka dashboard.</p>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}