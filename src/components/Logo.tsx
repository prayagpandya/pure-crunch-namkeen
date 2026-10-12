"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "header" | "full" | "footer" | "hero";
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  variant = "header",
  className = "",
}: LogoProps) {
  const isFooter = variant === "footer";
  const isHero = variant === "hero";
  const isHeader = variant === "header";

  if (isFooter) {
    return (
      <Link
        href="/"
        className={`inline-block group transition-transform duration-200 select-none ${className}`}
        aria-label="Pure Crunch Home"
      >
        <div className="bg-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-sm inline-flex items-center justify-center border border-white/20 group-hover:shadow-md transition">
          <Image
            src="/images/main_logo.webp"
            alt="Pure Crunch Healthy Namkeen"
            width={501}
            height={216}
            className="h-16 sm:h-18 md:h-20 w-auto object-contain"
          />
        </div>
      </Link>
    );
  }

  if (isHero) {
    return (
      <Link
        href="/"
        className={`inline-block group transition-transform duration-200 select-none ${className}`}
        aria-label="Pure Crunch Home"
      >
        <Image
          src="/images/main_logo.webp"
          alt="Pure Crunch Healthy Namkeen"
          width={501}
          height={216}
          className="h-24 sm:h-28 md:h-36 w-auto object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
          priority
        />
      </Link>
    );
  }

  // Header / Mobile Drawer / Default
  return (
    <Link
      href="/"
      className={`inline-flex items-center group transition-transform duration-200 select-none ${className}`}
      aria-label="Pure Crunch Home"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/main_logo.webp"
          alt="Pure Crunch Healthy Namkeen"
          width={501}
          height={216}
          className={`${
            isHeader
              ? "h-14 sm:h-16 md:h-20 w-auto"
              : "h-14 sm:h-16 w-auto"
          } object-contain transition-transform duration-300 group-hover:scale-105`}
          priority
        />
      </div>
    </Link>
  );
}
