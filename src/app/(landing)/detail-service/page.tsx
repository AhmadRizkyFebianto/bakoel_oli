"use client";

import { motion, Variants } from "framer-motion";
import { FileText, Info, CheckCircle2 } from "lucide-react";

// =========================
// DATA
// =========================
const ORDER_DETAILS = [
  { label: "Jenis Service", value: "Service Ganti Oli" },
  { label: "Tempat Service", value: "Di Rumah (Home Service)" },
  { label: "Tanggal", value: "25 Mei 2024" },
  { label: "Waktu Pemesanan", value: "10:30 WIB" },
  {
    label: "Alamat",
    value: "Jl. Melati No. 10, RT 04/RW 02, Jakarta Selatan",
  },
  { label: "No. Telepon", value: "0812-3456-7890" },
];

const STATUS_STEPS = [
  { label: "Pesanan Diterima", sub: "10:30 WIB", done: true, active: false },
  {
    label: "Menunggu Teknisi",
    sub: "Teknisi sedang disiapkan",
    done: false,
    active: true,
  },
  { label: "Teknisi Menuju Lokasi", sub: "", done: false, active: false },
  { label: "Service Berlangsung", sub: "", done: false, active: false },
  { label: "Selesai", sub: "", done: false, active: false },
];

// =========================
// ANIMATION VARIANTS
// =========================
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.12,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};
// =========================
// STATUS STEP
// =========================
function StatusStep({
  label,
  sub,
  done,
  active,
  isLast,
}: {
  label: string;
  sub: string;
  done: boolean;
  active: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      {/* Icon + Line */}
      <div className="flex flex-col items-center">
        {/* Circle */}
        <div className="relative flex items-center justify-center shrink-0">
          {active && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="absolute w-7 h-7 rounded-full bg-brand-yellow"
            />
          )}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
              done
                ? "bg-brand-yellow border-brand-yellow"
                : active
                  ? "bg-brand-yellow border-brand-yellow"
                  : "bg-white border-gray-300"
            }`}
          >
            {done && (
              <CheckCircle2 className="w-4 h-4 text-white fill-brand-yellow stroke-white" />
            )}
            {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
          </div>
        </div>

        {/* Line */}
        {!isLast && (
          <div
            className={`w-0.5 flex-grow mt-1 mb-1 min-h-[28px] rounded-full ${
              done ? "bg-brand-yellow" : "bg-gray-200"
            }`}
          />
        )}
      </div>

      {/* Text */}
      <div className="pb-5">
        <p
          className={`text-sm font-semibold leading-tight ${
            done || active ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {label}
        </p>
        {sub && (
          <p
            className={`text-xs mt-0.5 ${done ? "text-gray-500" : "text-brand-yellow font-medium"}`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// =========================
// MAIN PAGE
// =========================
export default function AntrianPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* HERO */}
      <section className="pt-16 pb-10 px-4 text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Terima Kasih, Andi!
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Layanan Anda telah kami terima. Berikut adalah kode antrian Anda.
          </p>
        </motion.div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* CARD 1 - QUEUE NUMBER */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between"
          >
            <div className="text-center flex-grow flex flex-col items-center justify-center py-4">
              {/* Label */}
              <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4">
                Kode Antrian Anda
              </p>

              {/* Queue Number */}
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 tracking-tight leading-none mb-6"
              >
                A-012
              </motion.h2>

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                <span>Service Ganti Oli</span>
                <span className="text-gray-300">•</span>
                <span>Di Rumah (Home Service)</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-gray-900" />
              </div>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Simpan kode antrian ini untuk pengecekan status service Anda.
              </p>
            </div>
          </motion.div>

          {/* CARD 2 - ORDER DETAILS */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Detail Pesanan
            </h3>

            <div className="flex-grow space-y-4">
              {ORDER_DETAILS.map((item, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="text-sm text-gray-400 shrink-0 w-32">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                filter: "brightness(1.05)",
              }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <FileText className="w-4 h-4" />
              Lihat Detail Pesanan
            </motion.button>
          </motion.div>

          {/* CARD 3 - STATUS */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Status Service
            </h3>

            <div className="flex flex-col">
              {STATUS_STEPS.map((step, i) => (
                <StatusStep
                  key={i}
                  label={step.label}
                  sub={step.sub}
                  done={step.done}
                  active={step.active}
                  isLast={i === STATUS_STEPS.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
