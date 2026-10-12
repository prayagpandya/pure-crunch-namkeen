"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppOrderModal } from "./WhatsAppOrderModal";

export function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartCount, 
    cartTotal, 
    getItemPrice,
    clearCart,
    getWhatsAppCheckoutUrl 
  } = useCart();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Prevent background body scrolling when cart is open on mobile
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-full sm:w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-in-right">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-wide text-heading font-serif">Shopping Cart</h2>
                <p className="text-xs text-muted font-semibold">
                  {cartCount} {cartCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-heading transition active:scale-95 cursor-pointer"
              aria-label="Close Cart Drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-warm-bg flex items-center justify-center text-primary">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-heading font-serif">Your cart is empty</h3>
                <p className="text-xs sm:text-sm text-muted max-w-xs">
                  Add some delicious, healthy groundnut oil snacks to get started!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md hover:bg-primary-hover transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = getItemPrice(item);
                return (
                  <div 
                    key={`${item.product.id}-${item.selectedWeight}`}
                    className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-2xl border border-gray-150 hover:shadow-xs transition"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative bg-warm-bg rounded-xl p-2 border border-gray-100 flex-shrink-0">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-heading truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-muted font-semibold mt-0.5">{item.selectedWeight}</p>
                      <div className="text-xs sm:text-sm font-bold text-primary mt-1">
                        ₹{(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="text-muted hover:text-red-600 transition p-1.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-1 bg-warm-bg border border-gray-200 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded text-heading active:scale-95 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-2 text-heading">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded text-heading active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-150 bg-white space-y-4 shadow-xs">
              <div className="flex justify-between items-center text-sm font-bold text-heading">
                <span>Subtotal ({cartCount} items)</span>
                <span className="text-lg font-black text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-muted font-medium leading-tight">
                Taxes included. Fast delivery directly from our Rajkot kitchen. Confirm order details via WhatsApp.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 bg-warm-bg hover:bg-gray-100 text-heading font-black text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1 transition text-center"
                >
                  View Cart
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition shadow-md shadow-green-500/10 text-center cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        items={cartItems.map((item) => ({
          name: item.product.name,
          weight: item.selectedWeight,
          quantity: item.quantity,
          price: getItemPrice(item),
        }))}
        totalAmount={cartTotal}
        onOrderSuccess={() => {
          clearCart();
          setIsCartOpen(false);
          setIsOrderModalOpen(false);
        }}
      />
    </div>
  );
}
