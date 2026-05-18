"use client";

import { CartProvider } from "@/src/lib/CartContext";
import "../dashboard-theme.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Dashboard tidak menampilkan Navbar/Footer.
  // CartProvider tetap dipasang jika dashboard butuh akses cart.
  // Jika cart tidak dipakai di dashboard, CartProvider bisa dihapus.
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <div className="min-h-screen">{children}</div>

        </CartProvider>
      </body>
    </html>
  );
}

