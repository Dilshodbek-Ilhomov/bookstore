"use client";

import Link from "next/link";
import {
  BookOpen,
  EnvelopeSimple,
  MapPin,
  Phone,
  InstagramLogo,
  TelegramLogo,
  FacebookLogo,
} from "@phosphor-icons/react/dist/ssr";
import { useLanguageStore } from "@/store/languageStore";
import { BookStoreLogo } from "@/components/BookStoreLogo";

export function PremiumFooter() {
  const { t } = useLanguageStore();

  const footerLinks = {
    sahifalar: [
      { label: t.nav.home, href: "/" },
      { label: t.nav.books, href: "/books" },
      { label: t.nav.categories, href: "/books?view=categories" },
      { label: t.nav.about, href: "#about" },
    ],
    yordam: [
      { label: t.footer.delivery, href: "#" },
      { label: t.footer.payments, href: "#" },
      { label: t.footer.refunds, href: "#" },
      { label: t.footer.contact, href: "#contact" },
    ],
  };

  return (
    <footer className="relative bg-navy-950 border-t border-navy-600/40">
      {/* Gold divider */}
      <div className="divider-gold" />

      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Brand Column */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BookStoreLogo className="w-9 h-9 shrink-0" />
              <div className="flex flex-col -space-y-0.5">
                <span className="text-sm font-bold tracking-wide text-text-primary">
                  BOOK<span className="text-gold-400">STORE</span>
                </span>
                <span className="text-[9px] tracking-[0.2em] text-text-muted uppercase font-mono">
                  Read More, Grow More
                </span>
              </div>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[42ch]">
              {t.footer.desc}
            </p>
          </div>

          {/* Links — Sahifalar */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start border-t md:border-t-0 pt-8 md:pt-0 border-white/5">
            <h3 className="text-sm font-semibold text-text-primary mb-5 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>{t.footer.pages}</span>
            </h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3.5 w-full">
              {footerLinks.sahifalar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-400 transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-gold-400 transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-navy-600/30 flex items-center justify-between">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
