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
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfPassword, setShowKonfPassword] = useState(false);
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukan Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute mt-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none select-none"
                  >
                    {showPassword ? (
                      // Ikon Mata Terbuka (Mengintip)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      // Ikon Mata Tertutup (Sembunyi)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showKonfPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password......"
                    className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    value={konfirmpassword}
                    onChange={(e) => setKonfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKonfPassword(!showKonfPassword)}
                    className="absolute mt-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none select-none"
                  >
                    {showKonfPassword ? (
                      // Ikon Mata Terbuka (Mengintip)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      // Ikon Mata Tertutup (Sembunyi)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
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
