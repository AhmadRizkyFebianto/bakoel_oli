"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function TestCheckoutPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState("");

    // Ambil daftar produk saat halaman dimuat
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        try {
            // Karena tidak ada API GET khusus semua produk di contoh ini, 
            // kita asumsikan ada minimal satu produk di database.
            // Sebagai dummy, kita bisa ambil dari endpoint yang relevan, atau gunakan ID statis.
            // Tapi mari kita tembak API internal atau fetch dari DB jika memungkinkan.
            // Untuk amannya, kita panggil GET /api/cart dulu, jika error, tampilkan.
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (productId: string) => {
        setLoading(true);
        setStatusText("Menambahkan ke keranjang...");
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            const data = await res.json();
            setStatusText(data.message);
            fetchCart();
        } catch (error) {
            setStatusText("Gagal menambah ke keranjang");
        }
        setLoading(false);
    };

    const checkout = async () => {
        setLoading(true);
        setStatusText("Memproses checkout...");
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            if (!res.ok) {
                setStatusText(`Gagal Checkout: ${data.message}`);
                setLoading(false);
                return;
            }

            setStatusText(`Berhasil! Token: ${data.snapToken}`);
            
            // Panggil Midtrans Snap
            if (window.snap) {
                window.snap.pay(data.snapToken, {
                    onSuccess: function (result: any) {
                        setStatusText("Pembayaran Sukses!");
                        fetchCart(); // Keranjang pasti kosong sekarang
                    },
                    onPending: function (result: any) {
                        setStatusText("Menunggu pembayaran...");
                    },
                    onError: function (result: any) {
                        setStatusText("Pembayaran gagal!");
                    },
                    onClose: function () {
                        setStatusText("Popup ditutup tanpa menyelesaikan pembayaran.");
                    }
                });
            } else {
                setStatusText("Midtrans Snap script belum dimuat!");
            }
        } catch (error) {
            setStatusText("Gagal memproses checkout.");
        }
        setLoading(false);
    };

    const simulateWebhook = async () => {
        setLoading(true);
        setStatusText("Mensimulasikan webhook dari server...");
        try {
            const res = await fetch("/api/test/simulate-payment", {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                setStatusText(data.message);
            } else {
                setStatusText(`Gagal: ${data.message}`);
            }
        } catch (error) {
            setStatusText("Gagal mensimulasikan webhook.");
        }
        setLoading(false);
    };

    // Kita sediakan Input ID manual jika tidak ada list produk
    const [manualProductId, setManualProductId] = useState("");

    return (
        <div className="p-8 max-w-4xl mx-auto font-sans">
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="lazyOnload"
            />
            
            <h1 className="text-3xl font-bold mb-6">Dummy Checkout Tester</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">1. Tambah ke Keranjang</h2>
                    <p className="text-sm text-gray-600 mb-2">
                        Masukkan ID Produk yang ada di database Anda (cek di Supabase/Prisma Studio).
                    </p>
                    <input
                        type="text"
                        placeholder="Contoh: cuid-product-xxx"
                        className="w-full p-2 border rounded mb-4 text-black"
                        value={manualProductId}
                        onChange={(e) => setManualProductId(e.target.value)}
                    />
                    <button
                        onClick={() => addToCart(manualProductId)}
                        disabled={!manualProductId || loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Tambah Barang
                    </button>
                    
                    <div className="mt-4 p-3 bg-white text-sm text-gray-800 rounded border">
                        <strong>Status: </strong> {statusText}
                    </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">2. Isi Keranjang (Saat ini)</h2>
                    {cart && cart.items && cart.items.length > 0 ? (
                        <ul className="mb-4 space-y-2">
                            {cart.items.map((item: any) => (
                                <li key={item.id} className="text-sm text-black bg-white p-2 border rounded">
                                    {item.product.nama_product} (x{item.quantity}) - Rp {item.product.harga * item.quantity}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 mb-4">Keranjang Kosong</p>
                    )}

                    <button
                        onClick={checkout}
                        disabled={loading || !cart || !cart.items || cart.items.length === 0}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 mb-4"
                    >
                        Checkout & Bayar Midtrans
                    </button>

                    <h2 className="text-xl font-semibold mb-2 pt-4 border-t border-gray-300">3. Alat Tes (Bypass Midtrans)</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Jika Anda tidak ingin memakai Ngrok, klik tombol di bawah ini setelah melakukan checkout untuk langsung merubah status pesanan Anda menjadi "SudahBayar" secara instan.
                    </p>
                    <button
                        onClick={simulateWebhook}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700 disabled:opacity-50"
                    >
                        Simulasikan Pembayaran Sukses (Webhook)
                    </button>
                </div>
            </div>
        </div>
    );
}
