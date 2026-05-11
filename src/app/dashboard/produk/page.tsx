"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { AdminLayout } from "@/src/components/admin/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Toaster } from "@/src/components/ui/sonner";
import { toast } from "sonner";
import { ProductDialog } from "@/src/components/admin/ProductDialog";
import { Product, formatRupiah, productsStore, useProducts } from "@/src/lib/products.store";

function statusBadge(s: Product["status"]) {
  const map: Record<Product["status"], string> = {
    Aktif: "bg-success/15 text-success-foreground border-success/30",
    Habis: "bg-destructive/15 text-destructive border-destructive/30",
    Draft: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`${map[s]} font-medium`}>
      {s}
    </Badge>
  );
}

export default function ProdukPage() {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Semua");
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchC = category === "Semua" || p.category === category;
      return matchQ && matchC;
    });
  }, [products, query, category]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "Aktif").length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const oos = products.filter((p) => p.stock === 0).length;
    return { total, active, lowStock, oos };
  }, [products]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      productsStore.remove(deleteId);
      toast.success("Produk berhasil dihapus");
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout
      title="Manajemen Produk"
      subtitle="Kelola seluruh produk yang dijual di Bakul Oli."
      actions={
        <Button onClick={openCreate} className="shadow-[var(--shadow-yellow)]">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      }
    >
      <Toaster richColors position="top-right" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Produk", value: stats.total, accent: "bg-primary/15 text-foreground" },
          { label: "Produk Aktif", value: stats.active, accent: "bg-success/15 text-foreground" },
          { label: "Stok Menipis", value: stats.lowStock, accent: "bg-chart-4/20 text-foreground" },
          { label: "Stok Habis", value: stats.oos, accent: "bg-destructive/15 text-foreground" },
        ].map((s) => (
          <Card key={s.label} className="p-5 border-border shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {s.label}
                </p>
                <p className="text-3xl font-black mt-2 text-foreground">{s.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.accent}`}>
                <Package className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau SKU..."
              className="pl-9 bg-muted/40 border-0"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-foreground">Produk</TableHead>
                <TableHead className="font-bold text-foreground">SKU</TableHead>
                <TableHead className="font-bold text-foreground">Kategori</TableHead>
                <TableHead className="font-bold text-foreground text-right">Harga</TableHead>
                <TableHead className="font-bold text-foreground text-center">Stok</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Tidak ada produk ditemukan.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{p.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/10 text-foreground border border-border">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">{formatRupiah(p.price)}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        p.stock === 0
                          ? "text-destructive font-semibold"
                          : p.stock <= 10
                            ? "text-chart-4 font-semibold"
                            : "text-foreground"
                      }
                    >
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Menampilkan {filtered.length} dari {products.length} produk
          </span>
        </div>
      </Card>

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen dari katalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

