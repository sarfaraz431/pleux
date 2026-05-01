import React, { useState, useEffect } from "react";
import { 
  Trash2, RefreshCw, Ticket 
} from "lucide-react";
import { getCoupons, addCoupon, deleteCoupon, type Coupon } from "../../services/couponService";
import { emptyCoupon } from "./adminTypes";

const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCoupon = async () => {
    if (!couponForm.code || !couponForm.discount) return alert("All fields required");
    try {
      await addCoupon({
        code: couponForm.code.toUpperCase().trim(),
        discount: Number(couponForm.discount),
        active: true
      });
      setCouponForm(emptyCoupon);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start animate-fade-in">
      {/* Coupon Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <h2 className="font-serif text-xl md:text-2xl text-charcoal flex items-center gap-2 mb-2">
          <Ticket className="text-emerald-500" size={24} />
          Discount Hub
        </h2>
        <p className="text-xs text-gray-400 mb-8">Create promotional codes to drive botanical sales.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Promo Code</label>
            <input
              placeholder="e.g. BOTANICAL20"
              value={couponForm.code}
              onChange={e => setCouponForm({ ...couponForm, code: e.target.value })}
              className="input-field uppercase font-black tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Discount Percentage (%)</label>
            <input
              type="number"
              placeholder="20"
              value={couponForm.discount}
              onChange={e => setCouponForm({ ...couponForm, discount: e.target.value })}
              className="input-field"
            />
          </div>
          <button
            onClick={handleAddCoupon}
            className="w-full py-4 rounded-2xl bg-charcoal hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all"
          >
            Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons List */}
      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">Active Offers</h2>
          <button onClick={fetchData} className="p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-8">Manage all promotional discount codes.</p>

        <div className="grid gap-4">
          {loading ? (
            <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">Syncing Offers...</div>
          ) : coupons.map(c => (
            <div key={c.id} className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl bg-stone-50/30 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Ticket size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-charcoal tracking-widest">{c.code}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{c.discount}% Discount</p>
                </div>
              </div>
              <button
                onClick={() => deleteCoupon(c.id!).then(fetchData)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {coupons.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-3xl">
              No promotional codes active at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponManager;
