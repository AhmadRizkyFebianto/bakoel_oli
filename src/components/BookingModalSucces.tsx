"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CalendarDays, Clock3 } from "lucide-react";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    jenisService: string;
    tempatService: string;
  } | null;
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  bookingData,
}: BookingSuccessModalProps) {
  if (!bookingData) return null;

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-[#FACC15]" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
                Booking Berhasil!
              </h2>

              <p className="text-gray-500 leading-relaxed">
                Booking service Anda berhasil dibuat. Tim Bakul Oli akan segera
                menghubungi Anda.
              </p>
            </div>

            {/* Booking Detail */}
            <div className="bg-[#F5F5F5] rounded-[24px] p-5 space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Jenis Service</span>

                <span className="font-semibold text-[#0F172A] capitalize">
                  {bookingData.jenisService.replace("-", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tempat</span>

                <span className="font-semibold text-[#0F172A] capitalize">
                  {bookingData.tempatService}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays className="w-4 h-4" />
                  Tanggal
                </div>

                <span className="font-semibold text-[#0F172A]">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className="w-full h-14 rounded-full bg-[#FACC15] text-[#0F172A] font-bold text-lg hover:brightness-105 transition-all duration-300 active:scale-[0.98]"
            >
              Selesai
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
