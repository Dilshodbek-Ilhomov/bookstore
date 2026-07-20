"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  DownloadSimple,
  ArrowSquareOut,
  FilePdf,
  Spinner,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  Desktop,
  DeviceMobile,
  CaretLeft,
  CaretRight,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
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
  const [viewMode, setViewMode] = useState<"canvas" | "iframe">("canvas");

  // Body scroll bloklash — iOS-friendly: position:fixed + top saqlash
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      // Scroll pozitsiyasini tiklash
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    };
  }, [isOpen]);

  // ESC bilan yopish
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  const proxyViewUrl = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
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
      {/* touchAction:none — backdrop scrollni tutib olmaydi */}
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-1.5 sm:p-4 md:p-6"
        style={{ touchAction: "none" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-950/90 backdrop-blur-2xl"
          style={{ touchAction: "none" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col w-full max-w-6xl rounded-3xl sm:rounded-[36px] border border-white/15 bg-navy-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden"
          style={{ height: "94svh", maxHeight: "94svh", touchAction: "auto" }}
        >
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-navy-950/90 border-b border-white/10 shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0">
                <FilePdf weight="fill" className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <h3 className="text-sm sm:text-lg font-bold text-text-primary truncate font-serif">
                  {title}
                </h3>
                <span className="hidden sm:flex text-xs text-gold-400/90 font-mono tracking-wider uppercase items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  {language === "uz" ? "PDF o'qish / yuklash rejimi" : "PDF Reader / Download Mode"}
                </span>
                <span className="sm:hidden text-[10px] text-green-400 font-mono flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  {language === "uz" ? "Online Reader" : "Online Reader"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode((m) => (m === "canvas" ? "iframe" : "canvas"))}
                className="group relative overflow-hidden hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] border border-white/15 text-text-secondary hover:text-white text-xs font-semibold transition-all"
                title={language === "uz" ? "Ko'rish rejimini o'zgartirish" : "Switch view mode"}
              >
                <span className="sheen-overlay" aria-hidden="true" />
                {viewMode === "canvas" ? (
                  <>
                    <Desktop weight="bold" className="w-4 h-4 text-gold-400 shrink-0 relative z-10" />
                    <span className="relative z-10">{language === "uz" ? "Iframe rejim" : "Iframe Mode"}</span>
                  </>
                ) : (
                  <>
                    <DeviceMobile weight="bold" className="w-4 h-4 text-gold-400 shrink-0 relative z-10" />
                    <span className="relative z-10">{language === "uz" ? "Canvas rejim" : "Canvas Mode"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleInstantDownload}
                disabled={downloading}
                className="group/btn relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 p-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 border border-white/25 backdrop-blur-md text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                title={language === "uz" ? "Faylni yuklab olish" : "Download file"}
              >
                <span className="sheen-overlay" aria-hidden="true" />
                {downloading ? (
                  <Spinner className="w-4 h-4 animate-spin text-navy-950 shrink-0 relative z-10" />
                ) : (
                  <DownloadSimple weight="bold" className="w-4 h-4 shrink-0 relative z-10" />
                )}
                <span className="hidden xs:inline relative z-10">
                  {downloading
                    ? language === "uz"
                      ? "..."
                      : "..."
                    : language === "uz"
                      ? "Yuklab olish"
                      : "Download"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleOpenExternal}
                className="group relative overflow-hidden inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] border border-white/15 text-text-secondary hover:text-white text-xs font-semibold transition-all"
                title={language === "uz" ? "To'liq ekranda ochish" : "Open in new tab"}
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <ArrowSquareOut weight="bold" className="w-4 h-4 shrink-0 relative z-10" />
                <span className="hidden sm:inline relative z-10">
                  {language === "uz" ? "To'liq ekran" : "Fullscreen"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] backdrop-blur-md hover:bg-red-500/20 border border-white/15 hover:border-red-500/40 text-text-secondary hover:text-red-400 transition-all active:scale-95 ml-0.5"
                aria-label="Close modal"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative bg-navy-950/95 overflow-hidden flex flex-col min-h-0">
            {viewMode === "iframe" ? (
              <div className="w-full h-full">
                <iframe
                  src={proxyViewUrl}
                  className="w-full h-full border-0 select-none"
                  title={`${title} PDF Viewer`}
                  style={{ touchAction: "auto" }}
                />
              </div>
            ) : (
              <PDFCanvasViewer url={proxyViewUrl} title={title} onFullscreen={handleOpenExternal} onDownload={handleInstantDownload} downloading={downloading} language={language} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface PDFCanvasViewerProps {
  url: string;
  title: string;
  onFullscreen: () => void;
  onDownload: (e: React.MouseEvent) => void;
  downloading: boolean;
  language: string;
}

function PDFCanvasViewer({ url, title, onFullscreen, onDownload, downloading, language }: PDFCanvasViewerProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.2);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobil qurilmalarda Lenis va body scroll interception'ni o'chirish — passive touch
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const stop = (e: TouchEvent) => e.stopPropagation();
    container.addEventListener("touchstart", stop, { passive: true });
    container.addEventListener("touchmove", stop, { passive: true });
    return () => {
      container.removeEventListener("touchstart", stop);
      container.removeEventListener("touchmove", stop);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        }
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false,
        });
        const loadedPdf = await loadingTask.promise;
        if (active) {
          setPdf(loadedPdf);
          setLoading(false);
          setCurrentPage(1);
          pageRefs.current = new Array(loadedPdf.numPages).fill(null);
        }
      } catch (err: any) {
        if (active) {
          console.error("PDF load error:", err);
          setError(err.message || "PDF faylni yuklashda xatolik yuz berdi");
          setLoading(false);
        }
      }
    };
    loadPdf();
    return () => {
      active = false;
    };
  }, [url]);

  const scrollToPage = useCallback((pageNum: number) => {
    if (!pdf || pageNum < 1 || pageNum > pdf.numPages) return;
    const el = pageRefs.current[pageNum - 1];
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  }, [pdf]);

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-hidden min-h-0">
      {/* Top Toolbar — Smooth Page Navigation & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2.5 bg-navy-950/90 border-b border-white/10 shrink-0 z-20 text-xs text-text-secondary backdrop-blur-md">
        {/* Page Selector Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={!pdf || currentPage <= 1}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 disabled:opacity-30 text-text-primary transition-all active:scale-90"
            title={language === "uz" ? "Oldingi sahifa" : "Previous page"}
          >
            <CaretLeft weight="bold" className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10 shadow-inner">
            <input
              type="number"
              min={1}
              max={pdf?.numPages || 1}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= (pdf?.numPages || 1)) {
                  scrollToPage(val);
                }
              }}
              className="w-10 bg-transparent text-center font-mono font-bold text-gold-400 text-xs focus:outline-none"
            />
            <span className="text-text-muted font-mono text-xs select-none">/ {pdf?.numPages || "..."}</span>
          </div>
          <button
            type="button"
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={!pdf || currentPage >= pdf.numPages}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 disabled:opacity-30 text-text-primary transition-all active:scale-90"
            title={language === "uz" ? "Keyingi sahifa" : "Next page"}
          >
            <CaretRight weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.2).toFixed(1))))}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-text-primary transition-all active:scale-90"
            title={language === "uz" ? "Kichiklashtirish" : "Zoom out"}
          >
            <MagnifyingGlassMinus weight="bold" className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setScale(1.2)}
            className="font-mono text-gold-400 font-bold text-xs px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 min-w-[56px] text-center transition-all active:scale-95"
            title={language === "uz" ? "Asl o'lchamga qaytarish (Reset)" : "Reset zoom"}
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.6, Number((s + 0.2).toFixed(1))))}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-text-primary transition-all active:scale-90"
            title={language === "uz" ? "Kattalashtirish" : "Zoom in"}
          >
            <MagnifyingGlassPlus weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/*
        ASOSIY FIX — Hardware Accelerated Scroll Container:
        - overflow-y: scroll & overscroll-behavior: contain (mobil uchun ideal)
        - WebkitOverflowScrolling: touch → iOS Apple momentum scroll
        - transform: translateZ(0) & will-change → GPU tezlanish
        - touch-action: pan-y pinch-zoom → bemalol vertikal scroll + pinch
      */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full p-3 sm:p-6 space-y-6 gpu-layer"
        style={{
          overflowY: "scroll",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch" as any,
          touchAction: "pan-y pinch-zoom",
          overscrollBehavior: "contain",
          minHeight: 0,
          position: "relative",
          willChange: "scroll-position",
        }}
        data-lenis-prevent
      >
        {loading && (
          <div className="w-full h-80 flex flex-col items-center justify-center text-center gap-3">
            <Spinner className="w-10 h-10 animate-spin text-gold-400" />
            <p className="text-sm font-semibold text-text-secondary font-mono">
              {language === "uz" ? "PDF sahifalari tayyorlanmoqda..." : "Rendering PDF pages..."}
            </p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mx-auto my-12 p-6 rounded-3xl bg-navy-900/90 border border-white/10 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <FilePdf weight="fill" className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-text-primary">
              {language === "uz" ? "Online o'qishda kichik to'siq" : "Online reading notice"}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {language === "uz"
                ? "Mobil brauzeringiz xavfsizlik sababli ushbu faylni to'g'ridan-to'g'ri ko'rsatishdan bosh tortdi. Keng ekranda o'qish tugmasini bosib darhol oching yoki yuklab oling:"
                : "Your browser restricted inline preview. Please open in fullscreen or download directly:"}
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={onFullscreen}
                className="group relative overflow-hidden w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                <ArrowSquareOut weight="bold" className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{language === "uz" ? "📑 To'liq ekranda o'qish" : "📑 Read in Fullscreen"}</span>
              </button>
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="group relative overflow-hidden w-full py-3.5 px-5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="sheen-overlay" aria-hidden="true" />
                {downloading ? (
                  <Spinner className="w-4 h-4 animate-spin text-gold-400 relative z-10" />
                ) : (
                  <DownloadSimple weight="bold" className="w-4 h-4 text-gold-400 relative z-10" />
                )}
                <span className="relative z-10">
                  {downloading
                    ? language === "uz"
                    ? "..."
                    : "..."
                    : language === "uz"
                    ? "📥 PDF yuklab olish"
                    : "📥 Download PDF"}
                </span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && pdf && (
          <div className="flex flex-col items-center gap-6 pb-16">
            {Array.from({ length: pdf.numPages }).map((_, i) => (
              <div
                key={i + 1}
                ref={(el) => { pageRefs.current[i] = el; }}
                data-page-number={i + 1}
                className="w-full flex justify-center"
              >
                <PDFPageCanvas
                  pdf={pdf}
                  pageNumber={i + 1}
                  scale={scale}
                  language={language}
                  onVisible={() => setCurrentPage(i + 1)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PDFPageCanvasProps {
  pdf: any;
  pageNumber: number;
  scale: number;
  language: string;
  onVisible?: () => void;
}

function PDFPageCanvas({ pdf, pageNumber, scale, language, onVisible }: PDFPageCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [pageRendering, setPageRendering] = useState(false);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);

  // IntersectionObserver — faqat ekranga yaqinlashganda yuklash (+800px margin)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (onVisible) onVisible();
          }
        });
      },
      { rootMargin: "800px 0px 800px 0px", threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  // Sahifani faqat isInView bo'lsa va scale/pdf o'zgarganda chizish
  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    const renderPage = async () => {
      if (!pdf || !isInView || !canvasRef.current) return;
      try {
        setPageRendering(true);
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        if (!active) return;

        setPageDimensions({ width: viewport.width, height: viewport.height });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        // Apple Retina (High DPI) va o'ta tiniq o'qish uchun dpr hisoblash
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.save();
        context.scale(dpr, dpr);

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
        context.restore();
        if (active) setPageRendering(false);
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(`Page ${pageNumber} render error:`, err);
          if (active) setPageRendering(false);
        }
      }
    };

    renderPage();
    return () => {
      active = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNumber, scale, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center bg-navy-900/90 border border-white/10 rounded-3xl p-2.5 sm:p-4 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-white/20 max-w-full group/page gpu-layer"
      style={{
        minHeight: pageDimensions ? `${pageDimensions.height + 40}px` : "620px",
        width: pageDimensions ? `${Math.min(pageDimensions.width + 32, 1100)}px` : "100%",
        touchAction: "pan-x pan-y pinch-zoom",
        willChange: "transform",
      }}
    >
      <div className="flex items-center justify-between w-full mb-2.5 px-2">
        <span className="text-[11px] font-mono font-bold text-gold-400 px-3 py-1 rounded-full bg-navy-950/80 border border-white/10 shadow-sm">
          {language === "uz" ? `${pageNumber}-sahifa` : `Page ${pageNumber}`}
        </span>
        {pageDimensions && (
          <span className="text-[10px] font-mono text-text-muted opacity-0 group-hover/page:opacity-100 transition-opacity">
            {Math.round(pageDimensions.width)} × {Math.round(pageDimensions.height)}px
          </span>
        )}
      </div>

      {!isInView && (
        <div className="w-full aspect-[1/1.4] max-w-2xl rounded-2xl bg-navy-950/50 border border-white/5 animate-pulse flex flex-col items-center justify-center gap-3 my-auto">
          <Spinner className="w-6 h-6 animate-spin text-gold-400/40" />
          <span className="text-xs font-mono text-text-muted">
            {language === "uz" ? `${pageNumber}-sahifa yuklanmoqda...` : `Loading page ${pageNumber}...`}
          </span>
        </div>
      )}

      {isInView && pageRendering && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/70 rounded-3xl z-10 backdrop-blur-xs gap-2.5 transition-opacity"
          style={{ minHeight: "300px" }}
        >
          <Spinner className="w-8 h-8 animate-spin text-gold-400" />
          <span className="text-xs font-mono font-semibold text-text-secondary">
            {language === "uz" ? "Sahifa silliqlanmoqda..." : "Rendering smooth page..."}
          </span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`max-w-full h-auto rounded-2xl shadow-xl bg-white select-none transition-opacity duration-300 ${
          !isInView || pageRendering ? "opacity-40" : "opacity-100"
        }`}
        style={{ display: isInView ? "block" : "none" }}
      />
    </div>
  );
}
