"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Daftar() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmpassword, setKonfirmPassword] = useState("");
  const [jenisMotor, setJenisMotor] = useState("");
  const [jenisMesin, setJenisMesin] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    if (password !== konfirmpassword) {
      setErrorMessage("Konfirmasi password tidak sesuai.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/register",
        {
          username,
          email,
          password,
          jenis_motor: jenisMotor,
          jenis_mesin: jenisMesin,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status >= 200 && res.status < 300) {
        router.push("/login");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal daftar. Silakan coba lagi.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px]"
      >
        <div className="w-full p-8 md:p-16 relative bg-white">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 leading-tight">
              Daftarkan akun anda di{" "}
              <span className="text-brand-yellow">Bakul Oli</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Username */}
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Masukan Username......"
                  className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukan Email......"
                  className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Masukan Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Konfirmasi Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={konfirmpassword}
                    onChange={(e) => setKonfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Jenis Motor
                  </label>
                  <select
                    value={jenisMotor}
                    onChange={(e) => setJenisMotor(e.target.value)}
                    className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Pilih Jenis Motor
                    </option>
                    <option value="motor matic">Motor Matic</option>
                    <option value="motor matic premium">
                      Motor Matic Premium
                    </option>
                    <option value="motor sport">Motor Sport</option>
                    <option value="motor sport premium">
                      Motor Sport Premium
                    </option>
                    <option value="motor bebek">Motor Bebek</option>
                    <option value="motor bebek lama">Motor Bebek Lama</option>
                    <option value="motor 2 tak">Motor 2 Tak</option>
                    <option value="motor harian">Motor Harian</option>
                  </select>
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Merk Motor
                  </label>
                  <select
                    value={jenisMesin}
                    onChange={(e) => setJenisMesin(e.target.value)}
                    className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Pilih Merk Motor
                    </option>
                    <option value="honda">Honda</option>
                    <option value="yamaha">Yamaha</option>
                    <option value="suzuki">Suzuki</option>
                    <option value="kawasaki">Kawasaki</option>
                  </select>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="text-sm text-red-600 font-semibold">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-yellow text-brand-dark py-4 rounded-xl font-bold text-lg hover:brightness-105 transition-all shadow-lg mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Daftar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-brand-yellow font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
