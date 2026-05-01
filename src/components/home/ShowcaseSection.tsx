import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../product/ProductCard";
import { useProducts } from "../../context/ProductContext";
import { useTheme } from "../../context/useTheme";

const beautyCategories = ["Hair Care", "Skincare", "Serum", "Face Care", "New Launch", "Soap"];
const wellnessCategories = ["Nutrition", "Energy", "Weight Loss", "Men Health", "Women Health"];

const ShowcaseSection = () => {
  const { products } = useProducts();
  const { section } = useTheme();

  const availableCategories = section === "beauty" ? beautyCategories : wellnessCategories;

  // Show all available categories as tabs
  const activeCategories = availableCategories
    .map(cat => ({
      name: cat,
      items: products.filter(p => p.category === cat && p.section === section).slice(0, 3)
    }));

  const [activeTab, setActiveTab] = useState(activeCategories[0]?.name || "");

  // Reset active tab when section changes
  useEffect(() => {
    if (activeCategories.length > 0) {
      setActiveTab(activeCategories[0].name);
    }
  }, [section, products]);

  if (activeCategories.length === 0) return null;

  const currentCategory = activeCategories.find(c => c.name === activeTab);

  return (
    <section className="py-12 md:py-20 bg-[#F9FBF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header matching image */}
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-3xl md:text-4xl font-black italic text-[#033b2e] font-sans tracking-tight">Best Sellers</h2>
          <Link to="/products" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 flex items-center gap-1 group pb-1">
            SHOP ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b-2 border-gray-100 mb-8 md:mb-12 relative">
          <div className="flex w-full justify-start">
            {activeCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveTab(category.name)}
                className={`relative px-4 md:px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === category.name ? "text-[#033b2e]" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {category.name}
                {activeTab === category.name && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-emerald-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentCategory && (
              <motion.div
                key={currentCategory.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentCategory.items.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {currentCategory.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 rounded-2xl border border-dashed border-emerald-100">
                    <p className="text-emerald-800 font-serif text-lg font-bold mb-2">New Arrivals Coming Soon</p>
                    <p className="text-gray-500 text-sm">We are crafting something special for {currentCategory.name}. Check back later!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Dots (Visual Only to match reference) */}
        {/* <div className="">
          <div className="w-2 h-2 rounded-full bg-[#033b2e]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        </div> */}

      </div>
    </section>
  );
};

export default ShowcaseSection;
