"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { booksAPI, reviewsAPI } from "@/lib/api";
import type { Book, Review } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  FilePdf,
  ChatCircleText,
  PaperPlaneRight,
  CheckCircle,
  Warning,
  DownloadSimple,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle, getLocalizedBookDesc } from "@/lib/i18n";
import { PDFReaderModal } from "@/components/PDFReaderModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { user, isAuthenticated } = useAuthStore();
  const { language, t } = useLanguageStore();

  // Review editing states
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [updatingReview, setUpdatingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setReviewsLoading(true);
        const [bookData, reviewsData] = await Promise.all([
          booksAPI.get(bookId),
          reviewsAPI.list(bookId),
        ]);
        setBook(bookData);
        const reviewsList = Array.isArray(reviewsData)
          ? reviewsData
          : reviewsData?.results || [];
        setReviews(reviewsList);
      } catch (err) {
        console.error("API error fetching book/reviews:", err);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    }
    loadData();
  }, [bookId]);

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book as unknown as Book);
    openCart();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const newReview = await reviewsAPI.create({
        book: bookId,
        rating,
        comment: comment.trim(),
      });
      setReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(5);
      setSubmitSuccess(t.bookDetail.reviewSuccess);
      setTimeout(() => setSubmitSuccess(null), 5000);
      if (book) {
        const newCount = (book.review_count || 0) + 1;
        const oldAvg = book.avg_rating || 0;
        const newAvg = (oldAvg * (newCount - 1) + rating) / newCount;
        setBook({
          ...book,
          review_count: newCount,
          avg_rating: Number(newAvg.toFixed(1)),
        });
      }
    } catch (err: any) {
      console.error("Review submit error:", err);
      setSubmitError(t.bookDetail.reviewError);
      setTimeout(() => setSubmitError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview = async (reviewId: number) => {
    if (!editComment.trim()) return;
    try {
      setUpdatingReview(true);
      const updated = await reviewsAPI.update(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, rating: updated.rating, comment: updated.comment }
            : r
        )
      );
      setEditingReviewId(null);
    } catch (err) {
      console.error("Error updating review:", err);
      alert(
        language === "uz"
          ? "Izohni tahrirlashda xatolik yuz berdi."
          : "Error updating review."
      );
    } finally {
      setUpdatingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const confirmMsg =
      language === "uz"
        ? "Haqiqatan ham ushbu izohingizni o'chirmoqchimisiz?"
        : "Are you sure you want to delete this review?";
    if (!window.confirm(confirmMsg)) return;
    try {
      await reviewsAPI.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      if (book && book.review_count && book.review_count > 0) {
        const newCount = book.review_count - 1;
        setBook({
          ...book,
          review_count: newCount,
        });
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(
        language === "uz"
          ? "Izohni o'chirishda xatolik yuz berdi."
          : "Error deleting review."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-40 font-mono text-sm text-gold-400 animate-pulse">
        {t.common.loading}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="section-container pt-32 pb-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">{t.bookDetail.notFound}</h1>
        <Link href="/books" className="inline-flex btn-ghost text-sm">
          {t.bookDetail.toCatalog}
        </Link>
      </div>
    );
  }

  const displayRating =
    book.avg_rating ||
    (reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
          reviews.length
        ).toFixed(1)
      : language === "uz"
      ? "Yangi"
      : "New");

  return (
    <div className="section-container pt-32 pb-20">
      {/* Back button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.bookDetail.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Cover image Column */}
        <div className="flex justify-center md:justify-start">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden glass p-3 border border-white/5 shadow-2xl">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy-900">
              <Image
                src={getImageUrl(book.cover_image)}
                alt={book.title}
                fill
                priority
                className="object-cover select-none pointer-events-none"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>

        {/* Content details Column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-mono tracking-wider uppercase bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/20 shadow-sm">
                <Star weight="fill" className="w-3.5 h-3.5" />
                <span>{displayRating}</span>
                {typeof book.review_count === "number" && book.review_count > 0 && (
                  <span className="text-text-muted">({book.review_count})</span>
                )}
              </div>
              <span className="text-xs text-text-muted">
                {t.bookDetail.categoryLabel}: #{book.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              {getLocalizedBookTitle(book, language, t)}
            </h1>

            <span className="text-2xl font-bold font-mono text-gradient-gold block">
              {formatPrice(book.price, language)}
            </span>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
              {getLocalizedBookDesc(book, language, t)}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4 mt-8 max-w-xl">
            {/* Primary Purchase CTA Button (Full Width & Prominent with Apple Liquid Glass Gold) */}
            <button
              onClick={handleAddToCart}
              className="group/btn relative overflow-hidden w-full sm:w-auto min-w-[260px] py-4 px-8 rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 border border-white/25 backdrop-blur-md shadow-[0_12px_35px_-8px_rgba(201,168,76,0.5)] hover:shadow-[0_18px_45px_-8px_rgba(201,168,76,0.7)] hover:scale-[1.01] active:scale-98 transition-all duration-300"
            >
              <span className="sheen-overlay" aria-hidden="true" />
              <ShoppingCart weight="bold" className="w-5 h-5 shrink-0 relative z-10" />
              <span className="relative z-10">{t.bookDetail.addToCart}</span>
            </button>

            {/* Secondary Digital PDF Actions (Spacious & Distinct with Liquid Glass) */}
            {book.book_file && (
              <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-navy-900/60 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-text-secondary font-medium">
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <FilePdf weight="fill" className="w-4 h-4" />
                  </div>
                  <span>{language === "uz" ? "Raqamli PDF format tayyor:" : "Digital PDF available:"}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="group relative overflow-hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-white backdrop-blur-md transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95"
                  >
                    <span className="sheen-overlay" aria-hidden="true" />
                    <FilePdf weight="fill" className="w-4 h-4 text-red-400 shrink-0 relative z-10" />
                    <span className="relative z-10">{t.bookDetail.readPdf}</span>
                  </button>
                  <a
                    href={`/api/proxy-pdf?url=${encodeURIComponent(getImageUrl(book.book_file))}&download=1`}
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-gold-400/20 border border-white/15 hover:border-gold-400/50 text-text-primary hover:text-gold-300 backdrop-blur-md transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95"
                    title={language === "uz" ? "Srazu yuklab olish" : "Instant Download"}
                  >
                    <span className="sheen-overlay" aria-hidden="true" />
                    <DownloadSimple weight="bold" className="w-4 h-4 text-gold-400 shrink-0 relative z-10" />
                    <span className="relative z-10">{language === "uz" ? "Yuklab olish" : "Download"}</span>
                  </a>
                </div>
              </div>
            )}

            <div className="text-xs text-text-muted">
              {book.stock > 0 ? (
                <span className="text-green-400">
                  {t.bookDetail.stockAvailable} ({book.stock})
                </span>
              ) : (
                <span className="text-red-400">{t.bookDetail.stockOut}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div id="reviews" className="mt-20 pt-16 border-t border-white/10 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
              <ChatCircleText weight="fill" className="w-7 h-7 text-gold-400" />
              <span>{t.bookDetail.reviewsTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {reviews.length} {language === "uz" ? "ta izoh" : "reviews"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Review Submit Form Column */}
          <div className="lg:col-span-1">
            <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 sticky top-28 shadow-xl">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Star weight="fill" className="w-5 h-5 text-gold-400" />
                <span>{t.bookDetail.addReview}</span>
              </h3>

              {!isAuthenticated ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-sm text-text-secondary">
                    {t.bookDetail.loginToReview}
                  </p>
                  <Link
                    href="/login"
                    className="btn-gold text-xs block w-full text-center py-2.5"
                  >
                    {t.loginPage.submit}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  {submitSuccess && (
                    <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
                      <Warning weight="fill" className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
                      {t.bookDetail.ratingLabel}
                    </label>
                    <div className="flex items-center gap-2 bg-navy-900/60 p-3 rounded-xl border border-white/5">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-transform active:scale-90"
                        >
                          <Star
                            weight={starVal <= rating ? "fill" : "regular"}
                            className={`w-6 h-6 transition-colors ${
                              starVal <= rating
                                ? "text-gold-400 scale-110"
                                : "text-text-muted/40 hover:text-gold-400/60"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-auto font-mono font-bold text-sm text-gold-400">
                        {rating}.0
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
                      {t.bookDetail.commentLabel}
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      placeholder={
                        language === "uz"
                          ? "Kitob haqida o'z fikringizni yozing..."
                          : "Share your thoughts about this book..."
                      }
                      className="w-full bg-navy-900/60 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="w-full btn-gold text-sm flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="animate-pulse">
                        {t.bookDetail.submitting}
                      </span>
                    ) : (
                      <>
                        <PaperPlaneRight weight="bold" className="w-4 h-4" />
                        <span>{t.bookDetail.submitReview}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List Column */}
          <div className="lg:col-span-2 space-y-4">
            {reviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl glass animate-pulse"
                  />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="glass p-12 rounded-2xl text-center text-text-secondary border border-white/5">
                <ChatCircleText
                  weight="thin"
                  className="w-12 h-12 text-gold-400/50 mx-auto mb-3"
                />
                <p className="text-sm">{t.bookDetail.noReviews}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const reviewerName =
                    review.user_detail?.first_name ||
                    review.user_detail?.email?.split("@")[0] ||
                    (language === "uz" ? "Kitobxon" : "Reader");
                  const isAuthor =
                    isAuthenticated &&
                    user &&
                    (review.user === user.id || review.user_detail?.id === user.id);

                  if (editingReviewId === review.id) {
                    return (
                      <div
                        key={review.id}
                        className="glass p-6 rounded-2xl border border-gold-400/40 space-y-4 bg-navy-900/80 shadow-[0_0_25px_rgba(201,168,76,0.15)]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gold-400 flex items-center gap-2">
                            <PencilSimple weight="bold" className="w-4 h-4" />
                            <span>
                              {language === "uz" ? "Izohni tahrirlash" : "Edit Review"}
                            </span>
                          </span>
                          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                className="p-0.5 text-gold-400 hover:scale-125 transition-transform"
                              >
                                <Star
                                  weight={star <= editRating ? "fill" : "regular"}
                                  className="w-5 h-5"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={3}
                          className="w-full bg-navy-950/80 border border-white/15 rounded-xl p-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors resize-none"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={updatingReview}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-text-secondary transition-all"
                          >
                            {language === "uz" ? "Bekor qilish" : "Cancel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateReview(review.id)}
                            disabled={updatingReview || !editComment.trim()}
                            className="btn-gold px-5 py-2 text-xs flex items-center gap-1.5 shadow-md"
                          >
                            {updatingReview && (
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-navy-950 border-t-transparent animate-spin" />
                            )}
                            <span>{language === "uz" ? "Saqlash" : "Save"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={review.id}
                      className="glass p-6 rounded-2xl border border-white/5 space-y-3 transition-all duration-300 hover:border-white/15"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-sm shrink-0">
                            {reviewerName[0]?.toUpperCase() || "K"}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-text-primary truncate">
                              {reviewerName}
                            </h4>
                            <span className="text-[11px] text-text-muted font-mono">
                              {review.created_at
                                ? new Date(
                                    review.created_at
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 bg-gold-400/10 px-2.5 py-1 rounded-full border border-gold-400/20">
                            {[...Array(review.rating || 5)].map((_, idx) => (
                              <Star
                                key={idx}
                                weight="fill"
                                className="w-3.5 h-3.5 text-gold-400"
                              />
                            ))}
                          </div>

                          {isAuthor && (
                            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(review)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gold-400/20 text-text-secondary hover:text-gold-400 border border-transparent hover:border-gold-400/40 flex items-center justify-center transition-all shadow-sm"
                                title={language === "uz" ? "Tahrirlash" : "Edit"}
                              >
                                <PencilSimple weight="bold" className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(review.id)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-text-secondary hover:text-red-400 border border-transparent hover:border-red-500/40 flex items-center justify-center transition-all shadow-sm"
                                title={language === "uz" ? "O'chirish" : "Delete"}
                              >
                                <Trash weight="bold" className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed sm:pl-13">
                        {review.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {book?.book_file && (
        <PDFReaderModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          title={getLocalizedBookTitle(book, language, t)}
          pdfUrl={getImageUrl(book.book_file)}
        />
      )}
    </div>
  );
}
