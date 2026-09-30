import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Factory,
  Users,
  ShoppingBag,
  Package,
  Wallet,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Truck,
  Flame,
  Scale,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
  X,
  Layers,
  ChevronRight,
  Send,
  Boxes,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import {
  GlassCard,
  Card,
  Button,
  Badge,
  useToast,
} from '../components/ui';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Setoran, Pesanan, StatusSetoran, StatusPesanan } from '../types';
import { formatRupiah, formatAngka } from '../utils/formatters';

const PIE_COLORS = ['#10B981', '#F97316', '#6B4423'];

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    setoranList,
    pesananList,
    produkList,
    tahapProduksiList,
    usersList,
    updateSetoranStatus,
    updatePesananStatus,
    resetAllDemoData,
  } = useData();
  const { toast } = useToast();

  // Navigation Items for Admin
  const navItems: NavItem[] = [
    { label: 'Ikhtisar Pabrik', href: '/admin', icon: Factory },
    { label: 'Verifikasi Setoran', href: '#verifikasi-setoran', icon: Scale },
    { label: 'Status Produksi', href: '#status-produksi', icon: Layers },
    { label: 'Kelola Pesanan', href: '#kelola-pesanan', icon: ShoppingBag },
    { label: 'Grafik & Analitik', href: '#grafik-analitik', icon: TrendingUp },
  ];

  // Search and Filters
  const [searchPesanan, setSearchPesanan] = useState('');
  const [filterPesananStatus, setFilterPesananStatus] = useState<string>('Semua');

  // Modal Verification States for Setoran
  const [verifyingSetoran, setVerifyingSetoran] = useState<Setoran | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Modal Resi / Status Change for Pesanan
  const [editingPesanan, setEditingPesanan] = useState<Pesanan | null>(null);
  const [targetPesananStatus, setTargetPesananStatus] = useState<StatusPesanan>('Dikirim');
  const [customNomorResi, setCustomNomorResi] = useState<string>('');

  // Modal Reset Demo
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Calculated Summary Statistics
  const summaryStats = useMemo(() => {
    const totalSuppliers = usersList.filter((u) => u.role === 'supplier').length || 120;
    const totalBuyers = usersList.filter((u) => u.role === 'pembeli').length || 30;
    const totalBriquetteStock = produkList.reduce((acc, p) => acc + p.stokKg, 0);
    const totalSalesMonth = pesananList.reduce((acc, p) => acc + p.total, 0);

    return {
      supplierCount: totalSuppliers,
      buyerCount: totalBuyers,
      totalStockKg: totalBriquetteStock,
      totalSalesRp: totalSalesMonth,
      waitingSetoranCount: setoranList.filter((s) => s.status === 'Menunggu').length,
    };
  }, [usersList, produkList, pesananList, setoranList]);

  // Data for Sales Bar Chart (per product)
  const barChartSalesData = useMemo(() => {
    return produkList.map((prod) => {
      // Find orders for this product
      const totalVolume = pesananList
        .filter((o) => o.produkId === prod.id)
        .reduce((sum, o) => sum + o.jumlahKg, 0);
      const totalOmset = pesananList
        .filter((o) => o.produkId === prod.id)
        .reduce((sum, o) => sum + o.total, 0);

      return {
        nama: prod.nama.replace('Briket ', ''),
        volume: totalVolume || prod.minOrderKg * 3,
        omset: (totalOmset || prod.hargaPerKg * prod.minOrderKg * 3) / 1000000, // In Millions
      };
    });
  }, [produkList, pesananList]);

  // Data for Donut Chart (Raw Material Input Breakdown)
  const donutMaterialData = useMemo(() => {
    let tempurungKg = 0;
    let sabutKg = 0;
    let arangKg = 0;

    setoranList.forEach((s) => {
      const type = s.jenisBahan.toLowerCase();
      if (type.includes('arang')) arangKg += s.beratKg;
      else if (type.includes('sabut')) sabutKg += s.beratKg;
      else tempurungKg += s.beratKg;
    });

    return [
      { name: 'Tempurung Batok', value: tempurungKg || 3800 },
      { name: 'Sabut Kering', value: sabutKg || 1200 },
      { name: 'Arang Kiln Mentah', value: arangKg || 850 },
    ];
  }, [setoranList]);

  // Filtered waiting setoran list
  const waitingSetoranList = useMemo(() => {
    return setoranList.filter((s) => s.status === 'Menunggu');
  }, [setoranList]);

  // Filtered orders list
  const filteredPesananList = useMemo(() => {
    return pesananList.filter((order) => {
      const matchStatus =
        filterPesananStatus === 'Semua' ? true : order.status === filterPesananStatus;
      const matchSearch =
        order.id.toLowerCase().includes(searchPesanan.toLowerCase()) ||
        (order.pembeliNama && order.pembeliNama.toLowerCase().includes(searchPesanan.toLowerCase())) ||
        (order.namaProduk && order.namaProduk.toLowerCase().includes(searchPesanan.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [pesananList, filterPesananStatus, searchPesanan]);

  // Handle Setoran Verification Actions
  const handleOpenVerifyModal = (setoran: Setoran, type: 'approve' | 'reject') => {
    setVerifyingSetoran(setoran);
    setActionType(type);
    setAdminNotes(
      type === 'approve'
        ? 'Lolos uji lab mutu: Kadar air 10.8%, tanpa kontaminan tanah. Timbangan digital sesuai.'
        : 'Kadar air melebihi batas maksimal pabrik (> 20%). Batok basah belum cukup dijemur.'
    );
  };

  const handleConfirmVerification = () => {
    if (!verifyingSetoran) return;

    const newStatus: StatusSetoran = actionType === 'approve' ? 'Diverifikasi' : 'Ditolak';
    updateSetoranStatus(verifyingSetoran.id, newStatus, adminNotes);

    if (actionType === 'approve') {
      toast.success(
        `Setoran ${verifyingSetoran.id} berhasil DIVERIFIKASI! Data seketika tersinkronisasi di dashboard Supplier.`,
        'Verifikasi Disetujui'
      );
    } else {
      toast.error(
        `Setoran ${verifyingSetoran.id} DITOLAK. Alasan penolakan telah dikirim ke Supplier.`,
        'Verifikasi Ditolak'
      );
    }

    setVerifyingSetoran(null);
  };

  // Handle Order Status Update
  const handleOpenStatusModal = (order: Pesanan, newStatus: StatusPesanan) => {
    setEditingPesanan(order);
    setTargetPesananStatus(newStatus);
    setCustomNomorResi(order.nomorResi || `EXP-KDL-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleConfirmOrderStatus = () => {
    if (!editingPesanan) return;

    updatePesananStatus(
      editingPesanan.id,
      targetPesananStatus,
      targetPesananStatus === 'Dikirim' ? customNomorResi : editingPesanan.nomorResi
    );

    toast.success(
      `Status pesanan ${editingPesanan.id} diubah menjadi "${targetPesananStatus}". Terlihat seketika di dashboard Pembeli.`,
      'Status Pesanan Diperbarui'
    );

    setEditingPesanan(null);
  };

  // Handle Reset Demo Data
  const handleConfirmReset = () => {
    resetAllDemoData();
    setShowResetModal(false);
    toast.info('Seluruh data setoran, pesanan, dan stok berhasil di-reset ke kondisi awal.', 'Reset Demo Sukses');
  };

  return (
    <DashboardLayout
      title="Pusat Kendali Operasional Pabrik"
      subtitle="Verifikasi setoran bahan baku petani, pengawasan 4 lini pirolisis, manajemen stok briket, dan status pengiriman pembeli."
      navItems={navItems}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetModal(true)}
            icon={<RotateCcw className="w-3.5 h-3.5 text-stone-500" />}
          >
            Reset Data Demo
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* ============================================================== */}
        {/* 1. 4 STATCARDS (Supplier, Pembeli, Stok Briket, Penjualan)     */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Jumlah Supplier */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Supplier Petani Aktif
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                120
              </span>
              <span className="text-xs font-bold text-stone-500">kelompok tani</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12 supplier baru bln ini</span>
              </span>
              <span className="text-[10px] text-stone-400">5 Provinsi</span>
            </div>
          </div>

          {/* Card 2: Jumlah Pembeli */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-[#F97316]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Mitra Pembeli & Klien
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                30
              </span>
              <span className="text-xs font-bold text-stone-500">entitas bisnis</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Shisha, BBQ & Ekspor</span>
              </span>
              <span className="text-[10px] text-stone-400">Kontrak Rutin</span>
            </div>
          </div>

          {/* Card 3: Stok Briket (kg) */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-[#6B4423]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Stok Siap Gudang
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#6B4423]/10 text-[#6B4423] dark:text-[#C59B76] flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {formatAngka(summaryStats.totalStockKg)}
              </span>
              <span className="text-xs font-bold text-stone-500">kg</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Kapasitas Lini Aman (92%)
              </span>
              <span className="text-[10px] text-stone-400">Gudang Kendal</span>
            </div>
          </div>

          {/* Card 4: Penjualan Bulan Ini (Rp) */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-blue-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Penjualan Bulan Ini
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {formatRupiah(summaryStats.totalSalesRp)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Hilirisasi Nilai Tambah</span>
              </span>
              <span className="text-[10px] text-stone-400">Target 94%</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. GRAFIK RECHARTS: BAR CHART PENJUALAN + DONUT KOMPOSISI     */}
        {/* ============================================================== */}
        <div id="grafik-analitik" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Bar Chart: Penjualan per Produk (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Volume & Omset Produk Jadi
                </span>
                <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                  Penjualan per Varian Briket (Juta Rp)
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Bulan Berjalan</span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartSalesData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(150, 150, 150, 0.15)"
                  />
                  <XAxis
                    dataKey="nama"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#78716c' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#78716c' }}
                    tickFormatter={(val) => `Rp ${val}jt`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-xl text-xs space-y-1">
                            <p className="font-bold text-stone-900 dark:text-stone-100">{label}</p>
                            <p className="text-emerald-600 font-semibold font-mono">
                              Total Omset: Rp {d.omset.toFixed(1)} Juta
                            </p>
                            <p className="text-stone-500">Volume Terjual: {formatAngka(d.volume)} kg</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="omset" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Komposisi Bahan Masuk (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] block">
                  Pasokan Bahan Mentah
                </span>
                <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                  Komposisi Bahan Baku Masuk
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Total Masuk</span>
            </div>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutMaterialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutMaterialData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        return (
                          <div className="p-2.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-xl text-xs space-y-0.5">
                            <span className="font-bold text-stone-900 dark:text-stone-100 block">
                              {d.name}
                            </span>
                            <span className="font-mono text-emerald-600 font-semibold">
                              {formatAngka(Number(d.value))} kg
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-center">
              {donutMaterialData.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono block">
                    {formatAngka(item.value)} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. STATUS PRODUKSI: 4 TAHAP DENGAN PROGRESS BAR BERANIMASI    */}
        {/* ============================================================== */}
        <div id="status-produksi" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Lini Pirolisis Terintegrasi
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                Pengawasan 4 Tahap Produksi Pabrik Kendal
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-xl">
              Target: 6.000 kg / hari
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tahapProduksiList.map((tahap, idx) => (
              <GlassCard key={tahap.id} glowBorder padding="md" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 font-mono font-bold text-xs flex items-center justify-center text-stone-700 dark:text-stone-300">
                    0{idx + 1}
                  </span>
                  <Badge
                    status={
                      tahap.status === 'Optimal'
                        ? 'Diverifikasi'
                        : tahap.status === 'Berjalan'
                        ? 'Menunggu'
                        : 'error'
                    }
                    size="sm"
                  >
                    {tahap.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {tahap.nama}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                    {tahap.deskripsi}
                  </p>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 text-[11px]">Kapasitas Lini</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                      {tahap.persentase}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tahap.persentase}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-emerald-500'
                          : idx === 1
                          ? 'bg-[#F97316]'
                          : idx === 2
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-400 pt-0.5 font-mono">
                    <span>{formatAngka(tahap.kapasitasKg)} kg</span>
                    <span>Target: {formatAngka(tahap.targetKg)} kg</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. VERIFIKASI SETORAN (Status "Menunggu" + Tombol Setujui/Tolak)*/}
        {/* ============================================================== */}
        <div id="verifikasi-setoran" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Antrean Penerimaan Bahan Masuk
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                Verifikasi Mutu & Timbangan Setoran Supplier
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Setujui atau tolak setoran dari petani. Aksi Anda langsung mengubah status di dashboard Supplier.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              {waitingSetoranList.length} Menunggu Tindakan
            </span>
          </div>

          <div className="rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-stone-500 dark:text-stone-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-4">ID Setoran</th>
                    <th className="py-3.5 px-4">Supplier Petani</th>
                    <th className="py-3.5 px-4">Jenis Bahan</th>
                    <th className="py-3.5 px-4">Berat Bersih</th>
                    <th className="py-3.5 px-4">Total Biaya Beli</th>
                    <th className="py-3.5 px-4">Lokasi Jemput</th>
                    <th className="py-3.5 px-4 text-center">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                  {waitingSetoranList.length > 0 ? (
                    waitingSetoranList.map((setoran) => (
                      <tr
                        key={setoran.id}
                        className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">
                            {setoran.id}
                          </span>
                          <span className="text-[11px] text-stone-500">{setoran.tanggal}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {setoran.supplierNama || 'Pak Slamet'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {setoran.supplierLokasi || 'Indragiri Hilir'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {setoran.jenisBahan}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {formatRupiah(setoran.hargaPerKg)} / kg
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-stone-900 dark:text-stone-100">
                          {formatAngka(setoran.beratKg)} kg
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(setoran.total || setoran.beratKg * setoran.hargaPerKg)}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs text-[11px] text-stone-500 truncate">
                          {setoran.alamatJemput || setoran.supplierLokasi || '-'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleOpenVerifyModal(setoran, 'approve')}
                              icon={<Check className="w-3.5 h-3.5" />}
                            >
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200"
                              onClick={() => handleOpenVerifyModal(setoran, 'reject')}
                              icon={<X className="w-3.5 h-3.5" />}
                            >
                              Tolak
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-10 px-4 text-center">
                        <div className="max-w-xs mx-auto space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                            Semua Setoran Telah Terverifikasi
                          </h4>
                          <p className="text-xs text-stone-500">
                            Tidak ada setoran yang menunggu verifikasi saat ini.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. KELOLA PESANAN TERBARU + FEED AKTIVITAS TIMELINE           */}
        {/* ============================================================== */}
        <div id="kelola-pesanan" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sisi Kiri: Tabel Pesanan & Dropdown Ubah Status (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                  Manajemen Pesanan Masuk
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ubah status pemrosesan & pengiriman kontainer langsung ke dashboard Pembeli.
                </p>
              </div>

              {/* Status Filter & Search */}
              <div className="flex items-center gap-2">
                <select
                  value={filterPesananStatus}
                  onChange={(e) => setFilterPesananStatus(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchPesanan}
                    onChange={(e) => setSearchPesanan(e.target.value)}
                    placeholder="Cari order..."
                    className="pl-7 pr-3 py-1 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-stone-500 dark:text-stone-400 uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-3.5 px-4">No. Pesanan</th>
                      <th className="py-3.5 px-4">Klien Pembeli</th>
                      <th className="py-3.5 px-4">Produk</th>
                      <th className="py-3.5 px-4">Volume</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status Saat Ini</th>
                      <th className="py-3.5 px-4 text-center">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                    {filteredPesananList.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-stone-900 dark:text-stone-100">
                          {order.id}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {order.pembeliNama || 'Sinta'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {order.pembeliInstansi}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-stone-800 dark:text-stone-200">
                          {order.namaProduk}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-stone-900 dark:text-stone-100">
                          {formatAngka(order.jumlahKg)} kg
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(order.total)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleOpenStatusModal(order, e.target.value as StatusPesanan)
                            }
                            className="px-2 py-1 text-xs bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 font-semibold cursor-pointer"
                          >
                            <option value="Diproses">Diproses</option>
                            <option value="Dikirim">Dikirim</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Feed Aktivitas Terbaru (Timeline Kecil, 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                  Feed Aktivitas Operasional
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Realtime
                </span>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 text-xs">
                <div className="flex gap-3 relative pb-3 border-b border-stone-100 dark:border-stone-800">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">
                      Setoran <strong>SET-2026-008</strong> baru diajukan oleh <strong>Pak Darmo</strong> (300 kg tempurung).
                    </p>
                    <span className="text-[10px] text-stone-400">10 menit lalu</span>
                  </div>
                </div>

                <div className="flex gap-3 relative pb-3 border-b border-stone-100 dark:border-stone-800">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">
                      Pesanan <strong>BN-2026-004</strong> dikirim via Truk Kontainer Kendal Express (Resi JNE-TRK-7729103).
                    </p>
                    <span className="text-[10px] text-stone-400">1 jam lalu</span>
                  </div>
                </div>

                <div className="flex gap-3 relative pb-3 border-b border-stone-100 dark:border-stone-800">
                  <span className="w-8 h-8 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">
                      Mesin retort kiln #2 mencapai kapasitas optimal 1.500 kg/hari dengan emisi bersih.
                    </p>
                    <span className="text-[10px] text-stone-400">3 jam lalu</span>
                  </div>
                </div>

                <div className="flex gap-3 relative">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">
                      Invoice resmi <strong>BN-2026-002</strong> lunas oleh <strong>CV Bara Shisha Nusantara</strong>.
                    </p>
                    <span className="text-[10px] text-stone-400">5 jam lalu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. MODAL VERIFIKASI SETORAN (Setujui / Tolak + Catatan)       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {verifyingSetoran && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVerifyingSetoran(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      actionType === 'approve'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {actionType === 'approve' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                      {actionType === 'approve' ? 'Setujui Setoran Bahan' : 'Tolak Setoran Bahan'}
                    </h4>
                    <span className="text-xs text-stone-500 font-mono">{verifyingSetoran.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setVerifyingSetoran(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Setoran Summary Details */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Supplier:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {verifyingSetoran.supplierNama}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Jenis Bahan:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {verifyingSetoran.jenisBahan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Berat Bersih:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {formatAngka(verifyingSetoran.beratKg)} kg
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200/60 dark:border-stone-700">
                  <span className="text-stone-500">Total Pembayaran:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(verifyingSetoran.total || verifyingSetoran.beratKg * verifyingSetoran.hargaPerKg)}
                  </span>
                </div>
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Catatan Evaluasi Mutu Lab Pabrik
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVerifyingSetoran(null)}
                >
                  Batal
                </Button>
                <Button
                  variant={actionType === 'approve' ? 'primary' : 'outline'}
                  size="sm"
                  className={actionType === 'reject' ? 'bg-rose-600 text-white hover:bg-rose-700' : ''}
                  onClick={handleConfirmVerification}
                >
                  {actionType === 'approve' ? 'Konfirmasi Setujui' : 'Konfirmasi Tolak'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 7. MODAL UBAH STATUS PESANAN (Diproses -> Dikirim -> Selesai) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {editingPesanan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPesanan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800">
                <div>
                  <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                    Ubah Status Pesanan
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">{editingPesanan.id}</span>
                </div>
                <button
                  onClick={() => setEditingPesanan(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Klien:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {editingPesanan.pembeliNama} ({editingPesanan.pembeliInstansi})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Produk:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {editingPesanan.namaProduk} ({formatAngka(editingPesanan.jumlahKg)} kg)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Baru:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {targetPesananStatus}
                  </span>
                </div>
              </div>

              {/* Resi field if Dikirim */}
              {targetPesananStatus === 'Dikirim' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Nomor Resi / Ekspedisi Truk
                  </label>
                  <input
                    type="text"
                    value={customNomorResi}
                    onChange={(e) => setCustomNomorResi(e.target.value)}
                    placeholder="Contoh: JNE-TRK-7729103"
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400">
                    Nomor resi ini akan langsung dapat dilacak oleh pembeli di dashboard mereka.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPesanan(null)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmOrderStatus}
                >
                  Simpan Status
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 8. MODAL RESET DATA DEMO                                      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 z-10 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                  Reset Semua Data Demo?
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  Tindakan ini akan mengembalikan data setoran, pesanan, kapasitas produksi, dan stok briket ke kondisi awal pabrik.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResetModal(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleConfirmReset}
                >
                  Ya, Reset Data
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};
