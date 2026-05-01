import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import ProductCard from "../product/ProductCard";
import { useProducts } from "../../context/ProductContext";
import { useTheme } from "../../context/useTheme";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const BestsellerSection = () => {
  const { products } = useProducts();
  const { section } = useTheme();
  const displayProducts = products.filter(p => p.section === section).slice(0, 4);

  return (
    <section id="bestsellers" className="py-24 md:py-32 bg-[#fdfdfd] relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/20 skew-x-12 translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="badge mb-4"
            >
              Our Bestsellers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Loved by Thousands
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-subtitle !text-left !mx-0"
            >
              Our top-rated products, formulated with potent plant extracts and trusted by customers worldwide.
            </motion.p>
          </div>
          <Link
            to="/products"
            id="bestseller-view-all"
            className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-600 transition-all"
          >
            Explore All Products
            <div className="w-8 h-8 rounded-full border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10"
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/products"
            className="btn-outline w-full"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellerSection;

