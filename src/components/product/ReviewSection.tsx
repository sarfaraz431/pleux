import { useState, useEffect, useRef } from "react";
import { Star, Camera, Trash2, Send, X, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getReviews, addReview, deleteReview, type Review } from "../../services/reviewService";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewSectionProps {
  productId: string;
  section: "beauty" | "wellness";
  themeColor: string;
}

const ReviewSection = ({ productId, section, themeColor }: ReviewSectionProps) => {
  const { user, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await getReviews(productId);
    setReviews(data);
    setLoading(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await addReview(
        productId,
        user.uid,
        user.displayName || user.email?.split("@")[0] || "Customer",
        rating,
        message,
        section,
        photo
      );
      // Reset form
      setMessage("");
      setRating(5);
      setPhoto(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Reload reviews
      await loadReviews();
    } catch (error) {
      alert("Failed to post review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(productId, reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="font-serif text-3xl text-gray-900 font-bold mb-2">Customer Stories</h2>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-500">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>

        {!user ? (
          <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Want to share your experience? <a href="/login" className="font-bold underline" style={{ color: themeColor }}>Login first</a>
            </p>
          </div>
        ) : (
          <button
            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 rounded-full text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="h-48 bg-gray-50 rounded-3xl animate-pulse" />
          ))
        ) : reviews.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={review.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {isAdmin && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment || review.message}</p>

              {review.photoUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 max-w-[200px]">
                  <img src={review.photoUrl} alt="Review" className="w-full h-auto object-cover" />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Review Form */}
      {user && (
        <div id="review-form" className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl">
          <h3 className="font-serif text-2xl text-gray-900 font-bold text-center mb-8">Share Your Experience</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star size={32} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How do you feel about this formula?"
                className="w-full h-32 p-5 bg-gray-50 rounded-2xl text-sm text-gray-800 border-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-400 transition-all"
                required
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} />
                {photo ? "Change Photo" : "Add Photo"}
              </button>

              {photoPreview && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: themeColor }}
            >
              {submitting ? "Posting..." : (
                <>
                  Post Review <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
