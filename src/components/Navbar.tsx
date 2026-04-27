'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCart } from '@/src/lib/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Produk', path: '/produk' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Kontak', path: '#' },
  ];

  // Don't show footer/navbar on login page if desired, but for now we keep it simple
  if (pathname === '/login') return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-blue p-2 rounded-lg">
            <ShoppingCart className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-brand-dark tracking-tight">BAKUL OLI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.path} 
              className={`hover:text-brand-blue transition-colors ${pathname === link.path ? 'text-brand-blue font-bold border-b-2 border-brand-yellow pb-1' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-brand-blue">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/keranjang" className="relative p-2 text-gray-600 hover:text-brand-blue">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="hidden md:block bg-brand-yellow px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 shadow-sm text-brand-dark">
            Masuk
          </Link>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
