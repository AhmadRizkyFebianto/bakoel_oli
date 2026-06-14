"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Search } from "lucide-react";

import { AdminLayout } from "@/src/components/admin/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Toaster } from "@/src/components/ui/sonner";
import { toast } from "sonner";

type WorkerStatus = "FREE" | "BUSY";



type Worker = {
  id: string;
  name: string;
  status: WorkerStatus;
};

type WorkersResponse = {
  workers: Worker[];
  summary?: {
    total: number;
    free: number;
    busy: number;
  };
};

function statusBadge(status: WorkerStatus) {
  const map: Record<WorkerStatus, string> = {
    FREE: "bg-success/20 text-success-foreground border-success/20",
    BUSY: "bg-chart-4/20 text-foreground border-chart-4/20",
  };

  const labelMap: Record<WorkerStatus, string> = {
    FREE: "Free",
    BUSY: "Busy",
  };

  return (
    <Badge variant="outline" className={`${map[status]} font-medium`}>
      {labelMap[status]}
    </Badge>
  );
}

export default function WorkerPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkers = async () => {

    try {
      setLoading(true);
      const res = await axios.get<WorkersResponse>("/api/workers");
      setWorkers(res.data.workers ?? []);
    } catch (err) {
      console.error("Gagal mengambil data workers:", err);
      toast("Gagal memuat data" as any);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = workers.length;
    const free = workers.filter((w) => w.status === "FREE").length;
    const busy = workers.filter((w) => w.status === "BUSY").length;
    return { total, free, busy };
  }, [workers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter((w) => w.name.toLowerCase().includes(q));
  }, [workers, query]);

  const onAddWorker = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast("Nama worker wajib diisi" as any);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/workers", { name: trimmed });
      setName("");
      setAddOpen(false);
      await fetchWorkers();

      toast(`${trimmed} berhasil ditambahkan.` as any);
    } catch (err: any) {
      console.error("Gagal menambahkan worker:", err);
      toast("Gagal menambahkan worker" as any);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Worker"
      subtitle="Monitoring total worker, worker free, dan worker busy."
    >
      <Toaster richColors position="top-right" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Worker",
            value: stats.total,
            accent: "bg-primary/15 text-foreground",
          },
          {
            label: "Worker Free",
            value: stats.free,
            accent: "bg-success/20 text-foreground",
          },
          {
            label: "Worker Busy",
            value: stats.busy,
            accent: "bg-chart-4/20 text-foreground",
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
                <p className="text-3xl font-black mt-2 text-foreground">
                  {s.value}
                </p>
              </div>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.accent}`}
              />
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
              placeholder="Cari worker..."
              className="pl-9 bg-muted/40 border-0"
            />
          </div>

          <Button
            onClick={() => setAddOpen(true)}
            className="shadow-[var(--shadow-yellow)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-foreground">Nama</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-sm text-muted-foreground animate-pulse">
                        Memuat data workers...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12 text-muted-foreground">
                    Tidak ada worker ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((w) => (
                  <TableRow key={w.id} className="hover:bg-muted/30">
                    <TableCell className="min-w-44">{w.name}</TableCell>
                    <TableCell>{statusBadge(w.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Menampilkan {filtered.length} dari {workers.length} worker
          </span>
        </div>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Worker</DialogTitle>
            <DialogDescription>
              Tambahkan worker baru. Status awal akan otomatis FREE.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Nama worker</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama worker"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={onAddWorker}
                disabled={submitting}
                className="shadow-[var(--shadow-yellow)]"
              >
                {submitting ? "Menambahkan..." : "Tambah"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

