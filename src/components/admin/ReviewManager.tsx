import React, { useState, useEffect } from "react";
import { 
  Trash2, RefreshCw, Star, MessageCircle 
} from "lucide-react";
import { getAllReviews, deleteReview, type Review } from "../../services/reviewService";

const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState<"all" | "beauty" | "wellness">("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReviews = reviews.filter(r => sectionFilter === "all" || r.section === sectionFilter);

  const handleDelete = async (productId: string, id: string) => {
    if (!window.confirm("Remove this review?")) return;
    try {
      await deleteReview(productId, id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Community Feedback</h2>
          <p className="text-sm text-gray-400">Monitor and manage customer reviews, ratings, and uploaded photos.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-start md:self-auto">
          {(["all", "beauty", "wellness"] as const).map(f => (
            <button key={f} onClick={() => setSectionFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sectionFilter === f ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4 text-emerald-200">
              <RefreshCw size={32} className="animate-spin" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Feedback...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <MessageCircle size={48} className="text-gray-100 mx-auto mb-4" />
              <p className="text-sm text-gray-300 italic font-light">No reviews found in this section yet.</p>
            </div>
          ) : (
            filteredReviews.map(r => (
              <div key={r.id} className="flex flex-col bg-stone-50/50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all group relative">
                
                {/* Delete Button - Appears on Hover */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(r.productId, r.id!); }} 
                  className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Remove Review"
                >
                  <Trash2 size={14} />
                </button>

                {/* Header: User & Rating */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs flex-shrink-0">
                    {r.userName?.[0].toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-charcoal truncate pr-8">{r.userName}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Message */}
                <div className="flex-1 mb-4">
                  <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-4 cursor-pointer hover:text-emerald-700" onClick={() => setSelectedReview(r)}>
                    "{r.comment || r.message}"
                  </p>
                </div>

                {/* Footer: Photo & Metadata */}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full mb-1 ${r.section === 'beauty' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                      {r.section}
                    </span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  
                  {/* Photo Thumbnail */}
                  {r.photoUrl && (
                    <div 
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer group-hover:scale-110 transition-transform"
                      onClick={() => setSelectedReview(r)}
                    >
                      <img src={r.photoUrl} alt="Review attachment" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expanded Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedReview(null)} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full transition-colors z-10 backdrop-blur-md shadow-sm">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Expanded Photo */}
            {selectedReview.photoUrl && (
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-stone-100">
                <img src={selectedReview.photoUrl} alt="Review" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className={`p-8 md:p-10 ${selectedReview.photoUrl ? 'w-full md:w-1/2' : 'w-full'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm">
                  {selectedReview.userName?.[0].toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">{selectedReview.userName}</h3>
                  <div className="flex gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < selectedReview.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-light mb-8 italic">"{selectedReview.comment || selectedReview.message}"</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                  <span className={`mt-1 inline-block text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedReview.section === 'beauty' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                    {selectedReview.section}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Published On</span>
                  <span className="text-xs font-bold text-charcoal mt-1">
                    {selectedReview.createdAt?.toDate ? selectedReview.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;
