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
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios"; // Pastikan axios di-import
import BookingSuccessModal from "./BookingModalSucces";
import "react-datepicker/dist/react-datepicker.css";

// --- INTERFACES ---
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService: "ganti-oli" | "ringan";
}

interface ServiceCardProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  infoList?: string[];
}

export interface UserProfile {
  username: string;
  email?: string;
  jenis_motor?: string | null;
  jenis_mesin?: string | null;
  nomor_hp?: string | null;
  alamat?: string | null;
}

export interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: {
    serviceName: string;
    placeName: string;
    tanggalFormatted: string;
  };
  profile: UserProfile;
}

// --- MAIN COMPONENT ---
export default function BookingModal({
  isOpen,
  onClose,
  defaultService,
}: BookingModalProps) {
  // State Layanan & Tempat
  const [selectedPlace, setSelectedPlace] = useState("rumah");
  const [selectedService, setSelectedService] = useState(defaultService);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // State Data Pengguna
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");

  // State Kontrol UI
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    setSelectedService(defaultService);
  }, [defaultService]);

  // --- LOGIKA MENGAMBIL DATA USER (AUTO-FILL) ---
  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get("/api/user/update", {
            withCredentials: true,
          });
          const user = res.data?.user;
          if (user) {
            setNamaLengkap(user.username || "");
            setNoHp(user.nomor_hp || "");
            if (user.alamat) setAlamat(user.alamat);
          }
        } catch (err: any) {
          // Fallback dari localStorage jika API gagal/session tidak terdeteksi langsung
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setNamaLengkap(parsedUser.username || "");
              setNoHp(parsedUser.nomor_hp || "");
              if (parsedUser.alamat) setAlamat(parsedUser.alamat);
            } catch {
              // ignore parse error
            }
          }
        }
      };

      fetchUserData();
    }
  }, [isOpen]); // Hanya dipanggil ulang saat modal dibuka

  // Hitung Progress Bar Dinamis
  const progressItems = [
    selectedService,
    selectedPlace,
    selectedDate,
    namaLengkap.trim(),
    noHp.trim(),
    ...(selectedPlace === "rumah" ? [alamat.trim()] : []), // Alamat wajib jika Home Service
  ];

  const completed = progressItems.filter(Boolean).length;
  const progress = Math.round((completed / progressItems.length) * 100);

  // Data Ringkasan untuk Modal Konfirmasi
  const summaryData = {
    serviceName:
      selectedService === "ganti-oli"
        ? "Service Ganti Oli"
        : "Service Sepeda Ringan",
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

  const userProfileData: UserProfile = {
    username: namaLengkap,
    nomor_hp: noHp,
    alamat: selectedPlace === "rumah" ? alamat : "Datang ke Bengkel",
  };

  // Handler Submit ke API
  const handleFinalSubmitBooking = async () => {
    try {
      if (
        !selectedDate ||
        !namaLengkap ||
        !noHp ||
        (selectedPlace === "rumah" && !alamat)
      ) {
        alert("Mohon lengkapi semua data wajib");
        return;
      }

      setLoading(true);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      // Set default jam 08:00:00 UTC
      const bookingDateTime = `${year}-${month}-${day}T08:00:00.000Z`;

      const payload = {
        jam: bookingDateTime,
        jenisService: selectedService,
        tempatService: selectedPlace,
        namaLengkap,
        noHp,
        alamat: selectedPlace === "rumah" ? alamat : null,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking gagal");
      }

      setSuccessData({
        ...payload,
        tanggalFormatted: summaryData.tanggalFormatted,
        serviceName: summaryData.serviceName,
        placeName: summaryData.placeName,
      });

      setShowConfirm(false);
      setShowSuccess(true);
      onClose(); // Tutup Form Utama
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. MODAL FORM UTAMA */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/60 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
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
                      style={{ width: `${progress}%` }}
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

              {/* Step 1: Service */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  1. Pilih Jenis Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(!selectedService || selectedService === "ganti-oli") && (
                    <ServiceCard
                      active={selectedService === "ganti-oli"}
                      onClick={() =>
                        setSelectedService(
                          selectedService === "ganti-oli" ? null : "ganti-oli",
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

              {/* Step 2: Place */}
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
                  />
                  <ServiceCard
                    active={selectedPlace === "bengkel"}
                    onClick={() => setSelectedPlace("bengkel")}
                    icon={<Warehouse />}
                    title="Di Bengkel"
                    subtitle="Workshop"
                  />
                </div>
              </div>

              {/* Step 3: Date */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  3. Pilih Tanggal
                </h3>
                <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14 max-w-md">
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

              {/* Step 4: Data Pengguna */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  4. Informasi Data Diri
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14">
                      <User className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        className="bg-transparent outline-none w-full text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. WhatsApp
                    </label>
                    <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        className="bg-transparent outline-none w-full text-[#0F172A]"
                      />
                    </div>
                  </div>

                  {/* Alamat (Hanya untuk Home Service) */}
                  <AnimatePresence>
                    {selectedPlace === "rumah" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat Lengkap
                          </label>
                          <div className="flex items-start gap-3 bg-[#F5F5F5] rounded-2xl p-4 min-h-[100px]">
                            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                            <textarea
                              placeholder="Masukkan alamat detail (Jalan, RT/RW, Patokan)"
                              value={alamat}
                              onChange={(e) => setAlamat(e.target.value)}
                              className="bg-transparent outline-none w-full text-[#0F172A] resize-none h-full"
                              rows={3}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer Button Form Utama */}
              <div>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={progress !== 100 || loading}
                  className={`w-full h-14 rounded-full font-bold text-lg transition-all duration-300 ${
                    progress === 100 && !loading
                      ? "bg-[#FACC15] text-[#0F172A] hover:shadow-md"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Konfirmasi Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MODAL KONFIRMASI (INTERMEDIATE) */}
      <BookingConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalSubmitBooking}
        loading={loading}
        data={summaryData}
        profile={userProfileData}
      />

      {/* 3. MODAL SUKSES (FINAL) */}
      <BookingSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        bookingData={successData}
      />
    </>
  );
}

// --- KOMPONEN BOOKING CONFIRM MODAL ---
function BookingConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  data,
  profile,
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

            {/* Kotak Ringkasan Booking */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 text-sm space-y-3">
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

            {/* Kotak Ringkasan Data Diri */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Nama:</span>
                <span className="font-semibold text-[#0F172A]">
                  {profile.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">No. WA:</span>
                <span className="font-semibold text-[#0F172A]">
                  {profile.nomor_hp}
                </span>
              </div>
              {profile.alamat && profile.alamat !== "Datang ke Bengkel" && (
                <div className="flex flex-col mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400 mb-1">Alamat Detail:</span>
                  <span className="font-semibold text-[#0F172A] leading-relaxed">
                    {profile.alamat}
                  </span>
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
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

// --- KOMPONEN SERVICE CARD ---
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
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-[24px] p-5 text-left transition-all duration-300 border-2 ${
        active
          ? "border-[#FACC15] bg-yellow-50 shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className="flex items-center justify-between gap-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? "bg-[#FACC15]" : "bg-[#F5F5F5]"}`}
          >
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-[#0F172A]">{title}</h4>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div>
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
    </motion.div>
  );
}
