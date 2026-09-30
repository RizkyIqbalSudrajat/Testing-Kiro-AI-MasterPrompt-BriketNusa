export type UserRole = 'supplier' | 'pembeli' | 'admin';

export interface User {
  id: string;
  nama: string;
  instansi?: string;
  email: string;
  password?: string;
  role: UserRole;
  telepon: string;
  lokasi: string;
  avatar?: string;
}

export type JenisBahan = 'Tempurung' | 'Sabut' | 'Arang Tempurung' | 'tempurung' | 'sabut' | 'arang tempurung';

export type StatusSetoran = 'Menunggu' | 'Diverifikasi' | 'Ditolak';

export interface Setoran {
  id: string;
  supplierId: string;
  supplierNama?: string;
  supplierLokasi?: string;
  tanggal: string;
  jenisBahan: string;
  beratKg: number;
  hargaPerKg: number;
  total?: number;
  alamatJemput?: string;
  catatan?: string;
  status: StatusSetoran;
  catatanAdmin?: string;
  tanggalVerifikasi?: string;
}

export type StatusPesanan = 'Diproses' | 'Dikirim' | 'Selesai';

export interface Produk {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  kegunaan?: string;
  kadarAbu: string;
  waktuBakar: string;
  hargaPerKg: number;
  minOrderKg: number;
  stokKg: number;
  gambar: string; // Gradient color CSS or illustration theme
  kalori?: string;
  bentuk?: string;
  spesifikasi?: {
    kadarAbu: string;
    kadarAir: string;
    waktuBakar: string;
    kalori: string;
    bentuk: string;
  };
}

export interface Pesanan {
  id: string; // format: BN-2026-001
  pembeliId: string;
  pembeliNama?: string;
  pembeliInstansi?: string;
  produkId: string;
  namaProduk?: string;
  jumlahKg: number;
  hargaPerKg?: number;
  total: number;
  alamat: string;
  alamatKirim?: string; // alias
  catatan?: string;
  status: StatusPesanan;
  tanggal: string;
  nomorResi?: string;
}

export interface TahapProduksi {
  id: string;
  nama: string;
  deskripsi: string;
  persentase: number;
  kapasitasKg: number;
  targetKg: number;
  status: 'Berjalan' | 'Optimal' | 'Siaga';
}
