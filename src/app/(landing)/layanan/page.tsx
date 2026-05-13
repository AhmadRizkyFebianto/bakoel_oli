"use client";
import { motion } from "framer-motion";
import { Clock, Calendar, Users, Star } from "lucide-react";
import PageBanner from "../../../components/PageBanner";

const TRUST_ITEMS = [
  { icon: <Clock className="w-5 h-5" />, label: "Layanan Cepat" },
  { icon: <Calendar className="w-5 h-5" />, label: "Booking Online" },
  { icon: <Users className="w-5 h-5" />, label: "Ahli Mesin" },
  { icon: <Star className="w-5 h-5" />, label: "Terpercaya" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title={
          <>
            Layanan bengkel <span className="text-brand-yellow">Bakul Oli</span>
          </>
        }
        description="Layanan Bengkel Bakul Oli mencakup perawatan lengkap untuk motor Anda. Mulai dari ganti oli, tune-up, hingga perbaikan mesin dan transmisi. Dikerjakan oleh teknisi berpengalaman untuk performa motor yang maksimal."
        height="h-[400px]"
      />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Layanan yang kami sediakan
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          <ServiceCard
            image="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-at-home-4488737-3723275.png"
            alt="Home Service"
            title="Servis di Rumah"
            description="Mekanik handal kami siap datang langsung ke lokasi Anda (Rumah/Kantor). Tidak perlu repot keluar rumah, kami yang datang kepada Anda."
            buttonLabel="Booking Sekarang"
            buttonClass="bg-brand-blue text-white hover:brightness-110"
          />
          <ServiceCard
            image="https://cdni.iconscout.com/illustration/premium/thumb/car-repair-shop-4488736-3723274.png"
            alt="Workshop"
            title="Servis di Bengkel"
            description="Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda. Nikmati fasilitas bengkel yang lengkap dan modern."
            buttonLabel="Pilih Jadwal"
            buttonClass="bg-brand-yellow text-brand-dark hover:brightness-105"
          />
        </div>

        {/* Trust Section */}
        <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-yellow opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">
                Percayakan Perawatan mesin pada bengkel{" "}
                <span className="text-brand-yellow">Bakul Oli</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Percayakan perawatan mesin kendaraan Anda pada Bengkel Bakul
                Oli. Layanan profesional dengan teknisi berpengalaman dan oli
                berkualitas untuk performa optimal.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {TRUST_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-brand-yellow/20 p-2 rounded-lg text-brand-dark">
                      {item.icon}
                    </div>
                    <span className="font-bold text-sm tracking-tight">
                      {item.label}
                    </span>
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

interface ServiceCardProps {
  image: string;
  alt: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
}

function ServiceCard({
  image,
  alt,
  title,
  description,
  buttonLabel,
  buttonClass,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
    >
      <div className="w-56 h-56 mb-8 overflow-hidden">
        <img src={image} alt={alt} className="w-full object-contain" />
      </div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 mb-10 text-sm leading-relaxed">
        {description}
      </p>
      <button
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md active:scale-95 ${buttonClass}`}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
