"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { booksAPI, categoriesAPI } from "@/lib/api";
import type { Book, Category } from "@/types";
import {
  ArrowRight,
  BookOpen,
  Fire,
  Trophy,
  Truck,
  Star,
  Code,
  Atom,
  TrendUp,
  Hourglass,
  Brain,
  Compass,
  Books,
  Crown,
} from "@phosphor-icons/react";
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

  // Custom high-end visual styles and Phosphor icons for each category
  const getCategoryTheme = (cat: Category, index: number) => {
    const nameLower = (cat.name || "").toLowerCase();
    if (nameLower.includes("programming") || nameLower.includes("dasturlash") || nameLower.includes("code")) {
      return {
        icon: <Code weight="bold" className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-cyan-500/[0.12] via-navy-900/95 to-navy-950 border-cyan-500/30 hover:border-cyan-400/80 shadow-[0_15px_35px_-12px_rgba(6,182,212,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(6,182,212,0.4)]",
        badge: "bg-cyan-400/10 border-cyan-400/30 text-cyan-300",
        glow: "bg-cyan-500/15",
        iconBox: "bg-cyan-400/10 border-cyan-400/30",
        accentText: "group-hover:text-cyan-300",
      };
    }
    if (nameLower.includes("science") || nameLower.includes("ilmiy") || nameLower.includes("adabiyot")) {
      return {
        icon: <Atom weight="bold" className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-purple-500/[0.12] via-navy-900/95 to-navy-950 border-purple-500/30 hover:border-purple-400/80 shadow-[0_15px_35px_-12px_rgba(168,85,247,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(168,85,247,0.4)]",
        badge: "bg-purple-400/10 border-purple-400/30 text-purple-300",
        glow: "bg-purple-500/15",
        iconBox: "bg-purple-400/10 border-purple-400/30",
        accentText: "group-hover:text-purple-300",
      };
    }
    if (nameLower.includes("business") || nameLower.includes("biznes") || nameLower.includes("iqtisod")) {
      return {
        icon: <TrendUp weight="bold" className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-emerald-500/[0.12] via-navy-900/95 to-navy-950 border-emerald-500/30 hover:border-emerald-400/80 shadow-[0_15px_35px_-12px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(16,185,129,0.4)]",
        badge: "bg-emerald-400/10 border-emerald-400/30 text-emerald-300",
        glow: "bg-emerald-500/15",
        iconBox: "bg-emerald-400/10 border-emerald-400/30",
        accentText: "group-hover:text-emerald-300",
      };
    }
    if (nameLower.includes("history") || nameLower.includes("tarix") || nameLower.includes("tarixiy")) {
      return {
        icon: <Hourglass weight="bold" className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-amber-500/[0.12] via-navy-900/95 to-navy-950 border-amber-500/30 hover:border-amber-400/80 shadow-[0_15px_35px_-12px_rgba(245,158,11,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.4)]",
        badge: "bg-amber-400/10 border-amber-400/30 text-amber-300",
        glow: "bg-amber-500/15",
        iconBox: "bg-amber-400/10 border-amber-400/30",
        accentText: "group-hover:text-amber-300",
      };
    }
    if (nameLower.includes("psychology") || nameLower.includes("psixologiya") || nameLower.includes("shaxsiy") || nameLower.includes("rivojlanish")) {
      return {
        icon: <Brain weight="bold" className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-rose-500/[0.12] via-navy-900/95 to-navy-950 border-rose-500/30 hover:border-rose-400/80 shadow-[0_15px_35px_-12px_rgba(244,63,94,0.25)] hover:shadow-[0_20px_45px_-10px_rgba(244,63,94,0.4)]",
        badge: "bg-rose-400/10 border-rose-400/30 text-rose-300",
        glow: "bg-rose-500/15",
        iconBox: "bg-rose-400/10 border-rose-400/30",
        accentText: "group-hover:text-rose-300",
      };
    }
    const fallbacks = [
      {
        icon: <BookOpen weight="bold" className="w-8 h-8 text-gold-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-gold-400/[0.12] via-navy-900/95 to-navy-950 border-gold-400/30 hover:border-gold-400/80 shadow-[0_15px_35px_-12px_rgba(201,168,76,0.25)]",
        badge: "bg-gold-400/10 border-gold-400/30 text-gold-300",
        glow: "bg-gold-500/15",
        iconBox: "bg-gold-400/10 border-gold-400/30",
        accentText: "group-hover:text-gold-300",
      },
      {
        icon: <Books weight="bold" className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />,
        bgCard: "bg-gradient-to-br from-cyan-400/[0.12] via-navy-900/95 to-navy-950 border-cyan-400/30 hover:border-cyan-400/80 shadow-[0_15px_35px_-12px_rgba(6,182,212,0.25)]",
        badge: "bg-cyan-400/10 border-cyan-400/30 text-cyan-300",
        glow: "bg-cyan-500/15",
        iconBox: "bg-cyan-400/10 border-cyan-400/30",
        accentText: "group-hover:text-cyan-300",
      },
    ];
    return fallbacks[index % fallbacks.length];
  };

  // Dynamic gapless 6-column bento span layout (ensures rows fill up perfectly without blank spots)
  const getBentoSpan = (idx: number, total: number) => {
    if (total === 5) {
      // Top row: 2 large feature cards (3 + 3 = 6 cols)
      // Bottom row: 3 equal cards (2 + 2 + 2 = 6 cols)
      if (idx === 0 || idx === 1) return "md:col-span-3 min-h-[300px] sm:min-h-[330px]";
      return "md:col-span-2 min-h-[270px] sm:min-h-[300px]";
    }
    if (total === 6) {
      return "md:col-span-2 min-h-[280px] sm:min-h-[310px]";
    }
    if (total === 4) {
      return "md:col-span-3 min-h-[300px] sm:min-h-[330px]";
    }
    const pattern = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];
    return (pattern[idx % pattern.length] || "md:col-span-2") + " min-h-[280px] sm:min-h-[310px]";
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-3xl bg-navy-900/60 animate-pulse border border-white/5"
                  />
                ))
              : books
                  .slice(0, 5)
                  .map((book) => <BookCard key={book.id} book={book} />)}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-navy-900/80 border border-white/10 hover:border-gold-400/40 text-sm font-semibold text-text-primary hover:text-gold-300 transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.2)]"
            >
              {t.featured.allBooks} <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento categories grid (TasteSkill / UI-UX Pro Max Gapless Creative Layout) */}
      <section id="categories" className="section-spacing relative z-10">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-4 flex items-center gap-3.5">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-navy-900 border border-gold-400/30 shrink-0 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                <Compass weight="fill" className="w-6 h-6 text-gold-400" />
              </span>
              <span>{t.categories.title}</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              {t.categories.subtitle}
            </p>
          </div>

          {/* Gapless 6-column Dynamic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-7">
            {categories.map((category, index) => {
              const theme = getCategoryTheme(category, index);
              const details = getCategoryDetails(category);
              const spanClass = getBentoSpan(index, categories.length);

              return (
                <ScrollReveal key={category.id || index} delay={index * 0.08} className={spanClass}>
                  <Link
                    href={`/books?category=${category.id}`}
                    className={`group relative flex flex-col justify-between h-full p-7 sm:p-9 rounded-3xl border ${theme.bgCard} backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden`}
                  >
                    {/* Micro-sheen reflection overlay */}
                    <span className="sheen-overlay" aria-hidden="true" />

                    {/* Ambient background glow radial */}
                    <div
                      className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[65px] ${theme.glow} opacity-60 group-hover:opacity-100 transition-all duration-700 pointer-events-none`}
                    />

                    {/* Card Header: Icon & Badges */}
                    <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg ${theme.iconBox}`}
                      >
                        {theme.icon}
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {typeof category.book_count === "number" && (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wide border shadow-sm ${theme.badge}`}
                          >
                            {category.book_count} {language === "uz" ? "kitob" : "books"}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-3.5 py-1 text-xs font-mono text-text-muted group-hover:text-white group-hover:border-white/20 transition-all">
                          <span>{t.categories.explore}</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body: Title & Description */}
                    <div className="relative z-10">
                      <h3
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary ${theme.accentText} transition-colors duration-300 mb-3`}
                      >
                        {details.title}
                      </h3>
                      <p className="text-sm sm:text-base text-text-secondary/90 leading-relaxed max-w-xl line-clamp-3 group-hover:text-text-primary/95 transition-colors duration-300">
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
