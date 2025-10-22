"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Wine } from "@/features/home/utils/wine.utils";

export interface CartItem extends Wine {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (wine: Wine, quantity?: number) => void;
  removeFromCart: (wineId: string) => void;
  updateQuantity: (wineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vina-ramljak-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vina-ramljak-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (wine: Wine, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === wine.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === wine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...wine, quantity }];
    });
  };

  const removeFromCart = (wineId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== wineId));
  };

  const updateQuantity = (wineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(wineId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === wineId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const { totalItems, totalPrice } = items.reduce(
    (sum, item) => ({
      totalItems: sum.totalItems + item.quantity,
      totalPrice: sum.totalPrice + item.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
