import { useState } from "react";
import { Package, Search, ArrowRight, Truck, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setTracking(true);
    // Simulate tracking
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-40 md:pt-48 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-8 md:p-12 border border-stone-100"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={32} />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">Track Your Order</h1>
            <p className="text-gray-400 text-sm font-medium">Enter your order ID to see its current status and estimated delivery.</p>
          </div>

          <form onSubmit={handleTrack} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Order ID (e.g. #PLX-12345)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/50 transition-all flex items-center justify-center gap-2"
            >
              Track Package <ArrowRight size={16} />
            </button>
          </form>

          {tracking && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-12 pt-12 border-t border-stone-100"
            >
              <div className="space-y-8">
                {[
                  { status: "Order Confirmed", date: "Oct 24, 2024", done: true, icon: <CheckCircle2 size={18} /> },
                  { status: "Processing", date: "Oct 25, 2024", done: true, icon: <Clock size={18} /> },
                  { status: "In Transit", date: "Estimated Oct 27", done: false, icon: <Truck size={18} /> },
                  { status: "Out for Delivery", date: "-", done: false, icon: <Package size={18} /> },
                ].map((step, idx) => (
                  <div key={step.status} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step.done ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-300"}`}>
                        {step.icon}
                      </div>
                      {idx < 3 && <div className={`w-[2px] h-12 my-1 ${step.done ? "bg-emerald-500" : "bg-stone-100"}`} />}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-black uppercase tracking-widest ${step.done ? "text-charcoal" : "text-stone-300"}`}>{step.status}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">Support Note</p>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Tracking information can take up to 24 hours to update after dispatch. If you have any questions, please contact our support.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;
