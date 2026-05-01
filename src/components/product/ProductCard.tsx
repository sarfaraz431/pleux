import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { ShoppingBag, Star, Check } from "lucide-react";
import { type Product } from "../../types/Product";
import { useTheme } from "../../context/useTheme";

const ProductCard = ({ product }: { product: Product }) => {
  const { section, colors } = useTheme();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const rating = product.rating ?? 4.5;
  const fullStars = Math.floor(rating);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={`group bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-card-hover border ${section === "beauty" ? "border-emerald-50/50" : "border-purple-50/50"}`}
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden aspect-[4/5] bg-stone-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400";
          }}
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${section === "beauty" ? "from-emerald-950/20" : "from-purple-950/20"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Badge Removed per user request */}

        {/* 🔥 Quick Add Button (Hover) */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[85%] sm:w-[80%] py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-500 backdrop-blur-md ${added
              ? `${colors.primary} text-white shadow-lg`
              : `bg-white/90 text-[#033b2e] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-xl`
            }`}
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={14} /> Added to Cart
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={14} /> Quick Add
            </span>
          )}
        </button>
      </div>

      {/* DETAILS */}
      <div className="p-3 sm:p-6 flex flex-col gap-2 sm:gap-3">
        {/* Name */}
        <h3 className={`text-sm sm:text-base font-serif font-bold text-[#033b2e] line-clamp-1 transition-colors ${section === "beauty" ? "group-hover:text-emerald-700" : "group-hover:text-purple-700"}`}>
          {product.name}
        </h3>

        {/* Rating & Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < fullStars
                    ? `fill-current ${colors.text}`
                    : "fill-stone-200 text-stone-200"
                }
              />
            ))}
            <span className="text-[9px] sm:text-[10px] text-stone-400 font-bold ml-1">
              {rating}
            </span>
          </div>
          <span className="text-[8px] sm:text-[10px] text-stone-400 uppercase tracking-tighter hidden sm:inline">Verified Result</span>
        </div>

        {/* Price */}
        <div className={`flex items-center justify-between mt-1 sm:mt-2 pt-3 sm:pt-4 border-t ${section === "beauty" ? "border-emerald-50/50" : "border-purple-50/50"}`}>
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] text-stone-400 uppercase font-medium">Price</span>
            <span className={`text-sm sm:text-xl font-bold text-[#033b2e]`}>
              ₹{product.price}
            </span>
          </div>

          {/* Mini Button (mobile visible) */}
          <button
            onClick={handleAddToCart}
            className={`md:hidden w-8 h-8 sm:w-10 sm:h-10 ${colors.light} ${colors.text} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

