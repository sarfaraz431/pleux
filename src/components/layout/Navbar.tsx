import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Sparkles, User, LogOut, Search, ChevronRight } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useTheme } from "../../context/useTheme";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { section, setSection } = useTheme();
  const location = useLocation();
  const { cart } = useCart();
  const { user, isAdmin, isVerified, logout } = useAuth();
  const { products } = useProducts();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  const isCheckoutOrCart = location.pathname === "/checkout" || location.pathname === "/cart";

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const filtered = searchTerm.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
    : [];

  useEffect(() => { setTimeout(() => { setOpen(false); setSearchTerm(""); setShowUserMenu(false); }, 0); }, [location]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  if (isAdminRoute) return null;

  const isBeauty = section === "beauty";
  const themeColor = isBeauty ? "#51C075" : "#8A56AC";
  const darkColor = isBeauty ? "#004d2c" : "#4B2961";
  const accentText = isBeauty ? "text-emerald-700" : "text-purple-700";
  const accentBg = isBeauty ? "bg-emerald-50 hover:bg-emerald-100" : "bg-purple-50 hover:bg-purple-100";

  const handleToggleSection = (newSection: "beauty" | "wellness") => {
    setSection(newSection);
    if (isHomePage) {
      setTimeout(() => {
        const el = document.getElementById("hero-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      navigate("/?scroll=hero");
    }
  };

  const categories = isBeauty
    ? [
      { label: "New Launch", img: "https://images.unsplash.com/photo-1615397323282-3112b329bc0b?w=120&q=80" },
      { label: "Hair Care", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&q=80" },
      { label: "Skincare", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=120&q=80" },
      { label: "Serum", img: "https://images.unsplash.com/photo-1710410815589-dd83514104d0?w=120&q=80" },
      { label: "Face Care", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=80" },
      { label: "Soap", img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=120&q=80" },
    ]
    : [
      { label: "Nutrition", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&q=80" },
      { label: "Energy", img: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=120&q=80" },
      { label: "Weight Loss", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&q=80" },
      { label: "Men Health", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=120&q=80" },
      { label: "Women Health", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&q=80" },
    ];

  return (
    <>
      {/* ═══ STICKY HEADER ══════════════════════════════════════ */}
      <header className="sticky top-0 z-[60] w-full" style={{ backgroundColor: themeColor }}>

        {/* Announcement with Marquee */}
        <div className="w-full text-white text-[10px] font-bold py-2 flex items-center overflow-hidden border-b border-white/5" style={{ backgroundColor: darkColor }}>
          <div className="whitespace-nowrap animate-[marquee_40s_linear_infinite] flex items-center gap-12 min-w-full">
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
            <span>🌿 Powered by Plant</span>
            <span>✨ Free Shipping on Orders Above ₹600! <Link to="/products" className="underline font-black">Shop Now</Link></span>
          </div>
        </div>

        {/* Mobile: Toggle row — hide on checkout/cart */}
        {!isCheckoutOrCart && (
          <div className="md:hidden flex justify-center px-4 py-1.5">
            <div className="flex items-center rounded-full p-0.5 border border-white/20" style={{ backgroundColor: "rgba(0,0,0,0.12)" }}>
              <button
                onClick={() => handleToggleSection("beauty")}
                className={`px-10 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${isBeauty
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                Beauty
              </button>
              <button
                onClick={() => handleToggleSection("wellness")}
                className={`px-10 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${!isBeauty
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                Wellness
              </button>
            </div>
          </div>
        )}

        {/* Main Nav Row */}
        <div className="w-full max-w-7xl mx-auto px-3 md:px-6 h-12 md:h-16 flex items-center gap-3 md:gap-6">

          {/* Hamburger (mobile) */}
          <button onClick={() => setOpen(true)} className="md:hidden text-white p-1 flex-shrink-0">
            <Menu size={20} />
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="PLEUX Home">
            <img
              src="/assets/images/pleux-logo.png"
              alt="PLEUX"
              className="h-6 w-auto brightness-0 invert"
              onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block"; }}
            />
            <span className="text-xl font-black tracking-tighter text-white leading-none hidden">
              PLEUX™<span className="text-white/60 font-sans"></span>
            </span>
          </Link>
          {/* ... (rest of main row) */}
          <div className="hidden md:flex items-center rounded-full p-1 flex-shrink-0 ml-1" style={{ backgroundColor: "rgba(0,0,0,0.18)" }}>
            <button
              onClick={() => handleToggleSection("beauty")}
              className={`px-10 py-1.5 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-200 ${isBeauty
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/55 hover:text-white/80"
                }`}
            >
              Beauty
            </button>
            <button
              onClick={() => handleToggleSection("wellness")}
              className={`px-10 py-1.5 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-200 ${!isBeauty
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/55 hover:text-white/80"
                }`}
            >
              Wellness
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder={`Search...`}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setTimeout(() => setSearchTerm(""), 180)}
              className="w-full bg-white rounded-lg py-1.5 pl-9 pr-4 text-xs text-gray-800 focus:outline-none placeholder:text-gray-400" />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 px-4">
            <Link to="/our-story" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Who we are</Link>
            <Link to="/why-choose-us" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Why choose Pleux</Link>
            <Link to="/blogs" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Blogs</Link>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center gap-2 ml-auto flex-shrink-0">
            {user && isVerified ? (
              <div className="relative" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                <button className="text-white hover:text-white/80 transition p-1.5"><User size={19} /></button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 min-w-[175px] z-[70]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5">
                      <div className="px-3 py-2 mb-1 border-b border-gray-50">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.displayName || user.email}</p>
                        <p className="text-[10px] text-gray-400">{isAdmin ? "Administrator" : "Member"}</p>
                      </div>
                      {isAdmin && <Link to="/admin" className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg ${accentText} ${accentBg}`}><Sparkles size={12} />Admin Suite</Link>}
                      <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg text-left"><LogOut size={12} />Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-white/80 transition p-1.5"><User size={19} /></Link>
            )}
            <Link to="/cart" className="relative text-white hover:text-white/80 transition p-1.5">
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-0.5">{cartCount}</span>}
            </Link>
            <Link to="/products" className="bg-white/15 hover:bg-white/25 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-white/10">Shop All</Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-5 ml-auto flex-shrink-0 pr-7">
            {user && isVerified ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="text-white p-1"><User size={19} /></button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 min-w-[150px] z-[70]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5">
                      <div className="px-3 py-1 mb-1 border-b border-gray-50">
                        <p className="text-[10px] font-bold text-gray-900 truncate">{user.displayName || user.email}</p>
                      </div>
                      <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-1 text-[10px] font-bold text-red-500 rounded-lg text-left"><LogOut size={12} />Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white p-1"><User size={19} /></Link>
            )}
            <Link to="/cart" className="relative text-white p-1">
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="absolute -top-0 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* Mobile Search Row — hide on checkout/cart */}
        {!isCheckoutOrCart && (
          <div className="md:hidden px-3 pb-1.5 relative">
            <Search size={12} className="absolute left-6 top-[10px] text-gray-400 pointer-events-none" />
            <input type="text" placeholder={`Search ${isBeauty ? "Hair, Skin..." : "Nutrition..."}`}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-gray-800 focus:outline-none placeholder:text-gray-400" />
            {searchTerm.trim() && (
              <div className="absolute top-full left-3 right-3 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[70] p-1.5 overflow-hidden">
                {filtered.length > 0 ? filtered.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-emerald-600 font-bold">₹{p.price}</p>
                    </div>
                  </Link>
                )) : <p className="py-3 text-center text-[11px] text-gray-400 font-bold">No results found</p>}
              </div>
            )}
          </div>
        )}
      </header>


      {/* ═══ CATEGORY CIRCLES — scroll naturally (NOT fixed) ═══ */}
      {isHomePage && (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-start gap-3 px-4 w-max md:w-full md:justify-center mx-auto max-w-7xl">
            {categories.map((cat) => (
              <Link key={cat.label} to={`/products?category=${encodeURIComponent(cat.label)}`} className="flex flex-col items-center gap-2 w-[82px] flex-shrink-0 group">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-current transition-all duration-200 group-hover:-translate-y-1 shadow-sm" style={{ borderColor: undefined }}>
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100"; }} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight group-hover:text-emerald-600 transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MOBILE DRAWER OVERLAY ══════════════════════════════ */}
      {open && <div className="fixed inset-0 bg-black/50 z-[65] md:hidden" onClick={() => setOpen(false)} />}

      {/* ═══ MOBILE SIDEBAR — Plixlife style ════════════════════ */}
      <div className={`fixed top-0 left-0 h-full w-[82vw] max-w-[310px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ backgroundColor: themeColor }}>
          <img src="/assets/images/pleux-logo.png" alt="PLEUX" className="h-6 w-auto brightness-0 invert"
            onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block"; }} />
          <span className="text-xl font-black tracking-tighter text-white hidden">PLEUX<span className="text-white/60 font-sans">+</span></span>
          <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
            <X size={16} />
          </button>
        </div>

        {/* Essentials Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-4">
          <p className="px-5 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Essentials</p>
          <div className="space-y-1 px-3">
            {[
              { label: "Who we are", to: "/our-story" },
              { label: "Why choose Pleux", to: "/why-choose-us" },
              { label: "Blogs", to: "/blogs" },
            ].map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group">
                {l.label}
                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
          <Link to="/cart" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-gray-700 bg-white shadow-sm border border-gray-100 transition-all hover:border-emerald-200">
            <ShoppingBag size={18} className="text-emerald-500" />
            <span>Shopping Bag</span>
            {cartCount > 0 && <span className="ml-auto text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ backgroundColor: themeColor }}>
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-gray-900 truncate">{user.displayName || "User"}</p>
                  <p className="text-[10px] text-gray-400 font-bold truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                {isAdmin && (
                  <Link to="/admin" className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${accentText} ${accentBg}`}>
                    <Sparkles size={14} /> Admin Dashboard
                  </Link>
                )}
                <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-4 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-200/50" style={{ backgroundColor: themeColor }}>
              <User size={16} /> Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
