"use client";
import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Product } from "../../types";
import { PRODUCTS } from "../../../data/products";
import ProductCard from "../../../components/ProductCard";
import PageBanner from "../../../components/PageBanner";

const CATEGORIES = [
  "Motor Matic",
  "Motor Bebek",
  "Motor Sport",
  "Pelumas Khusus",
];
const BRANDS = ["Shell", "Motul", "Castrol", "Ahm Oil"];

interface ProductsProps {
  addToCart: (p: Product) => void;
}

export default function Products({ addToCart }: ProductsProps) {
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title={
          <>
            Produk Perawatan di bengkel{" "}
            <span className="text-brand-yellow">Bakul Oli</span>
          </>
        }
        description="Produk perawatan Bengkel Bakul Oli dirancang untuk menjaga performa motor Anda. Mulai dari oli mesin, filter, hingga pelumas khusus, semuanya berkualitas tinggi."
        height="h-64"
      />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </h3>
              <div className="space-y-6">
                <FilterGroup label="Kategori" items={CATEGORIES} />
                <FilterGroup label="Merek" items={BRANDS} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ketik produk yang anda butuhkan..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-transparent focus:border-brand-yellow outline-none text-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="bg-brand-yellow px-8 rounded-2xl font-bold hover:brightness-105 transition-all shadow-md">
                Cari
              </button>
            </div>

            <h2 className="text-2xl font-bold">
              Pilihan Produk di bengkel{" "}
              <span className="text-brand-yellow">Bakul Oli</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>

            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 text-sm cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />
            <span className="group-hover:text-brand-blue transition-colors">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 pt-12">
      <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2">
        {[1, 2, 3, "...", 20].map((p, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              p === 1
                ? "bg-brand-dark text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-dark text-white hover:bg-brand-blue transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
