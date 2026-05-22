"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useCart } from "@/src/lib/CartContext";

import { motion, AnimatePresence } from "framer-motion";

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

export default function ProductCard() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/produk");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

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

  // Search Filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.nama_product.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error
  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <section className="w-full py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Pilihan Produk di bengkel{" "}
            <span className="text-yellow-500">Bakul Oli</span>
          </h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-14">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ketik produk yang anda butuhkan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-gray-200 rounded-full px-6 py-4 outline-none shadow-sm focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-md hover:scale-105 transition-all">
            <Search className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Empty State */}
        {currentProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Produk tidak ditemukan
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{
                y: -8,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
              }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Product Image */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
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
                whileTap={{
                  scale: 0.92,
                }}
                whileHover={{
                  scale: 1.03,
                }}
                animate={
                  addedId === product.id
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.4,
                }}
                className={`mt-6 px-8 py-3 rounded-full font-bold w-full transition-all duration-300 ${
                  addedId === product.id
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-black hover:brightness-105"
                }`}
                onClick={() => {
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
                  // console.log("Produk ditambahkan:", product);
                }}
              >
                <AnimatePresence mode="wait">
                  {addedId === product.id ? (
                    <motion.span
                      key="success"
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      ✓ Ditambahkan
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      Tambah Keranjang
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            {/* Prev */}
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))
              }
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-11 h-11 rounded-full font-semibold transition-all ${
                      currentPage === page
                        ? "bg-gray-800 text-white scale-110"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : totalPages,
                )
              }
              className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
