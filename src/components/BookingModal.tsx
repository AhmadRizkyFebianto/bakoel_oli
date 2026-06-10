"use client";

import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";

import {
  X,
  Wrench,
  Droplets,
  CalendarDays,
  House,
  Warehouse,
  Info,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";

import BookingSuccessModal from "./BookingModalSucces";

import "react-datepicker/dist/react-datepicker.css";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService: "oli" | "ringan";
}

interface ServiceCardProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  infoList?: string[];
}

const TIMES = ["08:00", "10:00", "13:00", "15:00"];

const MAX_SLOT = 2;

export default function BookingModal({
  isOpen,
  onClose,
  defaultService,
}: BookingModalProps) {
  const [selectedPlace, setSelectedPlace] = useState("rumah");

  const [selectedService, setSelectedService] = useState(defaultService);

  const [selectedTime, setSelectedTime] = useState("09:00");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [successData, setSuccessData] = useState<any>(null);

  const [bookings, setBookings] = useState<any[]>([]);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setSelectedService(defaultService);
  }, [defaultService]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/booking");

        const data = await response.json();

        setBookings(data.bookings || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const progressItems = [
    selectedService,
    selectedPlace,
    selectedDate,
    // selectedTime,
  ];

  const completed = progressItems.filter(Boolean).length;

  const progress = Math.round((completed / progressItems.length) * 100);

  const summaryData = {
    serviceName:
      selectedService === "oli" ? "Service Ganti Oli" : "Service Sepeda Ringan",
    placeName:
      selectedPlace === "rumah"
        ? "Home Service (Di Rumah)"
        : "Workshop (Di Bengkel)",
    tanggalFormatted: selectedDate
      ? selectedDate.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
  };

  // const getRemainingSlot = (time: string) => {
  //   if (!selectedDate) return MAX_SLOT;

  //   const selectedDay = `${selectedDate.getFullYear()}-${String(
  //     selectedDate.getMonth() + 1,
  //   ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  //   const currentBookings = bookings.filter((booking) => {
  //     const bookingDate = new Date(booking.jam);

  //     const bookingDay = bookingDate.toISOString().split("T")[0];

  //     const bookingTime = bookingDate.toTimeString().slice(0, 5);

  //     return bookingDay === selectedDay && bookingTime === time;
  //   });

  //   const usedSlot = currentBookings.length;

  //   return MAX_SLOT - usedSlot;
  // };

  const handleFinalSubmitBooking = async () => {
    try {
      if (!selectedDate) {
        alert("Tanggal wajib dipilih");

        return;
      }

      setLoading(true);

      const year = selectedDate.getFullYear();

      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

      const day = String(selectedDate.getDate()).padStart(2, "0");

      const bookingDateTime = `${year}-${month}-${day}T08:00:00.000Z`;

      const payload = {
        jam: bookingDateTime,
        jenisService: selectedService,
        tempatService: selectedPlace,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking gagal");
      }

      setSuccessData({
        ...payload,
        tanggalFormatted: selectedDate.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        // jamFormatted dihapus karena sudah tidak ada
        serviceName:
          selectedService === "oli"
            ? "Service Ganti Oli"
            : "Service Sepeda Ringan",
        placeName:
          selectedPlace === "rumah"
            ? "Home Service (Di Rumah)"
            : "Workshop (Di Bengkel)",
      });

      setShowSuccess(true);

      onClose();
    } catch (error: any) {
      console.error(error);

      alert(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/60 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="w-full">
                  <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                    Booking Service
                  </h2>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {progress}% Progres Booking
                    </span>

                    <span className="text-sm font-semibold text-gray-500">
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FACC15] transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="ml-6 p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-[#0F172A]" />
                </button>
              </div>

              {/* Service */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  1. Pilih Jenis Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(!selectedService || selectedService === "oli") && (
                    <ServiceCard
                      active={selectedService === "oli"}
                      onClick={() =>
                        // Jika sudah aktif dan diklik lagi, maka batalkan pilihan (set ke null/kosong)
                        setSelectedService(
                          selectedService === "oli" ? null : "oli",
                        )
                      }
                      icon={<Droplets />}
                      title="Service Ganti Oli"
                    />
                  )}

                  {(!selectedService || selectedService === "ringan") && (
                    <ServiceCard
                      active={selectedService === "ringan"}
                      onClick={() =>
                        // Jika sudah aktif dan diklik lagi, maka batalkan pilihan (set ke null/kosong)
                        setSelectedService(
                          selectedService === "ringan" ? null : "ringan",
                        )
                      }
                      icon={<Wrench />}
                      title="Service Sepeda Ringan"
                    />
                  )}
                </div>
              </div>

              {/* Place */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  2. Pilih Tempat Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ServiceCard
                    active={selectedPlace === "rumah"}
                    onClick={() => setSelectedPlace("rumah")}
                    icon={<House />}
                    title="Di Rumah"
                    subtitle="Home Service"
                    infoList={[
                      "Teknisi datang ke lokasi Anda",
                      "Ganti oli & service ringan",
                      "Pemeriksaan menyeluruh",
                      "Konsultasi langsung",
                      "Tidak perlu antre",
                      "Hemat waktu & tenaga",
                    ]}
                  />

                  <ServiceCard
                    active={selectedPlace === "bengkel"}
                    onClick={() => setSelectedPlace("bengkel")}
                    icon={<Warehouse />}
                    title="Di Bengkel"
                    subtitle="Workshop"
                    infoList={[
                      "Semua layanan service standar",
                      "Peralatan service lengkap",
                      "Pemeriksaan lebih detail",
                      "Sparepart lebih lengkap",
                      "Penanganan kerusakan kompleks",
                      "Area tunggu nyaman",
                    ]}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Date */}
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                    3. Pilih Tanggal
                  </h3>

                  <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14">
                    <CalendarDays className="w-5 h-5 text-gray-500" />

                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat="dd MMMM yyyy"
                      placeholderText="Pilih tanggal booking"
                      className="bg-transparent outline-none w-full text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Time */}
                {/* <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                    4. Pilih Jam
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {TIMES.map((time) => {
                      const remainingSlot = getRemainingSlot(time);

                      const isFull = remainingSlot <= 0;

                      return (
                        <button
                          key={time}
                          disabled={isFull}
                          onClick={() => setSelectedTime(time)}
                          className={`h-16 rounded-2xl font-semibold transition-all duration-300 border flex flex-col items-center justify-center ${
                            isFull
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : selectedTime === time
                                ? "bg-[#FACC15] text-[#0F172A] border-[#FACC15]"
                                : "bg-white border-gray-200 text-[#0F172A]"
                          }`}
                        >
                          <span>{time}</span>

                          <span className="text-xs mt-1">
                            {isFull
                              ? "Slot Habis"
                              : `Sisa ${remainingSlot} Slot`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div> */}
              </div>

              {/* Footer */}
              <div>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={progress !== 100 || loading}
                  className={`w-full h-14 rounded-full font-bold text-lg transition-all duration-300 ${
                    progress === 100 && !loading
                      ? "bg-[#FACC15] text-[#0F172A]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Memproses..." : "Lanjutkan"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Layanan profesional langsung ke rumah Anda
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalSubmitBooking}
        loading={loading}
        data={summaryData}
      />

      <BookingSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        bookingData={successData}
      />
    </>
  );
}

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: {
    serviceName: string;
    placeName: string;
    tanggalFormatted: string;
  };
}

function BookingConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  data,
}: BookingConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className="bg-white rounded-[28px] w-full max-w-md p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Periksa Kembali Jadwal Anda
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Apakah data pesanan di bawah ini sudah sesuai?
              </p>
            </div>

            {/* Kotak Ringkasan */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Layanan:</span>
                <span className="font-semibold text-[#0F172A]">
                  {data.serviceName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lokasi:</span>
                <span className="font-semibold text-[#0F172A]">
                  {data.placeName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tanggal:</span>
                <span className="font-semibold text-[#0F172A]">
                  {data.tanggalFormatted}
                </span>
              </div>
            </div>

            {/* Tombol Pilihan */}
            <div className="flex flex-col gap-2">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full h-12 bg-[#0F172A] text-white rounded-xl font-bold transition-colors hover:bg-black disabled:bg-gray-400"
              >
                {loading ? "Mengirim Pesanan..." : "Ya, Konfirmasi Booking"}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                Periksa Kembali
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ServiceCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  infoList,
}: ServiceCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah card utama ikut ter-klik/aktif
    setShowInfo(!showInfo);
  };

  return (
    <motion.button
      whileHover={{
        y: -4,
      }}
      onClick={onClick}
      className={`rounded-[24px] p-5 text-left transition-all duration-300 border-2 ${
        active
          ? "border-[#FACC15] bg-yellow-50 shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              active ? "bg-[#FACC15]" : "bg-[#F5F5F5]"
            }`}
          >
            {icon}
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A]">{title}</h4>

            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="">
          {infoList && infoList.length > 0 && (
            <button
              onClick={toggleInfo}
              className={`p-1.5 rounded-full transition-colors ${
                showInfo
                  ? "bg-[#0F172A] text-white"
                  : "bg-[#FACC15] hover:bg-[#e6c12d] text-black"
              }`}
              title="Lihat Detail Layanan"
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {showInfo && infoList && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-200/60 pt-4 w-full"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Layanan yang didapat:
            </p>
            <ul className="space-y-1.5">
              {infoList.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="text-[#FACC15] font-bold text-xs mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
