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
} from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";
import { getLocalizedBookTitle, getLocalizedBookDesc } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { language, t } = useLanguageStore();

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
        setBook(null);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    }
    loadData();
  }, [bookId]);

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book);
    openCart();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
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
                className="object-cover"
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

          <div className="pt-6 border-t border-navy-600/20 space-y-4 mt-6">
            {/* Purchase CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart weight="bold" className="w-4 h-4" />
                <span>{t.bookDetail.addToCart}</span>
              </button>

              {book.book_file && (
                <a
                  href={getImageUrl(book.book_file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm flex items-center justify-center gap-2"
                >
                  <FilePdf className="w-4 h-4 text-red-400" />
                  <span>{t.bookDetail.readPdf}</span>
                </a>
              )}
            </div>

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
                  return (
                    <div
                      key={review.id}
                      className="glass p-6 rounded-2xl border border-white/5 space-y-3 transition-all duration-300 hover:border-white/15"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-sm shrink-0">
                            {reviewerName[0]?.toUpperCase() || "K"}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-text-primary">
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
                        <div className="flex items-center gap-1 bg-gold-400/10 px-2.5 py-1 rounded-full border border-gold-400/20">
                          {[...Array(review.rating || 5)].map((_, idx) => (
                            <Star
                              key={idx}
                              weight="fill"
                              className="w-3.5 h-3.5 text-gold-400"
                            />
                          ))}
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
    </div>
  );
}
