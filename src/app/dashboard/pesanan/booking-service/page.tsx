"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Info, Phone, MapPin, CalendarDays, Handshake, MessageCircle } from "lucide-react";

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
import { toast } from "sonner";

import { formatTanggal } from "@/src/lib/orders.store";

import Link from "next/link";


type BookingStatus = "Menunggu" | "Working" | "Selesai" | "Batal";

type WorkerOption = {
  id: string;
  name: string;
  status: "FREE" | "BUSY";
};


type Booking = {
  id: string;
  jam: string; // ISO
  jenisService: string;
  tempatService: string;
  status: BookingStatus;
  workerId: string | null;
  worker: WorkerOption | null;
  user: {
    username: string;
    nomor_hp?: string | null;
    alamat?: string | null;
  };
};


function statusBadge(s: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    Menunggu: "bg-chart-4/20 text-foreground border-chart-4/20",
    Working: "bg-chart-4/20 text-foreground border-chart-4/20",
    Selesai: "bg-success/20 text-success-foreground border-success/20",
    Batal: "bg-destructive/15 text-foreground border-primary/30",
  };

  const labelMap: Partial<Record<BookingStatus, string>> = {
    Menunggu: "Menunggu",
    Working: "Working",
    Selesai: "Selesai",
    Batal: "Batal",
  };

  return (
    <Badge variant="outline" className={`${map[s]} font-medium`}>
      {labelMap[s]}
    </Badge>
  );
}

