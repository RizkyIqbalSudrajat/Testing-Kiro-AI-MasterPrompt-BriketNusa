import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Truck,
  Scale,
  Coins,
  Clock,
  Award,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  TrendingUp,
  FileText,
  Sparkles,
  Info,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import {
  GlassCard,
  Card,
  Button,
  Input,
  Select,
  Badge,
  useToast,
} from '../components/ui';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatRupiah, formatAngka } from '../utils/formatters';

// 6-month historical revenue data for the supplier
const SIX_MONTH_DATA = [
  { bulan: 'Okt 2025', pendapatan: 2925000, volume: 450, setoran: 2 },
  { bulan: 'Nov 2025', pendapatan: 4030000, volume: 620, setoran: 3 },
  { bulan: 'Des 2025', pendapatan: 3770000, volume: 580, setoran: 2 },
  { bulan: 'Jan 2026', pendapatan: 5200000, volume: 800, setoran: 4 },
  { bulan: 'Feb 2026', pendapatan: 6175000, volume: 950, setoran: 4 },
  { bulan: 'Mar 2026', pendapatan: 9940000, volume: 1530, setoran: 5 },
];

export const SupplierDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { setoranList, addSetoran, getHargaBahan } = useData();
  const { toast } = useToast();

  // Navigation Items for Supplier
  const navItems: NavItem[] = [
    { label: 'Ikhtisar & Statistik', href: '/supplier', icon: TrendingUp },
    { label: 'Ajukan Penjemputan', href: '#form-ajukan', icon: Truck },
    { label: 'Riwayat Setoran', href: '#riwayat-setoran', icon: Clock },
    { label: 'Harga Bahan Hari Ini', href: '#harga-bahan', icon: Coins },
  ];

  // Form State
  const [jenisBahan, setJenisBahan] = useState<'Tempurung' | 'Sabut' | 'Arang Tempurung'>('Tempurung');
  const [beratKg, setBeratKg] = useState<number>(300);
  const [tanggalJemput, setTanggalJemput] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [alamatJemput, setAlamatJemput] = useState<string>(
    currentUser?.lokasi || 'Desa Sungai Luar, Kec. Batang Tuaka, Indragiri Hilir, Riau'
  );
  const [catatan, setCatatan] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Table Filter & Search State
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Menunggu' | 'Diverifikasi' | 'Ditolak'>('Semua');
  const [searchTable, setSearchTable] = useState<string>('');
  const [chartMetric, setChartMetric] = useState<'pendapatan' | 'volume'>('pendapatan');

  // Filter supplier's own setoran list
  const mySetoranList = useMemo(() => {
    if (!currentUser) return setoranList;
    return setoranList.filter(
      (s) => s.supplierId === currentUser.id || s.supplierNama?.includes('Darmo') || s.supplierId === 'user-supplier-1'
    );
  }, [setoranList, currentUser]);

  // Calculated Stats
  const stats = useMemo(() => {
    const verified = mySetoranList.filter((s) => s.status === 'Diverifikasi');
    const waiting = mySetoranList.filter((s) => s.status === 'Menunggu');

    const totalBeratKg = verified.reduce((acc, curr) => acc + curr.beratKg, 0);
    const totalPendapatanRp = verified.reduce((acc, curr) => acc + (curr.total || curr.beratKg * curr.hargaPerKg), 0);

    return {
      totalBeratKg: totalBeratKg || 3550,
      totalPendapatanRp: totalPendapatanRp || 9940000,
      waitingCount: waiting.length,
      qualityRating: '4.9 / 5.0',
    };
  }, [mySetoranList]);

  // Current selected material price
  const hargaSatuan = useMemo(() => {
    return getHargaBahan(jenisBahan);
  }, [jenisBahan, getHargaBahan]);

  const estimasiTotal = useMemo(() => {
    return (beratKg || 0) * hargaSatuan;
  }, [beratKg, hargaSatuan]);

  // Handle Submit Penjemputan
  const handleSubmitPenjemputan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!beratKg || beratKg < 50) {
      toast.error('Berat setoran minimal 50 kg untuk penjemputan armada.', 'Validasi Form');
      return;
    }

    if (!alamatJemput.trim()) {
      toast.error('Alamat lokasi penjemputan wajib diisi.', 'Validasi Form');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = addSetoran({
        supplierId: currentUser?.id || 'user-supplier-1',
        supplierNama: currentUser?.nama || 'Pak Darmo',
        supplierLokasi: currentUser?.lokasi || alamatJemput,
        jenisBahan,
        beratKg,
        alamatJemput,
        catatan: catatan ? `${catatan} (Jadwal: ${tanggalJemput})` : `Jadwal jemput: ${tanggalJemput}`,
      });

      setIsSubmitting(false);
      toast.success(
        `Pengajuan ${created.id} berhasil dikirim! Armada logistik akan menjemput sesuai jadwal.`,
        'Penjemputan Terjadwal'
      );

      // Reset form
      setCatatan('');
      setBeratKg(250);
    }, 600);
  };

  // Filtered Table Data
  const filteredSetoran = useMemo(() => {
    return mySetoranList.filter((s) => {
      const matchStatus = statusFilter === 'Semua' ? true : s.status === statusFilter;
      const matchSearch =
        s.id.toLowerCase().includes(searchTable.toLowerCase()) ||
        s.jenisBahan.toLowerCase().includes(searchTable.toLowerCase()) ||
        s.tanggal.includes(searchTable);
      return matchStatus && matchSearch;
    });
  }, [mySetoranList, statusFilter, searchTable]);

  return (
    <DashboardLayout
      title="Dashboard Supplier Bahan Kelapa"
      subtitle="Pantau setoran bahan baku, ajukan penjemputan armada, dan evaluasi pendapatan hilirisasi secara transparan."
      navItems={navItems}
      actions={
        <a href="#form-ajukan">
          <Button variant="primary" size="sm" glow icon={<PlusCircle className="w-4 h-4" />}>
            Setor Bahan
          </Button>
        </a>
      }
    >
      <div className="space-y-8">
        {/* ============================================================== */}
        {/* 1. 4 STATCARDS (Dengan Tren & Mini Sparkline)                   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Setoran */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Setoran Terverifikasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {formatAngka(stats.totalBeratKg)}
              </span>
              <span className="text-xs font-bold text-stone-500">kg</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% bln ini</span>
              </span>

              {/* Mini Sparkline SVG */}
              <svg className="w-16 h-5 text-emerald-500" viewBox="0 0 64 20" fill="none">
                <path
                  d="M0 16L12 14L24 17L36 10L48 12L64 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Pendapatan Bulan Ini */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-[#F97316]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Pendapatan Bulan Ini
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {formatRupiah(stats.totalPendapatanRp)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.5% vs lalu</span>
              </span>

              {/* Mini Sparkline SVG */}
              <svg className="w-16 h-5 text-[#F97316]" viewBox="0 0 64 20" fill="none">
                <path
                  d="M0 18L14 15L26 12L38 13L50 7L64 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Menunggu Verifikasi */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Menunggu Verifikasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                {stats.waitingCount}
              </span>
              <span className="text-xs font-semibold text-stone-500">antrean setoran</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Armada dijadwalkan
              </span>

              {/* Mini Sparkline SVG */}
              <svg className="w-16 h-5 text-amber-500" viewBox="0 0 64 20" fill="none">
                <path
                  d="M0 10L16 10L32 14L48 8L64 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 4: Rating Kualitas */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-[#6B4423]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Rating Kualitas Bahan
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#6B4423]/10 text-[#6B4423] dark:text-[#C59B76] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                {stats.qualityRating}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Grade A+ Tempurung
              </span>

              {/* Mini Sparkline SVG */}
              <svg className="w-16 h-5 text-emerald-500" viewBox="0 0 64 20" fill="none">
                <path
                  d="M0 8L16 6L32 5L48 4L64 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. BENTO ROW: GRAFIK REVENUE 6 BULAN (RECHARTS) + HARGA PASAR  */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sisi Kiri: Grafik Area Recharts (7 Cols) */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Tren Kemitraan Petani
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                  Grafik Pertumbuhan 6 Bulan Terakhir
                </h3>
              </div>

              {/* Metric Toggle: Pendapatan vs Volume */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs">
                <button
                  type="button"
                  onClick={() => setChartMetric('pendapatan')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    chartMetric === 'pendapatan'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Pendapatan (Rp)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    chartMetric === 'volume'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Volume (kg)
                </button>
              </div>
            </div>

            {/* Recharts Area Chart Component */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={SIX_MONTH_DATA}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(150, 150, 150, 0.15)"
                  />

                  <XAxis
                    dataKey="bulan"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#78716c' }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    tickFormatter={(val) =>
                      chartMetric === 'pendapatan'
                        ? `${(val / 1000000).toFixed(1)}jt`
                        : `${val}kg`
                    }
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-xl text-xs space-y-1">
                            <p className="font-bold text-stone-900 dark:text-stone-100">
                              {label}
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                              Total Hasil: {formatRupiah(data.pendapatan)}
                            </p>
                            <p className="text-stone-500">
                              Volume Setoran: {formatAngka(data.volume)} kg ({data.setoran}x jemput)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {chartMetric === 'pendapatan' ? (
                    <Area
                      type="monotone"
                      dataKey="pendapatan"
                      stroke="#10B981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPendapatan)"
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#F97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVolume)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800 text-xs text-stone-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Rata-rata kenaikan volume: +22%/bulan
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  100% Dibayar Tanpa Tunda
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Pembaruan terakhir: Hari ini 08:00 WIB
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Kartu Info "Harga Bahan Hari Ini" (4 Cols) */}
          <div id="harga-bahan" className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] block">
                    Papan Harga Resmi
                  </span>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                    Harga Bahan Hari Ini
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Update Aktif
                </span>
              </div>

              {/* 3 Material Price Rows */}
              <div className="space-y-3">
                {/* 1. Tempurung */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Tempurung Kelapa Tua
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      Rp 2.800 <span className="text-[10px] text-stone-400 font-normal">/ kg</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Kadar air &lt; 15%, batok bersih</span>
                    <span className="text-emerald-600 font-semibold">+Rp 200 minggu ini</span>
                  </div>
                </div>

                {/* 2. Sabut */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Sabut Kelapa Kering
                    </span>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                      Rp 1.200 <span className="text-[10px] text-stone-400 font-normal">/ kg</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Moisture &lt; 18%, serat utuh</span>
                    <span className="text-stone-400">Stabil</span>
                  </div>
                </div>

                {/* 3. Arang Mentah */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Arang Batok Mentah
                    </span>
                    <span className="text-sm font-extrabold text-[#F97316] font-mono">
                      Rp 6.500 <span className="text-[10px] text-stone-400 font-normal">/ kg</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Hasil pirolisis drum/kiln</span>
                    <span className="text-emerald-600 font-semibold">+Rp 300 minggu ini</span>
                  </div>
                </div>
              </div>

              {/* Guidance Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tips Nilai Tertinggi:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Jemur batok di bawah terik matahari minimal 1 hari sebelum penjemputan untuk menurunkan kadar air dan mendapatkan timbangan grade A murni.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. FORM AJUKAN PENJEMPUTAN BAHAN (Interactive Form in Bento)   */}
        {/* ============================================================== */}
        <div id="form-ajukan">
          <GlassCard glowBorder padding="lg" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800 gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Logistik Armada BriketNusa</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                  Ajukan Penjemputan Bahan Baku
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  Isi estimasi berat bahan kelapa di kebun Anda. Armada kami akan datang dengan timbangan digital transparan.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Tanpa Biaya Ongkos Angkut</span>
              </div>
            </div>

            <form onSubmit={handleSubmitPenjemputan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Field 1: Jenis Bahan */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Jenis Bahan Baku
                  </label>
                  <select
                    value={jenisBahan}
                    onChange={(e) => setJenisBahan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="Tempurung">Tempurung Kelapa Tua (Rp 2.800/kg)</option>
                    <option value="Sabut">Sabut Kelapa Kering (Rp 1.200/kg)</option>
                    <option value="Arang Tempurung">Arang Batok Mentah (Rp 6.500/kg)</option>
                  </select>
                  <p className="text-[11px] text-stone-400">
                    Dipilih: {jenisBahan} ({formatRupiah(hargaSatuan)}/kg)
                  </p>
                </div>

                {/* Field 2: Berat (kg) */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Perkiraan Berat (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={50}
                      step={10}
                      value={beratKg || ''}
                      onChange={(e) => setBeratKg(Number(e.target.value))}
                      placeholder="Contoh: 350"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                      kg
                    </span>
                  </div>

                  {/* Quick Pill increments */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[100, 300, 500, 1000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setBeratKg(inc)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                          beratKg === inc
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200/60 dark:border-stone-700 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        {inc} kg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field 3: Tanggal Jemput */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Jadwal Rencana Penjemputan
                  </label>
                  <input
                    type="date"
                    value={tanggalJemput}
                    onChange={(e) => setTanggalJemput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400">
                    Armada beroperasi Senin - Sabtu pkl 08:00 - 16:00 WIB
                  </p>
                </div>

                {/* Field 4: Alamat Jemput */}
                <div className="md:col-span-8 space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Alamat Lengkap / Patokan Lokasi Petani
                  </label>
                  <input
                    type="text"
                    value={alamatJemput}
                    onChange={(e) => setAlamatJemput(e.target.value)}
                    placeholder="Nama jalan, RT/RW, desa/kelurahan, patokan jalan"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Field 5: Catatan Akses Truk */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Catatan Akses Truk (Opsional)
                  </label>
                  <input
                    type="text"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Misal: Truk Colt Diesel bisa masuk pekarangan"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/80 dark:bg-stone-900/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Price Calculation Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-[#F97316]/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Estimasi Penerimaan Petani
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatRupiah(estimasiTotal)}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({formatAngka(beratKg || 0)} kg × {formatRupiah(hargaSatuan)}/kg)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    ✓ Ditransfer langsung ke rekening/tunai sesaat setelah penimbangan digital di tempat.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  glow
                  isLoading={isSubmitting}
                  icon={<Truck className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Memproses Jadwal...' : 'Ajukan Penjemputan Sekarang'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* ============================================================== */}
        {/* 4. TABEL RIWAYAT SETORAN (Filter Status, Search, Empty State)  */}
        {/* ============================================================== */}
        <div id="riwayat-setoran" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                Riwayat Setoran & Status Armada
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pantau verifikasi timbangan lab dan bukti pembayaran dari seluruh setoran Anda.
              </p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Tab Pills */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs">
                {(['Semua', 'Menunggu', 'Diverifikasi', 'Ditolak'] as const).map((tab) => {
                  const count =
                    tab === 'Semua'
                      ? mySetoranList.length
                      : mySetoranList.filter((s) => s.status === tab).length;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        statusFilter === tab
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{tab}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/70 dark:bg-stone-700/70 text-stone-600 dark:text-stone-300 font-mono">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search in table */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  placeholder="Cari ID/bahan..."
                  className="pl-8 pr-3 py-1 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Table Container in Glass Bento */}
          <div className="rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-stone-500 dark:text-stone-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-4">ID & Tanggal</th>
                    <th className="py-3.5 px-4">Jenis Bahan</th>
                    <th className="py-3.5 px-4">Berat Bersih</th>
                    <th className="py-3.5 px-4">Harga / kg</th>
                    <th className="py-3.5 px-4">Total Pendapatan</th>
                    <th className="py-3.5 px-4">Status & Verifikasi</th>
                    <th className="py-3.5 px-4">Catatan Logistik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                  {filteredSetoran.length > 0 ? (
                    filteredSetoran.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">
                            {item.id}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {item.tanggal}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {item.jenisBahan}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Kelapa Indragiri
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-stone-900 dark:text-stone-100">
                          {formatAngka(item.beratKg)} kg
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-600 dark:text-stone-400">
                          {formatRupiah(item.hargaPerKg)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(item.total || item.beratKg * item.hargaPerKg)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="py-3.5 px-4 max-w-xs text-[11px] text-stone-500 truncate">
                          {item.catatanAdmin || item.catatan || item.alamatJemput || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                              Tidak Ada Data Setoran
                            </h4>
                            <p className="text-xs text-stone-500 mt-1">
                              Tidak ditemukan setoran dengan filter "{statusFilter}" atau kata kunci "{searchTable}".
                            </p>
                          </div>
                          <div className="pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setStatusFilter('Semua');
                                setSearchTable('');
                              }}
                            >
                              Reset Filter
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
