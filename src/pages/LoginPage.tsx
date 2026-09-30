import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Leaf,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Factory,
  Sparkles,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  GlassCard,
  Input,
  Badge,
  ThemeToggle,
  useToast,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password wajib diisi');
      hasError = true;
    }

    if (hasError) {
      triggerShake();
      return;
    }

    setLoading(true);

    // Simulated 600ms authentication processing
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (!res.success) {
        toast.error('Email atau password salah', 'Gagal Masuk');
        triggerShake();
        return;
      }

      // Success feedback
      const userName = res.user?.nama || 'Mitra';
      toast.success(`Selamat datang, ${userName}!`, 'Login Berhasil');

      // Redirect based on role
      if (res.role === 'supplier') {
        navigate('/supplier');
      } else if (res.role === 'pembeli') {
        navigate('/pembeli');
      } else {
        navigate('/admin');
      }
    }, 600);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleUseDemoAccount = (demoEmail: string, demoPass: string, roleTitle: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setEmailError('');
    setPasswordError('');
    toast.info(`Akun demo ${roleTitle} telah dimuat. Klik tombol 'Masuk'.`, 'Akun Demo');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col justify-between relative overflow-hidden bg-noise">
      {/* Background Decorative Blur Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/15 via-green-400/10 to-[#F97316]/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-gradient-to-br from-[#F97316]/15 via-orange-400/10 to-[#6B4423]/10 blur-[130px] rounded-full" />

      {/* Main Split-Screen Container */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-screen">
        {/* LEFT COLUMN: Visual Branding & Story (Desktop only, hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 relative p-10 xl:p-14 flex-col justify-between border-r border-stone-200/70 dark:border-stone-800/80 bg-stone-100/50 dark:bg-stone-950/60 backdrop-blur-md overflow-hidden">
          {/* Subtle gradient backdrop highlight */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-[#F97316]/5" />

          {/* Top Left: Logo & Back Link */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Kembali ke beranda</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-[#F97316] p-0.5 shadow-md">
                <div className="w-full h-full bg-white dark:bg-stone-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <Flame className="w-5 h-5 text-[#F97316] fill-[#F97316]/20 shrink-0" />
                  <Leaf className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/40 absolute -bottom-0.5 -right-0.5" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-white block leading-none">
                  Briket<span className="text-[#F97316]">Nusa</span>
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Platform Hilirisasi Kelapa Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Middle Left: Hero Tagline & Visual Illustration Card */}
          <div className="relative z-10 space-y-6 my-auto py-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Portal Terintegrasi Multi-Role</span>
              </span>

              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
                Masuk ke ekosistem BriketNusa.
              </h2>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Menghubungkan rantai pasok kelapa dari pekarangan petani lokal langsung ke lini pirolisis ramah lingkungan dan pembeli pasar global.
              </p>
            </div>

            {/* Testimonial Quote Card */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-[#F97316]">
                <Quote className="w-4 h-4 fill-current rotate-180" />
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "Dari tempurung lokal di pekarangan, kini kami punya kepastian harga dan timbangan digital transparan. Nilai tambah kelapa benar-benar dirasakan petani."
              </p>
              <div className="flex items-center gap-2.5 pt-1 border-t border-stone-200/60 dark:border-stone-800 text-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  PD
                </div>
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-200 block leading-tight">
                    Pak Darmo
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Ketua Kelompok Tani Kelapa Indragiri
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Pillars checklist */}
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Harga beli bahan baku terstandar tanpa calo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>Briket bersertifikasi kalori &gt; 7.500 kcal & abu &lt; 2.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Pelacakan pesanan dan faktur digital instan</span>
              </div>
            </div>
          </div>

          {/* Bottom Left: Trust footnote */}
          <div className="relative z-10 pt-4 border-t border-stone-200/60 dark:border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
            <span>© 2026 BriketNusa Platform</span>
            <span>Standar SNI 01-6235</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Form in GlassCard (Visible on both mobile & desktop) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-4 sm:p-6 lg:p-12 relative z-10">
          {/* Top Bar on Right Side */}
          <div className="flex items-center justify-between pb-6 sm:pb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Kembali ke beranda</span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle showLabel={false} />
            </div>
          </div>

          {/* Center Form Section */}
          <div className="w-full max-w-lg mx-auto my-auto py-4">
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard glowBorder padding="xl" className="space-y-6">
                {/* Form Header */}
                <div className="space-y-1.5 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Autentikasi Akses Aman</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                    Masuk ke Akun
                  </h1>

                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    Silakan masukkan email dan password, atau pilih salah satu akun demo di bawah.
                  </p>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Email Field with validation */}
                  <Input
                    label="Alamat Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="nama@briketnusa.id"
                    icon={<Mail className="w-4 h-4" />}
                    error={emailError}
                    autoComplete="email"
                  />

                  {/* Password Field with visibility toggle & validation */}
                  <Input
                    label="Kata Sandi (Password)"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    error={passwordError}
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Submit Button with 600ms loading */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="lg"
                      glow
                      isLoading={loading}
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      {loading ? 'Memverifikasi...' : 'Masuk'}
                    </Button>
                  </div>
                </form>

                {/* Akun Demo Card (3 roles with auto-fill buttons) */}
                <div className="pt-5 border-t border-stone-200/80 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                        Akun Demo Cepat
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Klik tombol "Pakai" untuk mengisi otomatis form
                      </span>
                    </div>
                    <Badge status="info" size="sm">Prototype</Badge>
                  </div>

                  <div className="space-y-2.5">
                    {/* Role 1: Supplier */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 hover:border-emerald-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              Supplier
                            </span>
                            <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                              · Pak Darmo
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono block">
                            supplier@briketnusa.id · supplier123
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUseDemoAccount('supplier@briketnusa.id', 'supplier123', 'Supplier (Pak Darmo)')
                        }
                      >
                        Pakai
                      </Button>
                    </div>

                    {/* Role 2: Pembeli */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 hover:border-[#F97316]/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#F97316]">
                              Pembeli
                            </span>
                            <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                              · Sinta
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono block">
                            pembeli@briketnusa.id · pembeli123
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUseDemoAccount('pembeli@briketnusa.id', 'pembeli123', 'Pembeli (Sinta)')
                        }
                      >
                        Pakai
                      </Button>
                    </div>

                    {/* Role 3: Admin */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 hover:border-[#6B4423]/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#6B4423]/10 text-[#6B4423] dark:text-[#A87950] flex items-center justify-center shrink-0">
                          <Factory className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#6B4423] dark:text-[#A87950]">
                              Admin
                            </span>
                            <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                              · Admin BriketNusa
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono block">
                            admin@briketnusa.id · admin123
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUseDemoAccount('admin@briketnusa.id', 'admin123', 'Admin Pabrik Kendal')
                        }
                      >
                        Pakai
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Simple Bottom Credit */}
          <div className="pt-6 text-center text-xs text-stone-400 dark:text-stone-500">
            © 2026 BriketNusa Indonesia · Hilirisasi Nilai Tambah Tempurung Kelapa
          </div>
        </div>
      </div>
    </div>
  );
};
