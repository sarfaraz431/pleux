import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

import { useTheme } from "../../context/useTheme";

const beautyCategories = [
  {
    name: "Hair Care",
    desc: "Nourish from roots",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    color: "from-green-100/50 to-emerald-50",
    link: "/products",
  },
  {
    name: "Skincare",
    desc: "Glow with botanicals",
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    color: "from-emerald-100/50 to-sage-50",
    link: "/products",
  },
  {
    name: "Serums",
    desc: "Targeted face & hair repair",
    emoji: "💧",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    color: "from-teal-100/50 to-green-50",
    link: "/products",
  },
  {
    name: "New Launch",
    desc: "Discover what's fresh",
    emoji: "🌸",
    image: "https://images.unsplash.com/photo-1615397323282-3112b329bc0b?w=600&q=80",
    color: "from-sage-100/50 to-stone-50",
    link: "/products",
  },
];

const wellnessCategories = [
  {
    name: "Nutrition",
    desc: "Fuel your daily energy",
    emoji: "🍎",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    color: "from-purple-100/50 to-fuchsia-50",
    link: "/products",
  },
  {
    name: "Energy",
    desc: "Stay active all day",
    emoji: "⚡",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80",
    color: "from-fuchsia-100/50 to-purple-50",
    link: "/products",
  },
  {
    name: "Weight Loss",
    desc: "Healthy metabolism",
    emoji: "⚖️",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    color: "from-violet-100/50 to-fuchsia-50",
    link: "/products",
  },
  {
    name: "Men & Women Health",
    desc: "Holistic wellness support",
    emoji: "🧘",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    color: "from-purple-100/50 to-pink-50",
    link: "/products",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } 
  },
};

const CategorySection = () => {
  const { section } = useTheme();
  const categories = section === "beauty" ? beautyCategories : wellnessCategories;

  return (
    <section id="shop-by-essential" className={`py-20 md:py-32 transition-colors duration-700 ${section === "beauty" ? "bg-white" : "bg-purple-50/10"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge mb-4"
        >
          Botanical Collections
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title"
        >
          Shop by Essential
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-subtitle"
        >
          Discover nature's finest ingredients tailored for your unique needs.
        </motion.p>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
      >
        {categories.map((cat) => (
          <motion.div key={cat.name} variants={item}>
            <Link
              to={cat.link}
              id={`category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative rounded-3xl overflow-hidden block aspect-[4/5] shadow-glow-soft hover:shadow-card-hover transition-all duration-500"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-black/10 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-3xl mb-2 block group-hover:-translate-y-1 transition-transform duration-500">{cat.emoji}</span>
                <h3 className="text-white font-bold text-xl leading-tight font-serif">
                  {cat.name}
                </h3>
                <p className="text-white/80 text-sm mt-1 font-light tracking-wide">{cat.desc}</p>
              </div>

              {/* Hover Pill */}
              <div className="absolute top-4 right-4 bg-white/95 text-emerald-800 text-[10px] font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 backdrop-blur-sm shadow-xl">
                Shop Now
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;

