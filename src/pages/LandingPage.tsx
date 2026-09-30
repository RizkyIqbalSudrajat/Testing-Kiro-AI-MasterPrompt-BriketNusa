import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Leaf,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Globe2,
  Trash2,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Factory,
  Layers,
  Sparkles,
  Users,
  ChevronRight,
  Info,
  Calendar,
  Package,
  Menu,
  X,
  Scale,
  MapPin,
  Clock,
  Quote,
  Star,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import {
  Button,
  Card,
  GlassCard,
  Badge,
  StatCard,
  Counter,
  ThemeToggle,
} from '../components/ui';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah, formatAngka } from '../utils/formatters';

export const LandingPage: React.FC = () => {
  const { produkList } = useData();
  const { currentUser, isAuthenticated, switchRoleQuick, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleQuickAction = (role: 'supplier' | 'pembeli' | 'admin') => {
    switchRoleQuick(role);
    navigate(role === 'supplier' ? '/supplier' : role === 'pembeli' ? '/pembeli' : '/admin');
  };

  // Partners for Marquee
  const marqueePartners = [
    'PT Nusantara Shisha Lounge',
    'Dubai Golden Hookah Trading',
    'IndoGrill BBQ Steakhouses',
    'Borneo Charcoal Export Ltd',
    'Java Bio-Energy Solutions',
    'Sumatra Agro Mandiri',
    'Bali Smoked Grill & Kitchen',
    'Hamburg Bio-Carbon Import Gmbh',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 relative overflow-hidden bg-noise">
      {/* 1. Navbar Sticky Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 dark:border-stone-800/80 bg-white/70 dark:bg-[#0C0A09]/70 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo BriketNusa (ikon api + daun) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-[#F97316] p-0.5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-stone-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-5 h-5 text-[#F97316] fill-[#F97316]/20 shrink-0" />
                <Leaf className="w-3 h-3 text-emerald-500 fill-emerald-500/40 absolute -bottom-0.5 -right-0.5" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white block leading-none">
                Briket<span className="text-[#F97316]">Nusa</span>
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                Hilirisasi Kelapa Indonesia
              </span>
            </div>
          </Link>

          {/* Menu Anchor Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <a href="#masalah" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Masalah
            </a>
            <a href="#solusi" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Solusi Hilirisasi
            </a>
            <a href="#produk" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Katalog Produk
            </a>
            <a href="#dampak" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Dampak
            </a>
            <a href="#mitra" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Kemitraan
            </a>
          </nav>

          {/* Actions: ThemeToggle + Tombol Masuk */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle showLabel={false} />

            {isAuthenticated && currentUser ? (
              <Link to={currentUser.role === 'supplier' ? '/supplier' : currentUser.role === 'pembeli' ? '/pembeli' : '/admin'}>
                <Button variant="primary" size="sm" glow icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                  Dashboard {currentUser.nama.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="accent" size="sm" glow icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                  Masuk Akun
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-b border-stone-200/80 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl px-6 py-6 space-y-4 overflow-hidden"
            >
              <div className="space-y-3 text-sm font-semibold text-stone-700 dark:text-stone-300">
                <a
                  href="#masalah"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Masalah
                </a>
                <a
                  href="#solusi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Solusi Hilirisasi
                </a>
                <a
                  href="#produk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Katalog Produk
                </a>
                <a
                  href="#dampak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Dampak
                </a>
                <a
                  href="#mitra"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Kemitraan
                </a>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                {isAuthenticated && currentUser ? (
                  <Link
                    to={currentUser.role === 'supplier' ? '/supplier' : currentUser.role === 'pembeli' ? '/pembeli' : '/admin'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" fullWidth size="md">
                      Buka Dashboard {currentUser.role}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="accent" fullWidth size="md" glow>
                      Masuk Portal Demo
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section: Animated Gradient Mesh + Blobs + Floating Glass Cards */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden border-b border-stone-200/60 dark:border-stone-800/80">
        {/* Animated Gradient Blobs in Background */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute -top-24 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/25 to-green-400/20 blur-[130px] rounded-full"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute top-40 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#F97316]/20 via-orange-500/15 to-[#6B4423]/15 blur-[120px] rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Headline, Badge, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge kecil */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-xs"
              >
                <span>🇮🇩 Hilirisasi Kelapa Indonesia</span>
              </motion.div>

              {/* Headline Besar */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.08]"
              >
                Dari Tempurung Lokal,{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#F97316] bg-clip-text text-transparent">
                  Jadi Bara Kelas Dunia.
                </span>
              </motion.h1>

              {/* Subjudul Nilai Tambah */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed"
              >
                BriketNusa menghubungkan petani kelapa nusantara dengan pengolahan briket arang standar ekspor.
                Menciptakan lonjakan nilai tambah <strong>500%</strong> di dalam negeri, mengentaskan limbah batok,
                dan memenuhi kebutuhan energi bersih global.
              </motion.p>

              {/* 2 CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a href="#mitra">
                  <Button variant="primary" size="lg" glow icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    Gabung Jadi Mitra
                  </Button>
                </a>
                <a href="#produk">
                  <Button variant="outline" size="lg" icon={<Flame className="w-4 h-4 text-[#F97316]" />}>
                    Lihat Produk
                  </Button>
                </a>
              </motion.div>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6 border-t border-stone-200/70 dark:border-stone-800/80 flex flex-wrap items-center gap-6 text-xs text-stone-500 dark:text-stone-400"
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Kadar Abu &lt; 2.2% White Ash</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Flame className="w-4 h-4 text-[#F97316]" />
                  <span>Daya Bakar 2.5 - 4 Jam</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-[#6B4423] dark:text-[#A87950]" />
                  <span>Jemput Langsung ke Petani</span>
                </div>
              </motion.div>
            </div>

            {/* Right Col: Visual Floating Card Glassmorphism */}
            <div className="lg:col-span-5 relative">
              {/* Main Feature Glass Box */}
              <GlassCard glowBorder padding="lg" className="relative z-10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] block">
                      Spesifikasi Unggulan
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-white mt-0.5">
                      Briket Kubus Shisha 25mm
                    </h3>
                  </div>
                  <span className="w-10 h-10 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5 fill-current" />
                  </span>
                </div>

                {/* 2x2 Matrix */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Kadar Abu</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      &lt; 2.2%
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium mt-0.5">
                      White ash tipis & bersih
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Durasi Nyala</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      120 - 150 Mnt
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium mt-0.5">
                      Panas konstan merata
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Nilai Kalori</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                      7.500 kcal
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium mt-0.5">
                      Kualitas ekspor GCC
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Bahan Baku</span>
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                      100% Batok
                    </span>
                    <span className="text-[10px] text-[#6B4423] dark:text-[#A87950] block font-medium mt-0.5">
                      Alami tanpa bau sulfur
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                      Kapasitas Lini Aktif Pabrik:
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    6.000 kg / hari
                  </span>
                </div>
              </GlassCard>

              {/* Floating Mini Glass Card 1 (Ton Diolah) */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800 shadow-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    450+ Ton Kelapa
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    Limbah batok diolah
                  </div>
                </div>
              </motion.div>

              {/* Floating Mini Glass Card 2 (Supplier Aktif) */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-6 -right-4 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800 shadow-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    120+ Petani Mitra
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    Penghasilan pasti & adil
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Logo Strip / Trust Bar (Marquee Berjalan) */}
      <section className="py-8 bg-stone-100/60 dark:bg-stone-950/60 border-b border-stone-200/70 dark:border-stone-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Dipercaya oleh Komunitas & Mitra Rantai Pasok
          </span>
        </div>

        <div className="relative w-full overflow-hidden flex">
          {/* Gradient Masks on Edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAFAF7] dark:from-[#0C0A09] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAFAF7] dark:from-[#0C0A09] to-transparent z-10" />

          {/* Marquee Track */}
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-stone-600 dark:text-stone-400 font-semibold text-xs sm:text-sm py-2">
            {marqueePartners.concat(marqueePartners).map((partner, index) => (
              <div key={index} className="flex items-center gap-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="tracking-tight hover:text-stone-900 dark:hover:text-white transition-colors">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section Masalah: Bento Grid dengan Angka Besar Animasi */}
      <section id="masalah" className="py-24 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge status="error">Latar Belakang Masalah</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Potensi Kelapa Raksasa, Nilai Tambah Mengalir ke Luar
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Indonesia adalah produsen kelapa terbesar kedua di dunia. Namun sistem konvensional
              menyebabkan petani tetap marjinal dan sumber daya bernilai tinggi terbuang percuma.
            </p>
          </motion.div>

          {/* Bento Grid Masalah */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: 70% Ekspor Mentah (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-7"
            >
              <GlassCard glowBorder className="h-full flex flex-col justify-between p-8 space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Ekspor Bahan Baku Mentah
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Mayoritas hasil kelapa diekspor dalam wujud batok basah atau arang setengah jadi
                    dengan harga sangat rendah (Rp 2.000 - Rp 3.000/kg). Negara pengimpor memprosesnya
                    menjadi briket shisha dan karbon aktif premium bernilai puluhan ribu rupiah.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
                    ±<Counter to={70} suffix="%" />
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Hasil kelapa diekspor mentah tanpa olahan hilir*
                  </span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Bento Card 2: Nilai Tambah Hilang (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-5"
            >
              <Card className="h-full flex flex-col justify-between p-8 space-y-6 border-amber-500/30">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Nilai Tambah Lenyap
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Briket jadi dijual seharga Rp 15.000 - Rp 25.000/kg di pasar shisha Timur Tengah dan BBQ Eropa.
                    Tanpa pabrik hilirisasi lokal, devisa besar ini hilang ke negara perantara.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 font-mono">
                    +<Counter to={500} suffix="%" />
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Margin lonjakan produk jadi yang terlewatkan*
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* Bento Card 3: Limbah Tempurung Terbuang (12 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-12"
            >
              <GlassCard className="p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                      <Trash2 className="w-4 h-4 text-[#F97316]" />
                      <span>Masalah Lingkungan & Emisi Liar</span>
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                      Ratusan Ribu Ton Limbah Tempurung Terbuang & Membakar Udara
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      Di sentra perkebunan kelapa seperti Riau, Jatim, dan Sulut, batok dan sabut kerap dibakar
                      terbuka di pinggir jalan desa, menghasilkan kepulan asap CO₂ beracun dan abu kotor yang mencemari
                      pemukiman masyarakat.
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-col justify-center items-start md:items-end">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#F97316] font-mono tabular-nums">
                      <Counter to={350000} suffix=" Ton" />
                    </span>
                    <span className="text-xs text-stone-500 mt-1">
                      Estimasi limbah biomassa kelapa belum teroptimasi per tahun*
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-400 italic">
                  *Catatan: Angka merupakan estimasi industri agro kelapa Indonesia untuk keperluan ilustrasi prototype BriketNusa.
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Section Solusi: Timeline Horizontal 4 Langkah */}
      <section id="solusi" className="py-24 bg-stone-100/40 dark:bg-stone-950/40 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge status="success">Solusi Terpadu</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Alur 4 Langkah Hilirisasi Berkelanjutan
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Dari pekarangan petani lokal sampai ke kontainer ekspor internasional dengan standarisasi mutlak.
            </p>
          </motion.div>

          {/* Timeline Cards Container */}
          <div className="relative">
            {/* Horizontal Line on Desktop */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-emerald-500 via-[#F97316] to-emerald-600 -translate-y-1/2 z-0 origin-left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard glowBorder padding="md" className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
                        01
                      </span>
                      <Truck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Kumpulkan & Timbang
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Supplier mengajukan setoran via web. Armada truk BriketNusa menjemput langsung ke kebun
                      petani dengan timbangan digital transparan dan harga adil.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    &rarr; Timbang digital di tempat
                  </span>
                </GlassCard>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard glowBorder padding="md" className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-[#F97316]/10 text-[#F97316] font-extrabold flex items-center justify-center text-sm font-mono">
                        02
                      </span>
                      <Factory className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Olah & Karbonisasi
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Batok dikarbonisasi dengan retort kiln suhu 500°C minim asap, digiling mesh 80, dipadukan
                      tepung tapioka organik, lalu dipres hidrolik bertekanan 120 bar.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#F97316]">
                    &rarr; Pirolisis bersih 500°C
                  </span>
                </GlassCard>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard glowBorder padding="md" className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-[#6B4423]/10 text-[#6B4423] dark:text-[#A87950] font-extrabold flex items-center justify-center text-sm font-mono">
                        03
                      </span>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Uji Kualitas Lab
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Setiap batch diuji kadar abu (white ash &lt; 2.2%), kadar air &lt; 5%, serta drop-test tahan
                      banting untuk memastikan kepuasan buyer shisha & resto.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    &rarr; Standar SNI 01-6235
                  </span>
                </GlassCard>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GlassCard glowBorder padding="md" className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 font-extrabold flex items-center justify-center text-sm font-mono">
                        04
                      </span>
                      <Package className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Distribusi & Ekspor
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      Briket dikemas master box 10kg inner plastik vacuum, siap dikirim ke resto BBQ lokal,
                      lounge shisha, maupun kontainer ekspor FOB ke Dubai & Eropa.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    &rarr; Domestik & Internasional
                  </span>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section Produk: Kartu Produk dengan Hover Tilt/Lift & Spesifikasi */}
      <section id="produk" className="py-24 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <Badge status="accent">Katalog Jadi</Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-2">
                Pilihan Briket Siap Pesan
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                Bebas belerang kimia, tidak mengeluarkan jelaga hitam, dan panas membara stabil hingga 4 jam.
              </p>
            </div>

            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
              ✓ Stok Gudang Terverifikasi
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produkList.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <GlassCard
                  hoverLift
                  glowBorder
                  padding="md"
                  className="h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Visual gradient illustration banner */}
                    <div
                      className={`w-full h-36 rounded-2xl bg-gradient-to-br ${prod.gambar} p-3.5 flex flex-col justify-between border border-white/10 relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg">
                          {prod.kategori}
                        </span>
                        <span className="text-[10px] text-white/80 font-mono">
                          {prod.bentuk}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white leading-snug">
                        {prod.nama}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed min-h-[48px]">
                      {prod.deskripsi}
                    </p>

                    {/* Quick Specs */}
                    <div className="p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">Kadar Abu:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{prod.kadarAbu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">Waktu Bakar:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{prod.waktuBakar}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 dark:text-stone-400">Kalori:</span>
                        <span className="font-semibold font-mono text-stone-800 dark:text-stone-200">{prod.kalori || '7.500 kcal'}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-stone-200/60 dark:border-stone-700">
                        <span className="text-stone-500 dark:text-stone-400">Stok Siap:</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                          {formatAngka(prod.stokKg)} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Harga / kg</span>
                      <span className="text-base font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                        {formatRupiah(prod.hargaPerKg)}
                      </span>
                      <span className="text-[10px] text-stone-400 block">Min {prod.minOrderKg} kg</span>
                    </div>

                    <Link to="/login">
                      <Button variant="accent" size="sm" glow>
                        Pesan
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section Dampak: Statistik Besar dalam Bento Grid */}
      <section id="dampak" className="py-24 bg-stone-100/40 dark:bg-stone-950/40 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge status="info">Dampak & Skala</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Hilirisasi Nyata untuk Ekonomi Kerakyatan
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Bukan sekadar komoditas arang, kami membangun rantai ekonomi yang memuliakan petani dan mengoptimalkan devisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StatCard
                label="Supplier Petani Terdaftar"
                value={120}
                suffix="+"
                icon={<Users className="w-5 h-5" />}
                trend={{ value: 'Meningkat +28%', isPositive: true }}
                subtitle="Tersebar di sentra kelapa"
                glowColor="emerald"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatCard
                label="Bahan Baku Terserap"
                value={450}
                suffix=" Ton"
                icon={<Scale className="w-5 h-5" />}
                trend={{ value: 'Limbah batok & sabut', isPositive: true }}
                subtitle="Mengurangi polusi pembakaran"
                glowColor="orange"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StatCard
                label="Provinsi Sentra Pasokan"
                value={5}
                suffix=" Wilayah"
                icon={<MapPin className="w-5 h-5" />}
                trend={{ value: 'Riau, Jatim, Jateng, Jabar, Sulut', isPositive: true }}
                subtitle="Rantai pasok terintegrasi"
                glowColor="coco"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatCard
                label="Mitra Pembeli Aktif"
                value={30}
                suffix="+"
                icon={<ShoppingBag className="w-5 h-5" />}
                trend={{ value: 'Shisha, Resto, Ekspor', isPositive: true }}
                subtitle="Pasokan rutin berkelanjutan"
                glowColor="blue"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Section Mitra/Role: 3 Kartu Peran dengan Benefit Masing-masing */}
      <section id="mitra" className="py-24 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge status="neutral">Pilar Ekosistem</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Pilih Peran Kemitraan Anda
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Portal multi-role BriketNusa dirancang spesifik untuk setiap pemangku kepentingan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Role 1: Supplier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard glowBorder className="h-full flex flex-col justify-between p-8 space-y-6 border-emerald-500/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Petani & Pengepul Lokal
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                      Peran Supplier
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Jual batok kelapa tua, sabut kering, atau arang kiln mentah dengan harga adil tanpa potongan calo.
                  </p>

                  <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Harga beli pasti Rp 1.200 - Rp 6.500/kg</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Timbang digital di kebun petani</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Transfer pembayaran instan setelah verifikasi</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 space-y-2">
                  <Button
                    variant="primary"
                    fullWidth
                    glow
                    onClick={() => handleRoleQuickAction('supplier')}
                  >
                    Masuk Dashboard Supplier &rarr;
                  </Button>
                  <p className="text-[10px] text-center text-stone-400 font-mono">
                    Demo: supplier@briketnusa.id (Pak Darmo)
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Role 2: Pembeli */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard glowBorder className="h-full flex flex-col justify-between p-8 space-y-6 border-orange-500/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#F97316] uppercase tracking-wider block">
                      Shisha Lounge & Resto BBQ
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                      Peran Pembeli
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Dapatkan suplai briket standar ekspor bebas sulfur dan percik secara kontinu untuk operasional bisnis.
                  </p>

                  <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span>Kadar abu tipis &lt; 2.2% White Ash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span>Pemesanan fleksibel (kg hingga tonase kontainer)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span>Pelacakan resi ekspedisi dan faktur resmi</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 space-y-2">
                  <Button
                    variant="accent"
                    fullWidth
                    glow
                    onClick={() => handleRoleQuickAction('pembeli')}
                  >
                    Masuk Dashboard Pembeli &rarr;
                  </Button>
                  <p className="text-[10px] text-center text-stone-400 font-mono">
                    Demo: pembeli@briketnusa.id (Sinta)
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Role 3: Admin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard glowBorder className="h-full flex flex-col justify-between p-8 space-y-6 border-[#6B4423]/30">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#6B4423]/10 text-[#6B4423] dark:text-[#A87950] flex items-center justify-center font-bold">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#6B4423] dark:text-[#A87950] uppercase tracking-wider block">
                      Operasional Pabrik
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                      Peran Admin
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Pusat kendali verifikasi mutu setoran bahan, pengawasan mesin pirolisis, stok gudang, dan order masuk.
                  </p>

                  <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#6B4423] dark:text-[#A87950] shrink-0" />
                      <span>Verifikasi 1-klik setoran & tolak kadar air tinggi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#6B4423] dark:text-[#A87950] shrink-0" />
                      <span>Monitor 4 tahap lini produksi dan output mesin</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#6B4423] dark:text-[#A87950] shrink-0" />
                      <span>Ubah status pesanan ke Dikirim dengan nomor resi</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 space-y-2">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => handleRoleQuickAction('admin')}
                  >
                    Masuk Dashboard Admin &rarr;
                  </Button>
                  <p className="text-[10px] text-center text-stone-400 font-mono">
                    Demo: admin@briketnusa.id (Admin BriketNusa)
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Section Testimoni: 3 Kartu Testimoni dengan Avatar Inisial */}
      <section className="py-24 bg-stone-100/40 dark:bg-stone-950/40 border-b border-stone-200/60 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge status="accent">Suara Mitra</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Dipercaya Dari Hulu Petani Hingga Hilir Klien
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Simak pengalaman nyata para mitra yang telah menjadi bagian dari hilirisasi kelapa Indonesia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimoni 1: Pak Darmo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard padding="lg" className="h-full flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#F97316]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    "Dulu batok kelapa di kebun cuma kami bakar jadi abu kotor atau dibeli tengkulak seribu perak per kilo.
                    Sejak gabung BriketNusa, timbangan digital langsung di kebun dan uang ditransfer pas itu juga. Sangat adil bagi petani."
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    PD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Pak Darmo
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Ketua Kelompok Tani Kelapa Indragiri
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Testimoni 2: Sinta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard padding="lg" className="h-full flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#F97316]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    "Untuk kebutuhan lounge shisha kami di Senopati dan Kemang, kadar abu putih di bawah 2.2% itu mutlak.
                    Briket Kubus BriketNusa sama sekali tidak berbau belerang dan tidak bikin tamu batuk. Pelanggan kami puas."
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    SN
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Sinta Nurhaliza
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Owner CV Bara Shisha Nusantara, Jakarta
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Testimoni 3: David Wijaya */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard padding="lg" className="h-full flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#F97316]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    "Briket Hexagonal-nya juara untuk konsep smoked BBQ kami. Waktu bakar stabil hampir 4 jam tanpa perlu bolak-balik
                    tambah arang. Pasokan rutin tiap bulan terjadwal rapi langsung dari pabrik Kendal."
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B4423] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    DW
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      David Wijaya
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Head Chef & Co-Founder IndoGrill BBQ Chain
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. CTA Besar: Panel Gradient Full-Width */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-emerald-700 via-green-600 to-[#F97316] text-white shadow-2xl text-center space-y-6"
        >
          {/* Subtle overlay decorative blob */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/10 blur-2xl" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kedaulatan Energi Berkelanjutan</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Siap Jadi Bagian Dari Hilirisasi Kelapa Indonesia?
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Bergabunglah hari ini sebagai supplier bahan baku lokal atau mitra pembeli briket berkualitas ekspor.
              Dukung nilai tambah di tanah air sendiri.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-stone-900 hover:bg-stone-100 border-none font-bold shadow-lg"
                icon={<ArrowRight className="w-4 h-4 text-[#F97316]" />}
                iconPosition="right"
              >
                Coba Demo BriketNusa Sekarang
              </Button>
            </Link>

            <a href="#solusi">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/15">
                Pelajari Alur Pabrik &rarr;
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* 11. Footer Modern */}
      <footer className="border-t border-stone-200/70 dark:border-stone-800/80 bg-white/60 dark:bg-[#0C0A09]/60 backdrop-blur-xl text-stone-600 dark:text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Logo & Brand Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-[#F97316] p-0.5 shadow-xs">
                  <div className="w-full h-full bg-white dark:bg-stone-900 rounded-[14px] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#F97316] fill-current" />
                  </div>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
                  Briket<span className="text-[#F97316]">Nusa</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Inisiatif hilirisasi terpadu tempurung dan sabut kelapa Indonesia menjadi briket arang
                berkualitas premium untuk pemenuhan energi ramah lingkungan domestik dan ekspor.
              </p>
              <div className="flex items-center gap-3 text-xs text-stone-400 pt-1">
                <span>SNI 01-6235</span>
                <span>·</span>
                <span>ISO 9001:2015</span>
                <span>·</span>
                <span>100% Bio-Organic</span>
              </div>
            </div>

            {/* Col 2: Navigasi Anchor */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#masalah" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Urgensi Masalah Hilirisasi
                  </a>
                </li>
                <li>
                  <a href="#solusi" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Alur 4 Langkah Pengolahan
                  </a>
                </li>
                <li>
                  <a href="#produk" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Katalog Briket & Arang
                  </a>
                </li>
                <li>
                  <a href="#dampak" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Dampak Sosial & Ekonomi
                  </a>
                </li>
                <li>
                  <a href="#mitra" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Skema Kemitraan Petani & UMKM
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Sentra Fasilitas */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Sentra Pabrik & Depo
              </h4>
              <div className="space-y-2.5 text-xs text-stone-500 dark:text-stone-400">
                <p>
                  <strong>Pabrik Utama Kendal:</strong><br />
                  Kawasan Industri Kendal Blok B-12, Jawa Tengah
                </p>
                <p>
                  <strong>Depo Pasokan Indragiri:</strong><br />
                  Sentra Kelapa Tembilahan, Indragiri Hilir, Riau
                </p>
                <p>
                  <strong>Depo Rogojampi:</strong><br />
                  Sentra Batok Banyuwangi, Jawa Timur
                </p>
              </div>
            </div>

            {/* Col 4: Kontak & Portal Login */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Layanan & Demo Portal
              </h4>
              <div className="space-y-2.5 text-xs text-stone-500 dark:text-stone-400">
                <p>
                  Email: <strong>kemitraan@briketnusa.id</strong><br />
                  WhatsApp: <strong>+62 821-1122-3344</strong>
                </p>
                <div className="pt-1">
                  <Link to="/login">
                    <Button variant="outline" size="sm" fullWidth icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                      Akses Portal Login Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright 2026 */}
          <div className="pt-8 border-t border-stone-200/70 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-4">
            <p>© 2026 BriketNusa Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-stone-900 dark:hover:text-white cursor-pointer">Kebijakan Privasi</span>
              <span>·</span>
              <span className="hover:text-stone-900 dark:hover:text-white cursor-pointer">Syarat & Ketentuan</span>
              <span>·</span>
              <span className="hover:text-stone-900 dark:hover:text-white cursor-pointer">Standar Mutu SNI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
