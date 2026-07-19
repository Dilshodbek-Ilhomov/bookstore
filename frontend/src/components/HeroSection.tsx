"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, BookOpen, Crown, ArrowRight, Star, Lightning } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle, getLocalizedBookDesc } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { Book } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  books?: Book[];
  loading?: boolean;
}

export function HeroSection({ books = [], loading = false }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { language, t } = useLanguageStore();

  const topBook = books.length > 0 ? books[0] : null;
  const miniBook1 = books.length > 1 ? books[1] : null;
  const miniBook2 = books.length > 2 ? books[2] : null;

  useEffect(() => {
    if (reduce || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle background glow parallax
      gsap.to(".hero-orb", {
        y: 80,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Background with clean stone/mesh feel */}
      <div className="absolute inset-0 bg-navy-950 pointer-events-none">
        <div className="hero-orb absolute top-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-gold-400/[0.05] blur-[120px]" />
        <div className="hero-orb absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-gold-400/[0.03] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="section-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-12 lg:gap-10 items-center">
          
          {/* Left Column — Clean Copy & Command CTA */}
          <div className="max-w-xl">
            {/* Display Headline */}
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02] text-text-primary mb-5"
            >
              {t.hero.title1}{" "}
              <span className="text-gradient-gold">{t.hero.title2}</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[48ch] mb-8"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/books"
                className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-4 text-sm font-semibold text-navy-950 shadow-[0_14px_32px_-8px_rgba(201,168,76,0.45)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_20px_40px_-10px_rgba(201,168,76,0.65)] active:scale-[0.98]"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <span className="relative z-10">{t.hero.catalogCta}</span>
                <ArrowRight weight="bold" className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              <Link
                href="#featured"
                className="group relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-medium text-text-primary transition-all duration-300 hover:-translate-y-px hover:border-gold-400/35 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <span>{t.hero.featuredCta}</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column — Fast, Clean Bento Showcase Stack */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden md:flex flex-col gap-4"
          >
            {loading ? (
              <>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg bg-white/5" />
                      <div className="space-y-2 flex-1">
                        <div className="w-20 h-4 bg-white/5 rounded" />
                        <div className="w-3/4 h-5 bg-white/10 rounded" />
                        <div className="w-1/2 h-3 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex justify-between">
                      <div className="w-24 h-5 bg-white/10 rounded" />
                      <div className="w-16 h-4 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 p-4 shadow-lg animate-pulse space-y-2">
                    <div className="w-20 h-3 bg-white/5 rounded" />
                    <div className="w-full h-4 bg-white/10 rounded" />
                    <div className="w-16 h-3 bg-white/5 rounded" />
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 p-4 shadow-lg animate-pulse space-y-2">
                    <div className="w-20 h-3 bg-white/5 rounded" />
                    <div className="w-full h-4 bg-white/10 rounded" />
                    <div className="w-16 h-3 bg-white/5 rounded" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Top Showcase Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-500 hover:border-gold-400/35 hover:-translate-y-1">
                  <span className="sheen-overlay" aria-hidden="true" />
                  
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-gold-400/20 to-navy-800 flex items-center justify-center border border-gold-400/20 shrink-0 overflow-hidden relative">
                        {topBook?.cover_image ? (
                          <img
                            src={topBook.cover_image}
                            alt={topBook.title}
                            className="w-full h-full object-cover select-none pointer-events-none"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                          />
                        ) : (
                          <BookOpen weight="thin" className="w-6 h-6 text-gold-400" />
                        )}
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded mb-1">
                          <Crown weight="fill" className="w-3.5 h-3.5 text-gold-400" /> {t.hero.bestseller}
                        </span>
                        <h3 className="text-lg font-bold text-text-primary line-clamp-1">
                          {topBook ? getLocalizedBookTitle(topBook, language, t) : t.hero.fallbackTopTitle}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {topBook ? getLocalizedBookDesc(topBook, language, t) : t.hero.subtext1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400 font-mono font-bold text-sm bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5 shrink-0">
                      <Star weight="fill" className="w-3.5 h-3.5" /> 4.9
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-base font-bold font-mono text-text-primary">
                      {topBook ? formatPrice(topBook.price, language) : formatPrice(45000, language)}
                    </span>
                    <Link
                      href={topBook ? `/books/${topBook.id}` : "/books/1"}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      {t.hero.view} <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Dual Mini-Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href={miniBook1 ? `/books/${miniBook1.id}` : "/books/2"}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 p-4 shadow-lg transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 block"
                  >
                    <span className="sheen-overlay" aria-hidden="true" />
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                      <BookOpen weight="bold" className="w-3.5 h-3.5 text-gold-400" /> {t.hero.subtext2}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                      {miniBook1 ? getLocalizedBookTitle(miniBook1, language, t) : t.hero.fallbackMini1Title}
                    </h4>
                    <div className="mt-2 text-xs font-mono font-semibold text-gold-400">
                      {miniBook1 ? formatPrice(miniBook1.price, language) : formatPrice(38000, language)}
                    </div>
                  </Link>

                  <Link
                    href={miniBook2 ? `/books/${miniBook2.id}` : "/books/3"}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 p-4 shadow-lg transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 block"
                  >
                    <span className="sheen-overlay" aria-hidden="true" />
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                      <BookOpen weight="bold" className="w-3.5 h-3.5 text-gold-400" /> {t.hero.subtext3}
                    </div>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                      {miniBook2 ? getLocalizedBookTitle(miniBook2, language, t) : t.hero.fallbackMini2Title}
                    </h4>
                    <div className="mt-2 text-xs font-mono font-semibold text-gold-400">
                      {miniBook2 ? formatPrice(miniBook2.price, language) : formatPrice(32000, language)}
                    </div>
                  </Link>
                </div>
              </>
            )}

          </motion.div>
        </div>

        {/* Minimalist Scroll indicator */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="mt-16 flex justify-center lg:mt-20"
        >
          <motion.div
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-text-muted text-xs font-mono tracking-wider"
          >
            <span>{t.hero.scrollDown}</span>
            <ArrowDown weight="bold" className="w-3.5 h-3.5 text-gold-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
