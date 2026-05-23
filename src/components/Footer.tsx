"use client";
import { Clock, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1D27] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display font-bold text-xl tracking-tighter text-brand-yellow">
                BAKUL OLI
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Solusi terpercaya untuk kebutuhan pelumas dan perawatan otomotif
              di Surabaya. Ahli dalam menjaga performa mesin Anda.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 uppercase tracking-wider text-brand-yellow">
              Navigasi
            </h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Produk
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 uppercase tracking-wider text-brand-yellow">
              Jam Kerja
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex justify-between">
                <span>Senin - Sabtu</span>
                <span className="font-bold text-gray-200">08.00 - 17.00</span>
              </li>
              <li className="flex justify-between">
                <span>Minggu & Hari Libur</span>
                <span className="font-bold text-gray-200">Tutup</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 uppercase tracking-wider text-brand-yellow">
              Kontak
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Building2 size={18} className="text-brand-yellow" />
                </div>
                <span className="text-sm">
                  Jl.Sidotopo wetan 2/87, Surabaya, Jawa Timur, 60128
                </span>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Clock size={18} className="text-brand-yellow" />
                </div>
                <span className="text-sm">+62 889-9152-0696</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Bakul Oli Surabaya. Ahli Perawatan Mesin.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
