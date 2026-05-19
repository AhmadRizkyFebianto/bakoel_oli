"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
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

  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [animateCart, setAnimateCart] = useState(false);

  // LOAD STORAGE
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // SAVE STORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // TOTAL ITEM
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // ADD TO CART
  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        );
      }

      return [...prev, product];
    });

    // TRIGGER ANIMASI
    setAnimateCart(true);

    setTimeout(() => {
      setAnimateCart(false);
    }, 700);
  };

  // REMOVE
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // UPDATE QTY
  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + amount,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  // CLEAR
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        animateCart,

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

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
