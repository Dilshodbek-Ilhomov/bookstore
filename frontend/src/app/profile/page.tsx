"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ordersAPI } from "@/lib/api";
import type { Order } from "@/types";
import { formatDate, formatPrice, getImageUrl } from "@/lib/utils";
import { User, SignOut, Receipt, BookOpen, BellRinging, CheckCircle, XCircle, Clock, ArrowsClockwise, FilePdf, DownloadSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle } from "@/lib/i18n";
import { PDFReaderModal } from "@/components/PDFReaderModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, hydrate } = useAuthStore();
  const { language, t } = useLanguageStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ id: number; prev: string; next: string } | null>(null);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<number | null>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; url: string } | null>(null);
  const prevOrdersRef = useRef<Order[]>([]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const loadOrders = useCallback(async (isSilent = false) => {
    if (!isAuthenticated) return;
    if (isSilent) setSyncing(true);
    try {
      const res = await ordersAPI.list();
      const newOrders = res?.results || (Array.isArray(res) ? res : []);
      
      // Detect if any order status changed (e.g., admin changed pending -> completed or cancelled)
      if (prevOrdersRef.current.length > 0 && newOrders.length > 0) {
        for (const newOrder of newOrders) {
          const oldOrder = prevOrdersRef.current.find((o) => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            setStatusAlert({ id: newOrder.id, prev: oldOrder.status, next: newOrder.status });
            setRecentlyUpdatedId(newOrder.id);
            setTimeout(() => {
              setRecentlyUpdatedId(null);
            }, 7000);
            break;
          }
        }
      }

      setOrders(newOrders);
      prevOrdersRef.current = newOrders;
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      if (!isSilent) setLoading(false);
      if (isSilent) setSyncing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadOrders(false);

    // Real-Time Polling: automatically sync orders every 3.5 seconds when tab is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadOrders(true);
      }
    }, 3500);

    const handleFocusOrVisibility = () => {
      if (document.visibilityState === "visible") {
        loadOrders(true);
      }
    };

    window.addEventListener("focus", handleFocusOrVisibility);
    document.addEventListener("visibilitychange", handleFocusOrVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocusOrVisibility);
      document.removeEventListener("visibilitychange", handleFocusOrVisibility);
    };
  }, [isAuthenticated, router, loadOrders]);

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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gold-400" /> {t.profilePage.myOrders}
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <ArrowsClockwise
                className={`w-4 h-4 text-gold-400 transition-all ${syncing ? "animate-spin opacity-100" : "opacity-40"}`}
              />
              <span className="font-mono text-[11px] hidden sm:inline">
                {syncing ? (language === "uz" ? "Yangilanmoqda..." : "Syncing...") : (language === "uz" ? "Jonli aloqada (Real-time)" : "Live sync active")}
              </span>
            </div>
          </div>

          {/* Status Change Toast Alert */}
          {statusAlert && (
            <div className="p-4 rounded-2xl bg-gold-400/15 border border-gold-400 text-text-primary shadow-[0_0_25px_rgba(201,168,76,0.25)] flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <BellRinging weight="fill" className="w-6 h-6 text-gold-400 shrink-0 animate-bounce" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-gold-300">
                    {language === "uz" ? `Buyurtma #${statusAlert.id} holati yangilandi!` : `Order #${statusAlert.id} status updated!`}
                  </span>{" "}
                  <span className="text-text-secondary">
                    (
                    {statusAlert.prev === "completed"
                      ? t.profilePage.statusCompleted
                      : statusAlert.prev === "cancelled"
                        ? t.profilePage.statusCancelled
                        : t.profilePage.statusPending}{" "}
                    →{" "}
                    <strong className="text-white font-semibold">
                      {statusAlert.next === "completed"
                        ? t.profilePage.statusCompleted
                        : statusAlert.next === "cancelled"
                          ? t.profilePage.statusCancelled
                          : t.profilePage.statusPending}
                    </strong>
                    )
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStatusAlert(null)}
                className="text-xs font-mono text-gold-400 hover:underline shrink-0"
              >
                {language === "uz" ? "Yopish" : "Dismiss"}
              </button>
            </div>
          )}

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
              {orders.map((order) => {
                const isUpdated = recentlyUpdatedId === order.id;
                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isUpdated
                        ? "bg-gold-400/10 border-gold-400 shadow-[0_0_30px_rgba(201,168,76,0.3)] ring-2 ring-gold-400/50"
                        : "glass border-white/5"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gold-400 font-semibold">
                          {t.profilePage.orderNumber}{order.id}
                        </span>
                        {isUpdated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold-400 text-navy-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            {language === "uz" ? "Yangi holat" : "Updated"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">
                        {t.profilePage.dateLabel} {formatDate(order.created_at, language)}
                      </p>
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-xs text-text-primary shadow-sm"
                          >
                            <BookOpen className="w-4 h-4 text-gold-400 shrink-0" />
                            {item.book ? (
                              <Link
                                href={`/books/${item.book.id}`}
                                className="font-medium hover:text-gold-300 transition-colors"
                              >
                                {getLocalizedBookTitle(item.book, language, t)}
                              </Link>
                            ) : (
                              <span>Kitob</span>
                            )}
                            <span className="text-text-muted font-mono text-[11px]">x{item.quantity}</span>

                            {order.status === "completed" && item.book?.book_file && (
                              <div className="ml-1 inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setActivePdf({
                                    title: getLocalizedBookTitle(item.book!, language, t),
                                    url: getImageUrl(item.book!.book_file!),
                                  })}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 hover:text-red-300 transition-all font-semibold shadow-sm text-[11px] font-mono uppercase tracking-wider"
                                >
                                  <FilePdf weight="fill" className="w-3.5 h-3.5 shrink-0" />
                                  <span>{language === "uz" ? "PDF O'qish" : "Read PDF"}</span>
                                </button>
                                <a
                                  href={`/api/proxy-pdf?url=${encodeURIComponent(getImageUrl(item.book.book_file))}&download=1`}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gold-400/15 border border-gold-400/30 text-gold-400 hover:bg-gold-400/25 hover:border-gold-400/50 transition-all font-semibold shadow-sm text-[11px] font-mono"
                                  title={language === "uz" ? "Srazu yuklab olish" : "Download"}
                                >
                                  <DownloadSimple weight="bold" className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                          order.status === "completed"
                            ? "bg-green-500/15 text-green-400 border border-green-500/30"
                            : order.status === "cancelled"
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {order.status === "completed" ? (
                          <CheckCircle weight="fill" className="w-4 h-4 text-green-400" />
                        ) : order.status === "cancelled" ? (
                          <XCircle weight="fill" className="w-4 h-4 text-red-400" />
                        ) : (
                          <Clock weight="fill" className="w-4 h-4 text-yellow-400" />
                        )}
                        <span>
                          {order.status === "completed"
                            ? t.profilePage.statusCompleted
                            : order.status === "cancelled"
                              ? t.profilePage.statusCancelled
                              : t.profilePage.statusPending}
                        </span>
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activePdf && (
        <PDFReaderModal
          isOpen={!!activePdf}
          onClose={() => setActivePdf(null)}
          title={activePdf.title}
          pdfUrl={activePdf.url}
        />
      )}
    </div>
  );
}
