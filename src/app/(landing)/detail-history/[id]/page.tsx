"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Package,
  Calendar,
  CreditCard,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailHistoryPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Gagal mengambil detail");

        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Memuat Detail Pesanan...
      </div>
    );
  if (error || !order)
    return <div className="text-center py-20">Data tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Tombol Kembali */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali ke Riwayat</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* KOLOM KIRI: DAFTAR PRODUK */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div className="flex items-center gap-3">
                  <ReceiptText className="w-6 h-6 text-brand-blue" />
                  <h2 className="text-xl font-bold">Rincian Produk</h2>
                </div>
                <span className="text-sm font-mono text-gray-400">
                  #{order.id.toUpperCase()}
                </span>
              </div>

              {/* Looping Semua Produk yang Dipesan */}
              <div className="space-y-8">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                  >
                    {/* Foto Produk */}
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img
                        src={
                          item.product.image_url ||
                          "/assets/placeholder-oil.png"
                        }
                        alt={item.product.nama_product}
                        className="h-full object-contain"
                      />
                    </div>

                    {/* Deskripsi Produk */}
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">
                        {item.product.nama_product}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.product.jenis_oli}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          {item.quantity} barang x Rp{" "}
                          {item.product.harga.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Total Harga per Baris */}
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-brand-blue">
                        Rp{" "}
                        {(item.quantity * item.product.harga).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: STATUS & RINGKASAN */}
          <div className="space-y-6">
            {/* Kartu Status */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">Status Pemesanan</h3>
              <div
                className={`w-full py-3 rounded-2xl text-center font-black text-sm uppercase tracking-widest ${
                  order.status === "BelumBayar"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {order.status}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Tanggal
                  </span>
                  <span className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Pembayaran
                  </span>
                  <span className="font-bold uppercase">Midtrans</span>
                </div>
              </div>
            </div>

            {/* Total Pembayaran */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Variasi dekorasi background */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-yellow/10 rounded-full blur-2xl"></div>

              <p className="text-sm opacity-60 mb-2 font-medium">
                Total Tagihan
              </p>
              <h2 className="text-4xl font-black text-brand-yellow mb-6">
                Rp {order.total.toLocaleString("id-ID")}
              </h2>

              {order.status === "BelumBayar" && (
                <button
                  onClick={() =>
                    window.open(
                      `https://app.sandbox.midtrans.com/snap/v2/vtweb/${order.id}`,
                      "_blank",
                    )
                  }
                  className="w-full bg-brand-yellow text-brand-dark py-4 rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  BAYAR SEKARANG
                </button>
              )}

              <p className="text-[10px] opacity-40 mt-4 text-center italic">
                Pastikan nominal sesuai dengan yang tertera pada aplikasi
                perbankan Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
