"use client";
import { motion } from "framer-motion";
import { Clock, Calendar, Users, Star } from "lucide-react";
import PageBanner from "../../../components/PageBanner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BookingModal from "../../../components/BookingModal";

const TRUST_ITEMS = [
  { icon: <Clock className="w-5 h-5" />, label: "Layanan Cepat" },
  { icon: <Calendar className="w-5 h-5" />, label: "Booking Online" },
  { icon: <Users className="w-5 h-5" />, label: "Ahli Mesin" },
  { icon: <Star className="w-5 h-5" />, label: "Terpercaya" },
];

export default function Services() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState<"rumah" | "bengkel">(
    "rumah",
  );
  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setSelectedPlace("bengkel");
    setOpenModal(true);
  };
  const handleBookHome = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setSelectedPlace("rumah");
    setOpenModal(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="text-center mb-16 pt-16">
          <h2 className="text-3xl font-bold mb-4">
            Layanan yang kami sediakan
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          <ServiceCard
            image="/assets/Rumah.png"
            alt="Home Service"
            title="Servis di Rumah"
            description="Mekanik handal kami siap datang langsung ke lokasi Anda (Rumah/Kantor). Tidak perlu repot keluar rumah, kami yang datang kepada Anda."
            buttonLabel="Booking Sekarang"
            buttonClass="bg-brand-blue text-white hover:brightness-110"
            onClick={handleBookHome}
          />
          <ServiceCard
            image="/assets/Bengkel.png"
            alt="Workshop"
            title="Servis di Bengkel"
            description="Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda. Nikmati fasilitas bengkel yang lengkap dan modern."
            buttonLabel="Pilih Jadwal"
            buttonClass="bg-brand-yellow text-brand-dark hover:brightness-105"
            onClick={handleBookNow}
          />
        </div>
      </div>

      {/* Trust Section - full width, menyatu dengan footer */}
      <div className="w-full bg-brand-blue relative py-16 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-white">
            Percayakan Perawatan mesin pada bengkel{" "}
            <span className="text-brand-yellow underline">Bakul Oli</span>
          </h2>
          <p className="text-white text-lg max-w-2xl">
            Percayakan perawatan mesin kendaraan Anda pada Bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>. Layanan
            profesional dengan teknisi berpengalaman dan oli berkualitas untuk
            performa optimal.
          </p>
          <button className="bg-brand-yellow text-blue-900 font-semibold px-10 py-4 rounded-full mt-2 hover:brightness-105 transition">
            Lihat Produk Kami
          </button>
        </div>
      </div>
      <BookingModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        defaultPlace={selectedPlace}
      />
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
  onClick: () => void;
}

function ServiceCard({
  image,
  alt,
  title,
  description,
  buttonLabel,
  buttonClass,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center"
    >
      <div className="w-auto h-48 mb-6">
        <img src={image} alt={alt} className="w-96 h-48" />
      </div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 mb-10 text-sm leading-relaxed">
        {description}
      </p>
      <button
        onClick={onClick}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md active:scale-95 ${buttonClass}`}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
