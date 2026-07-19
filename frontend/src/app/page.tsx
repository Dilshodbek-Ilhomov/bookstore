"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { booksAPI, categoriesAPI } from "@/lib/api";
import type { Book, Category } from "@/types";
import { ArrowRight, BookOpen, Fire, Trophy, Truck, Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedCategoryName } from "@/lib/i18n";

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Programming", book_count: 5 },
  { id: 2, name: "Science", book_count: 4 },
  { id: 3, name: "Business", book_count: 3 },
  { id: 4, name: "History", book_count: 4 },
  { id: 5, name: "Psychology", book_count: 6 },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguageStore();

  useEffect(() => {
    async function loadData() {
      try {
        const [booksRes, catsRes] = await Promise.all([
          booksAPI.list(),
          categoriesAPI.list(),
        ]);
        if (booksRes && Array.isArray(booksRes.results)) {
          setBooks(booksRes.results);
        } else if (Array.isArray(booksRes)) {
          setBooks(booksRes);
        }
        const catsList = Array.isArray(catsRes) ? catsRes : catsRes?.results;
        if (catsList && Array.isArray(catsList) && catsList.length > 0) {
          setCategories(catsList);
        }
      } catch (err) {
        console.error("API error loading home data:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Map category to localized title and description based on real category name
  const getCategoryDetails = (cat: Category) => {
    const title = getLocalizedCategoryName(cat, language, t);
    const nameLower = (cat.name || "").toLowerCase();
    let desc: string = t.categories.subtitle;
    if (nameLower.includes("programming") || nameLower.includes("dasturlash")) {
      desc = language === "uz"
        ? "Zamonaviy dasturlash tillari, veb va mobil texnologiyalari, algoritmik fikrlash hamda dasturiy ta'minot arxitekturasi bo'yicha eng sara qo'llanmalar."
        : "Master modern programming languages, web & mobile development, algorithms, and software architecture with top industry guides.";
    } else if (nameLower === "science" || nameLower.includes("ilmiy")) {
      desc = language === "uz"
        ? "Koinot sirlari, kvant fizikasi, neyrobiologiya va zamonaviy ilm-fanning eng so'nggi va hayratlanarli kashfiyotlari dunyosi."
        : "Explore the mysteries of the universe, quantum physics, neurobiology, and cutting-edge scientific breakthroughs.";
    } else if (nameLower.includes("business") || nameLower.includes("biznes")) {
      desc = language === "uz"
        ? "Tadbirkorlik, menejment, startap strategiyalari, marketing hamda moliyaviy savodxonlik bo'yicha amaliy kitoblar."
        : "Practical insights on entrepreneurship, management, startup strategies, marketing, and financial literacy.";
    } else if (nameLower.includes("history") || nameLower.includes("tarix")) {
      desc = language === "uz"
        ? "Qadimiy sivilizatsiyalar, buyuk imperiyalar, jahon tarixini o'zgartirgan shaxslar va burilish nuqtalari haqida asarlar."
        : "Discover ancient civilizations, great empires, legendary leaders, and the turning points that shaped world history.";
    } else if (nameLower.includes("psychology") || nameLower.includes("psixologiya") || nameLower.includes("shaxsiy") || nameLower.includes("personal")) {
      desc = language === "uz"
        ? "Inson ruhiyati, o'z-o'zini rivojlantirish, odatlarni shakllantirish, hissiy intellekt va ichki xotirjamlik sari yo'l."
        : "Understand human psychology, personal habits, emotional intelligence, productivity, and inner growth.";
    } else if (nameLower.includes("badiiy") || nameLower.includes("fiction")) {
      desc = t.categories.badiiyDesc;
    } else if (nameLower.includes("bolalar") || nameLower.includes("children")) {
      desc = t.categories.bolalarDesc;
    } else if (typeof cat.book_count === "number") {
      desc = language === "uz" ? `${cat.book_count} ta sara kitoblar to'plami` : `Collection of ${cat.book_count} curated books`;
    }
    return { title, desc };
  };

  return (
    <div className="relative pb-24">
      <HeroSection books={books} loading={loading} />

      {/* Featured / Mashhur kitoblar */}
      <section id="featured" className="section-spacing relative z-10">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/[0.06] px-3 py-1 text-xs text-gold-300 font-medium mb-3">
                <Fire weight="fill" className="w-3.5 h-3.5 text-gold-400" /> {t.featured.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary flex items-center gap-3.5">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_25px_rgba(201,168,76,0.35)] border border-gold-300/30 shrink-0 transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-110">
                  <BookOpen weight="fill" className="w-6 h-6 text-navy-950" />
                </span>
                <span>{t.featured.title}</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Bento categories grid (TasteSkill Asymmetric Layout) */}
      <section id="categories" className="section-spacing relative z-10">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
              {t.categories.title}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              {t.categories.subtitle}
            </p>
          </div>

          {/* Asymmetric Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const bentoClasses = [
                "md:col-span-2 bg-gradient-to-br from-gold-400/[0.08] via-navy-900/90 to-navy-950",
                "md:col-span-1 bg-gradient-to-br from-navy-900/90 to-navy-950",
                "md:col-span-1 bg-gradient-to-br from-navy-900/90 to-navy-950",
                "md:col-span-2 bg-gradient-to-r from-navy-900/90 via-gold-400/[0.06] to-navy-950",
              ];
              const details = getCategoryDetails(category);
              return (
                <ScrollReveal key={category.id} delay={index * 0.1}>
                  <Link
                    href={`/books?category=${category.id}`}
                    className={`group relative flex flex-col justify-between h-64 sm:h-72 p-8 sm:p-10 rounded-3xl border border-white/10 ${bentoClasses[index % bentoClasses.length]} shadow-[0_20px_40px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-500 hover:border-gold-400/40 hover:-translate-y-1 hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.8)] overflow-hidden`}
                  >
                    <span className="sheen-overlay" aria-hidden="true" />
                    
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:border-gold-400/40">
                        <BookOpen weight="thin" className="w-7 h-7 text-gold-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        {typeof category.book_count === "number" && (
                          <span className="inline-flex items-center rounded-full bg-gold-400/10 border border-gold-400/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-gold-300">
                            {category.book_count} {language === "uz" ? "kitob" : "books"}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/5 px-3 py-1 text-xs font-mono text-text-muted group-hover:text-gold-300 transition-colors">
                          {t.categories.explore} →
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-gold-300 transition-colors mb-2">
                        {details.title}
                      </h3>
                      <p className="text-sm text-text-secondary max-w-md line-clamp-2">
                        {details.desc}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps section — Tactile cards layout */}
      <section className="section-spacing relative z-10 border-t border-white/5 bg-navy-900/20">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
              {t.steps.title}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              {t.steps.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group relative flex flex-col p-8 sm:p-10 rounded-3xl border border-white/10 bg-navy-900/60 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-gold-400/35 hover:-translate-y-1 h-full overflow-hidden">
              <span className="sheen-overlay" aria-hidden="true" />
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-6 font-mono font-bold text-xl text-gold-400">
                01
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">{t.steps.step1Title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.steps.step1Desc}
              </p>
            </div>

            <div className="group relative flex flex-col p-8 sm:p-10 rounded-3xl border border-white/10 bg-navy-900/60 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-gold-400/35 hover:-translate-y-1 h-full overflow-hidden">
              <span className="sheen-overlay" aria-hidden="true" />
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-6 font-mono font-bold text-xl text-gold-400">
                02
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">{t.steps.step2Title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.steps.step2Desc}
              </p>
            </div>

            <div className="group relative flex flex-col p-8 sm:p-10 rounded-3xl border border-white/10 bg-navy-900/60 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-gold-400/35 hover:-translate-y-1 h-full overflow-hidden">
              <span className="sheen-overlay" aria-hidden="true" />
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-6 font-mono font-bold text-xl text-gold-400">
                03
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">{t.steps.step3Title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.steps.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
