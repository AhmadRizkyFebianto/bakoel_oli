"use client";

import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, Users, ArrowUpRight, Plus } from "lucide-react";
import { AdminLayout } from "@/src/components/admin/AdminLayout";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { formatRupiah, useProducts } from "@/src/lib/products.store";
import { useUsers } from "@/src/hooks/useUsers";

export default function DashboardPage() {
  const products = useProducts();
  const inventoryValue = products.reduce((s, p) => s + p.stok * p.harga, 0);
  const { totalUsers, loading } = useUsers();

  const stats = [
    { label: "Total Pendapatan", value: "Belum ada real pemesanan ya bang!", icon: TrendingUp },
    { label: "Pesanan Bulan Ini", value: "Belum ada real pesanan bang!", icon: ShoppingCart },
    { label: "Total Produk", value: products.length.toString(), icon: Package },
    { label: "Total Pelanggan", value: loading ? "..." : String(totalUsers), icon: Users },
  ];

  return (
    <AdminLayout
      title="Selamat datang kembali 👋"
      subtitle="Berikut ringkasan toko Bakul Oli hari ini."
      actions={
        <Button asChild className="shadow-[var(--shadow-yellow)]">
          <Link href="/dashboard/produk">
            <Plus className="h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      }
    >
      <Card
        className="relative overflow-hidden p-6 md:p-8 mb-6 border-0 text-secondary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative max-w-xl">
          <Badge className="bg-primary text-primary-foreground border-0 mb-4">Nilai Inventaris</Badge>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {formatRupiah(inventoryValue)}
          </h2>
          <p className="text-secondary-foreground/70 mt-2 text-sm">
            Total nilai stok produk yang tersedia di gudang Bakul Oli.
          </p>
          <div className="flex gap-3 mt-6">
            <Button asChild>
              <Link href="/dashboard/produk">
                Kelola Produk <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 border-border shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {s.label}
                </p>
                <p className="text-2xl font-black mt-2 text-foreground">{s.value}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-[var(--shadow-card)]">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Produk Terbaru</h3>
            <p className="text-sm text-muted-foreground">Daftar singkat produk di katalog.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/produk">Lihat semua</Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.nama_product}
                  className="h-11 w-11 rounded-lg object-cover border border-border"
                  loading="lazy"
                />
              ) : (
                <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{p.nama_product}</p>
                <p className="text-xs text-muted-foreground">
                  {p.jenis_oli} · {p.cc_motor}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{formatRupiah(p.harga)}</p>
                <p className="text-xs text-muted-foreground">Stok: {p.stok}</p>
              </div>
            </div>

          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}

