"use client";
import { Product } from "../app/types";

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col items-center text-center">
      <div className="h-48 mb-6 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h4 className="font-bold text-lg mb-1">{product.name}</h4>
      <p className="text-xs text-brand-blue font-medium mb-3">
        {product.category}
      </p>
      <span className="text-xl font-extrabold text-brand-blue mb-6">
        Rp. {product.price.toLocaleString("id-ID")}
      </span>
      <button
        onClick={onAdd}
        className="w-full bg-brand-yellow py-3 rounded-xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-sm active:scale-95"
      >
        Tambah Keranjang
      </button>
    </div>
  );
}
