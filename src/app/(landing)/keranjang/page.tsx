"use client";

import { useState, useEffect } from "react";
import { Trash2, Check, UserCircle, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/src/lib/CartContext";
import { useRouter } from "next/navigation";

// =========================
// PROFILE MODAL
// =========================
function ProfileIncompleteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-10"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lengkapi Profil Anda
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed">
            Sebelum melanjutkan pembayaran, pastikan alamat dan nomor telepon
            Anda sudah lengkap.
          </p>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/profile")}
          className="w-full flex items-center justify-center gap-2 bg-brand-yellow text-gray-900 font-bold py-4 rounded-2xl hover:brightness-105 transition-all"
        >
          Lengkapi Profil
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// =========================
// CART PAGE
// =========================
export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } =
    useCart();

  // =========================
  // STATE
  // =========================
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =========================
  // PAYMENT POPUP
  // =========================
  const [paymentPopup, setPaymentPopup] = useState<{
    open: boolean;
    type: "success" | "error" | "pending";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // =========================
  // POPUP HELPER
  // =========================
  const showPaymentPopup = (
    type: "success" | "error" | "pending",
    title: string,
    message: string,
  ) => {
    setPaymentPopup({
      open: true,
      type,
      title,
      message,
    });
  };

  // =========================
  // FILTER SELECTED ITEMS
  // =========================
  useEffect(() => {
    setSelectedItems((prev) =>
      prev.filter((id) => cart.some((item) => item.id === id)),
    );
  }, [cart]);

  // =========================
  // TOGGLE ITEM
  // =========================
  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // =========================
  // SELECT ALL
  // =========================
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  // =========================
  // SUBTOTAL
  // =========================
  const subtotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.harga * item.qty, 0);

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckout = async () => {
    try {
      const selectedProductIds = cart
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => item.id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemIds: selectedProductIds,
        }),
      });

      const data = await response.json();

      // PROFILE NOT COMPLETE
      if (response.status === 400 && data.message?.includes("alamat")) {
        setShowProfileModal(true);
        return;
      }

      // ERROR
      if (!response.ok) {
        showPaymentPopup(
          "error",
          "Checkout Gagal",
          data.message || "Terjadi kesalahan.",
        );
        return;
      }

      // MIDTRANS
      if (!window.snap) {
        showPaymentPopup(
          "error",
          "Midtrans Error",
          "Snap Midtrans belum dimuat.",
        );
        return;
      }

      // SNAP PAY
      window.snap.pay(data.snapToken, {
        onSuccess: function (result: any) {
          console.log(result);

          showPaymentPopup(
            "success",
            "Pembayaran Berhasil",
            "Terima kasih. Pesanan Anda berhasil diproses.",
          );

          setTimeout(() => {
            window.location.reload();
          }, 2500);
        },

        onPending: function (result: any) {
          console.log(result);

          showPaymentPopup(
            "pending",
            "Menunggu Pembayaran",
            "Silakan selesaikan pembayaran Anda terlebih dahulu.",
          );
        },

        onError: function (result: any) {
          console.log(result);

          showPaymentPopup(
            "error",
            "Pembayaran Gagal",
            "Terjadi kesalahan saat memproses pembayaran.",
          );
        },

        onClose: function () {
          showPaymentPopup(
            "error",
            "Pembayaran Dibatalkan",
            "Anda menutup popup pembayaran.",
          );
        },
      });
    } catch (error) {
      console.log(error);

      showPaymentPopup(
        "error",
        "Terjadi Kesalahan",
        "Gagal melakukan checkout.",
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Trash2 className="w-16 h-16 text-gray-300" />

        <h2 className="text-2xl font-bold">Keranjang Kosong</h2>

        <Link
          href="/produk"
          className="bg-brand-yellow px-6 py-3 rounded-xl font-bold"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      {/* PROFILE MODAL */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileIncompleteModal onClose={() => setShowProfileModal(false)} />
        )}
      </AnimatePresence>

      {/* PAYMENT POPUP */}
      <AnimatePresence>
        {paymentPopup.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() =>
                setPaymentPopup((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
            />

            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
            >
              {/* Icon */}
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                  paymentPopup.type === "success"
                    ? "bg-green-100"
                    : paymentPopup.type === "pending"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                }`}
              >
                <span className="text-4xl">
                  {paymentPopup.type === "success"
                    ? "✓"
                    : paymentPopup.type === "pending"
                      ? "⏳"
                      : "✕"}
                </span>
              </div>

              {/* Text */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {paymentPopup.title}
              </h2>

              <p className="text-gray-500 leading-relaxed mb-8">
                {paymentPopup.message}
              </p>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setPaymentPopup((prev) => ({
                    ...prev,
                    open: false,
                  }))
                }
                className="w-full bg-brand-yellow text-gray-900 font-bold py-4 rounded-2xl hover:brightness-105 transition-all"
              >
                Tutup
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAGE */}
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-12">Keranjang</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 ${
                    isAllSelected
                      ? "bg-brand-blue border-brand-blue text-white"
                      : "border-gray-300"
                  }`}
                >
                  {isAllSelected && <Check className="w-4 h-4" />}
                </button>

                <span className="font-bold">
                  Pilih Semua ({selectedItems.length})
                </span>
              </div>

              <button onClick={clearCart} className="text-red-500 font-bold">
                Hapus Semua
              </button>
            </div>

            {/* ITEMS */}
            {cart.map((item) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white p-6 rounded-2xl border flex items-center gap-6 ${
                    isSelected ? "border-brand-blue" : "border-gray-100"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-brand-blue border-brand-blue text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>

                  {/* Image */}
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.nama_product}
                    className="w-24 h-24 object-contain"
                  />

                  {/* Info */}
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg">{item.nama_product}</h4>

                    <p className="text-sm text-gray-400">{item.jenis_oli}</p>

                    <p className="text-sm text-gray-400">{item.peruntukan}</p>

                    {/* Qty */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="px-3 py-1 border rounded"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="px-3 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-blue">
                      Rp. {(item.harga * item.qty).toLocaleString("id-ID")}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 bg-red-100 text-red-500 p-2 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold mb-6">Ringkasan Belanja</h3>

              <div className="flex justify-between mb-4">
                <span>Produk Dipilih</span>
                <span>{selectedItems.length}</span>
              </div>

              <div className="flex justify-between border-b pb-6 mb-6">
                <span>Total</span>

                <span className="text-2xl font-bold text-brand-blue">
                  Rp. {subtotal.toLocaleString("id-ID")}
                </span>
              </div>

              <motion.button
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
                whileHover={selectedItems.length > 0 ? { scale: 1.02 } : {}}
                whileTap={selectedItems.length > 0 ? { scale: 0.97 } : {}}
                className={`w-full py-4 rounded-2xl font-bold text-lg ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-500"
                    : "bg-brand-yellow text-gray-900"
                }`}
              >
                Bayar Sekarang
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
