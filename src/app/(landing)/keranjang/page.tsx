'use client';

import { Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/src/lib/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
          <Trash2 className="w-20 h-20 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold">Keranjang Anda Kosong</h2>
        <p className="text-gray-500">Belum ada produk perawatan yang ditambahkan ke keranjang.</p>
        <Link href="/produk" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-12">Keranjang</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-blue text-white rounded flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="font-bold">Pilih Semua ({cart.length})</span>
              </div>
              <button className="text-red-500 font-bold hover:underline">Hapus</button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-6 h-6 border-2 border-brand-blue rounded flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                    <img src={item.image} alt={item.name} className="h-full object-contain" />
                  </div>
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.category}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-4">
                       <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-4 py-1 text-sm font-bold border-x border-gray-200">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                       </div>
                    </div>
                  </div>
                  <div className="text-right space-y-4 flex flex-col items-center sm:items-end">
                    <span className="text-xl font-extrabold text-brand-blue">Rp. {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-100 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="bg-brand-yellow text-brand-dark px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 transition-all">
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32 space-y-8">
              <h3 className="text-xl font-bold">Ringkasan Belanja</h3>
              <div className="flex justify-between items-center pb-6 border-b border-gray-100 text-gray-600">
                <span>Total</span>
                <span className="text-2xl font-extrabold text-brand-blue">Rp. {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <button className="w-full bg-brand-yellow py-4 rounded-2xl font-bold text-lg hover:brightness-105 transition-all shadow-lg active:scale-95">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24 py-16 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Temukan Layanan perawatan motor <br />terbaik di Bengkel <span className="text-brand-yellow underline">Bakul Oli</span></h2>
            <p className="text-blue-100">Temukan layanan perawatan motor profesional dan terpercaya di Bengkel Bakul Oli. <br />Dari ganti oli hingga tune-up lengkap, motor Anda tetap prima dan aman dikendarai.</p>
          </div>
          <Link href="/layanan" className="bg-brand-yellow text-brand-dark px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shrink-0">
            Lihat Layanan Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
