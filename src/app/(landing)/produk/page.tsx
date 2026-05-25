"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useCart } from "@/src/lib/CartContext";
import PageBanner from "../../../components/PageBanner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProductCardContent />
    </Suspense>
  );
}

function ProductCardContent() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [addedId, setAddedId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const queryJenisOli = searchParams.get("jenis_oli") || "";
  const queryPeruntukan = searchParams.get("peruntukan") || "";
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

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

  useEffect(() => {
    setSearch(querySearch);
    setCurrentPage(1);
  }, [querySearch, queryJenisOli, queryPeruntukan]);

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

  // Search + Filter Filter
  const filteredProducts = useMemo(() => {
    const searchKeyword = search.toLowerCase();
    const filterJenisOli = queryJenisOli ? queryJenisOli.toLowerCase() : "";
    const filterPeruntukan = queryPeruntukan
      ? queryPeruntukan.toLowerCase()
      : "";
    return products.filter((product) => {
      const productNama = product.nama_product?.toLowerCase() || "";
      const productJenis = product.jenis_oli?.toLowerCase() || "";
      const productPeruntukan = product.peruntukan?.toLowerCase() || "";

      // 1. Cocokkan dengan Filter Dropdown dari Halaman Home (Gunakan AND '&&')
      const matchesJenisOli = filterJenisOli
        ? productJenis.includes(filterJenisOli)
        : true;

      const matchesPeruntukan = filterPeruntukan
        ? productPeruntukan.includes(filterPeruntukan)
        : true;

      // 2. Cocokkan dengan Input Teks Search di Page Produk
      const matchesSearchText =
        !searchKeyword ||
        productNama.includes(searchKeyword) ||
        productJenis.includes(searchKeyword) ||
        productPeruntukan.includes(searchKeyword);

      // Semua kondisi wajib bernilai TRUE agar produk lolos filter
      return matchesJenisOli && matchesPeruntukan && matchesSearchText;
    });
  }, [products, search, queryJenisOli, queryPeruntukan]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Banner - full width */}
      <PageBanner
        title={
          <>
            Pilihan Produk di bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>
          </>
        }
        description="Produk perawatan Bengkel Bakul Oli dirancang untuk menjaga performa motor Anda. Mulai dari oli mesin, filter, hingga pelumas khusus, semuanya berkualitas tinggi."
        height="h-[400px]"
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Loading */}
        {/* Loading Skeleton */}
        {loading && (
          <>
            {/* Search Skeleton */}
            <div className="flex items-center gap-3 mb-14 animate-pulse">
              <div className="flex-1 h-14 bg-gray-200 rounded-full" />
              <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0" />
            </div>

            {/* Product Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center overflow-hidden animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="w-32 h-32 mb-5 bg-gray-200 rounded-2xl" />

                  {/* Title Skeleton */}
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />

                  {/* Subtitle Skeleton */}
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-5" />

                  {/* Price Skeleton */}
                  <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-6" />

                  {/* Button Skeleton */}
                  <div className="h-12 bg-gray-200 rounded-full w-full" />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-16 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />

              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-11 h-11 bg-gray-200 rounded-full"
                  />
                ))}
              </div>

              <div className="w-12 h-12 bg-gray-200 rounded-full" />
            </div>
          </>
        )}

        {/* Error */}
        {error && <div className="text-center text-red-500 py-20">{error}</div>}

        {!loading && !error && (
          <>
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
                    if (e.target.value.trim() !== "") {
                      router.replace("/produk", { scroll: false });
                    }
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
                <Link
                  key={product.id}
                  href={`/detail-produk/${product.id}`}
                  className="block"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center overflow-hidden cursor-pointer"
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
                      onClick={(e) => {
                        e.preventDefault(); // supaya tidak redirect ketika klik button
                        handleAddCart(product);
                      }}
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
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                {/* Prev */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                  disabled={currentPage === 1}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Mobile: tampilkan max 3 halaman
                      // Tablet/Desktop: tampilkan max 5 halaman
                      const delta = window.innerWidth < 640 ? 1 : 2;
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - delta &&
                          page <= currentPage + delta)
                      );
                    })
                    .reduce((acc: (number | string)[], page, index, arr) => {
                      // Tambah ellipsis jika ada gap
                      if (index > 0 && page - (arr[index - 1] as number) > 1) {
                        acc.push("...");
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center text-gray-400 text-sm"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-8 h-8 md:w-11 md:h-11 rounded-full font-semibold transition-all text-sm md:text-base ${
                            currentPage === page
                              ? "bg-gray-800 text-white scale-110"
                              : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
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
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
