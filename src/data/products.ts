import { Product } from "../types";

export const PRODUCTS: Product[] = Array(12)
  .fill({
    id: "1",
    name: "Shell Advance AX7 Matic 10W-30",
    category: "Untuk Motor Matic | 0.8L | Sintetik",
    price: 65000,
    image: "/assets/Produk.png",
  })
  .map((p, i) => ({ ...p, id: `p-${i}` }));

export const FEATURED_PRODUCTS: Product[] = PRODUCTS.slice(0, 6);
