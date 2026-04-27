import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Settings, Zap, Users, Wrench, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { FEATURED_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-brand-dark" />,
    title: 'Harga Terjangkau',
    desc: 'Dengan harga yang bersaing dan transparan, Bengkel Bakul Oli memberikan layanan terbaik tanpa membebani anggaran Anda.',
  },
  {
    icon: <Settings className="w-6 h-6 text-brand-dark" />,
    title: 'Layanan Cepat & Efisien',
    desc: 'Kami memahami betapa berharganya waktu Anda, oleh karena itu kami menjamin proses perawatan yang cepat dan efisien.',
  },
  {
    icon: <Wrench className="w-6 h-6 text-brand-dark" />,
    title: 'Teknologi Canggih',
    desc: 'Bengkel kami dilengkapi dengan teknologi terbaru untuk melakukan diagnosa dan perawatan, memastikan kendaraan Anda mendapatkan solusi terbaik.',
  },
  {
    icon: <Users className="w-6 h-6 text-brand-dark" />,
    title: 'Layanan Profesional',
    desc: 'Tim layanan pelanggan kami siap membantu dan memberikan saran terbaik sesuai kebutuhan kendaraan Anda.',
  },
];

interface HomeProps {
  addToCart: (p: Product) => void;
}

export default function Home({ addToCart }: HomeProps) {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection addToCart={addToCart} />
      <SeeProductSection/>
      <ServiceSelectionSection />
      <FaqSection/>
    </div>
  );
}

function HeroSection() {
  return (
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
              <div className="w-px h-10 bg-gray-600" />
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
            <button className="w-full bg-brand-yellow py-3 rounded-lg font-bold mt-4 hover:brightness-105 transition-all">Cari</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Kenapa harus di bengkel <span className="text-brand-yellow">Bakul Oli</span>?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Bengkel Bakul Oli hadir dengan layanan cepat, profesional, dan terpercaya. Harga bersahabat serta teknisi ahli menjaga performa kendaraan Anda tetap optimal.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
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
  );
}

function FeaturedProductsSection({ addToCart }: { addToCart: (p: Product) => void }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Pilihan Produk di bengkel <span className="text-brand-yellow">Bakul Oli</span></h2>
          <Link to="/produk" className="text-brand-dark font-semibold hover:text-brand-blue flex items-center gap-1 group">
            Lihat Selengkapnya <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SeeProductSection(){
  return (
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-white -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight">
              Percayakan Perawatan mesin pada bengkel <span className="text-brand-yellow italic underline">Bakul Oli</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Percayakan perawatan mesin kendaraan Anda pada Bengkel <span className="text-brand-yellow">Bakul Oli</span>. Layanan profesional dengan teknisi berpengalaman dan oli berkualitas untuk performa optimal.
            </p>
            <button className="bg-brand-yellow hover:bg-primary-dark text-black font-bold px-10 py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-primary/30 uppercase tracking-wide">
              Lihat Produk Kami
            </button>
          </motion.div>
        </div>
      </section>
  )
}

function ServiceSelectionSection() {
  return (
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
          <button className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Booking Sekarang</button>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="w-48 h-48 mb-6">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-shop-4488736-3723274.png" alt="Workshop service" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Servis di Bengkel</h3>
          <p className="text-gray-500 mb-8 text-sm">Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda.</p>
          <button className="w-full bg-brand-yellow text-brand-dark py-3 rounded-xl font-bold hover:brightness-105 transition-all">Pilih Jadwal</button>
        </div>
      </div>
    </section>
  );
  }

  interface FAQItem {
    question: string;
    answer: string;
  }

  const FAQS: FAQItem[] = [
  { question: "Apa tanda-tanda mesin motor membutuhkan servis?", answer: "Tanda-tanda meliputi suara mesin kasar, penurunan performa, konsumsi bahan bakar meningkat, atau lampu indikator mesin menyala." },
  { question: "Kapan oli mesin harus diganti?", answer: "Umumnya disarankan setiap 2.000 - 3.000 km atau sesuai rekomendasi pabrikan kendaraan Anda." },
  { question: "Mengapa mesin sering brebet atau susah hidup?", answer: "Penyebabnya bisa beragam, mulai dari busi kotor, filter udara tersumbat, hingga masalah pada sistem bahan bakar." },
  { question: "Mesin panas cepat, apakah berbahaya?", answer: "Ya, overheat dapat merusak komponen mesin secara permanen. Pastikan sistem pendingin dan pelumasan berfungsi dengan baik." },
  { question: "Bagaimana cara menjaga mesin motor tetap awet?", answer: "Servis rutin, penggantian oli teratur, penggunaan bahan bakar berkualitas, dan tidak memaksa mesin secara berlebihan adalah kuncinya." },
  ];

  const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left group"
          >
            <span className={`font-semibold ${openIndex === index ? 'text-primary-dark' : 'text-gray-900'} transition-colors`}>
              {faq.question}
            </span>
            <div className={`p-1 rounded-full transition-all ${openIndex === index ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
              {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
            </div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
       );};

  function FaqSection(){
    return(
       <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div>
             <span className="inline-block border-2 border-primary text-primary-dark font-display font-bold px-4 py-1.5 rounded-full mb-6">
              FAQs
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900 leading-tight">
              <span className="text-primary italic">FAQ:</span> Pertanyaan seputar perawatan motor
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Dapatkan solusi terkait pertanyaan seputar masalah ringan motor seperti starter motor, akselerasi lemot, dan knalpot berasap.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {/* Decorative background elements could go here */}
            </div>
          </div>

          <FAQAccordion />
        </div>
      </section>
    )
  }
