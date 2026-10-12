"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { WhatsAppOrderModal } from "@/components/WhatsAppOrderModal";

export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartCount, 
    cartTotal, 
    getItemPrice,
    clearCart 
  } = useCart();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-heading font-serif uppercase tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-muted font-semibold">
          Review your healthy groundnut oil snacks before checking out
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-2xl py-20 text-center px-4 space-y-5">
          <div className="w-20 h-20 rounded-full bg-warm-bg flex items-center justify-center text-primary mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-heading font-serif">Your cart is empty</h3>
          <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
            Add some crunchy potato wafers, mixes, or khakhra to satisfy your snack cravings!
          </p>
          <Link
            href="/products"
            className="inline-flex px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md transition active:scale-95 cursor-pointer"
          >
            Explore Snacks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const itemPrice = getItemPrice(item);
              return (
                <div 
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-white rounded-2xl border border-gray-150 hover:shadow-xs transition"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative bg-warm-bg rounded-xl p-2 border border-gray-100 flex-shrink-0">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        fill
                        unoptimized={Boolean(item.product.image?.startsWith("data:"))}
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-heading truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-muted font-semibold mt-0.5">{item.selectedWeight}</p>
                      <div className="text-xs sm:text-sm font-bold text-primary mt-1">
                        ₹{itemPrice.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity adjustments */}
                    <div className="flex items-center gap-1 bg-warm-bg border border-gray-200 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded text-heading active:scale-95 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-2.5 text-heading">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded text-heading active:scale-95 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1.5 pl-2">
                      <div className="text-xs sm:text-sm font-black text-heading">
                        ₹{(itemPrice * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="text-muted hover:text-red-600 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Sidebar Subtotal & Terms */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-150 space-y-6 shadow-xs">
            
            <h3 className="text-xs font-black uppercase tracking-widest text-heading border-b border-gray-100 pb-2">
              Order Summary
            </h3>

            <div className="space-y-3 font-semibold text-xs text-body">
              <div className="flex justify-between">
                <span>Items Count</span>
                <span className="text-heading font-bold">{cartCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">
                  {cartTotal >= 999 ? "FREE" : "₹50.00"}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-heading">
                <span>Total Amount</span>
                <span className="text-lg font-black text-primary">
                  ₹{(cartTotal + (cartTotal >= 999 ? 0 : 50)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Terms and conditions checkbox (cloned from jagdishfarshan cart checkout) */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100 select-none">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="mt-0.5 w-4.5 h-4.5 text-primary border-gray-300 rounded-sm focus:ring-primary cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-body leading-tight cursor-pointer font-semibold">
                I agree with the terms and conditions and understand that my order checkout will be processed directly via WhatsApp support.
              </label>
            </div>

            {/* Checkout Action Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (!termsAccepted) {
                    alert("Please accept the terms and conditions check box to proceed to checkout!");
                    return;
                  }
                  setIsOrderModalOpen(true);
                }}
                className={`w-full py-4 px-4 font-black text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition text-center shadow-md cursor-pointer ${
                  termsAccepted
                    ? "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-green-500/10"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                <WhatsAppIcon className="w-4.5 h-4.5" />
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* WhatsApp Customer Details & Order Modal */}
      <WhatsAppOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        items={cartItems.map((item) => ({
          name: item.product.name,
          weight: item.selectedWeight,
          quantity: item.quantity,
          price: getItemPrice(item),
        }))}
        totalAmount={cartTotal + (cartTotal >= 999 ? 0 : 50)}
        onOrderSuccess={() => {
          clearCart();
        }}
      />

    </div>
  );
}
