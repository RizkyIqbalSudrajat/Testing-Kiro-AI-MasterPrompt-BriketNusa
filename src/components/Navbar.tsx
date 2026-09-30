import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, LogOut, Menu, X, ArrowRight, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'supplier') return '/supplier';
    if (currentUser.role === 'pembeli') return '/pembeli';
    return '/admin';
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'supplier') return 'Supplier';
    if (currentUser.role === 'pembeli') return 'Pembeli';
    return 'Admin';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Single text wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#3B2317] hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-[#5C3D2E] text-[#E67E22] flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <span className="font-display tracking-tight text-[#2C1810]">
              Briket<span className="text-[#E67E22]">Nusa</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C4A3E]">
            <a href="#masalah" className="hover:text-[#2C1810] transition-colors">
              Masalah
            </a>
            <a href="#solusi" className="hover:text-[#2C1810] transition-colors">
              Solusi Hilirisasi
            </a>
            <a href="#produk" className="hover:text-[#2C1810] transition-colors">
              Katalog Produk
            </a>
            <a href="#mitra" className="hover:text-[#2C1810] transition-colors">
              Kemitraan
            </a>
            <a href="#kontak" className="hover:text-[#2C1810] transition-colors">
              Kontak Pabrik
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5C3D2E] hover:bg-[#432A1F] rounded-lg transition-colors shadow-xs whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Dashboard {getRoleLabel()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-2 text-[#7C685B] hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#5C3D2E] hover:bg-[#432A1F] rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <span>Masuk Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && currentUser && (
              <Link
                to={getDashboardLink()}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#5C3D2E] rounded-md"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3B2317] hover:bg-stone-100 rounded-md"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#masalah"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3B32] hover:text-[#2C1810]"
          >
            Masalah
          </a>
          <a
            href="#solusi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3B32] hover:text-[#2C1810]"
          >
            Solusi Hilirisasi
          </a>
          <a
            href="#produk"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3B32] hover:text-[#2C1810]"
          >
            Katalog Produk
          </a>
          <a
            href="#mitra"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3B32] hover:text-[#2C1810]"
          >
            Kemitraan
          </a>
          <a
            href="#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3B32] hover:text-[#2C1810]"
          >
            Kontak Pabrik
          </a>

          <div className="pt-3 border-t border-stone-200">
            {isAuthenticated && currentUser ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#5C3D2E] rounded-lg"
                >
                  Buka Dashboard ({getRoleLabel()})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#5C3D2E] rounded-lg"
              >
                <span>Masuk Akun Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
