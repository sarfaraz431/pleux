import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogService, type BlogPost } from "../services/blogService";
import { Calendar, User, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/layout/SEOHead";

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await blogService.getBlogs();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-3xl animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const seoDescription = "Explore PLEUX+ Wellness Journal. Deep dives into botanical science, holistic skincare tips, and stories of balanced living from our botanical experts.";

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Wellness Journal & Skincare Wisdom"
        description={seoDescription}
        url="/blogs"
        keywords="wellness journal, botanical skincare blog, herbal beauty advice, organic ingredients"
        jsonLd={{
          "@type": "Blog",
          name: "PLEUX+ Wellness Journal",
          description: seoDescription,
          url: "https://pleux.com/blogs",
          blogPost: blogs.slice(0, 10).map((blog) => ({
            "@type": "BlogPosting",
            headline: blog.title,
            url: `https://pleux.com/blog/${blog.id}`,
            author: { "@type": "Person", name: blog.author },
          }))
        }}
      />
      {/* Hero Header */}
      <section className="pt-12 md:pt-32 pb-16 px-4 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 hover:text-emerald-800 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 block">The Wellness Journal</span>
            <h1 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">Stories of Balance <br/> & Botanical Wisdom</h1>
            <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-medium leading-relaxed">
              Explore our latest thoughts on holistic living, skincare science, and the power of nature's finest ingredients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${blog.id}`} className="block">
                    <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : 'Recent'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                      </div>
                      
                      <h3 className="font-serif text-2xl text-charcoal mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {blog.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                        Read Story <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="font-serif text-2xl text-gray-300">New stories coming soon...</h3>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default Blogs;
