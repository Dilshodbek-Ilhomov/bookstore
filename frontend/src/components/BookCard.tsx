"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, Star } from "@phosphor-icons/react";
import type { Book } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { getLocalizedBookTitle, getLocalizedBookDesc } from "@/lib/i18n";
import { useCartStore } from "@/store/cartStore";
import { useLanguageStore } from "@/store/languageStore";

interface BookCardProps {
  book: Book;
}

/** Renders 5 stars (filled / partial / empty) based on a 0–5 float rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        return (
          <span key={i} className="relative inline-block w-3 h-3">
            {/* Empty star background */}
            <Star weight="regular" className="absolute inset-0 w-3 h-3 text-white/20" />
            {/* Filled portion — clipped horizontally */}
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star weight="fill" className="w-3 h-3 text-gold-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function BookCard({ book }: BookCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { language, t } = useLanguageStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
    openCart();
  };

  const hasRating = book.avg_rating !== null && book.avg_rating !== undefined;
  const displayRating = hasRating ? (book.avg_rating as number) : 0;
  const reviewCount = book.review_count ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-3xl border border-white/10 bg-navy-900/75 p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold-400/40 hover:bg-navy-900 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Micro-Sheen Reflection */}
      <span className="sheen-overlay" aria-hidden="true" />

      {/* Cover image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-navy-950 mb-4 ring-1 ring-white/5 transition-all duration-500 group-hover:ring-gold-400/20">
        <Image
          src={getImageUrl(book.cover_image)}
          alt={getLocalizedBookTitle(book, language, t)}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 select-none pointer-events-none"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          priority={false}
        />

        {/* Hover add-to-cart overlay */}
        <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={handleAddToCart}
            className="group/btn relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-tr from-gold-400 to-gold-500 text-navy-950 flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(201,168,76,0.6)] hover:scale-110 active:scale-95 transition-transform duration-300"
            aria-label={t.bookCard.add}
          >
            <span className="sheen-overlay" aria-hidden="true" />
            <ShoppingCart weight="bold" className="relative z-10 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Text content */}
      <Link href={`/books/${book.id}`} className="flex-1 flex flex-col z-10">
        {/* Title */}
        <h3 className="text-base font-bold tracking-tight text-text-primary group-hover:text-gold-300 transition-colors duration-200 line-clamp-1 mb-0.5">
          {getLocalizedBookTitle(book, language, t)}
        </h3>

        {/* Author(s) */}
        <p className="text-xs text-gold-400/80 font-medium mb-1 line-clamp-1">
          {book.authors_detail && book.authors_detail.length > 0
            ? book.authors_detail.map((a) => a.full_name).join(", ")
            : getLocalizedBookDesc(book, language, t)}
        </p>

        {/* Category badge */}
        {book.category_detail && (
          <span className="inline-flex self-start items-center rounded-full bg-white/[0.04] border border-white/5 px-2 py-0.5 text-[10px] font-mono text-text-muted mb-2 line-clamp-1">
            {book.category_detail.name}
          </span>
        )}

        {/* Price + Rating */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          {/* Price */}
          <span className="text-base font-bold font-mono tracking-tight text-gold-400">
            {formatPrice(book.price, language)}
          </span>

          {/* Real rating pill */}
          <div className="flex flex-col items-end gap-0.5">
            {hasRating ? (
              <>
                <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/5 px-2.5 py-1">
                  <StarRating rating={displayRating} />
                  <span className="text-xs font-bold font-mono text-gold-300 tabular-nums">
                    {displayRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[9px] text-text-muted font-mono tabular-nums pr-1">
                  {reviewCount} {language === "uz" ? "sharh" : "reviews"}
                </span>
              </>
            ) : (
              <span className="rounded-full bg-navy-700/60 border border-white/5 px-2.5 py-1 text-[10px] font-mono text-text-muted tracking-wider">
                {language === "uz" ? "Yangi" : "New"}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
