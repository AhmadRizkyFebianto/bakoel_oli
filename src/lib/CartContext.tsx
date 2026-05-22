"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string; // cartItemId
  productId: string;
  nama_product: string;
  harga: number;
  image_url: string;
  jenis_oli: string;
  peruntukan: string;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  animateCart: boolean;
  loading: boolean;
  addToCart: (product: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [animateCart, setAnimateCart] = useState(false);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH CART (GET)
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();

      console.log("=== CART DATA ===", data); // log seluruh response
      console.log("=== CART ITEMS ===", data.cart?.items); // log items
      // map items dari API ke CartItem
      const items: CartItem[] = (data.cart?.items || []).map((item: any) => ({
        id: item.id, // cartItemId untuk PUT/DELETE
        productId: item.productId,
        nama_product: item.product?.nama_product || "",
        harga: item.product?.harga || 0,
        image_url: item.product?.image_url || "",
        jenis_oli: item.product?.jenis_oli || "",
        peruntukan: item.product?.peruntukan || "",
        qty: item.quantity,
      }));
      setCart(items);
    } catch (err) {
      console.error("Gagal fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // =========================
  // ADD TO CART (POST)
  // =========================
  const addToCart = async (product: Omit<CartItem, "id">) => {
    try {
      // cek apakah produk sudah ada di cart
      const existing = cart.find(
        (item) => item.productId === product.productId,
      );

      if (existing) {
        // kalau sudah ada, update quantity
        await updateQuantity(existing.id, existing.qty + 1);
      } else {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.productId,
            quantity: 1,
          }),
        });
        if (!res.ok) throw new Error("Gagal menambah ke cart");
        await fetchCart(); // refresh cart
      }

      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 700);
    } catch (err) {
      console.error("addToCart error:", err);
    }
  };

  // =========================
  // UPDATE QUANTITY (PUT)
  // =========================
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (!res.ok) throw new Error("Gagal update quantity");
      // update local state langsung tanpa fetch ulang
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, qty: quantity } : item,
        ),
      );
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  };

  // =========================
  // REMOVE FROM CART (DELETE)
  // =========================
  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${cartItemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus item");
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("removeFromCart error:", err);
    }
  };

  // =========================
  // CLEAR CART (DELETE)
  // =========================
  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      if (!res.ok) throw new Error("Gagal clear cart");
      setCart([]);
    } catch (err) {
      console.error("clearCart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        animateCart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
