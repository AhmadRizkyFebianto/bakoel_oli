'use client';

import { motion } from 'motion/react';
import { House, Wrench, ChevronRight, Phone, Calendar, MapPin, Clock, Users, Star } from 'lucide-react';

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="relative h-[400px] flex items-center overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
          alt="Workshop"
        />
        <div className="container mx-auto px-6 relative z-10 text-white text-center">
          <h1 className="text-6xl font-bold mb-6">Layanan bengkel <span className="text-brand-yellow">Bakul Oli</span></h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
            Layanan Bengkel Bakul Oli mencakup perawatan lengkap untuk motor Anda. Mulai dari ganti oli, tune-up, hingga perbaikan mesin dan transmisi. Dikerjakan oleh teknisi berpengalaman untuk performa motor yang maksimal.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Layanan yang kami sediakan</h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-56 h-56 mb-8 overflow-hidden">
               <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-at-home-4488737-3723275.png" alt="Home Service" className="w-full object-contain" />
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:text-brand-blue transition-colors">Servis di Rumah</h3>
            <p className="text-gray-500 mb-10 text-sm leading-relaxed">
              Mekanik handal kami siap datang langsung ke lokasi Anda (Rumah/Kantor). Tidak perlu repot keluar rumah, kami yang datang kepada Anda.
            </p>
            <button className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg hover:brightness-110 transition-all shadow-md active:scale-95">
              Booking Sekarang
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-56 h-56 mb-8 overflow-hidden">
               <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-shop-4488736-3723274.png" alt="Workshop" className="w-full object-contain" />
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:text-brand-yellow transition-colors">Servis di Bengkel</h3>
            <p className="text-gray-500 mb-10 text-sm leading-relaxed">
              Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda. Nikmati fasilitas bengkel yang lengkap dan modern.
            </p>
            <button className="w-full bg-brand-yellow text-brand-dark py-4 rounded-2xl font-bold text-lg hover:brightness-105 transition-all shadow-md active:scale-95">
              Pilih Jadwal
            </button>
          </motion.div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-yellow opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Percayakan Perawatan mesin pada bengkel <span className="text-brand-yellow">Bakul Oli</span></h2>
              <p className="text-gray-500 text-lg mb-8">Percayakan perawatan mesin kendaraan Anda pada Bengkel Bakul Oli. Layanan profesional dengan teknisi berpengalaman dan oli berkualitas untuk performa optimal.</p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Clock className="w-5 h-5" />, label: 'Layanan Cepat' },
                  { icon: <Calendar className="w-5 h-5" />, label: 'Booking Online' },
                  { icon: <Users className="w-5 h-5" />, label: 'Ahli Mesin' },
                  { icon: <Star className="w-5 h-5" />, label: 'Terpercaya' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-brand-yellow/20 p-2 rounded-lg text-brand-dark">
                      {item.icon}
                    </div>
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?w=800&auto=format&fit=crop&q=80" 
                alt="Professional service"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
