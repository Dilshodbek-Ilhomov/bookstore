"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { ShoppingBag, User, List, X, BookOpen, ArrowRight, Globe } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { BookStoreLogo } from "@/components/BookStoreLogo";

export function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const totalItems = useCartStore((s) => s.totalItems);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const { language, setLanguage, hydrateLanguage, t } = useLanguageStore();

  useEffect(() => {
    hydrate();
    hydrateCart();
    hydrateLanguage();
  }, [hydrate, hydrateCart, hydrateLanguage]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.books, href: "/books" },
    { label: t.nav.categories, href: "/books?view=categories" },
    // { label: t.nav.about, href: "#about" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-3 left-0 right-0 z-50 px-4 sm:top-4 sm:px-6 lg:top-5 lg:px-8 pointer-events-none transition-all duration-500"
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          {/* Logo Badge */}
          <Link
            href="/"
            aria-label="BookStore Home"
            className="group pointer-events-auto relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-white/[0.12] bg-navy-950/[0.45] px-4 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.2] hover:bg-navy-950/[0.6] hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.22)] active:scale-[0.98]"
          >
            <span className="sheen-overlay" aria-hidden="true" />
            <BookStoreLogo className="w-7 h-7 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-3 shrink-0" />
            <span className="relative text-[16px] font-bold tracking-tight text-text-primary transition-colors duration-300 group-hover:text-white uppercase font-serif">
              BOOK<span className="text-gold-400">STORE</span>
            </span>
          </Link>

          {/* Desktop Nav Pills Container */}
          <div className="pointer-events-auto hidden md:inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-navy-950/[0.45] px-2 py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] hover:bg-navy-950/[0.55]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative inline-flex h-8 items-center overflow-hidden rounded-full px-4 text-sm font-medium tracking-tight text-text-secondary transition-all duration-300 hover:-translate-y-px hover:text-text-primary active:scale-[0.98]"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions Pill */}
          <div className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.12] bg-navy-950/[0.45] px-2 py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
            {/* Language Switcher Segmented Control */}
            <div className="hidden md:inline-flex h-8 items-center rounded-full bg-white/[0.04] p-0.5 ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setLanguage("uz")}
                aria-label="O'zbek tili"
                className={`flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-mono font-bold transition-all duration-300 ${
                  language === "uz"
                    ? "bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 shadow-sm scale-[1.02]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-label="English language"
                className={`flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-mono font-bold transition-all duration-300 ${
                  language === "en"
                    ? "bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 shadow-sm scale-[1.02]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                EN
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              aria-label={t.nav.cart}
              className="group relative inline-flex h-8 items-center gap-2 overflow-hidden rounded-full bg-white/[0.05] backdrop-blur-md saturate-150 px-3 text-sm font-medium text-text-primary ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-px hover:bg-white/[0.1] hover:text-gold-400 active:scale-[0.98]"
            >
              <span className="sheen-overlay" aria-hidden="true" />
              <ShoppingBag weight="bold" className="w-4 h-4 text-gold-400 relative z-10" />
              <span className="font-mono text-xs font-semibold tabular-nums relative z-10">
                {totalItems()}
              </span>
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="group relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/[0.05] backdrop-blur-md text-text-secondary ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-px hover:text-gold-400 active:scale-[0.98]"
                aria-label={t.nav.profile}
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <User weight="bold" className="w-4 h-4 relative z-10" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="group/btn relative hidden sm:inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-4 text-xs font-semibold text-navy-950 border border-white/25 backdrop-blur-md shadow-[0_6px_16px_-6px_rgba(201,168,76,0.5)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_10px_22px_-6px_rgba(201,168,76,0.7)] active:scale-[0.98]"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <span className="relative z-10">{t.nav.login}</span>
                <ArrowRight weight="bold" className="relative z-10 w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-text-primary ring-1 ring-white/10 transition-all hover:bg-white/[0.08] active:scale-95"
              aria-label="Menu"
            >
              {isMobileOpen ? (
                <X weight="bold" className="w-4 h-4" />
              ) : (
                <List weight="bold" className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-3 mx-auto max-w-7xl rounded-3xl border border-white/[0.12] bg-navy-950/[0.65] p-3.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {/* Mobile Language Selector */}
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-2.5 mb-2">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Globe weight="bold" className="w-4 h-4 text-gold-400" />
                    {t.common.selectLanguage}
                  </span>
                  <div className="inline-flex h-8 items-center rounded-full bg-white/[0.06] p-0.5 ring-1 ring-white/10">
                    <button
                      type="button"
                      onClick={() => setLanguage("uz")}
                      className={`flex h-7 items-center justify-center rounded-full px-3 text-xs font-mono font-bold transition-all ${
                        language === "uz"
                          ? "bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 shadow-sm"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      UZ
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage("en")}
                      className={`flex h-7 items-center justify-center rounded-full px-3 text-xs font-mono font-bold transition-all ${
                        language === "en"
                          ? "bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 shadow-sm"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:bg-white/[0.04] hover:text-text-primary"
                  >
                    <span>{link.label}</span>
                    <ArrowRight weight="bold" className="w-3.5 h-3.5 text-gold-400" />
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white/[0.08] py-3.5 text-sm font-semibold text-gold-400 border border-gold-400/20 shadow-lg"
                  >
                    <User weight="bold" className="w-4 h-4" />
                    <span>{t.nav.profile}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 py-3.5 text-sm font-semibold text-navy-950 shadow-lg"
                  >
                    <span>{t.nav.login}</span>
                    <ArrowRight weight="bold" className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
