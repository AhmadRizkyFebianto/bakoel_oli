import { motion } from 'motion/react';
import { Search, ChevronRight, ChevronLeft, Star, Settings, Zap, Users, House, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = Array(6).fill({
  id: '1',
  name: 'Shell Advance AX7 Matic 10W-30',
  category: 'Untuk Motor Matic | 0.8L | Sintetik',
  price: 65000,
  image: 'https://images.unsplash.com/photo-1635850312852-06ccc299f243?w=400&auto=format&fit=crop&q=60' // Placeholder for oil product
}).map((p, i) => ({ ...p, id: `p-${i}` }));

export default function Home({ addToCart }: { addToCart: (p: Product) => void }) {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=80" 
            alt="Garage background" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
              BAKUL OLI <br />
              <span className="text-brand-yellow font-extrabold">Pelumas Andal, Bengkel Siap Melayani</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Bengkel ini menawarkan kualitas oli sekaligus layanan yang siap membantu kendaraan anda dan menawarkan perawatan mesin secara menyeluruh.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/layanan" className="bg-brand-yellow text-brand-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                Lihat Lokasi Kami <ChevronRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4 text-white">
                <div>
                  <span className="block text-2xl font-bold">100%</span>
                  <span className="text-xs text-gray-400">Produk Original</span>
                </div>
                <div className="w-px h-10 bg-gray-600"></div>
                <div>
                  <span className="block text-2xl font-bold">10+</span>
                  <span className="text-xs text-gray-400">Jenis Perawatan</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md hidden lg:block"
          >
            <h3 className="text-xl font-bold text-center mb-6">Temukan Oli Pilihanmu</h3>
            <div className="flex justify-center mb-6">
              <img src="https://images.unsplash.com/photo-1635850312852-06ccc299f243?w=300&auto=format&fit=crop&q=80" alt="Oil" className="h-48 object-contain" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tipe Oli</label>
                <select className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm appearance-none cursor-pointer">
                  <option>Contoh Oli Mesin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Jenis Mesin</label>
                <select className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm appearance-none cursor-pointer">
                  <option>Pilih Jenis Mesin</option>
                </select>
              </div>
              <button className="w-full bg-brand-yellow py-3 rounded-lg font-bold mt-4 hover:brightness-105 transition-all">
                Cari
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Kenapa harus di bengkel <span className="text-brand-yellow">Bakul Oli</span>?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Bengkel Bakul Oli hadir dengan layanan cepat, profesional, dan terpercaya. Harga bersahabat serta teknisi ahli menjaga performa kendaraan Anda tetap optimal.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="w-6 h-6 text-brand-dark" />, title: 'Harga Terjangkau', desc: 'Dengan harga yang bersaing dan transparan, Bengkel Bakul Oli memberikan layanan terbaik tanpa membebani anggaran Anda.' },
              { icon: <Settings className="w-6 h-6 text-brand-dark" />, title: 'Layanan Cepat & Efisien', desc: 'Kami memahami betapa berharganya waktu Anda, oleh karena itu kami menjamin proses perawatan yang cepat dan efisien.' },
              { icon: <Wrench className="w-6 h-6 text-brand-dark" />, title: 'Teknologi Canggih', desc: 'Bengkel kami dilengkapi dengan teknologi terbaru untuk melakukan diagnosa dan perawatan, memastikan kendaraan Anda mendapatkan solusi terbaik.' },
              { icon: <Users className="w-6 h-6 text-brand-dark" />, title: 'Layanan Profesional', desc: 'Tim layanan pelanggan kami siap membantu dan memberikan saran terbaik sesuai kebutuhan kendaraan Anda.' }
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-brand-yellow transition-colors duration-300">
                <div className="w-12 h-12 bg-brand-yellow group-hover:bg-white rounded-full flex items-center justify-center mb-6 transition-colors">
                  {f.icon}
                </div>
                <h4 className="text-lg font-bold mb-3">{f.title}</h4>
                <p className="text-sm text-gray-500 group-hover:text-brand-dark transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Pilihan Produk di bengkel <span className="text-brand-yellow">Bakul Oli</span></h2>
            <Link to="/produk" className="text-brand-dark font-semibold hover:text-brand-blue flex items-center gap-1 group">
              Lihat Selengkapnya <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Service Selection Section */}
      <section className="py-20 bg-blue-50/30">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Layanan yang kami sediakan</h2>
          <p className="text-gray-500">Kami menyediakan layanan perawatan mesin kendaraan, penggantian oli, dan perbaikan komponen dengan teknisi berpengalaman.</p>
        </div>
        
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
            <div className="w-48 h-48 mb-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-at-home-4488737-3723275.png" alt="Home service" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Servis di Rumah</h3>
            <p className="text-gray-500 mb-8 text-sm">Mekanik handal kami siap datang langsung ke lokasi Anda (Rumah/Kantor).</p>
            <button className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Booking Sekarang
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
            <div className="w-48 h-48 mb-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-shop-4488736-3723274.png" alt="Workshop service" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Servis di Bengkel</h3>
            <p className="text-gray-500 mb-8 text-sm">Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda.</p>
            <button className="w-full bg-brand-yellow text-brand-dark py-3 rounded-xl font-bold hover:brightness-105 transition-all">
              Pilih Jadwal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void; key?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col items-center text-center">
      <div className="h-48 mb-6 overflow-hidden flex items-center justify-center">
        <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h4 className="font-bold text-lg mb-1">{product.name}</h4>
      <p className="text-xs text-brand-blue font-medium mb-3">{product.category}</p>
      <span className="text-xl font-extrabold text-brand-blue mb-6">Rp. {product.price.toLocaleString('id-ID')}</span>
      <button 
        onClick={onAdd}
        className="w-full bg-brand-yellow py-3 rounded-xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-sm active:scale-95"
      >
        Tambah Keranjang
      </button>
    </div>
  );
}
