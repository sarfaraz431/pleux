import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videoService, type PromoVideo } from "../../services/videoService";
import { ExternalLink, Video, X, ShoppingBag, ArrowRight, Play, Eye } from "lucide-react";
import { useTheme } from "../../context/useTheme";
import { useProducts } from "../../context/ProductContext";
import { Link } from "react-router-dom";

const VideoPromotion = () => {
  const { section } = useTheme();
  const { products } = useProducts();
  const [videos, setVideos] = useState<PromoVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<PromoVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await videoService.getAllVideos(section);
      setVideos(data);
      setLoading(false);
    };
    fetchVideos();
  }, [section]);

  if (loading || videos.length === 0) return null;

  const getEmbedInfo = (video: PromoVideo) => {
    const { url, type } = video;
    if (type === "upload") return { type: "video", url };

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
      return { type: "placeholder", url, platform: "Pinterest" };
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
      else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
      else if (url.includes("shorts/")) videoId = url.split("shorts/")[1]?.split("?")[0];
      return { type: "iframe", url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` };
    }

    return { type: "video", url };
  };

  return (
    <section className="py-20 md:py-32 bg-[#F9FBF9] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -ml-64 -mb-64 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
          >
            <Play size={12} className="text-emerald-600 fill-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Live Experiences</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl text-charcoal leading-[1.1] mb-6"
          >
            See the <span className="text-emerald-600 italic">Botanical</span> <br /> Results in Action
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base max-w-xl font-light leading-relaxed"
          >
            Join our community of over 50,000+ botanical enthusiasts sharing their real-life results and daily routines.
          </motion.p>
        </div>

        {/* Video Carousel */}
        <div className="flex flex-nowrap gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory px-4 -mx-4">
          {videos.map((video, idx) => {
            const embedInfo = getEmbedInfo(video);
            const linkedProduct = video.productId ? products.find(p => p.id === video.productId) : null;
            
            return (
              <motion.div
                key={video.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex-shrink-0 w-[280px] sm:w-[360px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black relative snap-center group cursor-pointer shadow-2xl border-4 border-white"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Video Content */}
                {embedInfo.type === "iframe" ? (
                  <iframe src={embedInfo.url} className="w-full h-full border-0 pointer-events-none" />
                ) : (
                  <video src={embedInfo.url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                )}

                {/* Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {linkedProduct && (
                      <div className="flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 animate-fade-in">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20">
                          <img src={linkedProduct.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{linkedProduct.name}</p>
                          <p className="text-[10px] font-bold text-emerald-400">₹{linkedProduct.price}</p>
                        </div>
                        <div className="p-2 bg-emerald-500 text-white rounded-lg">
                          <ShoppingBag size={12} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                          <Play size={12} className="text-white fill-white ml-0.5" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Watch Story</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-white text-[10px] font-black uppercase tracking-widest">
                        View Detail <Eye size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Shoppable Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-[110] p-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-charcoal rounded-full transition-all border border-white/20 shadow-xl"
              >
                <X size={24} />
              </button>

              {/* Left Side: Video Content */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black relative">
                {(() => {
                  const embed = getEmbedInfo(selectedVideo);
                  return embed.type === "iframe" ? (
                    <iframe src={embed.url} className="w-full h-full border-0" allowFullScreen />
                  ) : (
                    <video src={embed.url} className="w-full h-full object-contain" autoPlay controls loop playsInline />
                  );
                })()}
                
                <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Now
                  </p>
                </div>
              </div>

              {/* Right Side: Product Details */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 md:p-16 overflow-y-auto no-scrollbar bg-white">
                {(() => {
                  const product = selectedVideo.productId ? products.find(p => p.id === selectedVideo.productId) : null;
                  
                  if (!product) return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                      <Video size={64} className="mb-6" />
                      <p className="font-serif text-2xl">Community Story</p>
                      <p className="text-sm mt-2">This experience is shared by our community.</p>
                      {selectedVideo.linkTo && (
                        <a href={selectedVideo.linkTo} className="mt-8 btn-primary px-10">Visit Link</a>
                      )}
                    </div>
                  );

                  return (
                    <div className="flex-1 flex flex-col">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <span className="badge mb-4">In Stock • Fresh Batch</span>
                        <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-4 leading-tight">{product.name}</h3>
                        <div className="flex items-center gap-4 mb-8">
                          <p className="text-3xl font-black text-emerald-600">₹{product.price}</p>
                          <span className="text-sm text-gray-400 line-through">₹{Math.floor(product.price * 1.4)}</span>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">SAVE 40%</span>
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <p className="text-sm text-gray-500 leading-relaxed italic">"{product.description}"</p>
                      </motion.div>

                      {/* Benefits Pills */}
                      <div className="flex flex-wrap gap-2 mb-12">
                        {["100% Vegan", "No Toxins", "Clinically Proven"].map((tag) => (
                          <span key={tag} className="px-4 py-2 bg-emerald-50/50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto space-y-4">
                        <Link 
                          to={`/product/${product.id}`} 
                          onClick={() => setSelectedVideo(null)}
                          className="btn-primary w-full py-6 text-sm tracking-[0.2em] flex items-center justify-center gap-4"
                        >
                          SHOP THIS PRODUCT <ArrowRight size={18} />
                        </Link>
                        <p className="text-center text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          Fast Delivery • Secure Payments • 24/7 Support
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoPromotion;
