"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { SITE_CONFIG } from "@/data/config";

export interface CartItem {
  product: Product;
  selectedWeight: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, weight: string, quantity: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  getItemPrice: (item: CartItem) => number;
  getWhatsAppCheckoutUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pure_crunch_cart");
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("pure_crunch_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, weight: string, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { product, selectedWeight: weight, quantity }];
      }
    });
    setIsCartOpen(true); // Auto-open cart drawer on add
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedWeight === weight)
      )
    );
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemPrice = (item: CartItem) => {
    let price = item.product.mrp;
    const baseWeightStr = item.product.weight; // e.g. "125 g", "200 g"
    const baseWeight = parseInt(baseWeightStr);
    const selectedWeight = parseInt(item.selectedWeight);
    
    if (!isNaN(baseWeight) && !isNaN(selectedWeight) && baseWeight > 0) {
      price = (item.product.mrp / baseWeight) * selectedWeight;
    }
    return price;
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + getItemPrice(item) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const getWhatsAppCheckoutUrl = () => {
    if (cartItems.length === 0) return "#";
    
    let message = `Namaste *Pure Crunch* Team! 🙏\n\nI would like to place an order for the following items:\n\n`;
    
    cartItems.forEach((item, index) => {
      const price = getItemPrice(item);
      message += `${index + 1}. *${item.product.name}* (${item.selectedWeight})\n   - Qty: ${item.quantity} x ₹${price.toFixed(2)} = ₹${(price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n-------------------------\n*Total Amount:* ₹${cartTotal.toFixed(2)}\n\nPlease confirm availability and share payment/delivery instructions!`;

    const rawNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        getItemPrice,
        getWhatsAppCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
