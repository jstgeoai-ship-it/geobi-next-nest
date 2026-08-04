import Link from 'next/link';

const DASHBOARDS = [
  { href: '/katalog/dashboard-pbb/v1', title: 'Dashboard PBB-P2 Vol. 1', desc: 'Ringkasan status pembayaran, tingkat kepatuhan, dan peta sebaran parsel.' },
  { href: '/katalog/dashboard-pbb', title: 'Dashboard PBB-P2 Vol. 2', desc: 'Analitik interaktif, chart distribusi, dan peta sebaran pajak.' },
  { href: '/katalog/dashboard-pbb/v3', title: 'Dashboard PBB-P2 Vol. 3', desc: 'Analitik interaktif, chart distribusi, dan peta sebaran pajak.' },
];

export default function KatalogPage() {
  return (
    <div className="pt-24 px-6 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Katalog Geoportal</h1>
        <p className="text-slate-400 light:text-gray-600 mb-10">Pilih dashboard sistem geospasial</p>

        <div className="grid md:grid-cols-3 gap-6">
          {DASHBOARDS.map((d) => (
            <Link key={d.href} href={d.href} className="bg-slate-900 light:bg-slate-50 light:border light:border-gray-200 p-6 rounded-xl hover:bg-slate-800 light:hover:bg-gray-50 transition-colors">
              <h2 className="text-white light:text-gray-900 text-xl font-bold">{d.title}</h2>
              <p className="text-slate-400 light:text-gray-600 mt-2">{d.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
