"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Settings,
  Zap,
  Users,
  Wrench,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/src/lib/CartContext";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-brand-dark" />,
    title: "Harga Terjangkau",
    desc: "Dengan harga yang bersaing dan transparan, Bengkel Bakul Oli memberikan layanan terbaik tanpa membebani anggaran Anda.",
  },
  {
    icon: <Settings className="w-6 h-6 text-brand-dark" />,
    title: "Layanan Cepat & Efisien",
    desc: "Kami memahami betapa berharganya waktu Anda, oleh karena itu kami menjamin proses perawatan yang cepat dan efisien.",
  },
  {
    icon: <Wrench className="w-6 h-6 text-brand-dark" />,
    title: "Teknologi Canggih",
    desc: "Bengkel kami dilengkapi dengan teknologi terbaru untuk melakukan diagnosa dan perawatan, memastikan kendaraan Anda mendapatkan solusi terbaik.",
  },
  {
    icon: <Users className="w-6 h-6 text-brand-dark" />,
    title: "Layanan Profesional",
    desc: "Tim layanan pelanggan kami siap membantu dan memberikan saran terbaik sesuai kebutuhan kendaraan Anda.",
  },
];

interface Product {
  id: string;
  nama_product: string;
  jenis_oli: string;
  peruntukan: string;
  cc_motor: string;
  kekentalan_oli: string;
  harga: number;
  stok: number;
  deskripsi: string;
  image_url: string;
  createdAt: string;
}

interface ApiResponse {
  produk: Product[];
}

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
      <SeeProductSection />
      <ServiceSelectionSection />
      <FaqSection />
    </div>
  );
}

