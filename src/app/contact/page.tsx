"use client";

import React, { useState } from "react";
import { SITE_CONFIG } from "@/data/config";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getWhatsAppUrl = () => {
    const message = [
      "Namaste Pure Crunch Team!",
      "",
      "*New Contact Inquiry:*",
      `*Name:* ${formData.name.trim()}`,
      `*Phone:* ${formData.phone.trim()}`,
      `*Email:* ${formData.email.trim()}`,
      "",
      "*Message:*",
      formData.message.trim(),
      "",
      "-------------------------",
      "_Sent via Pure Crunch Website Contact Form_"
    ].join("\n");

    const rawNumber = (SITE_CONFIG.whatsappNumber || "+919408823452").replace(/[^0-9]/g, "");
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    // Strictly 10 digits starting with 6, 7, 8, or 9
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };

  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields before sending.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setErrorMsg("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrorMsg("Please enter a valid email address (e.g. yourname@example.com).");
      return;
    }

    setErrorMsg("");

    const url = getWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-primary text-xs font-black uppercase tracking-widest block">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-heading font-serif uppercase tracking-tight">
          Contact Our Kitchen
        </h1>
        <p className="text-xs sm:text-sm text-muted font-semibold">
          Have feedback, distributor inquiries, or custom order requests? Fill out the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-warm-bg rounded-3xl p-6 sm:p-8 border border-primary/10 space-y-6">
            
            <h3 className="text-lg font-black text-heading font-serif uppercase tracking-tight">
              Achyut Industries Office
            </h3>

            <div className="space-y-4 text-xs font-semibold text-body">
              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-white rounded-xl text-primary flex-shrink-0 mt-0.5 border border-primary/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-heading text-[11px] mb-1">Factory Address</h4>
                  <p className="leading-relaxed">{SITE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-white rounded-xl text-primary flex-shrink-0 mt-0.5 border border-primary/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-heading text-[11px] mb-1">Phone / WhatsApp</h4>
                  <p className="leading-relaxed flex items-center gap-2.5">
                    <a href={`tel:${SITE_CONFIG.whatsappNumber}`} className="hover:text-primary transition">
                      {SITE_CONFIG.phoneNumberDisplay}
                    </a>
                    <a
                      href={SITE_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition text-[11px] font-bold"
                      title="Chat on WhatsApp"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-white rounded-xl text-primary flex-shrink-0 mt-0.5 border border-primary/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-heading text-[11px] mb-1">Email Address</h4>
                  <p className="leading-relaxed hover:text-primary transition truncate">
                    <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-white rounded-xl text-primary flex-shrink-0 mt-0.5 border border-primary/10">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-heading text-[11px] mb-1">Operating Hours</h4>
                  <p className="leading-relaxed">Monday to Saturday: 9:00 AM to 7:00 PM (IST)</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* FSSAI Badge Info */}
          <div className="bg-white border border-gray-150 p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-heading">FSSAI Certified Fresh</h4>
              <p className="text-[11px] text-muted font-medium mt-0.5">
                Our facilities undergo regular safety inspections. Lic No: {SITE_CONFIG.fssaiLicense}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Pane */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-xs">
          
          <h3 className="text-lg font-black text-heading font-serif uppercase tracking-tight border-b border-gray-100 pb-3 mb-6">
            Inquiry Form
          </h3>

          {submitted ? (
            <div className="text-center py-12 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-[#25D366]/15 text-[#25D366] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <WhatsAppIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-heading font-serif">Opening WhatsApp...</h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Your message has been prepared! If WhatsApp didn’t open automatically, click the button below. The message is already in the input field—just press <strong>Enter</strong> to send!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4.5 h-4.5" />
                  <span>Open WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-heading font-bold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-heading mb-1.5 font-bold">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyesh Shah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#25D366] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-heading mb-1.5 font-bold">Phone Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length === 12 && val.startsWith("91")) {
                        val = val.slice(2);
                      } else if (val.length === 11 && val.startsWith("0")) {
                        val = val.slice(1);
                      }
                      val = val.slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#25D366] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-heading mb-1.5 font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (e.g., name@example.com)"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#25D366] focus:outline-none bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-heading mb-1.5 font-bold">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your custom requirements or partnership details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#25D366] focus:outline-none bg-slate-50 font-medium"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4.5 h-4.5" />
                <span>Send via WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-muted font-medium pt-1">
                Opens WhatsApp with your prepared message in the input field. Just press <strong>Enter</strong> to send!
              </p>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
