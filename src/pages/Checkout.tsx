import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, User, Phone, MapPin, ArrowLeft, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { validateCoupon } from "../services/couponService";
import { saveOrder } from "../services/orderService";

const Checkout = () => {
  const { cart, removeFromCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 🛡️ SECURITY GUARD: Block unauthorized access at the page level
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true, state: { from: { pathname: "/checkout" } } });
    }
  }, [user, loading, navigate]);

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    address: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const applyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;

    setValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    const validCoupon = await validateCoupon(code);

    if (validCoupon) {
      setDiscount(validCoupon.discount);
      setCouponSuccess(`Success! ${validCoupon.discount}% discount applied.`);
    } else {
      setDiscount(0);
      setCouponError("Invalid or expired coupon code.");
    }
    setValidatingCoupon(false);
  };

  // Update name if user logs in while on page
  useEffect(() => {
    if (user?.displayName && !form.name) {
      setForm(prev => ({ ...prev, name: user.displayName! }));
    }
  }, [user, form.name]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const shipping = subtotal >= 600 ? 0 : 79;
  const total = subtotal - discountAmount + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim() || form.address.trim().length < 10) e.address = "Please enter a complete delivery address";
    return e;
  };

  const handleOrder = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setPlacing(true);

    // 📊 Save order for Analytics
    try {
      await saveOrder({
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal,
        discount: discountAmount,
        total,
        customerName: form.name,
        customerPhone: form.phone,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Failed to save order for analytics:", err);
    }

    const items = cart.map((item) => `• ${item.name} x${item.qty} = ₹${item.price * item.qty}`).join("%0A");
    const message =
      `🛒 *New Order — PLEUX+* %0A%0A` +
      `👤 *Name:* ${form.name}%0A` +
      `📱 *Phone:* ${form.phone}%0A` +
      `📍 *Address:* ${form.address}%0A%0A` +
      `*Items:*%0A${items}%0A%0A` +
      `📦 *Subtotal:* ₹${subtotal}%0A` +
      (discount > 0 ? `🎟️ *Discount:* -₹${discountAmount} (${couponCode.toUpperCase()})%0A` : "") +
      `🚚 *Shipping:* ${shipping === 0 ? "Free" : `₹${shipping}`}%0A` +
      `💰 *Total: ₹${total}*`;

    const number = import.meta.env.VITE_WHATSAPP_NUMBER;
    setTimeout(() => {
      window.open(`https://wa.me/${number}?text=${message}`, "_blank");
      cart.forEach((item) => removeFromCart(item.id));
      navigate("/");
      setPlacing(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FBF9]">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FBF9] flex flex-col items-center justify-center gap-6 text-center px-4">
        <CheckCircle size={64} className="text-emerald-300" />
        <h2 className="font-serif text-3xl text-emerald-950 font-bold">Checkout is Empty</h2>
        <p className="text-stone-400 text-sm">You haven't added any botanical formulas to your bag yet.</p>
        <button onClick={() => navigate("/products")} className="btn-primary">Browse Collection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button onClick={() => navigate("/cart")} className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-emerald-700 transition-colors mb-8 group uppercase tracking-widest">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Bag
        </button>

        <div className="mb-10">
          <span className="badge mb-3">Final Ritual</span>
          <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 font-bold">Secure Checkout</h1>
          <p className="text-stone-400 text-sm mt-2 font-light">Complete your details to finalize your botanical acquisition.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Form */}
          <div className="bg-white rounded-[2.5rem] shadow-glow-soft p-8 md:p-10 border border-emerald-50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-emerald-950 font-bold">Delivery Address</h2>
              {user && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  <Sparkles size={12} /> Member Profile
                </div>
              )}
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-stone-400 mb-3 uppercase tracking-widest">Recipient Name</label>
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" />
                <input id="checkout-name" type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
                  className={`input-field pl-12 !bg-stone-50 ${errors.name ? "ring-2 ring-red-100 border-red-300" : ""}`} />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-stone-400 mb-3 uppercase tracking-widest">Contact Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" />
                <input id="checkout-phone" type="tel" name="phone" placeholder="10-digit Mobile" value={form.phone} onChange={handleChange}
                  className={`input-field pl-12 !bg-stone-50 ${errors.phone ? "ring-2 ring-red-100 border-red-300" : ""}`} />
              </div>
              {errors.phone && <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-stone-400 mb-3 uppercase tracking-widest">Shipping Destination</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-5 text-emerald-300" />
                <textarea id="checkout-address" name="address" rows={3} placeholder="Full address with Pincode" value={form.address} onChange={handleChange}
                  className={`input-field pl-12 resize-none !bg-stone-50 h-32 ${errors.address ? "ring-2 ring-red-100 border-red-300" : ""}`} />
              </div>
              {errors.address && <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.address}</p>}
            </div>

            <button id="checkout-place-order" onClick={handleOrder} disabled={placing}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-60 shadow-xl shadow-emerald-900/10"
              style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
              {placing ? (
                <span className="animate-pulse">Finalizing Ritual...</span>
              ) : (
                <>
                  <MessageCircle size={20} className="fill-white/20" />
                  Confirm via WhatsApp
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-4">Order confirmation will be sent to your WhatsApp</p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-[2.5rem] shadow-glow-soft p-8 sticky top-24 border border-emerald-50">
            <h2 className="font-serif text-2xl text-emerald-950 font-bold mb-6">Acquisition Summary</h2>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-emerald-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&q=80"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-emerald-950 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-black text-emerald-950 flex-shrink-0 tracking-tighter">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-emerald-50 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold text-emerald-950 text-sm">₹{subtotal}</span>
              </div>

              {/* Coupon UI */}
              <div className="py-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                      setCouponSuccess("");
                    }}
                    className="flex-1 bg-stone-50 border border-emerald-50 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-100 uppercase font-bold text-emerald-950"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={validatingCoupon}
                    className="bg-emerald-950 text-white text-[10px] font-bold px-6 py-3 rounded-xl hover:bg-emerald-800 transition-colors uppercase tracking-[0.2em] flex items-center justify-center min-w-[100px]"
                  >
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{couponError}</p>}
                {couponSuccess && <p className="text-emerald-600 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{couponSuccess}</p>}
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-lg">
                  <span>Discount ({discount}%)</span>
                  <span>−₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Shipping</span>
                <span className={`font-bold text-sm ${shipping === 0 ? "text-emerald-600" : "text-emerald-950"}`}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-emerald-50">
                <span className="text-emerald-950 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-emerald-900 font-black text-3xl tracking-tighter">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

