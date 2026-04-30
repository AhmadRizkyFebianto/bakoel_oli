"use client";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/src/lib/CartContext";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { useCart } from "../hooks/useCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { cart, cartCount, addToCart, removeFromCart, updateQuantity } =
    useCart();

  return (
    <html lang="id">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar cartCount={cartCount} />
            <main className="flex-grow pt-20">{children}</main>
            <Footer />

            {/* WhatsApp Floating Button */}
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="no-referrer"
              className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              id="whatsapp-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-8 h-8"
              />
            </a>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
