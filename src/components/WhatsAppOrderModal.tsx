"use client";

import React, { useState } from "react";
import { X, Check, AlertCircle, ShoppingBag, Send, RefreshCw, User, Mail, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export interface OrderItemPayload {
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItemPayload[];
  totalAmount: number;
  onOrderSuccess?: () => void;
}

const INDIAN_STATES = [
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Madhya Pradesh",
  "Delhi",
  "Uttar Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Goa",
  "Other"
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  items,
  totalAmount,
  onOrderSuccess
}: WhatsAppOrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "Gujarat"
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    city: false,
    state: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Real-time validations
  const phoneDigits = formData.phone.replace(/\D/g, "");
  const isPhoneValid = PHONE_REGEX.test(phoneDigits);
  const isEmailValid = EMAIL_REGEX.test(formData.email.trim());
  const isNameValid = formData.name.trim().length >= 2;
  const isCityValid = formData.city.trim().length >= 2;
  const isStateValid = formData.state.trim().length >= 2;

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isCityValid && isStateValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: raw }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true
    });

    if (!isFormValid) {
      setErrorMessage("Please fill all required fields correctly before proceeding.");
      return;
    }

    const capitalizeWords = (str: string): string => {
      if (!str) return "";
      return str
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    const capitalizeFirst = (str: string): string => {
      if (!str) return "";
      const t = str.trim();
      return t.charAt(0).toUpperCase() + t.slice(1);
    };

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: capitalizeWords(formData.name),
          email: capitalizeFirst(formData.email),
          phone: phoneDigits,
          city: capitalizeWords(formData.city),
          state: capitalizeWords(formData.state),
          items,
          totalAmount
        })
      });

      const data = await res.json();

      if (data.success && data.whatsappUrl) {
        // Open WhatsApp in a new tab/window
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
        if (onOrderSuccess) {
          onOrderSuccess();
        }
        onClose();
      } else {
        setErrorMessage(data.error || "Failed to generate WhatsApp order. Please try again.");
      }
    } catch (err) {
      console.error("Order modal error:", err);
      setErrorMessage("Network error connecting to order system. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-150 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-heading via-[#2A1810] to-[#1F120B] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366] block">
                Direct WhatsApp Order
              </span>
              <h3 className="text-lg sm:text-xl font-black font-serif uppercase tracking-tight text-white">
                Enter Delivery Details
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-2 font-medium">
            Please provide your contact info so we can prepare your order invoice and share payment &amp; delivery updates on WhatsApp.
          </p>
        </div>

        {/* Order Items Preview */}
        <div className="bg-warm-bg/40 border-b border-gray-150 px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-heading font-black">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>{items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items in order</span>
          </div>
          <div className="text-right">
            <span className="text-muted text-[11px] font-semibold block">Total Amount</span>
            <span className="text-primary font-black text-sm">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patel"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }));
                if (formData.name) {
                  setFormData((prev) => ({
                    ...prev,
                    name: prev.name.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                  }));
                }
              }}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition ${
                touched.name && !isNameValid
                  ? "border-red-400 bg-red-50/30"
                  : "border-gray-200 bg-slate-50 focus:bg-white"
              }`}
            />
            {touched.name && !isNameValid && (
              <p className="text-[10px] text-red-600 font-semibold">Please enter your full name (at least 2 characters).</p>
            )}
          </div>

          {/* Phone Number & Email (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>Mobile Number *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  maxLength={10}
                  className={`w-full p-2.5 pl-11 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition font-mono ${
                    touched.phone && !isPhoneValid
                      ? "border-red-400 bg-red-50/30"
                      : isPhoneValid
                      ? "border-green-400 bg-green-50/20"
                      : "border-gray-200 bg-slate-50 focus:bg-white"
                  }`}
                />
                {isPhoneValid && (
                  <Check className="w-4 h-4 text-green-600 absolute right-3 top-3" />
                )}
              </div>
              <p className="text-[10px] text-muted font-medium">
                10 digits only (e.g. 9876543210)
              </p>
              {touched.phone && !isPhoneValid && (
                <p className="text-[10px] text-red-600 font-semibold">
                  Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                placeholder="ramesh@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  if (formData.email) {
                    setFormData((prev) => ({
                      ...prev,
                      email: prev.email.trim().charAt(0).toUpperCase() + prev.email.trim().slice(1)
                    }));
                  }
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition ${
                  touched.email && !isEmailValid
                    ? "border-red-400 bg-red-50/30"
                    : isEmailValid
                    ? "border-green-400 bg-green-50/20"
                    : "border-gray-200 bg-slate-50 focus:bg-white"
                }`}
              />
              <p className="text-[10px] text-muted font-medium">For order receipt</p>
              {touched.email && !isEmailValid && (
                <p className="text-[10px] text-red-600 font-semibold">Please enter a valid email address.</p>
              )}
            </div>
          </div>

          {/* City & State (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* City */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>City / Town *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajkot, Ahmedabad"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, city: true }));
                  if (formData.city) {
                    setFormData((prev) => ({
                      ...prev,
                      city: prev.city.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                    }));
                  }
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition ${
                  touched.city && !isCityValid
                    ? "border-red-400 bg-red-50/30"
                    : "border-gray-200 bg-slate-50 focus:bg-white"
                }`}
              />
              {touched.city && !isCityValid && (
                <p className="text-[10px] text-red-600 font-semibold">Please enter your city.</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 focus:bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing WhatsApp Message...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="w-4.5 h-4.5" />
                  <span>Send Order on WhatsApp</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-muted font-medium mt-2">
              🔒 Your details are used strictly for order fulfillment and dispatch.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
