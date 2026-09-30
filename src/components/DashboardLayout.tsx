import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Leaf,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Factory,
  Home,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { Button } from './ui/Button';
import { DashboardSkeleton } from './DashboardSkeleton';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  navItems,
  actions,
  searchPlaceholder = 'Cari transaksi, bahan, atau ID...',
  onSearchChange,
}) => {
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('Selamat datang');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Brief initial shimmer skeleton on mount/navigation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 320);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Dynamic time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      setGreeting('Selamat pagi');
    } else if (hour >= 11 && hour < 15) {
      setGreeting('Selamat siang');
    } else if (hour >= 15 && hour < 18) {
      setGreeting('Selamat sore');
    } else {
      setGreeting('Selamat malam');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const getRoleMetadata = () => {
    switch (currentUser?.role) {
      case 'supplier':
        return {
          title: 'Supplier Mandiri',
          roleBadge: 'Petani & Pengepul',
          badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
          accentColor: 'text-emerald-500',
          avatarBg: 'bg-emerald-600 text-white',
          homePath: '/supplier',
          icon: Truck,
        };
      case 'pembeli':
        return {
          title: 'Mitra Pembeli Briket',
          roleBadge: 'Shisha & BBQ Lounge',
          badgeBg: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
          accentColor: 'text-[#F97316]',
          avatarBg: 'bg-[#F97316] text-white',
          homePath: '/pembeli',
          icon: ShoppingBag,
        };
      case 'admin':
      default:
        return {
          title: 'Admin Operasional',
          roleBadge: 'Pabrik Kendal',
          badgeBg: 'bg-[#6B4423]/10 text-[#6B4423] dark:text-[#C59B76] border-[#6B4423]/20',
          accentColor: 'text-[#6B4423] dark:text-[#C59B76]',
          avatarBg: 'bg-[#6B4423] text-white',
          homePath: '/admin',
          icon: Factory,
        };
    }
  };

  const roleMeta = getRoleMetadata();

  // Simulated notifications
  const notifications = [
    {
      id: 1,
      title: 'Jadwal Penjemputan Armada',
      desc: 'Truk logistik bernomor lambung BN-04 dijadwalkan tiba pkl 09:30 WIB.',
      time: '10 menit lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Update Harga Bahan Baku',
      desc: 'Tempurung kelapa tua naik menjadi Rp 2.800/kg hari ini.',
      time: '2 jam lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Verifikasi Setoran Selesai',
      desc: 'Setoran SET-2026-001 diverifikasi tim mutu pabrik Kendal.',
      time: '1 hari lalu',
      unread: false,
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'BN';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFAF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col md:flex-row bg-noise">
      {/* ============================================================== */}
      {/* 1. SIDEBAR (Static/Fixed on Desktop, Drawer on Mobile)         */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-full bg-white/85 dark:bg-stone-950/85 backdrop-blur-xl border-r border-stone-200/80 dark:border-stone-800/80 flex flex-col transition-all duration-300 shrink-0 md:relative md:translate-x-0 ${
          mobileDrawerOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-stone-200/70 dark:border-stone-800/80 flex items-center justify-between">
          <Link
            to={roleMeta.homePath}
            className={`flex items-center gap-2.5 transition-all ${
              collapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-[#F97316] p-0.5 shadow-sm shrink-0">
              <div className="w-full h-full bg-white dark:bg-stone-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-4 h-4 text-[#F97316] fill-[#F97316]/20" />
                <Leaf className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500/40 absolute -bottom-0.5 -right-0.5" />
              </div>
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white leading-none block">
                  Briket<span className="text-[#F97316]">Nusa</span>
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                  {roleMeta.title}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="md:hidden p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info / Badge Role (Hidden when collapsed) */}
        {!collapsed && (
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl ${roleMeta.avatarBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
              >
                {getInitials(currentUser?.nama)}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">
                  {currentUser?.nama || 'Pengguna'}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  {currentUser?.lokasi || 'Indonesia'}
                </p>
                <div className="mt-1">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeBg}`}
                  >
                    {roleMeta.roleBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== '#' && location.hash === item.href);

            return (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-900/80 hover:text-stone-900 dark:hover:text-stone-100'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-white dark:text-stone-900'
                      : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}

          {/* Quick link back to public landing page */}
          <div className="pt-3 mt-3 border-t border-stone-200/60 dark:border-stone-800/80">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-900/60 rounded-xl transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? 'Lihat Landing Page' : undefined}
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Lihat Landing Page</span>}
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer: Collapse Toggle & Logout */}
        <div className="p-3 border-t border-stone-200/70 dark:border-stone-800/80 space-y-2">
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-full py-1.5 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-medium">Sembunyikan Sidebar</span>
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all ${
              collapsed ? 'px-0' : ''
            }`}
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA & TOPBAR                                  */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Topbar: SaaS Ala Linear / Vercel */}
        <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-stone-950/70 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
          {/* Left: Mobile Menu Trigger + Dynamic Greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white md:hidden rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {greeting},{' '}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {currentUser?.nama?.split(' ')[0] || 'Mitra'}
                </span>
                ! 👋
              </h2>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block truncate">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-14 py-1.5 text-xs bg-stone-100/80 dark:bg-stone-900/80 rounded-xl border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right: Actions, Notifications, ThemeToggle, Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Action buttons passed from pages */}
            {actions}

            {/* Notification Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                aria-label="Lihat Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316] ring-2 ring-white dark:ring-stone-950 animate-pulse" />
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800 shadow-xl p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/70 dark:border-stone-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Notifikasi Logistik & Mutu
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                          2 Baru
                        </span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            n.unread
                              ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20'
                              : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100 leading-tight">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-stone-400 shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle showLabel={false} />

            {/* User Avatar with Status Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                aria-label="Menu Pengguna"
              >
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full ${roleMeta.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs`}
                  >
                    {getInitials(currentUser?.nama)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-950" />
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800 shadow-xl p-3 z-50 space-y-2">
                    <div className="px-2 py-1.5 border-b border-stone-200/60 dark:border-stone-800">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                        {currentUser?.nama}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {currentUser?.email}
                      </p>
                      <div className="mt-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeBg}`}
                        >
                          {roleMeta.title}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <Link
                        to="/"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>Halaman Utama (Landing Page)</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun Demo</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Header Breadcrumbs / Title Strip */}
        <div className="border-b border-stone-200/60 dark:border-stone-800/80 bg-stone-100/30 dark:bg-stone-950/30 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <Link to="/" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
                  BriketNusa
                </Link>
                <span>/</span>
                <span className="text-stone-800 dark:text-stone-200 capitalize">
                  Portal {currentUser?.role}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sentra: {currentUser?.lokasi || 'Kendal, Jawa Tengah'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Container (Bento Grid Area) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {isLoading ? <DashboardSkeleton /> : children}
        </main>
      </div>
    </div>
  );
};
