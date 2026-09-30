import React from 'react';
import { Flame, MapPin, Phone, Mail, Award, ShieldCheck, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="kontak" className="bg-[#2C1810] text-[#E8DFD3] border-t border-[#432A1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Hilirisasi Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5C3D2E] text-[#E67E22] flex items-center justify-center">
                <Flame className="w-5 h-5 fill-current" />
              </span>
              <span className="text-xl font-bold font-display text-white">
                Briket<span className="text-[#E67E22]">Nusa</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#BFAEA2]">
              Inisiatif hilirisasi kelapa terpadu Indonesia. Mengubah limbah batok dan sabut kelapa nusantara
              menjadi briket arang bernilai tambah tinggi untuk pemenuhan energi bersih domestik dan ekspor.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#8A7669]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> SNI 01-6235
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#E67E22]" /> ISO 9001:2015
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-[#2E7D32]" /> 100% Bio-Organic
              </span>
            </div>
          </div>

          {/* Col 2: Alur Hilirisasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Struktur Hilirisasi
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEA2]">
              <li>
                <a href="#masalah" className="hover:text-white transition-colors">
                  Urgensi Hilirisasi Bahan Mentah
                </a>
              </li>
              <li>
                <a href="#solusi" className="hover:text-white transition-colors">
                  Alur 4 Langkah Pengolahan Pabrik
                </a>
              </li>
              <li>
                <a href="#produk" className="hover:text-white transition-colors">
                  Spesifikasi Briket Shisha, BBQ & Boiler
                </a>
              </li>
              <li>
                <a href="#mitra" className="hover:text-white transition-colors">
                  Skema Kemitraan Petani & UMKM
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#E67E22] hover:underline font-medium">
                  Portal Login Multi-Role &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sentra Pabrik & Fasilitas */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Sentra Pabrik & Pengumpulan
            </h4>
            <div className="space-y-2.5 text-xs text-[#BFAEA2]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <span>
                  <strong>Pabrik Utama Kendal:</strong> Kawasan Industri Kendal Blok B-12, Jawa Tengah
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>
                  <strong>Depo Pengumpul Banyuwangi:</strong> Sentra Kelapa Rogojampi, Jawa Timur
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>
                  <strong>Depo Jabar:</strong> Jalur Selatan Cijulang, Pangandaran
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Kontak Cepat & Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Layanan & Kerjasama
            </h4>
            <div className="space-y-2.5 text-xs text-[#BFAEA2]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span className="tabular-nums">+62 (24) 867-9201 / +62 821-1122-3344</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E67E22] shrink-0" />
                <span>kemitraan@briketnusa.id</span>
              </div>
              <div className="p-3 bg-[#3B2317] rounded-lg border border-[#4E3122]">
                <p className="text-[11px] text-[#D8C7BC]">
                  Bahan baku tempurung kelapa dibeli langsung dari petani dengan sistem timbang digital dan pembayaran instan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-[#432A1F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7669] gap-4">
          <p>© {new Date().getFullYear()} BriketNusa Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Standar SNI 01-6235-2000</span>
            <span>·</span>
            <span>Kadar Abu Rendah</span>
            <span>·</span>
            <span>Bebas Asap Beracun</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
