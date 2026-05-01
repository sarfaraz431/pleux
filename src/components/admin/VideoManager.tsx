import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, RefreshCw, UploadCloud, Video, X 
} from "lucide-react";
import { videoService } from "../../services/videoService";
import type { Product } from "../../types/Product";
import { beautyCategories, wellnessCategories } from "./adminTypes";
import { useProducts } from "../../context/ProductContext";

const VideoManager: React.FC = () => {
  const { products } = useProducts();
  const [promoVideos, setPromoVideos] = useState<any[]>([]);
  const [promoVideoUrl, setPromoVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [promoVideoSection, setPromoVideoSection] = useState<"beauty" | "wellness">("beauty");
  const [updatingVideo, setUpdatingVideo] = useState(false);
  const [promoVideoType, setPromoVideoType] = useState<"upload" | "url">("upload");
  const [promoVideoPreview, setPromoVideoPreview] = useState<{ type: string, url: string } | null>(null);
  const [promoVideoCategory, setPromoVideoCategory] = useState<string>("");
  const [promoVideoProductId, setPromoVideoProductId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getEmbedInfo = (url: string) => {
    if (!url) return null;
    if (url.includes("instagram.com")) {
      const baseUrl = url.split("?")[0];
      const sanitizedUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      return { type: "iframe", url: `${sanitizedUrl}embed/` };
    }
    if (url.includes("pinterest.com/pin/") || url.includes("pin.it/")) {
      if (url.includes("pinterest.com/pin/")) {
        const pinId = url.split("/pin/")[1]?.split("/")[0];
        return { type: "iframe", url: `https://assets.pinterest.com/ext/embed.html?id=${pinId}` };
      }
      return { type: "placeholder", url };
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
      else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
      else if (url.includes("shorts/")) videoId = url.split("shorts/")[1]?.split("?")[0];
      return { type: "iframe", url: `https://www.youtube.com/embed/${videoId}` };
    }
    return { type: "video", url };
  };

  useEffect(() => {
    if (promoVideoType === "url" && promoVideoUrl) {
      setPromoVideoPreview(getEmbedInfo(promoVideoUrl));
    } else if (promoVideoType === "upload" && videoFile) {
      setPromoVideoPreview({ type: "video", url: URL.createObjectURL(videoFile) });
    } else {
      setPromoVideoPreview(null);
    }
  }, [promoVideoUrl, videoFile, promoVideoType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await videoService.getAllVideos();
      setPromoVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVideoSubmit = async () => {
    if (promoVideoType === "url" && !promoVideoUrl) return alert("Please enter a URL");
    if (promoVideoType === "upload" && !videoFile) return alert("Please select a file");

    setUpdatingVideo(true);
    try {
      let finalUrl = promoVideoUrl;
      if (promoVideoType === "upload" && videoFile) {
        finalUrl = await videoService.uploadVideoFile(videoFile);
      }

      await videoService.addVideo({
        type: promoVideoType,
        url: finalUrl,
        section: promoVideoSection,
        category: promoVideoCategory,
        productId: promoVideoProductId || undefined
      });

      setPromoVideoUrl("");
      setVideoFile(null);
      setPromoVideoProductId("");
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingVideo(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.section === promoVideoSection && 
    (!promoVideoCategory || p.category === promoVideoCategory)
  );

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start animate-fade-in">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <h2 className="font-serif text-xl md:text-2xl text-charcoal flex items-center gap-2 mb-2">
          <Video className="text-emerald-500" size={24} />
          Shoppable Video
        </h2>
        <p className="text-xs text-gray-400 mb-8">Link cinematic promo videos to your product catalog.</p>

        <div className="space-y-6">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setPromoVideoType("upload")}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${promoVideoType === "upload" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-charcoal"}`}
            >
              Upload File
            </button>
            <button
              onClick={() => setPromoVideoType("url")}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${promoVideoType === "url" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-charcoal"}`}
            >
              Embed URL
            </button>
          </div>

          {promoVideoType === "url" ? (
            <input
              placeholder="Instagram, YouTube, or Pinterest URL"
              value={promoVideoUrl}
              onChange={e => setPromoVideoUrl(e.target.value)}
              className="input-field"
            />
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setIsVideoDragging(true); }}
              onDragLeave={() => setIsVideoDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setIsVideoDragging(false);
                if (e.dataTransfer.files?.[0]) setVideoFile(e.dataTransfer.files[0]);
              }}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${isVideoDragging ? "border-emerald-500 bg-emerald-50/50" : "border-gray-100 hover:border-emerald-200"
                }`}
            >
              <UploadCloud size={32} className="text-emerald-400 mb-3" />
              <p className="text-xs font-black text-charcoal uppercase tracking-widest">{videoFile ? videoFile.name : "Select Video File"}</p>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">MP4 recommended (max 50MB)</p>
              <input type="file" accept="video/*" onChange={e => e.target.files?.[0] && setVideoFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <select value={promoVideoSection} onChange={e => { setPromoVideoSection(e.target.value as any); setPromoVideoCategory(""); setPromoVideoProductId(""); }} className="input-field cursor-pointer bg-white">
              <option value="beauty">Beauty Section</option>
              <option value="wellness">Wellness Section</option>
            </select>
            <select value={promoVideoCategory} onChange={e => { setPromoVideoCategory(e.target.value); setPromoVideoProductId(""); }} className="input-field cursor-pointer bg-white">
              <option value="">Select Category</option>
              {(promoVideoSection === "beauty" ? beautyCategories : wellnessCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Link to Product (Optional)</label>
            <select value={promoVideoProductId} onChange={e => setPromoVideoProductId(e.target.value)} className="input-field cursor-pointer bg-white">
              <option value="">No Product Linked</option>
              {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
            </select>
          </div>

          <button
            disabled={updatingVideo}
            onClick={handleVideoSubmit}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/50 transition-all disabled:opacity-50"
          >
            {updatingVideo ? "Processing Media..." : "Add to Video Feed"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">Video Library</h2>
          <button onClick={fetchData} className="p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><RefreshCw size={18} /></button>
        </div>
        <p className="text-xs text-gray-400 mb-8">Manage cinematic content and shoppable links.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">Syncing Media Feed...</div>
          ) : promoVideos.map(v => (
            <div key={v.id} className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-stone-900 shadow-xl group">
              {getEmbedInfo(v.url)?.type === "iframe" ? (
                <iframe src={getEmbedInfo(v.url)!.url} className="w-full h-full pointer-events-none" />
              ) : (
                <video src={v.url} className="w-full h-full object-cover" muted loop onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${v.section === 'beauty' ? 'bg-emerald-500 text-white' : 'bg-purple-500 text-white'}`}>{v.section}</span>
                  {v.category && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-md">{v.category}</span>}
                </div>
                {v.productId && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 mb-4 border border-white/10">
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Linked Product</p>
                    <p className="text-xs text-white font-bold truncate">{products.find(p => p.id === v.productId)?.name || "Unknown Product"}</p>
                  </div>
                )}
                <button onClick={() => videoService.deleteVideo(v.id!, v.url).then(fetchData)} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  Delete Video
                </button>
              </div>
            </div>
          ))}
          {promoVideos.length === 0 && !loading && <div className="col-span-2 py-20 text-center text-gray-300 italic text-sm">No promotional videos added yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default VideoManager;
