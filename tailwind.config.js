/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        pleux: {
          50:  "#f0f9f6",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981", // Emerald 500 - Brand Primary
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        sage: {
          50:  "#f4f7f5",
          100: "#e9efeb",
          200: "#d3dfd7",
          300: "#bdcfc3",
          400: "#a7bfaf",
          500: "#91af9b",
        },
        stone: {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
        },
        cream: "#F9FBF9",
        charcoal: "#1A1C1B",
      },
      boxShadow: {
        "glow-green": "0 0 30px 0 rgba(16, 185, 129, 0.15)",
        "glow-soft": "0 4px 40px 0 rgba(0,0,0,0.04)",
        "card":      "0 2px 20px 0 rgba(0,0,0,0.04)",
        "card-hover":"0 12px 50px 0 rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #f0f9f6 0%, #f9fbf9 100%)",
        "green-gradient": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "brand-gradient":"linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.8s ease-out",
        "slide-up":   "slideUp 0.8s ease-out",
        "float":      "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "marquee":    "marquee 15s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:     { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-15px)" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.8" } },
        marquee:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};