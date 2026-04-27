'use client';

import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/src/lib/types';
import { useCart } from '@/src/lib/CartContext';

const PRODUCTS: Product[] = Array(12).fill({
  id: '1',
  name: 'Shell Advance AX7 Matic 10W-30',
  category: 'Untuk Motor Matic | 0.8L | Sintetik',
  price: 65000,
  image: 'https://images.unsplash.com/photo-1635850312852-06ccc299f243?w=400&auto=format&fit=crop&q=60'
}).map((p, i) => ({ ...p, id: `p-${i}` }));

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <section className="relative h-64 flex items-center overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
          alt="Banner"
        />
        <div className="container mx-auto px-6 relative z-10 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">Produk Perawatan di bengkel <span className="text-brand-yellow">Bakul Oli</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Produk perawatan Bengkel Bakul Oli dirancang untuk menjaga performa motor Anda. Mulai dari oli mesin, filter, hingga pelumas khusus, semuanya berkualitas tinggi.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Kategori</label>
                  <div className="space-y-2">
                    {['Motor Matic', 'Motor Bebek', 'Motor Sport', 'Pelumas Khusus'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="group-hover:text-brand-blue transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Merek</label>
                  <div className="space-y-2">
                    {['Shell', 'Motul', 'Castrol', 'Ahm Oil'].map(brand => (
                      <label key={brand} className="flex items-center gap-3 text-sm cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                        <span className="group-hover:text-brand-blue transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Ketik produk yang anda butuhkan..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-transparent focus:border-brand-yellow outline-none text-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="bg-brand-yellow px-8 rounded-2xl font-bold hover:brightness-105 transition-all shadow-md">
                Cari
              </button>
            </div>

            <h2 className="text-2xl font-bold">Pilihan Produk di bengkel <span className="text-brand-yellow">Bakul Oli</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col items-center text-center">
                  <div className="h-48 mb-6 overflow-hidden flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{product.category}</p>
                  <span className="text-xl font-extrabold text-brand-blue mb-6">Rp. {product.price.toLocaleString('id-ID')}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-brand-yellow py-3 rounded-xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-sm"
                  >
                    Tambah Keranjang
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pt-12">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, '...', 20].map((p, i) => (
                  <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${p === 1 ? 'bg-brand-dark text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-dark text-white hover:bg-brand-blue transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
