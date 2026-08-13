import { Navbar } from '@/components/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] light:bg-slate-100 text-[var(--pub-text)] light:text-[var(--pub-text)]">
      <Navbar />
      {children}
    </div>
  );
}
