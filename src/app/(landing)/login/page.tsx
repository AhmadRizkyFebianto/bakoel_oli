"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          // cookie token di-set oleh server (httpOnly), jadi kita tidak perlu baca token-nya di client
          withCredentials: true,
        },
      );

      if (res.status >= 200 && res.status < 300) {
        const role = res.data?.role;
        const username = res.data?.user?.username;

        localStorage.setItem("isLoggedIn", "true");

        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            username,
            role,
          }),
        );

        window.dispatchEvent(new Event("storage"));

        // Redirect berdasarkan role
        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal login. Silakan coba lagi.";
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
        {/* Left Side - Brand Color */}
        <div className="w-full md:w-1/2 bg-brand-blue flex items-center justify-center p-12">
          <div className="text-white text-center">
            <div className="bg-white/10 p-6 rounded-full inline-block mb-6 backdrop-blur-sm">
              <Lock className="w-16 h-16 text-brand-yellow" />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Bengkel Profesional
            </h2>
            <p className="text-blue-100 opacity-80">
              Pelayanan terbaik untuk mesin kendaraan Anda dimulai dari sini.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 relative bg-white">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 leading-tight">
              Selamat Datang di Bengkel{" "}
              <span className="text-brand-yellow">Bakul Oli</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
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

            <div>
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
              {isLoading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="text-brand-yellow font-bold hover:underline"
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
