import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/useTheme";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const SORT_OPTIONS = [
  { label: "Sort: Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const Products = () => {
  const { products, loading } = useProducts();
  const { section } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    document.title = "Shop Pure Botanicals | PLEUX+";
  }, []);

  const filtered = products
    .filter((p) => p.section === section) // Strictly filter by current section
    .filter((p) => !categoryFilter || p.category === categoryFilter)
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  const categories = Array.from(new Set(products.filter(p => p.section === section).map(p => p.category))).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#F9FBF9]">
      {/* Header - theme aware */}
      <div className={`relative overflow-hidden py-20 md:py-28 ${section === "beauty" ? "bg-emerald-50/40" : "bg-purple-50/40"}`}>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none opacity-40" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-100/40 rounded-full blur-[100px] pointer-events-none opacity-30" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10 md:top-10 md:left-10">
          <Link to="/" className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal hover:text-emerald-600 hover:scale-105 transition-all duration-300" aria-label="Go back to home">
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge mb-6"
          >
            Our Full Collection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title mb-6"
          >
            Consciously Crafted <br className="hidden md:block" /> Essentials
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-subtitle !text-center"
          >
            Explore our complete range of premium botanical care, 
            sourced from nature and refined by science.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 mb-12 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              id="products-search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-14 pr-12 !bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 lg:gap-6">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="relative w-full sm:w-auto">
                <select
                  value={categoryFilter || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      searchParams.set("category", e.target.value);
                    } else {
                      searchParams.delete("category");
                    }
                    setSearchParams(searchParams);
                  }}
                  className="input-field w-full sm:w-48 pr-10 cursor-pointer !bg-white font-bold text-emerald-950 text-xs uppercase tracking-widest"
                >
                  <option value="">ALL CATEGORIES</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="relative flex items-center gap-3 w-full sm:w-auto">
              <SlidersHorizontal size={16} className="text-emerald-400 flex-shrink-0" />
              <select
                id="products-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field w-full sm:w-56 pr-10 cursor-pointer !bg-white font-bold text-emerald-950 text-xs uppercase tracking-widest"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count & Active Category */}
        {!loading && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-emerald-50 pb-4">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              Showing {filtered.length} Botanical Formula{filtered.length !== 1 ? "s" : ""}
              {search ? ` for "${search}"` : ""}
            </p>
            
            {categoryFilter && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="text-[10px] font-black uppercase tracking-widest">{categoryFilter}</span>
                <button 
                  onClick={() => {
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  }}
                  className="hover:text-emerald-900 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-glow-soft animate-pulse p-6">
                <div className="aspect-[4/5] bg-stone-50 rounded-3xl mb-6" />
                <div className="space-y-4">
                  <div className="h-5 bg-stone-50 rounded-full w-3/4" />
                  <div className="h-3 bg-stone-50 rounded-full w-1/2" />
                  <div className="h-10 bg-stone-50 rounded-full w-full mt-6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="text-6xl mb-8 grayscale opacity-20">🍃</div>
            <h3 className="font-serif text-3xl text-emerald-950 mb-4 font-bold">No Match Found</h3>
            <p className="text-stone-400 text-base mb-10 font-light max-w-sm">
              We couldn't find a formula matching your search. Try different terms or explore our bestsellers.
            </p>
            <button
              onClick={() => setSearch("")}
              className="btn-primary"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10"
          >
            {filtered.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={{ ...product, id: product.id! }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;

