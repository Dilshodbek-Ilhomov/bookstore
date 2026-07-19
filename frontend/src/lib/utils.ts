// ============================================
// BookStore — Utility Functions
// ============================================

import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names with clsx (no tailwind-merge needed for this project)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price in UZS
 */
export function formatPrice(price: string | number, lang: "uz" | "en" = "uz"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  // Convert from UZS (database format) to USD ($) using a fixed rate of 12500 UZS = 1 USD
  const usdPrice = num / 12500;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice);
}

/**
 * Format date to local string
 */
export function formatDate(dateStr: string, lang: "uz" | "en" = "uz"): string {
  return new Date(dateStr).toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate rating stars array
 */
export function getStars(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

/**
 * Get full image URL from API path
 */
export function getImageUrl(path: string | null): string {
  if (!path) return "/placeholder-book.svg";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || "https://book-store.uz";
  // Remove /api from base if present
  const origin = base.replace(/\/api$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}
