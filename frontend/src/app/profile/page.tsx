"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ordersAPI } from "@/lib/api";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { User, SignOut, Receipt, BookOpen } from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle } from "@/lib/i18n";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, hydrate } = useAuthStore();
  const { language, t } = useLanguageStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function loadOrders() {
      try {
        const res = await ordersAPI.list();
        if (res?.results) {
          setOrders(res.results);
        }
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return (
    <div className="section-container pt-32 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User Card */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 h-fit">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
              <User weight="bold" className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="divider-gold opacity-20" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <SignOut weight="bold" className="w-4 h-4" />
            {t.profilePage.logout}
          </button>
        </div>

        {/* Orders list */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gold-400" /> {t.profilePage.myOrders}
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl glass animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center text-text-secondary">
              <p className="text-sm">{t.profilePage.noOrders}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-gold-400 font-semibold">
                      {t.profilePage.orderNumber}{order.id}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {t.profilePage.dateLabel} {formatDate(order.created_at, language)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items?.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-white/5 text-[11px] text-text-secondary"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-gold-400/60" />
                          {item.book ? getLocalizedBookTitle(item.book, language, t) : ""} x {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        order.status === "completed"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : order.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {order.status === "completed"
                        ? t.profilePage.statusCompleted
                        : order.status === "cancelled"
                          ? t.profilePage.statusCancelled
                          : t.profilePage.statusPending}
                    </span>
                    <span className="text-sm font-bold font-mono text-text-primary">
                      {formatPrice(
                        order.items?.reduce(
                          (sum, item) => sum + parseFloat(item.total_price),
                          0
                        ) || 0,
                        language
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
