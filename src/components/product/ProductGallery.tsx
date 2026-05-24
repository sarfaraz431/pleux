import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Touch / Swipe state
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const safeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80"];
  const total = safeImages.length;

  const goTo = useCallback((idx: number) => {
    setActiveIndex((idx + total) % total);
    setIsZoomed(false);
  }, [total]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") {
        setLightboxOpen(false);
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const thumb = container.children[activeIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) goNext();
      else goPrev();
    }
  };

  // Desktop hover-zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <>
      <div className="relative flex flex-col-reverse md:flex-row gap-3 md:gap-4">
        {/* ── Thumbnails ── */}
        {total > 1 && (
          <div
            ref={thumbnailContainerRef}
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0 md:pr-1 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {safeImages.map((src, i) => (
              <button
                key={`thumb-${i}`}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl overflow-hidden border-2 transition-all duration-300 group
                  ${i === activeIndex
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
                    : "border-transparent hover:border-emerald-200 opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={src}
                  alt={`${productName} view ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=60";
                  }}
                />
                {i === activeIndex && (
                  <motion.div
                    layoutId="thumb-indicator"
                    className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500 ring-offset-2 ring-offset-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Main Image ── */}
        <div
          ref={mainImageRef}
          className="relative flex-1 aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white shadow-glow-soft border border-emerald-50 cursor-pointer group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onClick={() => {
            // Desktop: toggle zoom. Mobile: open lightbox.
            if (window.innerWidth >= 768) {
              setIsZoomed((z) => !z);
            } else {
              setLightboxOpen(true);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={safeImages[activeIndex]}
              src={safeImages[activeIndex]}
              alt={`${productName} - Image ${activeIndex + 1} of ${total}`}
              className="w-full h-full object-cover"
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: "scale(2)",
                      cursor: "zoom-out",
                    }
                  : { cursor: total > 1 ? "zoom-in" : "default" }
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80";
              }}
            />
          </AnimatePresence>

          {/* Zoom hint icon */}
          <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-emerald-700 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm pointer-events-none">
            <ZoomIn size={16} />
          </div>

          {/* Fullscreen button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-emerald-700 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:bg-white hover:scale-110"
            aria-label="Open fullscreen"
          >
            <Maximize2 size={16} />
          </button>

          {/* Badge */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <span className="badge !bg-white/90 backdrop-blur-md shadow-sm">🌿 100% Pure</span>
          </div>

          {/* Navigation arrows (desktop) */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-emerald-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-emerald-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Mobile image counter */}
          {total > 1 && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
              {activeIndex + 1} / {total}
            </div>
          )}
        </div>
      </div>

      {/* ── Dot indicators (mobile only) ── */}
      {total > 1 && (
        <div className="flex md:hidden justify-center gap-1.5 mt-3">
          {safeImages.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 h-2 bg-emerald-500"
                  : "w-2 h-2 bg-emerald-200 hover:bg-emerald-300"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── FULLSCREEN LIGHTBOX ── */}
      {/* ══════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>

            {/* Counter */}
            {total > 1 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold tracking-widest uppercase">
                {activeIndex + 1} / {total}
              </div>
            )}

            {/* Image */}
            <motion.div
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`lb-${safeImages[activeIndex]}`}
                  src={safeImages[activeIndex]}
                  alt={`${productName} - fullscreen view ${activeIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl select-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80";
                  }}
                />
              </AnimatePresence>

              {/* Prev / Next */}
              {total > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Lightbox Thumbnail Strip */}
            {total > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2" style={{ scrollbarWidth: "none" }}>
                {safeImages.map((src, i) => (
                  <button
                    key={`lb-thumb-${i}`}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      i === activeIndex
                        ? "border-white shadow-lg shadow-white/20 scale-110"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=60";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;
