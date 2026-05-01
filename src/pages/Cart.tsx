import { useCart } from "../hooks/useCart";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 600 ? 0 : 79;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FBF9] flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center mb-4">
          <ShoppingBag size={48} className="text-emerald-300" />
        </div>
        <h2 className="font-serif text-3xl text-emerald-950 font-bold">Your Bag is Empty</h2>
        <p className="text-stone-400 text-sm max-w-xs font-light">Explore our botanical formulas and treat your skin to nature's purity.</p>
        <Link to="/products" id="cart-shop-now" className="btn-primary mt-4">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12">
          <button onClick={() => navigate("/products")} className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-emerald-700 transition-colors mb-6 group uppercase tracking-widest">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
          </button>
          <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 font-bold">
            Shopping Bag <span className="text-base font-sans font-bold text-emerald-500 ml-2">({cart.reduce((s, i) => s + i.qty, 0)})</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div key={item.id} id={`cart-item-${item.id}`} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }} transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] shadow-glow-soft p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-emerald-50/50">
                  
                  <div className="flex items-center gap-5 w-full sm:w-auto flex-1">
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-50 cursor-pointer border border-emerald-50" onClick={() => navigate(`/product/${item.id}`)}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-bold text-emerald-950 line-clamp-1 cursor-pointer hover:text-emerald-700 transition-colors" onClick={() => navigate(`/product/${item.id}`)}>
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 font-black text-xl mt-1 tracking-tighter">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-4 sm:pt-0 border-t sm:border-0 border-emerald-50">
                    <div className="flex items-center bg-stone-50 border border-emerald-50 rounded-xl overflow-hidden">
                      <button id={`cart-decrease-${item.id}`} onClick={() => decreaseQty(item.id)} className="w-10 h-10 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-emerald-950">{item.qty}</span>
                      <button id={`cart-increase-${item.id}`} onClick={() => increaseQty(item.id)} className="w-10 h-10 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <p className="font-black text-emerald-950 text-lg min-w-[80px] text-right tracking-tighter">₹{item.price * item.qty}</p>
                      <button id={`cart-remove-${item.id}`} onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-glow-soft p-8 md:sticky md:top-28 border border-emerald-50">
            <h2 className="font-serif text-2xl text-emerald-950 font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="font-bold text-emerald-950">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                <span className={`font-bold ${shipping === 0 ? "text-emerald-600" : "text-emerald-950"}`}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 font-bold uppercase tracking-widest">Add ₹{600 - subtotal} more for Free Shipping 🌿</p>
              )}
            </div>
            <div className="flex justify-between items-end border-t border-emerald-50 pt-6 mb-8">
              <span className="text-emerald-950 font-bold uppercase tracking-widest text-xs">Total</span>
              <span className="text-emerald-900 font-black text-3xl tracking-tighter">₹{total}</span>
            </div>
            <button id="cart-checkout-btn" onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-brand-gradient text-white font-bold text-base shadow-xl shadow-emerald-900/10 hover:shadow-glow-green active:scale-95 transition-all">
              Checkout Bag <ArrowRight size={18} />
            </button>
            <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-4">🔒 Secured by PLEUX+ Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

