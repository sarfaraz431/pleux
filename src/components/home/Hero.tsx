import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, ShieldCheck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/useTheme";

const Hero = () => {
  const { section } = useTheme();
  const isBeauty = section === "beauty";
  const ref = useRef<HTMLDivElement>(null);

  // Subtle parallax on the product as you scroll out of the hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const productY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const productScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const green = { bg: "from-emerald-50 via-[#f4fbf6] to-white", glow1: "bg-emerald-200/50", glow2: "bg-teal-100/60", accent: "#10b981", accentDark: "#047857", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", stars: "text-emerald-400", trust: "text-emerald-600", btn: "from-emerald-500 to-emerald-700", btnHover: "hover:shadow-emerald-200" };
  const purple = { bg: "from-purple-50 via-[#f9f4fc] to-white", glow1: "bg-purple-200/50", glow2: "bg-fuchsia-100/60", accent: "#9333ea", accentDark: "#6b21a8", badge: "bg-purple-50 text-purple-700 border-purple-100", stars: "text-purple-400", trust: "text-purple-600", btn: "from-purple-500 to-purple-800", btnHover: "hover:shadow-purple-200", };
  const t = isBeauty ? green : purple;

  return (
    <div id="hero-section" ref={ref} style={{ position: "relative" }} className={`relative w-full min-h-[calc(100svh-165px)] md:min-h-[calc(100svh-73px)] bg-gradient-to-br ${t.bg} overflow-hidden flex items-center`}>

      {/* Decorative glow orbs */}
      <div className={`absolute top-0 right-0 w-[55%] h-[55%] ${t.glow1} rounded-full blur-[130px] -translate-y-1/3 translate-x-1/4 pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[45%] h-[45%] ${t.glow2} rounded-full blur-[110px] translate-y-1/3 -translate-x-1/4 pointer-events-none`} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:min-h-[calc(100svh-67px)]">

          {/* ─── LEFT: Text ─────────────────────────────── */}
          <motion.div style={{ y: textY, opacity }} className="text-center md:text-left order-2 md:order-1 pb-6 md:pb-0">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-5"
            >
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] px-4 py-1.5 rounded-full border ${t.badge}`}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: t.accent }} />
                {isBeauty ? "Premium Botanical Beauty" : "Holistic Wellness Science"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="font-serif text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-5"
            >
              {isBeauty ? (
                <>Nature's Purity,<br /><span style={{ color: t.accent }}>Bottled For You.</span></>
              ) : (
                <>Science-Backed<br /><span style={{ color: t.accent }}>Wellness, Daily.</span></>
              )}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-gray-500 text-base md:text-lg font-light leading-relaxed mb-7 max-w-md mx-auto md:mx-0"
            >
              {isBeauty
                ? "Premium plant-based skincare & haircare with certified organic botanicals, backed by dermatology."
                : "Clinically researched nutrition, energy & wellness supplements designed for healthy modern living."}
            </motion.p>

            {/* Stars */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex items-center gap-2 justify-center md:justify-start mb-7"
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={13} className={`fill-current ${t.stars}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-400">4.8 rating · 12,000+ Happy Customers</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-8"
            >
              <Link to="/products" id="hero-shop-now"
                className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white shadow-lg bg-gradient-to-r ${t.btn} ${t.btnHover} hover:shadow-xl active:scale-95 transition-all duration-300`}>
                Shop Now <ArrowRight size={15} />
              </Link>
              <Link to="/products" id="hero-explore"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-95 transition-all duration-300 shadow-sm">
                View Collection
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap items-center gap-4 justify-center md:justify-start"
            >
              {[
                { icon: <Leaf size={12} />, label: "100% Natural" },
                { icon: <ShieldCheck size={12} />, label: "Derm Tested" },
                { icon: <span className="text-xs">🚚</span>, label: "Free Ship ₹600+" },
              ].map((b) => (
                <span key={b.label} className={`flex items-center gap-1.5 text-[11px] font-semibold ${t.trust}`}>
                  {b.icon} {b.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ─── RIGHT: Product ─────────────────────────── */}
          <motion.div
            style={{ y: productY, scale: productScale, opacity }}
            className="flex items-center justify-center order-1 md:order-2 relative"
          >
            {/* Glow behind product */}
            <div
              className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-[90px] opacity-50"
              style={{ backgroundColor: isBeauty ? "#6ee7b7" : "#d8b4fe" }}
            />

            {/* Floating product */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center min-h-[280px] md:min-h-[400px]"
              >
                <img
                  src="/assets/images/hero-product.png"
                  alt="PLEUX+ Botanical Product"
                  className="w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-[3/4] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.14)] relative z-10"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80";
                    e.currentTarget.className = "w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-[3/4] rounded-3xl object-cover drop-shadow-[0_40px_80px_rgba(0,0,0,0.14)] relative z-10";
                  }}
                />
              </motion.div>

              {/* Floating stat: Rating */}
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                className="absolute top-6 -left-4 md:-left-10 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 border border-gray-50"
              >
                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Rated</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-gray-900 leading-none">4.8</span>
                  <Star size={11} className={`fill-current ${t.stars} mb-0.5`} />
                </div>
              </motion.div>

              {/* Floating stat: Customers */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
                className="absolute bottom-10 -right-4 md:-right-10 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 border border-gray-50"
              >
                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Happy Customers</p>
                <p className="text-lg font-black text-gray-900 leading-none">12K+</p>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
