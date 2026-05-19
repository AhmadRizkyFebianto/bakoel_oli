"use client";

import { useEffect, useSyncExternalStore } from "react";

export interface Product {
  id: string;
  nama_product: string;
  jenis_oli: string;
  peruntukan: string;
  cc_motor: string;
  kekentalan_oli: string;
  harga: number;
  stok: number;
  deskripsi: string;
  image_url?: string | null;
  createdAt: string;
}

let products: Product[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

let isSyncing = false;
let lastSyncAt = 0;

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/produk", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const data = await res.json();
  return (data?.produk ?? data?.data ?? []) as Product[];
}

export const productsStore = {
  getAll: () => products,
  sync: async () => {
    // prevent request storms
    const now = Date.now();
    if (isSyncing) return;
    if (now - lastSyncAt < 5000 && products.length > 0) return;

    isSyncing = true;
    try {
      products = await fetchProducts();
      lastSyncAt = Date.now();
      emit();
    } finally {
      isSyncing = false;
    }
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export async function syncProducts() {
  await productsStore.sync();
}

export function useProducts() {
  useEffect(() => {
    // fire initial sync on client mount
    void productsStore.sync();
  }, []);

  return useSyncExternalStore(
    productsStore.subscribe,
    productsStore.getAll,
    productsStore.getAll,
  );
}

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

