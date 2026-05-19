"use client";

import { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/src/lib/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // =========================
  // CHECKBOX STATE
  // =========================
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // otomatis pilih semua saat pertama load
  useEffect(() => {
    setSelectedItems((prev) =>
      prev.filter((id) => cart.some((item) => item.id === id)),
    );
  }, [cart]);

  // =========================
  // CHECKBOX ITEM
  // =========================
  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // =========================
  // CHECKBOX ALL
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
  // TOTAL
  // =========================
  const subtotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.harga * item.qty, 0);

  // =========================
  // EMPTY STATE
  // =========================
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
          <Trash2 className="w-20 h-20 text-gray-300" />
        </div>

        <h2 className="text-2xl font-bold">Keranjang Anda Kosong</h2>

        <p className="text-gray-500">
          Belum ada produk perawatan yang ditambahkan ke keranjang.
        </p>

        <Link
          href="/produk"
          className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-12">Keranjang</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* CHECKBOX ALL */}
                <button
                  onClick={toggleSelectAll}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-all border-2 ${
                    isAllSelected
                      ? "bg-brand-blue border-brand-blue text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isAllSelected && <Check className="w-4 h-4" />}
                </button>

                <span className="font-bold">
                  Pilih Semua ({selectedItems.length})
                </span>
              </div>

              <button
                onClick={clearCart}
                className="text-red-500 font-bold hover:underline"
              >
                Hapus Semua
              </button>
            </div>

            {/* CART ITEMS */}
            <div className="space-y-4">
              {cart.map((item) => {
                const isSelected = selectedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col sm:flex-row items-center gap-6 ${
                      isSelected ? "border-brand-blue" : "border-gray-100"
                    }`}
                  >
                    {/* CHECKBOX */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-all border-2 shrink-0 ${
                        isSelected
                          ? "bg-brand-blue border-brand-blue text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>

                    {/* IMAGE */}
                    <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.nama_product}
                        className="h-full object-contain"
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-grow space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-lg">{item.nama_product}</h4>

                      <p className="text-xs text-gray-400">{item.jenis_oli}</p>

                      <p className="text-xs text-gray-400">{item.peruntukan}</p>

                      {/* QUANTITY */}
                      <div className="flex items-center justify-center sm:justify-start gap-4 pt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>

                          <span className="px-4 py-1 text-sm font-bold border-x border-gray-200">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="text-right space-y-4 flex flex-col items-center sm:items-end">
                      <span className="text-xl font-extrabold text-brand-blue">
                        Rp. {(item.harga * item.qty).toLocaleString("id-ID")}
                      </span>

                      <div className="flex items-center gap-3">
                        {/* DELETE */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-100 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* DETAIL */}
                        <button className="bg-brand-yellow text-brand-dark px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 transition-all">
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32 space-y-8">
              <h3 className="text-xl font-bold">Ringkasan Belanja</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Produk Dipilih</span>
                  <span>{selectedItems.length}</span>
                </div>

                <div className="flex justify-between items-center pb-6 border-b border-gray-100 text-gray-600">
                  <span>Total</span>

                  <span className="text-2xl font-extrabold text-brand-blue">
                    Rp. {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                disabled={selectedItems.length === 0}
                onClick={async () => {
                  try {
                    // PRODUK YANG DICENTANG
                    const selectedProducts = cart.filter((item) =>
                      selectedItems.includes(item.id),
                    );

                    // REQUEST KE API MIDTRANS
                    const response = await fetch("/api/transaction", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },

                      body: JSON.stringify({
                        items: selectedProducts,

                        total: subtotal,

                        name: "Ahmad Rizky",
                        email: "user@gmail.com",
                      }),
                    });

                    const data = await response.json();

                    // OPEN MIDTRANS SNAP
                    window.snap.pay(data.token, {
                      onSuccess: function (result: any) {
                        console.log(result);

                        alert("Pembayaran berhasil");
                      },

                      onPending: function (result: any) {
                        console.log(result);

                        alert("Menunggu pembayaran");
                      },

                      onError: function (result: any) {
                        console.log(result);

                        alert("Pembayaran gagal");
                      },

                      onClose: function () {
                        alert("Popup pembayaran ditutup");
                      },
                    });
                  } catch (error) {
                    console.log(error);

                    alert("Terjadi kesalahan");
                  }
                }}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-brand-yellow hover:brightness-105"
                }`}
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
