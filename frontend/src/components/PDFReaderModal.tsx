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

          {/* Reader Body */}
          <div className="flex-1 w-full relative bg-navy-950/60 overflow-hidden">
            <iframe
              src={proxyViewUrl}
              className="w-full h-full border-0 select-none"
              title={`${title} PDF Viewer`}
            />

            {/* Mobile note bar at bottom if iframe is restricted */}
            <div className="sm:hidden absolute bottom-0 inset-x-0 bg-navy-950/95 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-text-secondary z-20">
              <span>{language === "uz" ? "Fayl to'liq ochilmadimi?" : "File not fully visible?"}</span>
              <button
                onClick={handleInstantDownload}
                className="text-gold-400 font-bold underline ml-2"
              >
                {language === "uz" ? "Srazu yuklab oling" : "Download directly"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
