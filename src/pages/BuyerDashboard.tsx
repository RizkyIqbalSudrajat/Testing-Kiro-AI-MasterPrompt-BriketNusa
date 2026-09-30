import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Truck,
  Coins,
  Sparkles,
  Flame,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  X,
  Search,
  MapPin,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  FileText,
  TrendingUp,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import {
  GlassCard,
  Card,
  Button,
  Input,
  Badge,
  useToast,
} from '../components/ui';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Produk, Pesanan } from '../types';
import { formatRupiah, formatAngka } from '../utils/formatters';

export const BuyerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { produkList, pesananList, createPesanan } = useData();
  const { toast } = useToast();

  // Navigation Items for Pembeli
  const navItems: NavItem[] = [
    { label: 'Ikhtisar & Katalog', href: '/pembeli', icon: ShoppingBag },
    { label: 'Katalog Briket Siap Pesan', href: '#katalog', icon: Flame },
    { label: 'Tracking Pesanan', href: '#tracking-pesanan', icon: Truck },
    { label: 'Pesanan Saya', href: '#pesanan-saya', icon: Package },
  ];

  // State for Ordering Modal
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState<number>(100);
  const [shippingAddress, setShippingAddress] = useState<string>(
    currentUser?.lokasi || 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan'
  );
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Table Filter & Search State
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Diproses' | 'Dikirim' | 'Selesai'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(null);

  // Filter buyer's orders (linked to currentUser or demo pembeli)
  const myOrders = useMemo(() => {
    if (!currentUser) return pesananList;
    return pesananList.filter(
      (p) =>
        p.pembeliId === currentUser.id ||
        p.pembeliId === 'user-pembeli-1' ||
        p.pembeliNama?.toLowerCase().includes('sinta') ||
        p.pembeliInstansi?.toLowerCase().includes('shisha')
    );
  }, [pesananList, currentUser]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalOrdersCount = myOrders.length;
    const inShipping = myOrders.filter((p) => p.status === 'Dikirim').length;
    const processing = myOrders.filter((p) => p.status === 'Diproses').length;
    const totalSpend = myOrders.reduce((sum, p) => sum + p.total, 0);

    // Reward points: 1 point per Rp 10.000 spent
    const points = Math.floor(totalSpend / 10000);

    return {
      totalOrdersCount: totalOrdersCount || 4,
      inShippingCount: inShipping + processing, // Active orders
      totalSpend: totalSpend || 16125000,
      rewardPoints: points || 1612,
    };
  }, [myOrders]);

  // Latest active order for visual tracking
  const latestOrderForTracking = useMemo(() => {
    if (selectedTrackOrderId) {
      const found = myOrders.find((p) => p.id === selectedTrackOrderId);
      if (found) return found;
    }
    return myOrders[0] || null;
  }, [myOrders, selectedTrackOrderId]);

  // Handle open modal
  const handleOpenOrderModal = (product: Produk) => {
    setSelectedProduct(product);
    setOrderQuantityKg(product.minOrderKg || 100);
    setOrderNotes('');
    setShippingAddress(currentUser?.lokasi || 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan');
  };

  // Stepper adjustments
  const handleIncrement = (amount: number) => {
    if (!selectedProduct) return;
    const newQty = orderQuantityKg + amount;
    if (newQty <= selectedProduct.stokKg) {
      setOrderQuantityKg(newQty);
    } else {
      setOrderQuantityKg(selectedProduct.stokKg);
    }
  };

  const handleDecrement = (amount: number) => {
    if (!selectedProduct) return;
    const min = selectedProduct.minOrderKg || 50;
    const newQty = orderQuantityKg - amount;
    if (newQty >= min) {
      setOrderQuantityKg(newQty);
    } else {
      setOrderQuantityKg(min);
    }
  };

  // Submit Order Handler
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (orderQuantityKg < selectedProduct.minOrderKg) {
      toast.error(
        `Minimal order untuk ${selectedProduct.nama} adalah ${selectedProduct.minOrderKg} kg.`,
        'Validasi Pemesanan'
      );
      return;
    }

    if (orderQuantityKg > selectedProduct.stokKg) {
      toast.error(
        `Jumlah melebihi stok yang tersedia (${formatAngka(selectedProduct.stokKg)} kg).`,
        'Stok Tidak Cukup'
      );
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Alamat pengiriman wajib diisi.', 'Validasi Pemesanan');
      return;
    }

    setIsSubmittingOrder(true);

    setTimeout(() => {
      const res = createPesanan({
        pembeliId: currentUser?.id || 'user-pembeli-1',
        pembeliNama: currentUser?.nama || 'Sinta',
        pembeliInstansi: currentUser?.instansi || 'CV Bara Shisha Nusantara',
        produkId: selectedProduct.id,
        jumlahKg: orderQuantityKg,
        alamat: shippingAddress,
        catatan: orderNotes,
      });

      setIsSubmittingOrder(false);

      if (res.success && res.pesanan) {
        toast.success(
          `Pesanan ${res.pesanan.id} berhasil dibuat dengan status Diproses! Stok produk otomatis dikurangi.`,
          'Pesanan Berhasil Dibuat'
        );
        setSelectedTrackOrderId(res.pesanan.id);
        setSelectedProduct(null);
      } else {
        toast.error(res.message || 'Gagal membuat pesanan.', 'Terjadi Kesalahan');
      }
    }, 600);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      const matchStatus = statusFilter === 'Semua' ? true : order.status === statusFilter;
      const matchSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.namaProduk && order.namaProduk.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.tanggal.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [myOrders, statusFilter, searchQuery]);

  return (
    <DashboardLayout
      title="Dashboard Pembeli & Klien Briket"
      subtitle="Katalog pemesanan briket batok kelapa standar ekspor, kalkulasi tonase instan, dan pelacakan pengiriman resmi."
      navItems={navItems}
      actions={
        <a href="#katalog">
          <Button variant="accent" size="sm" glow icon={<Flame className="w-4 h-4" />}>
            Katalog Briket
          </Button>
        </a>
      }
    >
      <div className="space-y-8">
        {/* ============================================================== */}
        {/* 1. 4 STATCARDS (Total Pesanan, Sedang Dikirim, Total Belanja, Poin) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Pesanan */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-[#F97316]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Pesanan
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {stats.totalOrdersCount}
              </span>
              <span className="text-xs font-bold text-stone-500">transaksi</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pelanggan Rutin Prioritas</span>
              </span>
              <span className="text-[10px] text-stone-400">Shisha & BBQ</span>
            </div>
          </div>

          {/* Card 2: Sedang Dikirim */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-blue-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Sedang Dikirim / Diproses
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                {stats.inShippingCount}
              </span>
              <span className="text-xs font-bold text-stone-500">pengiriman aktif</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Ekspedisi Truk Kontainer</span>
              </span>
              <span className="text-[10px] text-stone-400">Estimasi 1-2 hari</span>
            </div>
          </div>

          {/* Card 3: Total Belanja (Rp) */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Total Belanja Akumulasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {formatRupiah(stats.totalSpend)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Faktur Pajak Resmi Pabrik</span>
              </span>
              <span className="text-[10px] text-stone-400">Bebas PPN Ekspor</span>
            </div>
          </div>

          {/* Card 4: Poin Mitra */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Poin Loyalitas Hilirisasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono tabular-nums">
                {formatAngka(stats.rewardPoints)}
              </span>
              <span className="text-xs font-bold text-stone-500">pts</span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Diskon Rp {formatAngka(stats.rewardPoints * 100)} order depan
              </span>
              <span className="text-[10px] text-stone-400">Tier Emas</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. TRACKING VISUAL UNTUK PESANAN TERBARU (Stepper 3 Tahap)    */}
        {/* ============================================================== */}
        <div id="tracking-pesanan">
          <GlassCard glowBorder padding="lg" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800 gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Pelacakan Status Pengiriman</span>
                </div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                  Tracking Pesanan:{' '}
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {latestOrderForTracking?.id || 'BN-2026-001'}
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Produk: <strong>{latestOrderForTracking?.namaProduk || 'Briket Kubus Shisha 25mm'}</strong> (
                  {latestOrderForTracking?.jumlahKg || 300} kg) · Tujuan:{' '}
                  {latestOrderForTracking?.alamat || currentUser?.lokasi}
                </p>
              </div>

              {latestOrderForTracking && (
                <div className="flex items-center gap-2">
                  <StatusBadge status={latestOrderForTracking.status} />
                  {latestOrderForTracking.nomorResi && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700">
                      Resi: {latestOrderForTracking.nomorResi}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Visual Stepper 3 Steps: Diproses -> Dikirim -> Selesai */}
            {latestOrderForTracking && (
              <div className="py-2">
                {(() => {
                  const status = latestOrderForTracking.status;
                  const stepIndex =
                    status === 'Diproses' ? 1 : status === 'Dikirim' ? 2 : 3;

                  return (
                    <div className="relative">
                      {/* Stepper Progress Bar Line */}
                      <div className="hidden sm:block absolute top-1/2 left-16 right-16 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-[#F97316] to-emerald-600 transition-all duration-500"
                          style={{
                            width:
                              stepIndex === 1
                                ? '15%'
                                : stepIndex === 2
                                ? '65%'
                                : '100%',
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                        {/* Step 1: Diproses */}
                        <div
                          className={`p-4 rounded-2xl border transition-all ${
                            stepIndex >= 1
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                stepIndex >= 1
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {stepIndex > 1 ? <Check className="w-5 h-5" /> : '1'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                1. Pesanan Diproses
                              </h4>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                Packing master box inner vacuum
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Dikirim */}
                        <div
                          className={`p-4 rounded-2xl border transition-all ${
                            stepIndex >= 2
                              ? 'bg-blue-500/10 border-blue-500/30'
                              : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                stepIndex >= 2
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                              }`}
                            >
                              {stepIndex > 2 ? <Check className="w-5 h-5" /> : '2'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                2. Dalam Pengiriman
                              </h4>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                {latestOrderForTracking.nomorResi
                                  ? `Truk ekspedisi (${latestOrderForTracking.nomorResi})`
                                  : 'Armada kontainer Kendal Express'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Selesai */}
                        <div
                          className={`p-4 rounded-2xl border transition-all ${
                            stepIndex === 3
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                stepIndex === 3
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                              }`}
                            >
                              <Check className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                3. Selesai Diterima
                              </h4>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                Konfirmasi & faktur digital lunas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </GlassCard>
        </div>

        {/* ============================================================== */}
        {/* 3. KATALOG PRODUK GRID (Visual Gradient, Specs, Stok, Pesan)  */}
        {/* ============================================================== */}
        <div id="katalog" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Ready Stock Gudang Pabrik
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                Katalog Produk Briket Siap Pesan
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pilih varian briket sesuai kebutuhan operasional shisha lounge, resto grill BBQ, atau industri.
              </p>
            </div>

            <span className="text-xs font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-xl">
              SNI 01-6235 Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produkList.map((product) => (
              <GlassCard
                key={product.id}
                hoverLift
                glowBorder
                padding="md"
                className="h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Visual Gradient Card Header */}
                  <div
                    className={`w-full h-36 rounded-2xl bg-gradient-to-br ${product.gambar} p-3.5 flex flex-col justify-between border border-white/10 relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/95 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg">
                        {product.kategori}
                      </span>
                      <span className="text-[10px] text-white/80 font-mono">
                        {product.bentuk || 'Standar'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white leading-snug drop-shadow-xs">
                        {product.nama}
                      </h4>
                      <span className="text-[11px] text-white/80">
                        {product.kegunaan || 'Kualitas Ekspor'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed min-h-[40px]">
                    {product.deskripsi}
                  </p>

                  {/* Spesifikasi Grid */}
                  <div className="p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-stone-400">Kadar Abu:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        {product.kadarAbu}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-stone-400">Daya Bakar:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {product.waktuBakar}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-stone-400">Nilai Kalori:</span>
                      <span className="font-semibold font-mono text-stone-800 dark:text-stone-200">
                        {product.kalori || '7.500 kcal'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-500 dark:text-stone-400">Stok Siap:</span>
                      <span
                        className={`font-bold font-mono ${
                          product.stokKg > 500
                            ? 'text-stone-900 dark:text-stone-100'
                            : 'text-amber-600'
                        }`}
                      >
                        {formatAngka(product.stokKg)} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Harga Satuan</span>
                    <span className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                      {formatRupiah(product.hargaPerKg)}
                      <span className="text-[10px] text-stone-400 font-normal"> / kg</span>
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      Min {product.minOrderKg} kg
                    </span>
                  </div>

                  <Button
                    variant="accent"
                    size="sm"
                    glow
                    disabled={product.stokKg <= 0}
                    onClick={() => handleOpenOrderModal(product)}
                    icon={<ShoppingBag className="w-3.5 h-3.5" />}
                  >
                    {product.stokKg > 0 ? 'Pesan' : 'Habis'}
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. TABEL "PESANAN SAYA" (Filter Status, Resi, Detail)          */}
        {/* ============================================================== */}
        <div id="pesanan-saya" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                Daftar Pesanan Saya
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Riwayat pesanan briket lengkap dengan nomor resi dan invoice resmi.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs">
                {(['Semua', 'Diproses', 'Dikirim', 'Selesai'] as const).map((tab) => {
                  const count =
                    tab === 'Semua'
                      ? myOrders.length
                      : myOrders.filter((o) => o.status === tab).length;
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

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari no. pesanan..."
                  className="pl-8 pr-3 py-1 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    <th className="py-3.5 px-4">Produk Briket</th>
                    <th className="py-3.5 px-4">Jumlah (kg)</th>
                    <th className="py-3.5 px-4">Total Pembayaran</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tanggal Order</th>
                    <th className="py-3.5 px-4">No. Resi Ekspedisi</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors ${
                          selectedTrackOrderId === order.id
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                            : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                            {order.id}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {order.namaProduk || 'Briket Shisha'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {order.pembeliInstansi}
                          </span>
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

                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 font-mono">
                          {order.tanggal}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {order.nomorResi ? (
                            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                              {order.nomorResi}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px] italic">
                              Sedang dipersiapkan
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTrackOrderId(order.id);
                              // Scroll up to tracking section
                              document
                                .getElementById('tracking-pesanan')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            Lacak
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                              Tidak Ada Pesanan
                            </h4>
                            <p className="text-xs text-stone-500 mt-1">
                              Tidak ditemukan pesanan dengan filter "{statusFilter}".
                            </p>
                          </div>
                          <div className="pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setStatusFilter('Semua');
                                setSearchQuery('');
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

      {/* ============================================================== */}
      {/* 5. MODAL PESAN (Scale-In Animation, Stepper, Total Otomatis)  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog with Scale-In animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-full inline-block">
                  Formulir Pemesanan Resmi
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50">
                  {selectedProduct.nama}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedProduct.kategori} · Stok tersedia: {formatAngka(selectedProduct.stokKg)} kg
                </p>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                {/* Stepper Jumlah kg */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-stone-700 dark:text-stone-300">
                      Jumlah Pemesanan (kg)
                    </label>
                    <span className="text-stone-400 text-[11px]">
                      Minimal: {selectedProduct.minOrderKg} kg
                    </span>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecrement(50)}
                      disabled={orderQuantityKg <= (selectedProduct.minOrderKg || 50)}
                      className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-lg disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={selectedProduct.minOrderKg}
                        max={selectedProduct.stokKg}
                        step={10}
                        value={orderQuantityKg}
                        onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
                        className="w-full text-center py-2.5 px-3 text-lg font-bold font-mono bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleIncrement(50)}
                      disabled={orderQuantityKg >= selectedProduct.stokKg}
                      className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-lg disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick presets buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {[100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (preset <= selectedProduct.stokKg) {
                            setOrderQuantityKg(preset);
                          }
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono transition-all ${
                          orderQuantityKg === preset
                            ? 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40 font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        +{preset} kg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alamat Pengiriman */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Alamat Pengiriman (Outlet / Gudang)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Alamat lengkap tujuan pengiriman"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Catatan Tambahan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Contoh: Titipkan di security lounge shisha"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Ringkasan Total Otomatis */}
                <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Harga Satuan:</span>
                    <span className="font-mono font-semibold">
                      {formatRupiah(selectedProduct.hargaPerKg)} / kg
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Volume Order:</span>
                    <span className="font-mono font-semibold">
                      {formatAngka(orderQuantityKg)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Pengemasan & QC:</span>
                    <span className="text-emerald-600 font-semibold">Gratis Master Box</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Total Tagihan:
                    </span>
                    <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(orderQuantityKg * selectedProduct.hargaPerKg)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    glow
                    isLoading={isSubmittingOrder}
                    icon={<ShoppingBag className="w-4 h-4" />}
                  >
                    {isSubmittingOrder ? 'Memproses Order...' : 'Konfirmasi & Pesan Sekarang'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};
