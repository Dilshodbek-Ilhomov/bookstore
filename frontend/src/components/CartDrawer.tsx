"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash, Minus, Plus, ShoppingBag, ArrowRight } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { ordersAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle } from "@/lib/i18n";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguageStore();

  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert(t.cart.loginRequired);
      window.location.href = "/login";
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        book: item.book.id,
        quantity: item.quantity,
      }));
      await ordersAPI.create(orderItems);
      alert(t.cart.successOrder);
      clearCart();
      closeCart();
    } catch (err: any) {
      alert(`${t.cart.errorOrder}: ${err.message || ""}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Futuristic Backdrop overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md"
          />

          {/* Futuristic Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", willChange: "transform" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-gradient-to-b from-navy-950 via-[#0a0f1d] to-navy-950 border-l border-gold-400/30 sm:rounded-l-3xl flex flex-col shadow-[-20px_0_60px_rgba(201,168,76,0.18)] overflow-hidden gpu-layer"
          >
            {/* Top glowing neon accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-80 shadow-[0_0_15px_#c9a84c]" aria-hidden="true" />

            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-navy-900/40 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.25)]">
                  <ShoppingBag weight="fill" className="w-5 h-5 text-gold-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                    <span>{t.cart.title}</span>
                    {totalItemCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-mono font-bold shadow-[0_0_10px_rgba(201,168,76,0.3)]">
                        {totalItemCount}
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] text-text-secondary hover:text-white hover:border-gold-400/50 hover:bg-gold-400/10 transition-all flex items-center justify-center shadow-sm active:scale-90"
                aria-label={t.common.close}
              >
                <X weight="bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center text-text-secondary space-y-4 px-6 py-12"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner relative">
                    <ShoppingBag weight="thin" className="w-10 h-10 text-gold-400/60" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary">
                      {t.cart.empty}
                    </h3>
                    <p className="text-xs text-text-muted max-w-[220px]">
                      {language === "uz"
                        ? "Kitoblarni tanlab, savatingizni to'ldiring."
                        : "Select books to fill your cart."}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.book.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="group relative flex gap-3.5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent border border-white/10 hover:border-gold-400/40 transition-all duration-300 shadow-lg"
                    >
                      <span className="sheen-overlay opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />

                      {/* Cover Image */}
                      <div className="relative w-16 h-22 sm:w-18 sm:h-24 aspect-[3/4] overflow-hidden rounded-xl bg-navy-950 shrink-0 border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={getImageUrl(item.book.cover_image)}
                          alt={getLocalizedBookTitle(item.book, language, t)}
                          fill
                          className="object-cover select-none pointer-events-none"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-text-primary line-clamp-1 group-hover:text-gold-300 transition-colors">
                            {getLocalizedBookTitle(item.book, language, t)}
                          </h4>
                          <span className="text-xs sm:text-sm font-mono font-bold text-gradient-gold block">
                            {formatPrice(item.book.price, language)}
                          </span>
                        </div>

                        {/* Quantity Controller & Delete */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5 bg-navy-950/90 rounded-xl p-1 border border-gold-400/20 shadow-inner">
                            <button
                              onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-300 hover:bg-white/10 transition-colors active:scale-90"
                              aria-label="Decrease quantity"
                            >
                              <Minus weight="bold" className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold px-2 w-6 text-center text-text-primary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-300 hover:bg-white/10 transition-colors active:scale-90"
                              aria-label="Increase quantity"
                            >
                              <Plus weight="bold" className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.book.id)}
                            className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all active:scale-90"
                            aria-label={t.cart.delete}
                          >
                            <Trash weight="bold" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-gold-400/20 bg-navy-950/95 backdrop-blur-xl space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-mono tracking-wider text-text-secondary">
                      {t.cart.total}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {totalItemCount} {language === "uz" ? "ta kitob" : "items"}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-gradient-gold drop-shadow-[0_0_15px_rgba(201,168,76,0.4)]">
                    {formatPrice(totalPrice(), language)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 p-[1px] shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(201,168,76,0.6)] hover:scale-[1.01] active:scale-[0.98]"
                >
                  <span className="sheen-overlay" aria-hidden="true" />
                  <div className="h-13 sm:h-14 w-full bg-navy-950/25 backdrop-blur-md group-hover:bg-transparent transition-colors rounded-2xl flex items-center justify-center gap-2.5 font-bold tracking-wide text-navy-950 text-sm sm:text-base uppercase">
                    <span className="relative z-10">{t.cart.checkout}</span>
                    <ArrowRight weight="bold" className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
