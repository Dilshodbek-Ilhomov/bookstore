"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash, Minus, Plus, ShoppingBag } from "@phosphor-icons/react";
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
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-navy-950 border-l border-navy-600/30 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-navy-600/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag weight="bold" className="w-5 h-5 text-gold-400" />
                <h2 className="text-lg font-bold text-text-primary">{t.cart.title}</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.03] transition-colors"
                aria-label={t.common.close}
              >
                <X weight="bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary space-y-4">
                  <ShoppingBag weight="thin" className="w-16 h-16 text-navy-600" />
                  <p className="text-sm">{t.cart.empty}</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.book.id}
                    className="flex gap-4 p-3 rounded-xl bg-navy-900/40 border border-white/[0.02]"
                  >
                    <div className="relative w-16 aspect-[3/4] overflow-hidden rounded-lg bg-navy-900 shrink-0">
                      <Image
                        src={getImageUrl(item.book.cover_image)}
                        alt={getLocalizedBookTitle(item.book, language, t)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary line-clamp-1">
                          {getLocalizedBookTitle(item.book, language, t)}
                        </h4>
                        <span className="text-xs text-gold-400 font-mono">
                          {formatPrice(item.book.price, language)}
                        </span>
                      </div>
                      
                      {/* Quantity Controller & Delete */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-navy-800 rounded-lg p-1 border border-white/[0.04]">
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                            className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-semibold px-2 w-6 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.book.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          aria-label={t.cart.delete}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-navy-600/20 bg-navy-900/20 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{t.cart.total}</span>
                  <span className="text-lg font-bold font-mono text-gold-400">
                    {formatPrice(totalPrice(), language)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full btn-gold text-sm text-center block"
                >
                  <span>{t.cart.checkout}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