function HeroSection() {
  const [jenisOli, setJenisOli] = useState("");
  const [jenisMesin, setJenisMesin] = useState("");

  return (
    <section className="relative h-[800px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/headerBG.png"
          alt="Garage background"
          className="w-full h-full object-cover brightness-[0.4]"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white max-w-2xl"
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            BAKUL OLI <br />
            <span className="text-white font-extrabold">
              Pelumas Andal,{" "}
              <span className="text-brand-yellow">Bengkel Siap Melayani</span>
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Bengkel ini menawarkan kualitas oli sekaligus layanan yang siap
            membantu kendaraan anda dan menawarkan perawatan mesin secara
            menyeluruh.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="https://www.google.com/maps?q=-7.2255,112.7667"
              className="w-[230px] bg-brand-yellow text-brand-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              Lihat Lokasi Kami <ChevronRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 text-white">
              <div>
                <span className="block text-4xl font-black">100%</span>
                <span className="text-xs text-gray-400">
                  Produk yang ada pada bengkel Original
                </span>
              </div>
              <div className="w-px h-10 bg-gray-600" />
              <div>
                <span className="block text-4xl font-black">10+</span>
                <span className="text-xs text-gray-400">
                  Jenis produk perawatan mesin
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md hidden lg:block"
        >
          <h3 className="text-xl font-bold text-center mb-6">
            Temukan Oli Pilihanmu
          </h3>
          <div className="flex justify-center mb-6">
            <img
              src="/assets/HeroOli.png"
              alt="Oil"
              className="h-48 object-contain"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Jenis Oli
              </label>
              <select
                value={jenisOli}
                onChange={(e) => setJenisOli(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>
                  Pilih Jenis Oli
                </option>
                <option value="mesin">Mesin</option>
                <option value="gardan">Gardan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Jenis Motor
              </label>
              <select
                value={jenisMesin}
                onChange={(e) => setJenisMesin(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>
                  Pilih Jenis Motor
                </option>
                <option value="motor matic">Motor Matic</option>
                <option value="motor matic premium">Motor Matic Premium</option>
                <option value="motor sport">Motor Sport</option>
                <option value="motor sport premium">Motor Sport Premium</option>
                <option value="motor bebek">Motor Bebek</option>
                <option value="motor bebek lama">Motor Bebek Lama</option>
                <option value="motor 2 tak">Motor 2 Tak</option>
                <option value="motor harian">Motor Harian</option>
              </select>
            </div>
            <button className="w-full bg-brand-yellow py-3 rounded-lg font-bold mt-4 hover:brightness-105 transition-all">
              Cari
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Kenapa harus di bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Bengkel Bakul Oli hadir dengan layanan cepat, profesional, dan
            terpercaya. Harga bersahabat serta teknisi ahli menjaga performa
            kendaraan Anda tetap optimal.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                {f.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const router = useRouter();
  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/produk");
        if (!response.ok) throw new Error("Gagal mengambil data produk");
        const data: ApiResponse = await response.json();
        setProducts(data.produk);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddCart = (product: Product) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    addToCart({
      productId: product.id,
      nama_product: product.nama_product,
      harga: product.harga,
      image_url: product.image_url,
      jenis_oli: product.jenis_oli,
      peruntukan: product.peruntukan,
      qty: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Pilihan Produk di bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Bengkel Bakul Oli menyediakan berbagai produk berkualitas untuk
            kendaraan Anda, Semua produk terjamin keasliannya, menjaga performa
            dan umur mesin tetap optimal.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-20">{error}</div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {products.slice(0, 6).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 mb-5 flex items-center justify-center"
                  >
                    <img
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.nama_product}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                    {product.nama_product}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 mt-2">
                    Untuk Motor {product.peruntukan}
                  </p>

                  {/* Price */}
                  <div className="mt-4 text-3xl font-extrabold text-blue-700">
                    Rp. {(product.harga ?? 0).toLocaleString("id-ID")}
                  </div>

                  {/* Add To Cart */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.03 }}
                    animate={
                      addedId === product.id ? { scale: [1, 1.1, 1] } : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`mt-6 px-8 py-3 rounded-full font-bold w-full transition-all duration-300 ${
                      addedId === product.id
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black hover:brightness-105"
                    }`}
                    onClick={() => handleAddCart(product)}
                  >
                    <AnimatePresence mode="wait">
                      {addedId === product.id ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          ✓ Ditambahkan
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Tambah Keranjang
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between my-12">
          <div className="w-[25px] h-[25px]" />
          <Link
            href="/produk"
            className="text-brand-dark font-semibold hover:text-brand-yellow flex items-center gap-1 group"
          >
            Lihat Selengkapnya{" "}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SeeProductSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/FrameBG.png"
          alt="Frame background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-white -z-10"></div> */}

      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight">
            Percayakan Perawatan mesin pada bengkel{" "}
            <span className="text-brand-yellow italic underline">
              Bakul Oli
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Percayakan perawatan mesin kendaraan Anda pada Bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>. Layanan
            profesional dengan teknisi berpengalaman dan oli berkualitas untuk
            performa optimal.
          </p>
          <Link
            href="/produk"
            className="bg-brand-yellow hover:bg-primary-dark text-black font-bold px-10 py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-primary/30 uppercase tracking-wide"
          >
            Lihat Produk Kami
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceSelectionSection() {
  return (
    <section className="py-20 bg-blue-50/30">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Layanan yang kami sediakan</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Kami menyediakan layanan perawatan mesin kendaraan, penggantian oli,
          dan perbaikan komponen dengan teknisi berpengalaman dan peralatan
          canggih untuk menjaga performa optimal kendaraan Anda.
        </p>
      </div>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="w-auto h-48 mb-6">
            <img
              src="/assets/Rumah.png"
              alt="Home service"
              className="w-96 h-48"
            />
          </div>
          <h3 className="text-2xl font-bold mb-3">Servis di Rumah</h3>
          <p className="text-gray-500 mb-8 text-sm">
            Mekanik handal kami siap datang langsung ke lokasi Anda
            (Rumah/Kantor).
          </p>
          <button className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Booking Sekarang
          </button>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="w-auto h-48 mb-6">
            <img
              src="/assets/Bengkel.png"
              alt="Workshop service"
              className="w-96 h-48"
            />
          </div>
          <h3 className="text-2xl font-bold mb-3">Servis di Bengkel</h3>
          <p className="text-gray-500 mb-8 text-sm">
            Pesan antrean di bengkel rekanan kami dan hemat waktu tunggu Anda.
          </p>
          <button className="w-full bg-brand-yellow text-brand-dark py-3 rounded-xl font-bold hover:brightness-105 transition-all">
            Pilih Jadwal
          </button>
        </div>
      </div>
    </section>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Apa tanda-tanda mesin motor membutuhkan servis?",
    answer:
      "Tanda-tanda meliputi suara mesin kasar, penurunan performa, konsumsi bahan bakar meningkat, atau lampu indikator mesin menyala.",
  },
  {
    question: "Kapan oli mesin harus diganti?",
    answer:
      "Umumnya disarankan setiap 2.000 - 3.000 km atau sesuai rekomendasi pabrikan kendaraan Anda.",
  },
  {
    question: "Mengapa mesin sering brebet atau susah hidup?",
    answer:
      "Penyebabnya bisa beragam, mulai dari busi kotor, filter udara tersumbat, hingga masalah pada sistem bahan bakar.",
  },
  {
    question: "Mesin panas cepat, apakah berbahaya?",
    answer:
      "Ya, overheat dapat merusak komponen mesin secara permanen. Pastikan sistem pendingin dan pelumasan berfungsi dengan baik.",
  },
  {
    question: "Bagaimana cara menjaga mesin motor tetap awet?",
    answer:
      "Servis rutin, penggantian oli teratur, penggunaan bahan bakar berkualitas, dan tidak memaksa mesin secara berlebihan adalah kuncinya.",
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left group"
          >
            <span
              className={`font-semibold ${openIndex === index ? "text-primary-dark" : "text-gray-900"} transition-colors`}
            >
              {faq.question}
            </span>
            <div
              className={`p-1 rounded-full transition-all ${openIndex === index ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
            >
              {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
            </div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

function FaqSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/FrameBG.png"
          alt="Frame background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="inline-block border-2 border-[#1A55A8] text-[#1A55A8] font-display font-bold px-4 py-1.5 rounded-full mb-6">
            FAQs
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-[#1A55A8] leading-tight italic">
            FAQ:{" "}
            <span className="text-[#202835] not-italic">
              Pertanyaan seputar perawatan motor
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Dapatkan solusi terkait pertanyaan seputar masalah ringan motor
            seperti starter motor, akselerasi lemot, dan knalpot berasap.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Decorative background elements could go here */}
          </div>
        </div>

        <FAQAccordion />
      </div>
    </section>
  );
}
