import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft, Home, Compass } from 'lucide-react';
import { Button, GlassCard, ThemeToggle } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col justify-between p-4 sm:p-6 bg-noise">
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-[#F97316] p-0.5 shadow-sm">
            <div className="w-full h-full bg-white dark:bg-stone-900 rounded-[14px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#F97316] fill-[#F97316]/20" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
            Briket<span className="text-[#F97316]">Nusa</span>
          </span>
        </Link>

        <ThemeToggle showLabel={false} />
      </header>

      {/* Main 404 Center Bento Card */}
      <main className="max-w-md w-full mx-auto my-auto text-center">
        <GlassCard glowBorder padding="xl" className="space-y-6">
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
            <Compass className="w-10 h-10 text-[#F97316] animate-pulse" />
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-xs shadow-sm">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
              Jalur Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Halaman atau tautan yang Anda cari tidak tersedia dalam alur ekosistem rantai pasok hilirisasi BriketNusa.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                fullWidth
                glow
                icon={<Home className="w-4 h-4" />}
              >
                Kembali ke Beranda
              </Button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                fullWidth
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Portal Masuk
              </Button>
            </Link>
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-stone-400 dark:text-stone-500">
        © 2026 BriketNusa Indonesia · Hilirisasi Nilai Tambah Kelapa
      </footer>
    </div>
  );
};