function TruncatedText({
  text,
  lines = 1,
}: {
  text: string;
  lines?: 1 | 2;
}) {
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

export default function BookingServicePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Semua" | BookingStatus>("Semua");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [workerBusyAllShown, setWorkerBusyAllShown] = useState(false);


  const fetchWorkers = async () => {
    try {
      const res = await axios.get("/api/workers");
      const nextWorkers: WorkerOption[] = res.data.workers ?? [];
      setWorkers(nextWorkers);

      // reset flag jika masih ada worker FREE
      const freeCount = nextWorkers.filter((w) => w.status === "FREE").length;
      if (freeCount > 0) setWorkerBusyAllShown(false);
    } catch (err) {
      console.error("Gagal mengambil data workers:", err);
      toast("Gagal memuat data workers" as any);
    }
  };



  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(() => {
      fetchWorkers();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await axios.get("/api/booking");
        setBookings(res.data.bookings ?? []);
      } catch (err) {
        console.error("Gagal mengambil data booking:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const statuses = useMemo(
    () => ["Semua", "Menunggu", "Selesai", "Batal"] as const,
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchS = status === "Semua" || b.status === status;
      const matchQ =
        !q ||
        b.user.username.toLowerCase().includes(q) ||
        (b.user.nomor_hp ?? "").toLowerCase().includes(q) ||
        b.jenisService.toLowerCase().includes(q) ||
        b.tempatService.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q);

      return matchS && matchQ;
    });
  }, [bookings, query, status]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const menunggu = bookings.filter((b) => b.status === "Menunggu").length;
    const selesai = bookings.filter((b) => b.status === "Selesai").length;
    return { total, menunggu, selesai };
  }, [bookings]);

  const active = useMemo(
    () => (activeId ? bookings.find((b) => b.id === activeId) ?? null : null),
    [activeId, bookings],
  );

  const clearActive = () => setActiveId(null);

  return (
    <AdminLayout
      title="Booking Service"
      subtitle="Monitoring data booking service berkala."
    >
      <Toaster richColors position="top-right" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Booking",
            value: stats.total,
            accent: "bg-primary/15 text-foreground",
          },
          {
            label: "Menunggu",
            value: stats.menunggu,
            accent: "bg-chart-4/20 text-foreground",
          },
          {
            label: "Selesai",
            value: stats.selesai,
            accent: "bg-success/20 text-foreground",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="p-5 border-border shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {s.label}
                </p>
                <p className="text-3xl font-black mt-2 text-foreground">{s.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.accent}`} />
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
              placeholder="Cari nama, nomor HP, jenis service, tempat..."
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
                <TableHead className="font-bold text-foreground">Nama</TableHead>
                <TableHead className="font-bold text-foreground">Jenis Service</TableHead>
                <TableHead className="font-bold text-foreground">Tempat Service</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal & Jam</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Worker</TableHead>
                <TableHead className="font-bold text-foreground text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-sm text-muted-foreground animate-pulse">
                        Memuat data booking...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Tidak ada booking ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell className="min-w-44">
                      <TruncatedText text={b.user.username ?? "-"} lines={1} />
                    </TableCell>

                    <TableCell className="min-w-56">
                      <TruncatedText text={b.jenisService ?? "-"} lines={1} />
                    </TableCell>

                    <TableCell className="min-w-56">
                      <TruncatedText text={b.tempatService ?? "-"} lines={1} />
                    </TableCell>

                    <TableCell className="text-muted-foreground min-w-[180px]">
                      <div className="flex flex-col text-sm">
                        <span>
                          <span className="font-semibold text-foreground">Tanggal:</span>{" "}
                          {new Date(b.jam).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                        <span>
                          <span className="font-semibold text-foreground">Jam:</span>{" "}
                          {new Date(b.jam).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{statusBadge(b.status)}</TableCell>

                    <TableCell>
                        <Select
                          value={b.worker?.id ?? ""}
                          disabled={!!b.worker}
                          onValueChange={async (workerId) => {
                            if (!workerId || workerId === "__empty__") return;

                            try {
                              setLoading(true);
                              await axios.put("/api/booking", {
                                bookingId: b.id,
                                workerId,
                              });

                              const [bookingRes, workerRes] = await Promise.all([
                                axios.get("/api/booking"),
                                axios.get("/api/workers"),
                              ]);

                              setBookings(bookingRes.data.bookings ?? []);
                              const nextWorkers: WorkerOption[] =
                                workerRes.data.workers ?? [];
                              setWorkers(nextWorkers);

                              toast("Worker berhasil ditugaskan" as any);
                            } catch (err) {
                              console.error("Gagal menugaskan worker:", err);
                              toast("Gagal menugaskan worker" as any);
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              workers.some((w) => w.status === "FREE")
                                ? "Pilih worker"
                                : "Tidak ada worker tersedia"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            const selectedId = b.worker?.id ?? "";
                            const selectedWorker = workers.find((w) => w.id === selectedId);
                            const freeWorkers = workers.filter((w) => w.status === "FREE");

                            const items = selectedWorker
                              ? [
                                  selectedWorker,
                                  ...freeWorkers.filter((w) => w.id !== selectedWorker.id),
                                ]
                              : freeWorkers;

                            // Jika tidak ada worker tersedia
                            if (items.length === 0) {
                              return (
                                <SelectItem value="__empty__" disabled>
                                  -
                                </SelectItem>
                              );
                            }

                            return items.map((w) => (
                              <SelectItem key={w.id} value={w.id}>
                                {w.name}
                              </SelectItem>
                            ));
                          })()}
                        </SelectContent>

                      </Select>
                    </TableCell>

                    <TableCell className="text-right">
                      <Dialog
                        open={activeId === b.id}
                        onOpenChange={(open) =>
                          open ? setActiveId(b.id) : clearActive()
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="shadow-[var(--shadow-yellow)]"
                            onClick={() => setActiveId(b.id)}
                          >
                            <Info className="h-4 w-4 mr-2" /> Detail
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detail Booking</DialogTitle>
                            <DialogDescription>
                              {b.user.username} • {formatTanggal(b.jam)}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border shadow-[var(--shadow-card)] p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Kontak</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  {b.user.nomor_hp ? <TruncatedText text={b.user.nomor_hp} lines={2} /> : "-"}
                                </p>

                                {b.user.nomor_hp && (
                                  <Button
                                    type="button"
                                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                                    onClick={() => {
                                      // hapus semua karakter selain angka
                                      let phone = b.user.nomor_hp.replace(/\D/g, "");

                                      // jika diawali 0 → ubah jadi 62
                                      if (phone.startsWith("0")) {
                                        phone = "62" + phone.slice(1);
                                      }

                                      // jika belum ada 62
                                      if (!phone.startsWith("62")) {
                                        phone = "62" + phone;
                                      }

                                      window.open(`https://wa.me/${phone}`, "_blank");
                                    }}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Kirim Pesan
                                  </Button>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mt-4 mb-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Alamat</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {b.user.alamat ? (
                                  <TruncatedText text={b.user.alamat} lines={2} />
                                ) : (
                                  "-"
                                )}
                              </p>

                              <div className="flex items-center gap-2 mt-4 mb-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-foreground">Tanggal & Jam</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(b.jam).toLocaleString("id-ID", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>

                            </Card>

                            <Card className="border-border shadow-[var(--shadow-card)] p-4">
                              <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold text-foreground">Worker</p>
                                {b.worker ? (
                                  <span className="text-sm font-semibold text-foreground">{b.worker.name}</span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </div>

                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-foreground">Service</p>
                            {statusBadge(b.status)}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Jenis</p>
                              <p className="text-sm font-semibold text-foreground mt-1">
                                {b.jenisService ?? "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Tempat</p>
                              <p className="text-sm font-semibold text-foreground mt-1">
                                {b.tempatService ?? "-"}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-border mt-4 pt-3 flex items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">Aksi</p>
                            {b.status === "Menunggu" || b.status === "Working" ? (
                              <Button
                                className="shadow-[var(--shadow-yellow)] cursor-pointer"
                                onClick={async () => {
                                  try {
                                    setLoading(true);
                                    await axios.put("/api/booking", {
                                      bookingId: b.id,
                                      status: "Selesai",
                                    });

                                    const res = await axios.get("/api/booking");
                                    setBookings(res.data.bookings ?? []);
                                  } catch (err) {
                                    console.error("Gagal update status booking:", err);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                Selesai
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">Service Done</span>
                            )}
                          </div>
                          {(b.status === "Menunggu" || b.status === "Working") && (
                            <p className="text-red-400">
                              Tekan selesai jika proses service telah selesai.
                            </p>
                          )}
                            </Card>

                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Menampilkan {filtered.length} dari {bookings.length} booking
          </span>
        </div>
      </Card>
    </AdminLayout>
  );
}


