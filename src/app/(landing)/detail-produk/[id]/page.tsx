"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/src/lib/CartContext";
import PageBanner from "../../../../components/PageBanner";
import CtaBanner from "@/src/components/CtaBanner";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  nama_product: string;
  harga: number;
  deskripsi: string;
  image_url: string;
  jenis_oli: string;
  peruntukan: string;
  kekentalan_oli: string;
  cc_motor: string;
  stok: number;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const router = useRouter();

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/produk/${id}`);
        if (!res.ok) throw new Error("Produk tidak ditemukan");
        const data = await res.json();
        console.log("=== PRODUCT DETAIL ===", data);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Produk tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!product) return;
    addToCart({
      productId: product.id,
      nama_product: product.nama_product,
      harga: product.harga,
      image_url: product.image_url,
      jenis_oli: product.jenis_oli,
      peruntukan: product.peruntukan,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageBanner
          title={
            <>
              Detail Produk <span className="text-brand-yellow">Bakul Oli</span>
            </>
          }
          description=""
          height="h-[350px]"
        />
        <div className="flex justify-center items-center py-40">
          <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Error
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageBanner
          title={
            <>
              Detail Produk <span className="text-brand-yellow">Bakul Oli</span>
            </>
          }
          description=""
          height="h-[350px]"
        />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Link
            href="/produk"
            className="bg-brand-yellow text-gray-900 font-bold px-6 py-3 rounded-full hover:brightness-105 transition"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Banner */}
      <PageBanner
        title={
          <>
            Produk Perawatan di bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>
          </>
        }
        description="Produk perawatan Bengkel Bakul Oli dirancang untuk menjaga performa motor Anda. Mulai dari oli mesin, filter, hingga pelumas khusus, semuanya berkualitas tinggi."
        height="h-[350px]"
      />

      {/* Product Detail */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors mb-10 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </Link>

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT - Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-3xl shadow-sm border border-gray-100 p-10 flex items-center justify-center min-h-[380px]"
            >
              <img
                src={product.image_url || "/placeholder.jpg"}
                alt={product.nama_product}
                className="max-h-72 object-contain drop-shadow-md"
              />
            </motion.div>

            {/* RIGHT - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Name & Price */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                  {product.nama_product}
                </h1>
                <span className="text-xl font-extrabold text-blue-700 whitespace-nowrap">
                  Rp. {product.harga.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {product.deskripsi}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Specs */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Spesifikasi Produk
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Jenis Motor", value: product.peruntukan },
                    { label: "Tipe Oli", value: product.jenis_oli },
                    { label: "Jenis Oli", value: product.kekentalan_oli },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <span className="w-40 text-gray-400">{spec.label}</span>
                      <span className="text-gray-400 mr-4">:</span>
                      <span className="text-gray-700 font-medium">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.a
                  href="https://wa.me/6288991520696"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 bg-blue-700 text-white font-bold px-6 py-3 rounded-full hover:brightness-110 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tanyakan Produk ini
                </motion.a>

                <motion.button
                  onClick={(e) => {
                    e.preventDefault(); // supaya tidak redirect ketika klik button
                    handleAddToCart();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-full transition-all shadow-md ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-brand-yellow text-gray-900 hover:brightness-105"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? "✓ Ditambahkan" : "+ Keranjang"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaBanner />
    </div>
  );
}
