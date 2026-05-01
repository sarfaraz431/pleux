import React, { useState, useEffect } from "react";
import { 
  Trash2, RefreshCw, UploadCloud, Shield 
} from "lucide-react";
import { bannerService, type Banner } from "../../services/bannerService";

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerForm, setBannerForm] = useState({
    section: "beauty" as "beauty" | "wellness",
    linkTo: "/products",
    size: "rectangle" as "rectangle" | "square",
    location: "hero" as "hero" | "middle" | "side",
    isClickable: true
  });
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllAdminBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBanner = async () => {
    if (!bannerImageFile) return alert("Please select an image");
    setUploadingBanner(true);
    try {
      const imageUrl = await bannerService.uploadBannerImage(bannerImageFile);
      await bannerService.addBanner({
        ...bannerForm,
        imageUrl,
        isActive: true
      });
      setBannerImageFile(null);
      setBannerImagePreview(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to add banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleToggleBanner = async (id: string, current: boolean) => {
    try {
      await bannerService.toggleBanner(id, !current);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await bannerService.deleteBanner(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start animate-fade-in">
      {/* Banner Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <h2 className="font-serif text-xl md:text-2xl text-charcoal flex items-center gap-2 mb-2">
          <Shield className="text-emerald-500" size={24} />
          New Promotion
        </h2>
        <p className="text-xs text-gray-400 mb-8">Design high-impact visual banners for your storefront.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Section Target</label>
              <select
                value={bannerForm.section}
                onChange={e => setBannerForm({ ...bannerForm, section: e.target.value as any })}
                className="input-field cursor-pointer bg-white"
              >
                <option value="beauty">Beauty</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Destination</label>
              <input
                placeholder="/products or URL"
                value={bannerForm.linkTo}
                onChange={e => setBannerForm({ ...bannerForm, linkTo: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visual Aspect</label>
              <select
                value={bannerForm.size}
                onChange={e => setBannerForm({ ...bannerForm, size: e.target.value as any })}
                className="input-field cursor-pointer bg-white"
              >
                <option value="rectangle">Wide Landscape</option>
                <option value="square">Standard Square</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Placement</label>
              <select
                value={bannerForm.location}
                onChange={e => setBannerForm({ ...bannerForm, location: e.target.value as any })}
                className="input-field cursor-pointer bg-white"
              >
                <option value="hero">Hero Section</option>
                <option value="middle">Middle Feed</option>
                <option value="side">Sidebar/Promo</option>
              </select>
            </div>
          </div>

          {/* Banner Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${bannerImagePreview ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200 hover:border-emerald-300 hover:bg-stone-50"
              }`}
          >
            {bannerImagePreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden group shadow-lg">
                <img src={bannerImagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setBannerImageFile(null); setBannerImagePreview(null); }}
                    className="bg-white text-red-500 text-[10px] font-black px-4 py-2 rounded-full shadow-xl uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud size={32} className="text-emerald-400 mb-3" />
                <p className="text-xs font-black text-charcoal uppercase tracking-widest">Promotion Graphic</p>
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Click to upload (1400x500 rec.)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBannerImageFile(e.target.files[0]);
                      setBannerImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          <button
            disabled={uploadingBanner}
            onClick={handleAddBanner}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/50 transition-all disabled:opacity-50"
          >
            {uploadingBanner ? "Uploading Graphic..." : "Launch Campaign"}
          </button>
        </div>
      </div>

      {/* Banners List */}
      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">Active Campaigns</h2>
          <button onClick={fetchData} className="p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-8">Management for all storefront visual assets.</p>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">Syncing Campaigns...</div>
          ) : banners.map(b => (
            <div key={b.id} className="group relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[21/9] w-full">
                <img src={b.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${b.section === 'beauty' ? 'bg-emerald-500 text-white' : 'bg-purple-500 text-white'}`}>
                        {b.section}
                      </span>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-md">
                        {b.location}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/60 font-medium truncate max-w-[200px]">{b.linkTo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBanner(b.id!, b.isActive)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${b.isActive ? "bg-white text-emerald-600" : "bg-white/20 text-white"}`}
                    >
                      {b.isActive ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id!)}
                      className="p-2 bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
