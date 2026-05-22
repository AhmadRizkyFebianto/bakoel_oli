"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import PageBanner from "../../../components/PageBanner";

const CONTACT_ITEMS = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Alamat Kantor",
    content: (
      <p className="text-gray-500 text-sm leading-relaxed">
        Jl.Sidotopo wetan 2/87,
        <br />
        Surabaya, Jawa Timur, 60128
      </p>
    ),
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Telepon & WhatsApp",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">+62 889-9152-0696</p>
        <a
          href="https://wa.me/6288991520696"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:text-gray-900"
        >
          <Phone className="w-4 h-4" />
          Hubungi via WhatsApp
        </a>
      </div>
    ),
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    title: "Instagram Resmi",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">@bakoel_oli_surabaya</p>

        <a
          href="https://www.instagram.com/bakoel_oli_surabaya?igsh=MXBpOGNwNmZoMDA4cQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:text-gray-900"
        >
          <Instagram className="h-4 w-4" />
          Kunjungi Instagram
        </a>
      </div>
    ),
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Jam Operasional",
    content: (
      <div className="text-gray-500 text-sm space-y-1">
        <p>Senin - Sabtu: 08:00 - 17:00 WIB</p>
        <p>Minggu & Hari Libur: Tutup</p>
      </div>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <PageBanner
        title={
          <>
            <span className="text-brand-yellow">Hubungi</span> Kami
          </>
        }
        description="Kami siap membantu kebutuhan perawatan kendaraan Anda dengan layanan profesional dan respons cepat. Hubungi tim Bakul Oli melalui WhatsApp, telepon, atau email untuk konsultasi dan informasi lebih lanjut."
        height="h-[400px]"
      />

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT - Contact Cards */}
            <div className="space-y-4">
              {CONTACT_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-full bg-brand-yellow flex items-center justify-center shrink-0 text-gray-900">
                    {item.icon}
                  </div>
                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT - Map Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
            >
              {/* MAP */}
              <div className="relative w-full h-[420px]">
                <iframe
                  src="https://maps.google.com/maps?q=-7.2255,112.7667&z=17&output=embed"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0"
                />
              </div>

              {/* INFO FOOTER */}
              <div className="p-6 bg-white space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bakoel Oli Surabaya
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    Jl. Sidotopo Wetan 2/87,
                    <br />
                    Surabaya, Jawa Timur, 60128
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps?q=-7.2255,112.7667"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-yellow text-gray-900 font-semibold px-5 py-3 rounded-xl hover:brightness-105 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  Buka di Google Maps
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-24 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-4xl font-bold text-white">
            Punya Pertanyaan Lain?
          </h2>
          <p className="text-gray-400 text-lg">
            Lihat daftar pertanyaan yang sering diajukan untuk mendapatkan
            jawaban cepat tentang layanan kami.
          </p>
          <motion.button
            whileHover={{
              scale: 1.02,
              filter: "brightness(1.1)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-brand-yellow text-gray-900 font-bold px-8 py-4 rounded-full hover:brightness-105 transition-all"
          >
            Buka Pusat Bantuan <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}