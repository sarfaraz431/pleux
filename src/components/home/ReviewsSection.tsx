import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { getAllReviews, type Review } from "../../services/reviewService";
import { useTheme } from "../../context/useTheme";

const dummyReviews = [
  {
    name: "Aisha Khan",
    role: "Skincare Enthusiast",
    text: "Amazing quality! My skin feels so fresh and glowing after using the Vitamin C Serum. Best product I've tried this year.",
    rating: 5,
    avatar: "AK",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "Rahul Mehta",
    role: "Wellness Coach",
    text: "Very natural products, no irritation at all. The hair oil has completely transformed my hair in just 4 weeks. Highly recommended!",
    rating: 5,
    avatar: "RM",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Sneha Patel",
    role: "Lifestyle Blogger",
    text: "Loved the packaging, the scent, and most importantly — the results! Worth every rupee. My go-to beauty brand now.",
    rating: 5,
    avatar: "SP",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Divya Sharma",
    role: "Yoga Instructor",
    text: "Finally found products that align with my values — natural, cruelty-free, and actually effective. PLEUX+ is the real deal.",
    rating: 4,
    avatar: "DS",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Arjun Nair",
    role: "Fitness Trainer",
    text: "Great face wash that doesn't dry out my skin. The packaging is premium and delivery was super fast. Will order again!",
    rating: 5,
    avatar: "AN",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Priya Joshi",
    role: "Dermatology Student",
    text: "Science-backed formulas that actually deliver. I've recommended PLEUX+ to all my friends. The skin feels hydrated all day.",
    rating: 5,
    avatar: "PJ",
    color: "bg-rose-100 text-rose-700",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const bgColors = [
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const ReviewsSection = () => {
  const { section } = useTheme();
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        if (isMounted) {
          // Filter by active section and grab the latest 6 reviews
          const sectionReviews = data.filter(r => r.section === section).slice(0, 6);
          
          // Map DB reviews to match the display structure
          const mappedReviews = sectionReviews.map((r, i) => ({
            name: r.userName || "Verified Customer",
            role: "Verified Buyer",
            text: r.comment || r.message || "",
            rating: r.rating || 5,
            avatar: r.userName ? r.userName.substring(0, 2).toUpperCase() : "U",
            color: bgColors[i % bgColors.length],
          }));

          setDbReviews(mappedReviews);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => { isMounted = false; };
  }, [section]);

  const displayReviews = dbReviews.length > 0 ? dbReviews : dummyReviews;

  return (
    <section className="py-16 md:py-24"
      style={{ background: section === "beauty" ? "linear-gradient(180deg, #F9FBF9 0%, #FDF8F4 100%)" : "linear-gradient(180deg, #F9FBF9 0%, #FDF4F8 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge mb-3">Community Reviews</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle max-w-md mx-auto">
            Real experiences from thousands of happy PLEUX customers
          </p>
          {/* Aggregate stars */}
          <div className="inline-flex items-center gap-2 mt-4 bg-white border border-amber-100 rounded-full px-4 py-2 shadow-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-charcoal">4.9</span>
            <span className="text-xs text-gray-400">from {dbReviews.length > 0 ? "our community" : "2,400+ reviews"}</span>
          </div>
        </div>

        {/* Cards */}
        {!loading && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-4 md:gap-6"
          >
            {displayReviews.map((review, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col gap-4"
              >
                {/* Quote icon */}
                <Quote size={20} className="text-pleux-200" />

                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className={j < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <div className={`w-9 h-9 rounded-full ${review.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;

