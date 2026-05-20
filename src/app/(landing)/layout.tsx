"use client";

import "../globals.css";

import { Geist } from "next/font/google";
import Script from "next/script";

import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

import { CartProvider } from "@/src/lib/CartContext";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={geist.variable}>
      <body>
        <CartProvider>
          {/* MIDTRANS SNAP */}
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="beforeInteractive"
          />

          <Navbar />

          <main className="pt-24">{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
