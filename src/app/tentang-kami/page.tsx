'use client';

import { motion } from 'motion/react';
import { Zap, Settings, Wrench, Users } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const features = [
    { 
      icon: <Zap className="w-6 h-6 text-brand-dark" />, 
      title: 'Harga Terjangkau', 
      desc: 'Dengan harga yang bersaing dan transparan, Bengkel Bakul Oli memberikan layanan terbaik tanpa membebani anggaran Anda.' 
    },
    { 
      icon: <Settings className="w-6 h-6 text-brand-dark" />, 
      title: 'Layanan Cepat dan Efisien', 
      desc: 'Kami memahami betapa berharganya waktu Anda, oleh karena itu kami menjamin proses perawatan yang cepat dan efisien, tanpa mengorbankan kualitas.' 
    },
    { 
      icon: <Wrench className="w-6 h-6 text-brand-dark" />, 
      title: 'Teknologi Canggih untuk Diagnosa yang Tepat', 
      desc: 'Bengkel kami dilengkapi dengan teknologi terbaru untuk melakukan diagnosa dan perawatan, memastikan kendaraan Anda mendapatkan solusi terbaik.' 
    },
    { 
      icon: <Users className="w-6 h-6 text-brand-dark" />, 
      title: 'Layanan Pelanggan Profesional dan Ramah', 
      desc: 'Tim layanan pelanggan kami siap membantu dan memberikan saran terbaik sesuai kebutuhan kendaraan Anda, dengan pendekatan yang ramah dan profesional.' 
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[480px] flex items-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
          alt="About Banner"
        />
        <div className="container mx-auto px-6 relative z-10 text-white text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold mb-8"
          >
            Tentang bengkel <span className="text-brand-yellow">Bakul Oli</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed font-medium"
          >
            Bengkel Bakul Oli Surabaya siap merawat motor Anda dengan layanan profesional dan terpercaya. 
            Kami menyediakan ganti oli, tune-up, dan perawatan mesin lengkap untuk semua jenis motor. 
            Teknisi berpengalaman memastikan performa motor tetap optimal dan awet. 
            Kunjungi kami untuk servis cepat, aman, dan harga bersahabat di Surabaya.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Kenapa harus di bengkel <span className="text-brand-yellow">Bakul Oli</span>?</h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg">
              Bengkel <span className="text-brand-yellow font-bold">Bakul Oli</span> hadir dengan layanan cepat, profesional, and terpercaya. Harga bersahabat serta teknisi ahli menjaga performa kendaraan Anda tetap optimal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-blue relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Temukan Layanan perawatan motor <br />terbaik di Bengkel <span className="text-brand-yellow underline">Bakul Oli</span></h2>
            <p className="text-blue-100 text-lg">
              Temukan layanan perawatan motor profesional dan terpercaya di Bengkel Bakul Oli. <br />
              Dari ganti oli hingga tune-up lengkap, motor Anda tetap prima dan aman dikendarai.
            </p>
          </div>
          <Link href="/layanan" className="bg-brand-yellow text-brand-dark px-10 py-5 rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-2xl shrink-0">
            Lihat Layanan Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
