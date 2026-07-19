"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, DownloadSimple, ArrowSquareOut, FilePdf, Spinner } from "@phosphor-icons/react";
import { useLanguageStore } from "@/store/languageStore";

interface PDFReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
}

export function PDFReaderModal({ isOpen, onClose, title, pdfUrl }: PDFReaderModalProps) {
  const { language } = useLanguageStore();
  const [downloading, setDownloading] = useState(false);
  const [forceMobileIframe, setForceMobileIframe] = useState(false);

  if (!isOpen || !pdfUrl) return null;

  // Proxy URL for viewing inside iframe
  const proxyViewUrl = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
  // Proxy URL for direct downloading
  const proxyDownloadUrl = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}&download=1`;

  const handleInstantDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setDownloading(true);
      const res = await fetch(proxyDownloadUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      let cleanFileName = title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "book";
      if (!cleanFileName.toLowerCase().endsWith(".pdf")) {
        cleanFileName += ".pdf";
      }
      a.download = cleanFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("PDF download error:", error);
      // Fallback direct navigation
      window.open(proxyDownloadUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenExternal = () => {
    window.open(proxyViewUrl, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-950/85 backdrop-blur-2xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col w-full max-w-6xl h-[90vh] rounded-3xl border border-white/15 bg-navy-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-navy-950/80 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0">
                <FilePdf weight="fill" className="w-5 h-5 text-gold-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-text-primary truncate font-serif">
                  {title}
                </h3>
                <span className="text-xs text-gold-400/90 font-mono tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {language === "uz" ? "PDF o'qish / yuklash rejimi" : "PDF Reader / Download Mode"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Instant Download Button */}
              <button
                type="button"
                onClick={handleInstantDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                title={language === "uz" ? "Faylni yuklab olish" : "Download file"}
              >
                {downloading ? (
                  <Spinner className="w-4 h-4 animate-spin text-navy-950 shrink-0" />
                ) : (
                  <DownloadSimple weight="bold" className="w-4 h-4 shrink-0" />
                )}
                <span className="hidden xs:inline">
                  {downloading
                    ? language === "uz"
                      ? "Yuklanmoqda..."
                      : "Downloading..."
                    : language === "uz"
                      ? "Yuklab olish"
                      : "Download"}
                </span>
              </button>

              {/* Open Fullscreen */}
              <button
                type="button"
                onClick={handleOpenExternal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white text-xs font-semibold transition-all"
                title={language === "uz" ? "Yangi tabda ochish" : "Open in new tab"}
              >
                <ArrowSquareOut weight="bold" className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">
                  {language === "uz" ? "To'liq ekran" : "Fullscreen"}
                </span>
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-text-secondary hover:text-red-400 transition-all active:scale-95 ml-1"
                aria-label="Close modal"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reader Body (Desktop vs Mobile Presentation) */}
          <div className="flex-1 w-full relative bg-navy-950/60 overflow-hidden flex flex-col">
            {/* Desktop Iframe View */}
            <div className={`w-full h-full ${forceMobileIframe ? "block" : "hidden sm:block"}`}>
              <iframe
                src={proxyViewUrl}
                className="w-full h-full border-0 select-none"
                title={`${title} PDF Viewer`}
              />
            </div>

            {/* Premium Mobile Presentation Deck (Bypasses broken mobile iframe rendering) */}
            {!forceMobileIframe && (
              <div className="sm:hidden flex-1 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 overflow-y-auto text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400/20 via-red-500/15 to-navy-800 border border-gold-400/30 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(201,168,76,0.25)] ring-1 ring-white/10">
                  <FilePdf weight="fill" className="w-10 h-10 text-gold-400 animate-pulse" />
                </div>

                <h4 className="text-lg font-serif font-bold text-text-primary mb-2 line-clamp-2 px-2">
                  {title}
                </h4>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  {language === "uz" ? "Raqamli kitob tayyor" : "Digital Book Ready"}
                </span>

                <p className="text-xs text-text-secondary max-w-xs leading-relaxed mb-6">
                  {language === "uz"
                    ? "Mobil telefonlarda PDF kitoblarni 100% tiniq va tezkor o'qish uchun maxsus keng ekranda oching yoki faylni yuklab oling:"
                    : "For the cleanest reading experience on mobile devices, open directly in full-screen native reader or download:"}
                </p>

                <div className="w-full max-w-xs space-y-3">
                  <button
                    type="button"
                    onClick={handleOpenExternal}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 text-navy-950 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_12px_35px_-8px_rgba(201,168,76,0.5)] active:scale-95 transition-all"
                  >
                    <ArrowSquareOut weight="bold" className="w-5 h-5 shrink-0" />
                    <span>{language === "uz" ? "📑 Keng ekranda o'qish (To'liq)" : "📑 Read in Fullscreen"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantDownload}
                    disabled={downloading}
                    className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-text-primary font-bold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {downloading ? (
                      <Spinner className="w-5 h-5 animate-spin text-gold-400 shrink-0" />
                    ) : (
                      <DownloadSimple weight="bold" className="w-5 h-5 text-gold-400 shrink-0" />
                    )}
                    <span>
                      {downloading
                        ? language === "uz"
                          ? "Yuklanmoqda..."
                          : "Downloading..."
                        : language === "uz"
                          ? "⚡ Faylni yuklab olish (.PDF)"
                          : "⚡ Download File (.PDF)"}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setForceMobileIframe(true)}
                  className="mt-6 text-xs text-text-muted hover:text-gold-400 underline transition-colors"
                >
                  {language === "uz"
                    ? "Yoki kichik oynaning o'zida o'qishni ko'rish"
                    : "Or view inside mini modal preview"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
