import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";

export default function Daftar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmpassword, setKonfirmPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log("Logging in with:", email, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px]"
      >
        {/* Left Side - Brand Color */}
        {/* <div className="w-full md:w-1/2 bg-brand-blue flex items-center justify-center p-12">
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
        </div> */}

        {/* Right Side - Form */}
        <div className="w-full p-8 md:p-16 relative bg-white">
          <button
            onClick={() => navigate(-1)}
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
                    Jenis Mesin
                  </label>
                  <select className="w-full px-3 py-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer">
                    <option>Pilih Jenis Mesin</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-yellow text-brand-dark py-4 rounded-xl font-bold text-lg hover:brightness-105 transition-all shadow-lg mt-4 active:scale-[0.98]"
            >
              Daftar
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Sudah punya akun?{" "}
              <Link
                to="/Login"
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
