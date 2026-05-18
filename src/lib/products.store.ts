"use client";

import { useSyncExternalStore } from "react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: "Aktif" | "Habis";
  description?: string;
}

const seed: Product[] = [
  { id: "1", name: "Shell Advance AX7 Matic 10W-30", category: "Oli Mesin", price: 65000, stock: 42, sku: "SHL-AX7-10W30", status: "Aktif", description: "Oli motor matic premium." },
  { id: "2", name: "Castrol Power1 Scooter 10W-40", category: "Oli Mesin", price: 72000, stock: 28, sku: "CTL-PWR1-10W40", status: "Aktif" },
  { id: "3", name: "Motul 3000 4T 20W-50", category: "Oli Mesin", price: 58000, stock: 0, sku: "MTL-3000-20W50", status: "Habis" },
  { id: "4", name: "Yamalube Sport 10W-40", category: "Oli Mesin", price: 55000, stock: 64, sku: "YML-SPT-10W40", status: "Aktif" },
  { id: "5", name: "Filter Oli Honda Genuine", category: "Filter", price: 35000, stock: 120, sku: "HND-FLT-OIL", status: "Aktif" },
  { id: "6", name: "Pelumas Rantai Repsol", category: "Pelumas", price: 48000, stock: 17, sku: "RPL-CHN-LUB", status: "Aktif" },
  { id: "7", name: "Brake Cleaner WD-40", category: "Perawatan", price: 42000, stock: 5, sku: "WD40-BRK-CLN", status: "Aktif" },
  { id: "8", name: "Coolant Prestone Yellow 1L", category: "Coolant", price: 38000, stock: 33, sku: "PRS-CLT-YL1", status: "Aktif" },
];

let products: Product[] = [...seed];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const productsStore = {
  getAll: () => products,
  add: (p: Omit<Product, "id">) => {
    products = [{ ...p, id: crypto.randomUUID() }, ...products];
    emit();
  },
  update: (id: string, p: Omit<Product, "id">) => {
    products = products.map((x) => (x.id === id ? { ...p, id } : x));
    emit();
  },
  remove: (id: string) => {
    products = products.filter((x) => x.id !== id);
    emit();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useProducts() {
  return useSyncExternalStore(
    productsStore.subscribe,
    productsStore.getAll,
    productsStore.getAll,
  );
}

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
