import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-blue p-2 rounded-lg">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight">BAKUL OLI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Solusi terpercaya untuk kebutuhan pelumas dan perawatan otomotif di Surabaya. Ahli dalam menjaga performa mesin Anda.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-brand-yellow">Beranda</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-brand-yellow">Tentang Kami</Link></li>
              <li><Link href="/produk" className="hover:text-brand-yellow">Produk</Link></li>
              <li><Link href="/layanan" className="hover:text-brand-yellow">Layanan</Link></li>
              <li><Link href="#" className="hover:text-brand-yellow">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Jam Kerja</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Senin - Sabtu</span>
                <span>08.00 - 17.00</span>
              </li>
              <li className="flex justify-between">
                <span>Minggu</span>
                <span>09.00 - 15.00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>Jl. Raya Surabaya No. 123, Surabaya, Jawa Timur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>+62 31 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>info@bakuloli.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2026 Bakul Oli Surabaya. Ahli Perawatan Mesin.</p>
        </div>
      </div>
    </footer>
  );
}
