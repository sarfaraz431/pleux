import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/useTheme";
import { bannerService, type Banner } from "../../services/bannerService";

interface PromotionalBannersProps {
  location?: "hero" | "middle" | "side";
}

const PromotionalBanners = ({ location = "hero" }: PromotionalBannersProps) => {
  const { section } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchBanners = async () => {
      setLoading(true);
      const data = await bannerService.getBanners(section);
      if (!cancelled) {
        const filtered = data.filter(b => (b.location || "hero") === location);
        setBanners(filtered);
        setActiveIndex(0);
        if (scrollRef.current) scrollRef.current.scrollLeft = 0;
        setLoading(false);
      }
    };
    fetchBanners();
    return () => { cancelled = true; };
  }, [section, location]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(idx);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const next = (activeIndex + 1) % banners.length;
      scrollRef.current.scrollTo({ left: next * scrollRef.current.clientWidth, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, banners.length, location]);

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="w-full bg-gray-100 rounded-2xl md:rounded-3xl animate-pulse h-[200px] sm:h-[260px] md:h-[300px] lg:h-[380px]" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  // Determine container height based on the first banner's size property
  const isSquare = banners[0]?.size === "square";
  const heightClass = isSquare
    ? "aspect-square max-w-[500px] mx-auto"
    : location === "hero"
    ? "h-[200px] sm:h-[260px] md:h-[300px] lg:h-[380px]"
    : "h-[220px] md:h-[280px]";

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-4 md:py-6 ${location !== "hero" ? "md:py-8" : ""}`}>
      <div className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-md ${heightClass}`}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {banners.map((banner, idx) => {
            const currentKey = banner.id || idx;
            const commonProps = {
              className: `relative flex-shrink-0 snap-center w-full h-full block overflow-hidden ${
                banner.isClickable ? "cursor-pointer active:scale-[0.98]" : "cursor-default"
              }`,
              onClick: (e: any) => {
                if (scrollRef.current && Math.abs(scrollRef.current.scrollLeft - idx * scrollRef.current.clientWidth) > 10) {
                  e.preventDefault();
                }
              }
            };

            const InnerContent = (
              <>
                <img
                  src={banner.imageUrl}
                  alt={`Banner ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full transition-transform duration-700 ${isSquare ? "object-contain" : "object-cover"} ${banner.isClickable ? "hover:scale-105" : ""}`}
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">
                    {banner.isClickable ? "Explore Now" : "Information"}
                  </span>
                </div>
              </>
            );

            if (banner.isClickable) {
              return (
                <Link key={currentKey} to={banner.linkTo || "/products"} {...commonProps}>
                  {InnerContent}
                </Link>
              );
            }
            
            return (
              <div key={currentKey} {...commonProps}>
                {InnerContent}
              </div>
            );
          })}
        </div>

        {banners.length > 1 && (
          <>
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`transition-all duration-300 rounded-full pointer-events-auto ${
                    activeIndex === idx ? "w-6 h-1.5 bg-white shadow-lg" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.preventDefault(); scrollTo((activeIndex - 1 + banners.length) % banners.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm opacity-0 md:opacity-100 transition-opacity hover:scale-105 z-10"
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={(e) => { e.preventDefault(); scrollTo((activeIndex + 1) % banners.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm opacity-0 md:opacity-100 transition-opacity hover:scale-105 z-10"
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionalBanners;
