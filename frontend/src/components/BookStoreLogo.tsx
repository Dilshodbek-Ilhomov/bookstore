"use client";

import React from "react";

interface BookStoreLogoProps {
  className?: string;
}

/**
 * Custom SVG Vector Logo recreating the Shopping-Bag Book with golden letter 'B'
 * exactly matching the user's second reference image in pure vector format.
 */
export function BookStoreLogo({ className = "w-8 h-8" }: BookStoreLogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/logo.png"
        alt="BookStore Logo"
        className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(201,168,76,0.3)] transition-transform duration-300"
      />
    </div>
  );
}
