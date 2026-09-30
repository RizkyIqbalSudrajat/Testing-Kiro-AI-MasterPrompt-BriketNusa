import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Setoran, Pesanan, Produk, TahapProduksi, StatusSetoran, StatusPesanan, JenisBahan, User } from '../types';
import {
  INITIAL_USERS,
  INITIAL_SETORAN,
  INITIAL_PESANAN,
  INITIAL_PRODUK,
  INITIAL_TAHAP_PRODUKSI,
  HARGA_BAHAN_BAKU,
} from '../data/mockData';

interface DataContextType {
  usersList: User[];
  setoranList: Setoran[];
  pesananList: Pesanan[];
  produkList: Produk[];
  tahapProduksiList: TahapProduksi[];
  addSetoran: (data: {
    supplierId: string;
    supplierNama?: string;
    supplierLokasi?: string;
    jenisBahan: string;
    beratKg: number;
    alamatJemput?: string;
    catatan?: string;
  }) => Setoran;
  updateSetoranStatus: (id: string, status: StatusSetoran, catatanAdmin?: string) => void;
  createPesanan: (data: {
    pembeliId: string;
    pembeliNama?: string;
    pembeliInstansi?: string;
    produkId: string;
    jumlahKg: number;
    alamat: string;
    catatan?: string;
  }) => { success: boolean; message?: string; pesanan?: Pesanan };
  updatePesananStatus: (id: string, status: StatusPesanan, nomorResi?: string) => void;
  updateTahapProduksi: (id: string, persentase: number, kapasitasKg: number) => void;
  resetAllDemoData: () => void;
  getHargaBahan: (jenis: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_SETORAN = 'briketnusa_data_setoran_v3';
const STORAGE_KEY_PESANAN = 'briketnusa_data_pesanan_v3';
const STORAGE_KEY_PRODUK = 'briketnusa_data_produk_v3';
const STORAGE_KEY_PRODUKSI = 'briketnusa_data_produksi_v3';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList] = useState<User[]>(INITIAL_USERS);

