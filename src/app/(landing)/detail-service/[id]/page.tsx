"use client";

import { motion, Variants } from "framer-motion";
import { FileText, Info, CheckCircle2, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type BookingStatus =
  | "Menunggu"
  | "Menunggu Teknisi"
  | "Working"
  | "Selesai"
  | "Batal";

type BookingDetail = {
  id: string;
  kodeAntrian: string | null;
  jenisService: string;
  tempatService: string;
  jam: string | Date;
  status: BookingStatus;
  user: {
    id: string;
    username: string;
    email?: string | null;
    nomor_hp: string | null;
    alamat: string | null;
    jenis_motor?: string | null;
    jenis_mesin?: string | null;
  };
  worker?: unknown;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
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
      <div className="flex flex-col items-center">
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

        {!isLast && (
          <div
            className={`w-0.5 flex-grow mt-1 mb-1 min-h-[28px] rounded-full ${
              done ? "bg-brand-yellow" : "bg-gray-200"
            }`}
          />
        )}
      </div>

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
            className={`text-xs mt-0.5 ${
              done ? "text-gray-500" : "text-brand-yellow font-medium"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function formatJamToWIB(jam: string | Date) {
  const d = typeof jam === "string" ? new Date(jam) : jam;
  // WIB = UTC+7
  const base = d.getTime();
  const wib = new Date(base + 7 * 60 * 60 * 1000);

  return {
    date: wib.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: wib.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

function getStatusSteps(status: BookingStatus) {
  // Urutan UI: Pesanan Diterima -> Menunggu Teknisi -> Teknisi Menuju Lokasi -> Service Berlangsung -> Selesai
  // Mapping ke status backend:
  // - Menunggu: aktif di "Menunggu Teknisi" (karena masih nunggu)
  // - Menunggu Teknisi: done "Pesanan Diterima", active "Menunggu Teknisi"
  // - Working: done sampai "Menunggu Teknisi" dan aktif "Service Berlangsung" (kita anggap "Teknisi menuju lokasi" dilewati)
  // - Selesai: done semua sampai Selesai
  // - Batal: aktif tidak ditangani khusus; kita tampilkan seluruh langkah tidak done kecuali "Pesanan Diterima".
  const steps = [
    {
      label: "Pesanan Diterima",
      sub: "",
      done: false,
      active: false,
    },
    {
      label: "Service Dilakukan",
      sub: "Teknisi sedang mengerjakan",
      done: false,
      active: false,
    },
    { label: "Service Berlangsung", sub: "", done: false, active: false },

    { label: "Selesai", sub: "", done: false, active: false },
  ];

  if (status === "Menunggu") {
    steps[0].done = true;
    steps[1].active = true;
  } else if (status === "Menunggu Teknisi") {
    steps[0].done = true;
    steps[1].active = true;
  } else if (status === "Working") {
    steps[0].done = true;
    steps[1].done = true;
    steps[2].active = true;
  } else if (status === "Selesai") {
    steps.forEach((s) => (s.done = true));
  } else if (status === "Batal") {
    steps[0].done = true;
    // lainnya tetap tidak done/active
  }

  return steps;
}

export default function DetailServicePage() {
  const params = useParams<{ id: string }>();
  const bookingId = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/booking/${bookingId}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Gagal memuat detail booking");
        if (!cancelled) setBooking(data.booking as BookingDetail);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Gagal memuat detail booking");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const formatted = useMemo(() => {
    if (!booking) return null;
    return formatJamToWIB(booking.jam);
  }, [booking]);

  // useMemo statusSteps — hapus argument formatted?.time
  const statusSteps = useMemo(() => {
    if (!booking) return [] as any[];

    if (booking.tempatService === "bengkel") {
      const steps = getStatusSteps(booking.status); // ← tanpa jam
      return steps.filter((_, idx) => idx !== 2);
    }

    return getStatusSteps(booking.status); // ← tanpa jam
  }, [booking]);

  const orderDetails = useMemo(() => {
    if (!booking || !formatted) return [] as { label: string; value: string }[];

    const serviceLabel =
      booking.jenisService === "ganti-oli"
        ? "Service Ganti Oli"
        : "Service Sepeda Ringan";
    const placeLabel =
      booking.tempatService === "rumah"
        ? "Di Rumah (Home Service)"
        : "Di Bengkel";

    return [
      { label: "Jenis Service", value: serviceLabel },
      { label: "Tempat Service", value: placeLabel },
      { label: "Tanggal", value: formatted.date },
      {
        label: "Alamat",
        value:
          booking.tempatService === "rumah"
            ? booking.user?.alamat || "-"
            : "Datang ke Bengkel",
      },
      { label: "No. Telepon", value: booking.user?.nomor_hp || "-" },
    ];
  }, [booking, formatted]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-gray-600">Memuat detail booking...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Gagal memuat booking
          </h1>
          <p className="text-gray-600">{error || "Booking tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const queueCode = booking.kodeAntrian || booking.id;
  const queueSubtitle =
    booking.tempatService === "rumah"
      ? "Di Rumah (Home Service)"
      : "Di Bengkel";

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <section className="pt-16 pb-10 px-4 text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Terima Kasih!
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Layanan Anda telah kami terima. Berikut adalah kode antrian Anda.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 place-items-center">
          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between h-full"
          >
            <div className="text-center flex-grow flex flex-col items-center justify-center py-4">
              <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4">
                Kode Antrian Anda
              </p>
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 tracking-tight leading-none mb-6"
              >
                {queueCode}
              </motion.h2>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                <span>
                  {booking.jenisService === "ganti-oli"
                    ? "Service Ganti Oli"
                    : "Service Sepeda Ringan"}
                </span>
                <span className="text-gray-300">•</span>
                <span>{queueSubtitle}</span>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-gray-900" />
              </div>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Simpan kode antrian ini untuk pengecekan status service Anda.
              </p>
            </div>
          </motion.div>

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
              {orderDetails.map((item, i) => (
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

            <motion.div
              className="mt-8 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <Clock3 className="w-4 h-4" />
              Jadwal Anda
            </motion.div>
          </motion.div>

          {(booking.tempatService === "rumah" ||
            booking.tempatService === "bengkel") && (
            <motion.div
              custom={3}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px rgba(0,0,0,0.10)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Status Service
              </h3>

              <div className="flex flex-col">
                {statusSteps.map((step: any, i: number) => (
                  <StatusStep
                    key={i}
                    label={step.label}
                    sub={step.sub}
                    done={step.done}
                    active={step.active}
                    isLast={i === statusSteps.length - 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
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
    </div>
  );
}
