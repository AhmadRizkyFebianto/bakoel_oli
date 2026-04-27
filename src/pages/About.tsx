import { motion } from 'motion/react';
import { Zap, Settings, Wrench, Users } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import CtaBanner from '../components/CtaBanner';

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-brand-dark" />,
    title: 'Harga Terjangkau',
    desc: 'Dengan harga yang bersaing dan transparan, Bengkel Bakul Oli memberikan layanan terbaik tanpa membebani anggaran Anda.',
  },
  {
    icon: <Settings className="w-6 h-6 text-brand-dark" />,
    title: 'Layanan Cepat dan Efisien',
    desc: 'Kami memahami betapa berharganya waktu Anda, oleh karena itu kami menjamin proses perawatan yang cepat dan efisien, tanpa mengorbankan kualitas.',
  },
  {
    icon: <Wrench className="w-6 h-6 text-brand-dark" />,
    title: 'Teknologi Canggih untuk Diagnosa yang Tepat',
    desc: 'Bengkel kami dilengkapi dengan teknologi terbaru untuk melakukan diagnosa dan perawatan, memastikan kendaraan Anda mendapatkan solusi terbaik.',
  },
  {
    icon: <Users className="w-6 h-6 text-brand-dark" />,
    title: 'Layanan Pelanggan Profesional dan Ramah',
    desc: 'Tim layanan pelanggan kami siap membantu dan memberikan saran terbaik sesuai kebutuhan kendaraan Anda, dengan pendekatan yang ramah dan profesional.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <PageBanner
        title={<>Tentang bengkel <span className="text-brand-yellow">Bakul Oli</span></>}
        description="Bengkel Bakul Oli Surabaya siap merawat motor Anda dengan layanan profesional dan terpercaya. Kami menyediakan ganti oli, tune-up, dan perawatan mesin lengkap untuk semua jenis motor. Teknisi berpengalaman memastikan performa motor tetap optimal dan awet. Kunjungi kami untuk servis cepat, aman, dan harga bersahabat di Surabaya."
        height="h-[480px]"
      />

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Kenapa harus di bengkel <span className="text-brand-yellow">Bakul Oli</span>?
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg">
              Bengkel <span className="text-brand-yellow font-bold">Bakul Oli</span> hadir dengan
              layanan cepat, profesional, dan terpercaya. Harga bersahabat serta teknisi ahli
              menjaga performa kendaraan Anda tetap optimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
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

      <CtaBanner />
    </div>
  );
}
