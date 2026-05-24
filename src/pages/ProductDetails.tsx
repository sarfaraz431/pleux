import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, ShoppingBag, ArrowLeft, Check, Shield, Leaf, Truck, ChevronRight, Share2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import ProductCard from "../components/product/ProductCard";
import ProductGallery from "../components/product/ProductGallery";
import SEOHead from "../components/layout/SEOHead";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/useTheme";
import ReviewSection from "../components/product/ReviewSection";
import type { Product } from "../types/Product";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products: allProducts, loading: globalLoading } = useProducts();

  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!globalLoading) {
      const found = allProducts.find((p) => p.id === id);
      setProduct(found ?? null);
      setLoading(false);
    }
  }, [id, allProducts, globalLoading]);

  const handleShare = async () => {
    const shareData = {
      title: `PLEUX+ | ${product?.name}`,
      text: `Check out this amazing botanical formula: ${product?.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } else {
        // Legacy Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setShared(true);
          setTimeout(() => setShared(false), 3000);
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id!,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FBF9] max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-stone-100 rounded-[2.5rem]" />
        <div className="space-y-6 py-4">
          <div className="h-6 bg-stone-100 rounded-full w-1/4" />
          <div className="h-12 bg-stone-100 rounded-full w-3/4" />
          <div className="h-6 bg-stone-100 rounded-full w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-stone-100 rounded-full w-full" />
            <div className="h-4 bg-stone-100 rounded-full w-5/6" />
          </div>
          <div className="h-16 bg-stone-100 rounded-full w-full mt-12" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9FBF9] flex flex-col items-center justify-center gap-6 text-center px-4">
        <span className="text-6xl grayscale opacity-20">🍃</span>
        <h2 className="font-serif text-3xl text-emerald-950 font-bold">Formula Not Found</h2>
        <p className="text-stone-400 text-sm max-w-xs">The product you're looking for might have been archived or moved.</p>
        <button
          onClick={() => navigate("/products")}
          className="btn-primary"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const rating = product.rating ?? 4.5;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-[#F9FBF9]">
      <SEOHead
        title={product.name}
        description={product.description || `Shop ${product.name} — premium botanical formula by PLEUX+. 100% natural, science-backed skincare.`}
        url={`/product/${product.id}`}
        image={product.image}
        type="product"
        keywords={`${product.name}, ${product.category || ''}, botanical skincare, PLEUX, premium beauty`}
        jsonLd={{
          "@type": "Product",
          name: product.name,
          description: product.description || "Premium botanical skincare formula",
          image: product.images?.length ? product.images : [product.image],
          brand: { "@type": "Brand", name: "PLEUX+" },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `https://pleux.com/product/${product.id}`,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating ?? 4.5,
            bestRating: 5,
            ratingCount: 128,
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-emerald-600 transition-colors"
          >
            Home
          </button>
          <ChevronRight size={10} />
          <button
            onClick={() => navigate("/products")}
            className="hover:text-emerald-600 transition-colors"
          >
            Shop
          </button>
          <ChevronRight size={10} />
          <span className="text-emerald-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          id="product-back-btn"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-emerald-700 transition-colors mb-10 group uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Premium Multi-Image Gallery */}
          <ProductGallery
            images={product.images?.length ? product.images : [product.image]}
            productName={product.name}
          />

          {/* Info */}
          <div className="flex flex-col py-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="badge !bg-emerald-50 !text-emerald-700 !border-emerald-100">Dermatologist Approved</span>
              <span className="badge !bg-stone-50 !text-stone-500 !border-stone-100">Vegan</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 leading-tight font-bold">
                {product.name}
              </h1>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-white border border-emerald-50 text-emerald-900 hover:bg-emerald-50 transition-all shadow-sm group active:scale-90"
                  title="Share product"
                >
                  <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                {shared && (
                  <div className="absolute top-full right-0 mt-2 bg-charcoal text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap animate-fade-in shadow-xl uppercase tracking-widest z-20">
                    Link Copied!
                  </div>
                )}
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < fullStars
                        ? "fill-emerald-500 text-emerald-500"
                        : i === fullStars && hasHalf
                        ? "fill-emerald-200 text-emerald-500"
                        : "fill-stone-100 text-stone-100"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-emerald-950 ml-1">{rating}</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Certified Result</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-black text-5xl text-emerald-900 tracking-tighter">₹{product.price}</span>
              <span className="text-stone-300 line-through text-xl font-light">
                ₹{Math.round(product.price * 1.3)}
              </span>
              <div className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                Save 23%
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-500 leading-relaxed text-base md:text-lg mb-10 flex-1 font-light">
              {product.description || "A masterfully crafted botanical formula designed to harmonize with your skin's natural biology. Powered by plant extracts and refined by modern clinical science for visible, lasting results."}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-8 mb-10">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-[0.2em]">Quantity</span>
              <div className="flex items-center bg-white border border-emerald-50 rounded-2xl overflow-hidden shadow-sm">
                <button
                  id="product-qty-decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-14 h-14 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors text-2xl font-light"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-bold text-emerald-950">{qty}</span>
                <button
                  id="product-qty-increase"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-14 h-14 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors text-2xl font-light"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                id="product-add-to-cart"
                onClick={handleAdd}
                className={`flex-[2] flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-sm md:text-base transition-all duration-500 shadow-xl ${
                  added
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : "bg-brand-gradient text-white hover:shadow-glow-green active:scale-95"
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add to Cart
                  </>
                )}
              </button>

              <button
                id="product-buy-now"
                onClick={() => {
                  handleAdd();
                  navigate("/cart");
                }}
                className="flex-1 py-5 rounded-2xl font-bold text-sm md:text-base border border-emerald-100 text-emerald-900 bg-white hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
              >
                Quick Buy
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-emerald-50">
              {[
                { icon: <Leaf size={18} />, label: "Bio-Organic" },
                { icon: <Shield size={18} />, label: "Clinic Tested" },
                { icon: <Truck size={18} />, label: "Fast Shipping" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">{b.icon}</div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Related Products Section */}
      <div className="bg-white border-t border-emerald-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="badge mb-4">Curated for you</span>
              <h2 className="font-serif text-4xl text-emerald-950 font-bold">Complete Your Ritual</h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-[0.2em] border-b-2 border-emerald-100 pb-1 transition-all"
            >
              See All Products
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {allProducts
              .filter((p) => p.id !== id && p.section === product.section)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      </div>

      {/* ⭐ Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <ReviewSection
          productId={product.id!}
          section={product.section as any}
          themeColor={product.section === "wellness" ? "#9333ea" : "#10b981"}
        />
      </div>
    </div>
  );
};

export default ProductDetails;

