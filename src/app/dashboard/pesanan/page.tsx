"use client";

import { useMemo, useState } from "react";
import { Pencil, Search, Package, Info, Phone, MapPin, CalendarDays } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Toaster } from "@/src/components/ui/sonner";

import { useOrders, type Order, type OrderStatus, formatRupiah, formatTanggal } from "@/src/lib/orders.store";

function statusBadge(s: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    Baru: "bg-primary/15 text-foreground border-primary/30",
    Dikemas: "bg-success/15 text-success-foreground border-success/30",
    Dikirim: "bg-chart-4/20 text-foreground border-chart-4/30",
    Selesai: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge variant="outline" className={`${map[s]} font-medium`}>
      {s}
    </Badge>
  );
}

function TruncatedText({ text, lines = 1 }: { text: string; lines?: 1 | 2 }) {
  const clamp = lines === 2 ? "line-clamp-2" : "line-clamp-1";
  return (
    <span
      className={`block ${clamp} overflow-hidden text-ellipsis`}
      title={text}
    >
      {text}
    </span>
  );
}

function joinItems(items: Order["items"]) {
  const first = items[0];
  if (!first) return "-";
  if (items.length === 1) return first.namaProduk;
  return `${first.namaProduk} +${items.length - 1}`;
}

export default function PesananPage() {
  const orders = useOrders();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "Semua">("Semua");
  const [activeId, setActiveId] = useState<string | null>(null);

  const statuses = useMemo(
    () => ["Semua", "Baru", "Dikemas", "Dikirim", "Selesai"] as const,
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchS = status === "Semua" || o.status === status;
      const matchQ =
        !q ||
        o.namaPemesan.toLowerCase().includes(q) ||
        o.alamat.toLowerCase().includes(q) ||
        o.items.some((it) => it.namaProduk.toLowerCase().includes(q) || (it.sku ?? "").toLowerCase().includes(q));
      return matchS && matchQ;
    });
  }, [orders, query, status]);

  const stats = useMemo(() => {
    const total = orders.length;
    const baru = orders.filter((o) => o.status === "Baru").length;
    const dikemas = orders.filter((o) => o.status === "Dikemas").length;
    const dikirim = orders.filter((o) => o.status === "Dikirim").length;
    return { total, baru, dikemas, dikirim };
  }, [orders]);

  const active = useMemo(() => (activeId ? orders.find((o) => o.id === activeId) : null), [activeId, orders]);

  const clearActive = () => setActiveId(null);

  return (
    <AdminLayout
      title="Monitoring Data Pesanan"
      subtitle="Kelola seluruh data pesanan (dikemas/dikirim)"
    >
      <Toaster richColors position="top-right" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pesanan", value: stats.total, accent: "bg-primary/15 text-foreground" },
          { label: "Baru", value: stats.baru, accent: "bg-chart-4/20 text-foreground" },
          { label: "Dikemas", value: stats.dikemas, accent: "bg-success/15 text-foreground" },
          { label: "Dikirim", value: stats.dikirim, accent: "bg-destructive/15 text-foreground" },
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
              placeholder="Cari pemesan, alamat, produk, SKU..."
              className="pl-9 bg-muted/40 border-0"
            />
          </div>

          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((st) => (
                <SelectItem key={st} value={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-foreground">Nama Pemesan</TableHead>
                <TableHead className="font-bold text-foreground">Alamat</TableHead>
                <TableHead className="font-bold text-foreground">Produk</TableHead>
                <TableHead className="font-bold text-foreground text-right">Total</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Tidak ada pesanan ditemukan.
                  </TableCell>
                </TableRow>
              )}

              {filtered.map((o) => (
                <TableRow key={o.id} className="hover:bg-muted/30">
                  <TableCell className="min-w-44">
                    <TruncatedText text={o.namaPemesan} lines={1} />
                  </TableCell>

                  <TableCell className="min-w-56">
                    <TruncatedText text={o.alamat} lines={1} />
                  </TableCell>

                  <TableCell className="min-w-56">
                    <TruncatedText text={joinItems(o.items)} lines={1} />
                  </TableCell>

                  <TableCell className="text-right font-bold text-foreground">{formatRupiah(o.total)}</TableCell>

                  <TableCell className="text-muted-foreground">
                    <TruncatedText text={formatTanggal(o.tglPesan)} lines={1} />
                  </TableCell>

                  <TableCell>{statusBadge(o.status)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
              <Dialog
                        open={activeId === o.id}
                        onOpenChange={(open) => (open ? setActiveId(o.id) : clearActive())}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="shadow-[var(--shadow-yellow)]"
                            onClick={() => setActiveId(o.id)}
                          >
                            <Info className="h-4 w-4 mr-2" /> Detail
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detail Pesanan</DialogTitle>
                            <DialogDescription>
                              {o.namaPemesan} • {formatTanggal(o.tglPesan)}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border shadow-[var(--shadow-card)] p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Kontak</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {o.noHp ? <TruncatedText text={o.noHp} lines={2} /> : "-"}
                              </p>

                              <div className="flex items-center gap-2 mt-4 mb-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Alamat</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <TruncatedText text={o.alamat} lines={2} />
                              </p>

                              <div className="flex items-center gap-2 mt-4 mb-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Tanggal</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{formatTanggal(o.tglPesan)}</p>

                              {o.catatan && (
                                <div className="mt-4">
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                    Catatan
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">{o.catatan}</p>
                                </div>
                              )}
                            </Card>

                            <Card className="border-border shadow-[var(--shadow-card)] p-4">
                              <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold text-foreground">Produk</p>
                                {statusBadge(o.status)}
                              </div>

                              <div className="space-y-3">
                                {o.items.map((it, idx) => (
                                  <div key={`${o.id}-${idx}`} className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-foreground">
                                        <TruncatedText text={it.namaProduk} lines={1} />
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        {it.sku ? `SKU: ${it.sku}` : ""}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">Qty: {it.qty}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-foreground">{formatRupiah(it.qty * it.hargaSatuan)}</p>
                                      <p className="text-xs text-muted-foreground">{formatRupiah(it.hargaSatuan)} / pcs</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-sm font-bold text-foreground">{formatRupiah(o.total)}</p>
                              </div>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Edit" onClick={() => {}}>
                        <Pencil className="h-4 w-4" />
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
            Menampilkan {filtered.length} dari {orders.length} pesanan
          </span>
        </div>
      </Card>
    </AdminLayout>
  );
}

