"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Product, syncProducts } from "@/src/lib/products.store";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: Product | null;
}

const emptyForm = {
  nama_product: "",
  jenis_oli: "",
  peruntukan: "",
  cc_motor: [100, 250] as number[],
  kekentalan_oli: "",
  harga: "",
  stok: "",
  deskripsi: "",
  image_url: "",
};


export function ProductDialog({ open, onOpenChange, product }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);


  useEffect(() => {
    if (!open) return;

    if (!product) {
      setForm(emptyForm);
      return;
    }

    setForm({
      nama_product: product.nama_product ?? "",
      jenis_oli: product.jenis_oli ?? "",
      peruntukan: product.peruntukan ?? "",
      cc_motor: (() => {
        if (!product.cc_motor) return [100, 250];

        // ambil semua angka dari string
        const numbers = product.cc_motor.match(/\d+/g);

        if (!numbers || numbers.length === 0) {
          return [100, 250];
        }

        // jika hanya ada 1 angka
        if (numbers.length === 1) {
          const val = Number(numbers[0]);
          return [val, val];
        }

        return [Number(numbers[0]), Number(numbers[1])];
      })(),
      kekentalan_oli: product.kekentalan_oli ?? "",
      harga: String(product.harga ?? ""),
      stok: String(product.stok ?? ""),
      deskripsi: product.deskripsi ?? "",
      image_url: product.image_url ?? "",
    });
  }, [open, product]);

  const validate = () => {
    if (!form.nama_product.trim()) return "Nama produk wajib diisi";
    if (!form.jenis_oli.trim()) return "Jenis oli wajib diisi";
    if (!form.peruntukan.trim()) return "Peruntukan wajib diisi";
    if (!form.cc_motor.length) return "CC motor wajib diisi";
    if (!form.kekentalan_oli.trim()) return "Kekentalan oli wajib diisi";
    if (!form.deskripsi.trim()) return "Deskripsi wajib diisi";
    if (Number.isNaN(Number(form.harga)) || Number(form.harga) < 0) return "Harga tidak valid";
    if (Number.isNaN(Number(form.stok)) || Number(form.stok) < 0) return "Stok tidak valid";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nama_product", form.nama_product);
      formData.append("jenis_oli", form.jenis_oli);
      formData.append("peruntukan", form.peruntukan);
      formData.append("cc_motor", `${form.cc_motor[0]}-${form.cc_motor[1]}cc`);
      formData.append("kekentalan_oli", form.kekentalan_oli);
      formData.append("harga", String(Math.round(Number(form.harga))));
      formData.append("stok", String(Math.round(Number(form.stok))));
      formData.append("deskripsi", form.deskripsi);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = product
        ? await fetch(`/api/produk/${product.id}`, {
            method: "PUT",
            body: formData,
          })
        : await fetch("/api/produk", {
            method: "POST",
            body: formData,
          });


      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Gagal menyimpan produk");
        return;
      }

      toast.success(product ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");
      await syncProducts();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          <DialogDescription>
            Sinkron ke backend melalui API <code>/api/produk</code>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_product">Nama Produk</Label>
            <Input
              id="nama_product"
              value={form.nama_product}
              onChange={(e) => setForm({ ...form, nama_product: e.target.value })}
              placeholder="Contoh: Unirace"
            />
          </div>

          <div className="space-y-2">
            <Label>Jenis Oli</Label>
            <Select
              value={form.jenis_oli}
              onValueChange={(v) => setForm({ ...form, jenis_oli: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis oli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mesin">Mesin</SelectItem>
                <SelectItem value="Gardan">Gardan</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <Label>Peruntukan (bisa lebih dari 1)</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Motor Bebek",
                "Motor Matic",
                "Motor Sport",
                "Motor Matic Premium",
                "Motor Bebek Lama",
                "Motor Sport Premium",
                "Motor 2 Tak",
                "Multi Purpose",
              ].map((opt) => {
                const checked = form.peruntukan
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .includes(opt);

                return (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = form.peruntukan
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);

                        const next = e.target.checked
                          ? Array.from(new Set([...current, opt]))
                          : current.filter((x) => x !== opt);

                        setForm({ ...form, peruntukan: next.join(", ") });
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>


          {/* <div className="space-y-2">
            <Label htmlFor="cc_motor">CC Motor</Label>
            <Input
              id="cc_motor"
              value={form.cc_motor}
              onChange={(e) => setForm({ ...form, cc_motor: e.target.value })}
              placeholder="Contoh: 100–125cc"
            />
          </div> */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Range CC Motor</Label>

              <span className="text-sm text-muted-foreground font-medium">
                {form.cc_motor[0]}cc - {form.cc_motor[1]}cc
              </span>
            </div>

            <Slider
              value={form.cc_motor}
              min={100}
              max={250}
              step={5}
              minStepsBetweenThumbs={1}
              onValueChange={(value) =>
                setForm({ ...form, cc_motor: value })
              }
            />
            <p className="text-sm text-muted-foreground">
              {form.cc_motor[0]}cc - {form.cc_motor[1]}cc
            </p>
          </div>

          <div className="space-y-2">
            <Label>Kekentalan Oli</Label>
            <Select
              value={form.kekentalan_oli}
              onValueChange={(v) => setForm({ ...form, kekentalan_oli: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kekentalan oli" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "10W-30",
                  "10W-40",
                  "15W-40",
                  "20W-50",
                  "SAE 40",
                  "SAE 90",
                  "2T",
                ].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <Label htmlFor="harga">Harga</Label>
            <Input
              id="harga"
              type="number"
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stok">Stok</Label>
            <Input
              id="stok"
              type="number"
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gambar Produk (upload)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageFile(file);
                setForm({ ...form, image_url: file.name });
              }}

            />
            {form.image_url ? (
              <p className="text-xs text-muted-foreground">
                {form.image_url}
              </p>
            ) : null}
          </div>


          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              rows={4}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Deskripsi produk..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={submitting} onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
