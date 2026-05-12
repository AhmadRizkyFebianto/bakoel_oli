"use client";

import { useSyncExternalStore } from "react";

export type OrderStatus = "Baru" | "Dikemas" | "Dikirim" | "Selesai";

export interface OrderItem {
  productId?: string;
  namaProduk: string;
  sku?: string;
  qty: number;
  hargaSatuan: number;
}

export interface Order {
  id: string;
  namaPemesan: string;
  alamat: string;
  noHp?: string;
  status: OrderStatus;
  tglPesan: string; // ISO/date string
  catatan?: string;
  items: OrderItem[];
  total: number;
}

const seed: Order[] = [
  {
    id: "o-1",
    namaPemesan: "Budi Santoso",
    alamat: "Jl. Melati No. 12, Kel. Sukamaju, Kec. Cimanggis, Depok",
    noHp: "0812-3456-7890",
    status: "Baru",
    tglPesan: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    catatan: "Tolong hubungi sebelum sampai.",
    items: [
      {
        productId: "1",
        namaProduk: "Shell Advance AX7 Matic 10W-30",
        sku: "SHL-AX7-10W30",
        qty: 1,
        hargaSatuan: 65000,
      },
      {
        productId: "5",
        namaProduk: "Filter Oli Honda Genuine",
        sku: "HND-FLT-OIL",
        qty: 2,
        hargaSatuan: 35000,
      },
    ],
    total: 65000 + 2 * 35000,
  },
  {
    id: "o-2",
    namaPemesan: "Siti Aisyah",
    alamat:
      "Komplek Perumahan Harapan Indah Blok C/5, RT 03 RW 07, Bekasi Selatan",
    noHp: "0813-1111-2222",
    status: "Dikemas",
    tglPesan: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    items: [
      {
        namaProduk: "Motul 3000 4T 20W-50",
        sku: "MTL-3000-20W50",
        qty: 1,
        hargaSatuan: 58000,
      },
    ],
    total: 58000,
  },
  {
    id: "o-3",
    namaPemesan: "Andi Pratama",
    alamat:
      "Jl. Raya Bogor KM 20, Kel. Tanah Sereal, Kec. Bogor Barat, Kota Bogor",
    noHp: "0822-9999-0000",
    status: "Dikirim",
    tglPesan: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    catatan: "Pengiriman saat siang.",
    items: [
      {
        namaProduk: "Pelumas Rantai Repsol",
        sku: "RPL-CHN-LUB",
        qty: 3,
        hargaSatuan: 48000,
      },
      {
        namaProduk: "Brake Cleaner WD-40",
        sku: "WD40-BRK-CLN",
        qty: 1,
        hargaSatuan: 42000,
      },
    ],
    total: 3 * 48000 + 42000,
  },
];

let orders: Order[] = [...seed];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const ordersStore = {
  getAll: () => orders,
  add: (o: Omit<Order, "id">) => {
    orders = [{ ...o, id: crypto.randomUUID() }, ...orders];
    emit();
  },
  update: (id: string, o: Omit<Order, "id">) => {
    orders = orders.map((x) => (x.id === id ? { ...o, id } : x));
    emit();
  },
  remove: (id: string) => {
    orders = orders.filter((x) => x.id !== id);
    emit();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useOrders() {
  return useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getAll,
    ordersStore.getAll,
  );
}

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const formatTanggal = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
};

