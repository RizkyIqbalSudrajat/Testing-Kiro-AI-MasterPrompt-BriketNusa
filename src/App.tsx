/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DemoSwitcher } from './components/DemoSwitcher';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                {/* 1. Landing Page Publik */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Halaman Autentikasi Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* 3. Dashboard Supplier (Diproteksi: Role Supplier) */}
                <Route
                  path="/supplier"
                  element={
                    <ProtectedRoute allowedRole="supplier">
                      <SupplierDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Dashboard Pembeli (Diproteksi: Role Pembeli) */}
                <Route
                  path="/pembeli"
                  element={
                    <ProtectedRoute allowedRole="pembeli">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Dashboard Admin (Diproteksi: Role Admin) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Halaman 404 Tidak Ditemukan */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              {/* Floating Demo Navigator & Reset Data Demo Button */}
              <DemoSwitcher />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
