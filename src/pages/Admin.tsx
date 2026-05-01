import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
//import logo from "/"
import {
  Ticket, Users, BarChart3, ShoppingCart, Video, LayoutDashboard, FileText, Star, ImageIcon, ArrowLeft
} from "lucide-react";

// Modular Components
import ProductManager from "../components/admin/ProductManager";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import BannerManager from "../components/admin/BannerManager";
import CouponManager from "../components/admin/CouponManager";
import ReviewManager from "../components/admin/ReviewManager";
import BlogManager from "../components/admin/BlogManager";
import VideoManager from "../components/admin/VideoManager";
import TeamManager from "../components/admin/TeamManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "videos" | "coupons" | "reviews" | "blogs" | "team" | "analytics">("analytics");
  const [timeRange, setTimeRange] = useState(30);
  const { products } = useProducts();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Admin Suite | PLEUX+ Dashboard";
  }, []);

  const tabs = [
    { id: "analytics", label: "Intelligence", icon: <BarChart3 size={18} /> },
    { id: "products", label: "Catalog", icon: <ShoppingCart size={18} /> },
    { id: "banners", label: "Promotions", icon: <ImageIcon size={18} /> },
    { id: "videos", label: "Shoppable", icon: <Video size={18} /> },
    { id: "blogs", label: "Stories", icon: <FileText size={18} /> },
    { id: "coupons", label: "Discounts", icon: <Ticket size={18} /> },
    { id: "reviews", label: "Community", icon: <Star size={18} /> },
    { id: "team", label: "Authority", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FBF9] pb-20">
      {/* ─── TOP HEADER & TABS ─────────────────────────────── */}
      <div className="bg-[#061C14] text-white pt-4 md:pt-6 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 md:px-10 lg:px-12">
          {/* Header Top Row */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div className="flex items-center gap-3 md:gap-5">
              {/* Back Button */}
              <Link
                to="/"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition"
                title="Back to Store"
              >
                <ArrowLeft className="text-white" size={18} />
              </Link>

              {/* Dashboard Icon */}


              {/* Divider */}
              <div className="w-px h-8 bg-white/10 hidden md:block" />

              {/* Brand Section */}
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src="/assets/images/pleux-logo.png"
                  alt="PLEUX"
                  className="h-6 md:h-8 w-auto object-contain"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Admin Suite
                  </span>
                </div>
              </div>
            </div>

            {/* User Profile Mini */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-4 py-1.5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{user?.displayName || "Administrator"}</p>
                <p className="text-[9px] text-white/40 font-medium uppercase tracking-widest">System Access</p>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs Area */}
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 md:gap-2 pb-3 md:pb-4 -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-full text-[11px] md:text-xs font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
              >
                <span className="hidden md:inline">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CANVAS ─────────────────────────── */}
      <main className="p-4 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === "analytics" && <AnalyticsDashboard timeRange={timeRange} setTimeRange={setTimeRange} />}
              {activeTab === "products" && <ProductManager />}
              {activeTab === "banners" && <BannerManager />}
              {activeTab === "videos" && <VideoManager />}
              {activeTab === "blogs" && <BlogManager />}
              {activeTab === "coupons" && <CouponManager />}
              {activeTab === "reviews" && <ReviewManager />}
              {activeTab === "team" && <TeamManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