  const [setoranList, setSetoranList] = useState<Setoran[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETORAN);
      return saved ? JSON.parse(saved) : INITIAL_SETORAN;
    } catch {
      return INITIAL_SETORAN;
    }
  });

  const [pesananList, setPesananList] = useState<Pesanan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PESANAN);
      return saved ? JSON.parse(saved) : INITIAL_PESANAN;
    } catch {
      return INITIAL_PESANAN;
    }
  });

  const [produkList, setProdukList] = useState<Produk[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUK);
      return saved ? JSON.parse(saved) : INITIAL_PRODUK;
    } catch {
      return INITIAL_PRODUK;
    }
  });

  const [tahapProduksiList, setTahapProduksiList] = useState<TahapProduksi[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUKSI);
      return saved ? JSON.parse(saved) : INITIAL_TAHAP_PRODUKSI;
    } catch {
      return INITIAL_TAHAP_PRODUKSI;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETORAN, JSON.stringify(setoranList));
  }, [setoranList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PESANAN, JSON.stringify(pesananList));
  }, [pesananList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(produkList));
  }, [produkList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUKSI, JSON.stringify(tahapProduksiList));
  }, [tahapProduksiList]);

  // Handle storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SETORAN && e.newValue) {
        setSetoranList(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEY_PESANAN && e.newValue) {
        setPesananList(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEY_PRODUK && e.newValue) {
        setProdukList(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEY_PRODUKSI && e.newValue) {
        setTahapProduksiList(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getHargaBahan = (jenis: string): number => {
    const normalized = jenis.toLowerCase();
    if (normalized.includes('arang')) return 6500;
    if (normalized.includes('sabut')) return 1200;
    return 2800; // tempurung
  };

  const addSetoran = useCallback((data: {
    supplierId: string;
    supplierNama?: string;
    supplierLokasi?: string;
    jenisBahan: string;
    beratKg: number;
    alamatJemput?: string;
    catatan?: string;
  }) => {
    const hargaPerKg = getHargaBahan(data.jenisBahan);
    const total = hargaPerKg * data.beratKg;
    const now = new Date();
    const dateFormatted = now.toISOString().split('T')[0];
    const newId = `SET-2026-${String(setoranList.length + 1).padStart(3, '0')}`;

    const newSetoran: Setoran = {
      id: newId,
      supplierId: data.supplierId,
      supplierNama: data.supplierNama || 'Pak Darmo',
      supplierLokasi: data.supplierLokasi || 'Indragiri Hilir, Riau',
      tanggal: dateFormatted,
      jenisBahan: data.jenisBahan,
      beratKg: data.beratKg,
      hargaPerKg,
      total,
      alamatJemput: data.alamatJemput || 'Indragiri Hilir',
      catatan: data.catatan,
      status: 'Menunggu',
    };

    setSetoranList((prev) => [newSetoran, ...prev]);
    return newSetoran;
  }, [setoranList.length]);

  const updateSetoranStatus = useCallback((id: string, status: StatusSetoran, catatanAdmin?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSetoranList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              catatanAdmin: catatanAdmin || item.catatanAdmin,
              tanggalVerifikasi: today,
            }
          : item
      )
    );
  }, []);

  const createPesanan = useCallback((data: {
    pembeliId: string;
    pembeliNama?: string;
    pembeliInstansi?: string;
    produkId: string;
    jumlahKg: number;
    alamat: string;
    catatan?: string;
  }) => {
    const targetProduct = produkList.find((p) => p.id === data.produkId);
    if (!targetProduct) {
      return { success: false, message: 'Produk tidak ditemukan.' };
    }

    if (data.jumlahKg < targetProduct.minOrderKg) {
      return {
        success: false,
        message: `Minimal pemesanan untuk ${targetProduct.nama} adalah ${targetProduct.minOrderKg} kg.`,
      };
    }

    if (data.jumlahKg > targetProduct.stokKg) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Stok saat ini: ${targetProduct.stokKg} kg.`,
      };
    }

    const total = targetProduct.hargaPerKg * data.jumlahKg;
    const now = new Date();
    const dateFormatted = now.toISOString().split('T')[0];
    const orderId = `BN-2026-${String(pesananList.length + 1).padStart(3, '0')}`;

    const newOrder: Pesanan = {
      id: orderId,
      pembeliId: data.pembeliId,
      pembeliNama: data.pembeliNama || 'Sinta',
      pembeliInstansi: data.pembeliInstansi || 'CV Bara Shisha Nusantara',
      produkId: targetProduct.id,
      namaProduk: targetProduct.nama,
      jumlahKg: data.jumlahKg,
      hargaPerKg: targetProduct.hargaPerKg,
      total,
      alamat: data.alamat,
      alamatKirim: data.alamat,
      catatan: data.catatan,
      status: 'Diproses',
      tanggal: dateFormatted,
    };

    // Deduct stock
    setProdukList((prev) =>
      prev.map((prod) =>
        prod.id === targetProduct.id ? { ...prod, stokKg: prod.stokKg - data.jumlahKg } : prod
      )
    );

    setPesananList((prev) => [newOrder, ...prev]);
    return { success: true, pesanan: newOrder };
  }, [produkList, pesananList.length]);

  const updatePesananStatus = useCallback((id: string, status: StatusPesanan, nomorResi?: string) => {
    setPesananList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            nomorResi: nomorResi !== undefined ? nomorResi : item.nomorResi,
          };
        }
        return item;
      })
    );
  }, []);

  const updateTahapProduksi = useCallback((id: string, persentase: number, kapasitasKg: number) => {
    setTahapProduksiList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              persentase: Math.min(100, Math.max(0, persentase)),
              kapasitasKg,
              status: persentase >= 80 ? 'Optimal' : persentase >= 40 ? 'Berjalan' : 'Siaga',
            }
          : item
      )
    );
  }, []);

  const resetAllDemoData = useCallback(() => {
    setSetoranList(INITIAL_SETORAN);
    setPesananList(INITIAL_PESANAN);
    setProdukList(INITIAL_PRODUK);
    setTahapProduksiList(INITIAL_TAHAP_PRODUKSI);
    localStorage.removeItem(STORAGE_KEY_SETORAN);
    localStorage.removeItem(STORAGE_KEY_PESANAN);
    localStorage.removeItem(STORAGE_KEY_PRODUK);
    localStorage.removeItem(STORAGE_KEY_PRODUKSI);
  }, []);

  return (
    <DataContext.Provider
      value={{
        usersList,
        setoranList,
        pesananList,
        produkList,
        tahapProduksiList,
        addSetoran,
        updateSetoranStatus,
        createPesanan,
        updatePesananStatus,
        updateTahapProduksi,
        resetAllDemoData,
        getHargaBahan,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
