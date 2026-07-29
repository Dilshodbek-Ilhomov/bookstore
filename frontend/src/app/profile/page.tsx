"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ordersAPI, authAPI } from "@/lib/api";
import type { Order, User as UserType } from "@/types";
import { formatDate, formatPrice, getImageUrl } from "@/lib/utils";
import { 
  User, SignOut, Receipt, BookOpen, BellRinging, CheckCircle, XCircle, Clock, 
  ArrowsClockwise, FilePdf, DownloadSimple, Camera, PencilSimple, Phone, MapPin, 
  FloppyDisk, UserCircle 
} from "@phosphor-icons/react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle } from "@/lib/i18n";
import { PDFReaderModal } from "@/components/PDFReaderModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout, isAuthenticated, hydrate } = useAuthStore();
  const { language, t } = useLanguageStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ id: number; prev: string; next: string } | null>(null);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<number | null>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; url: string } | null>(null);
  const prevOrdersRef = useRef<Order[]>([]);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
      setBio(user.bio || "");
      setAddress(user.address || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess(false);

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone_number", phoneNumber);
      formData.append("bio", bio);
      formData.append("address", address);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updatedUser = await authAPI.updateProfile(formData);
      setUser(updatedUser);
      setProfileSuccess(true);
      setIsEditing(false);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(err?.message || "Xatolik yuz berdi");
    } finally {
      setSavingProfile(false);
    }
  };

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
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gold-400/10 flex items-center justify-center border-2 border-gold-400/30 text-gold-400 overflow-hidden shadow-lg">
                {avatarPreview ? (
                  <img 
                    src={getImageUrl(avatarPreview)} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User weight="bold" className="w-10 h-10" />
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gold-400 text-navy-950 hover:bg-gold-300 transition-transform hover:scale-110 shadow-md"
                title="Profilni tahrirlash"
              >
                <Camera weight="bold" className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : "Foydalanuvchi"}
              </h2>
              <p className="text-xs text-text-secondary font-mono">{user.email}</p>
            </div>

            {user.bio && (
              <p className="text-xs text-text-muted italic px-2">"{user.bio}"</p>
            )}

            <div className="w-full space-y-2 text-left pt-2 text-xs text-text-secondary">
              {user.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{user.phone_number}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="divider-gold opacity-20" />

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-xs text-green-400 text-center animate-fade-in">
              Profil muvaffaqiyatli saqlandi!
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-400/15 border border-gold-400/30 text-xs font-semibold text-gold-400 hover:bg-gold-400/25 transition-all"
            >
              <PencilSimple weight="bold" className="w-4 h-4" />
              Profilni tahrirlash
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <SignOut weight="bold" className="w-4 h-4" />
              {t.profilePage.logout}
            </button>
          </div>
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <PencilSimple className="w-5 h-5 text-gold-400" />
                Profilni tahrirlash
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {profileError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/30 overflow-hidden shrink-0">
                  {avatarPreview ? (
                    <img src={getImageUrl(avatarPreview)} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gold-400" />
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-400/15 border border-gold-400/30 text-xs text-gold-400 hover:bg-gold-400/25 cursor-pointer font-semibold transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Rasm tanlash</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                  <p className="text-[11px] text-text-muted mt-1">Max 2MB (JPG, PNG, WEBP)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Ism</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-sm text-text-primary focus:border-gold-400 outline-none"
                    placeholder="Ismingiz"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Familiya</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-sm text-text-primary focus:border-gold-400 outline-none"
                    placeholder="Familiyangiz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">Telefon raqami</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-sm text-text-primary focus:border-gold-400 outline-none"
                  placeholder="+998 90 123 45 67"
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">Men haqimda (Bio)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-sm text-text-primary focus:border-gold-400 outline-none resize-none"
                  placeholder="O'zingiz haqingizda qisqacha..."
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-1">Manzil</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-sm text-text-primary focus:border-gold-400 outline-none"
                  placeholder="Toshkent sh., Chilonzor tumani..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-text-secondary hover:bg-white/5"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-400 text-navy-950 font-bold text-xs hover:bg-gold-300 disabled:opacity-50 transition-all shadow-md"
                >
                  <FloppyDisk weight="bold" className="w-4 h-4" />
                  {savingProfile ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
