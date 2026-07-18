"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { booksAPI, categoriesAPI } from "@/lib/api";
import type { Book, Category } from "@/types";
import { Funnel, MagnifyingGlass, ArrowsDownUp } from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedCategoryName } from "@/lib/i18n";

// Mock Fallback Books in case API results are empty
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Badiiy adabiyot" },
  { id: 2, name: "Shaxsiy rivojlanish" },
  { id: 3, name: "Bolalar adabiyoti" },
  { id: 4, name: "Ilmiy-ommabop" },
];

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguageStore();
  
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search") || "";
  const currentOrdering = searchParams.get("ordering") || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(currentSearch);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const catId = currentCategory ? parseInt(currentCategory) : undefined;
        const [booksRes, catsRes] = await Promise.all([
          booksAPI.list({
            category: catId,
            search: currentSearch || undefined,
            ordering: currentOrdering || undefined,
          }),
          categoriesAPI.list(),
        ]);
        
        if (booksRes?.results) {
          setBooks(booksRes.results);
        } else {
          setBooks([]);
        }

        if (catsRes?.results?.length > 0) {
          setCategories(catsRes.results);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("API error when fetching books:", err);
        setBooks([]);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentCategory, currentSearch, currentOrdering]);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/books?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchVal);
  };

  return (
    <div className="section-container pt-32 pb-20">
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.booksPage.title}</h1>
        <p className="text-text-secondary text-sm">{t.booksPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t.booksPage.searchPlaceholder}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-600/40 text-sm text-text-primary focus:outline-none focus:border-gold-400 transition-colors"
            />
            <MagnifyingGlass className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
          </form>

          {/* Categories list */}
          <div className="glass p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Funnel className="w-4 h-4 text-gold-400" />
              {t.booksPage.categoriesHeader}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => updateFilters("category", null)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  !currentCategory
                    ? "bg-gold-400/10 text-gold-400"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                }`}
              >
                {t.booksPage.filterAll}
              </button>
              {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters("category", String(cat.id))}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentCategory === String(cat.id)
                        ? "bg-gold-400/10 text-gold-400"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                    }`}
                  >
                    {getLocalizedCategoryName(cat, language, t)}
                  </button>
                ))}
            </div>
          </div>

          {/* Ordering list */}
          <div className="glass p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <ArrowsDownUp className="w-4 h-4 text-gold-400" />
              {t.booksPage.sortDefault}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => updateFilters("ordering", null)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  !currentOrdering
                    ? "bg-gold-400/10 text-gold-400"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                }`}
              >
                {t.booksPage.sortStandard}
              </button>
              <button
                onClick={() => updateFilters("ordering", "price")}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentOrdering === "price"
                    ? "bg-gold-400/10 text-gold-400"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                }`}
              >
                {t.booksPage.sortPriceAsc}
              </button>
              <button
                onClick={() => updateFilters("ordering", "-price")}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentOrdering === "-price"
                    ? "bg-gold-400/10 text-gold-400"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                }`}
              >
                {t.booksPage.sortPriceDesc}
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-text-secondary">
              <p className="text-sm">{t.booksPage.emptyTitle}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="text-center pt-40 font-mono text-sm text-gold-400 animate-pulse">Loading catalog / Yuklanmoqda...</div>}>
      <BooksContent />
    </Suspense>
  );
}
