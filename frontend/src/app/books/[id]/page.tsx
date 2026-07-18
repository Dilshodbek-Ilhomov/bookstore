"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { booksAPI } from "@/lib/api";
import type { Book } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, ArrowLeft, Star, FilePdf } from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle, getLocalizedBookDesc } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { language, t } = useLanguageStore();

  useEffect(() => {
    async function loadBook() {
      try {
        const bookData = await booksAPI.get(bookId);
        setBook(bookData);
      } catch (err) {
        console.error("API error fetching book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [bookId]);

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book);
    openCart();
  };

  if (loading) {
    return <div className="text-center py-40 font-mono text-sm text-gold-400 animate-pulse">{t.common.loading}</div>;
  }

  if (!book) {
    return (
      <div className="section-container pt-32 pb-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">{t.bookDetail.notFound}</h1>
        <Link href="/books" className="inline-flex btn-ghost text-sm">
          {t.bookDetail.toCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container pt-32 pb-20">
      {/* Back button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.bookDetail.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Cover image Column */}
        <div className="flex justify-center md:justify-start">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden glass p-3 border border-white/5 shadow-2xl">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy-900">
              <Image
                src={getImageUrl(book.cover_image)}
                alt={book.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content details Column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 text-xs text-gold-400 font-mono tracking-wider uppercase bg-gold-400/5 px-2.5 py-1 rounded-full border border-gold-400/10">
                <Star weight="fill" className="w-3 h-3" /> 4.8
              </div>
              <span className="text-xs text-text-muted">{t.bookDetail.categoryLabel}: #{book.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              {getLocalizedBookTitle(book, language, t)}
            </h1>

            <span className="text-2xl font-bold font-mono text-gradient-gold block">
              {formatPrice(book.price, language)}
            </span>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
              {getLocalizedBookDesc(book, language, t)}
            </p>
          </div>

          <div className="pt-6 border-t border-navy-600/20 space-y-4 mt-6">
            {/* Purchase CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart weight="bold" className="w-4 h-4" />
                <span>{t.bookDetail.addToCart}</span>
              </button>

              {book.book_file && (
                <a
                  href={getImageUrl(book.book_file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm flex items-center justify-center gap-2"
                >
                  <FilePdf className="w-4 h-4 text-red-400" />
                  <span>{t.bookDetail.readPdf}</span>
                </a>
              )}
            </div>

            <div className="text-xs text-text-muted">
              {book.stock > 0 ? (
                <span className="text-green-400">{t.bookDetail.stockAvailable} ({book.stock})</span>
              ) : (
                <span className="text-red-400">{t.bookDetail.stockOut}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
