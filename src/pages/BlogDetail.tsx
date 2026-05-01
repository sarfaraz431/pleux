import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { blogService, type BlogPost } from "../services/blogService";
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let scriptTag: HTMLScriptElement | null = null;

    const fetchBlog = async () => {
      if (id) {
        const data = await blogService.getBlogById(id);
        setBlog(data);
        if (data) {
          document.title = `${data.title} | PLEUX+ Wellness Journal`;

          // SEO Meta Description
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
          }
          metaDescription.setAttribute('content', data.content.substring(0, 160).replace(/\n/g, ' '));

          // JSON-LD Structured Data
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.title,
            "image": data.imageUrl,
            "author": { "@type": "Person", "name": data.author },
            "publisher": {
              "@type": "Organization",
              "name": "PLEUX",
              "logo": { "@type": "ImageObject", "url": "https://pleux.plus/logo.png" }
            },
            "datePublished": data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            "description": data.content.substring(0, 160),
            "articleBody": data.content
          });
          document.head.appendChild(script);
          scriptTag = script;
        }
      }
      setLoading(false);
    };

    fetchBlog();
    window.scrollTo(0, 0);

    return () => {
      if (scriptTag) {
        document.head.removeChild(scriptTag);
      }
    };
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: `PLEUX+ | ${blog?.title}`,
      text: `Read this botanical story on PLEUX+: ${blog?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setShared(true);
          setTimeout(() => setShared(false), 3000);
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

  if (loading) return <div className="min-h-screen animate-pulse bg-white pt-24 px-4"><div className="max-w-3xl mx-auto h-20 bg-gray-50 rounded-2xl" /></div>;
  if (!blog) return <div className="min-h-screen flex flex-col items-center justify-center pt-24"><h2 className="font-serif text-3xl mb-4">Story not found</h2><Link to="/blogs" className="text-emerald-600 font-bold underline">Back to Blogs</Link></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Meta */}
      <article className="pt-12 md:pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 mb-12 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
              {blog.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-charcoal mb-8 leading-[1.15]">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-charcoal">{blog.author}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    <Calendar size={12} /> {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <button onClick={handleShare} className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                  {shared && (
                    <div className="absolute top-full right-0 mt-2 bg-charcoal text-white text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap animate-fade-in shadow-xl uppercase tracking-widest z-20">
                      Link Copied!
                    </div>
                  )}
                </div>
                <button className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"><Bookmark size={18} /></button>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-video md:aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
          >
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </motion.div>

          {/* Body Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-emerald max-w-none"
          >
            <p className="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-10 border-l-4 border-emerald-500 pl-6">
              Empowering your wellness journey through evidence-based botanical science and mindful living.
            </p>

            <div className="text-gray-600 text-base md:text-lg leading-[1.8] whitespace-pre-wrap font-medium">
              {blog.content}
            </div>
          </motion.div>

          {/* Footer Meta */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
            {['Holistic', 'Botanical', 'Wellness', 'Science'].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        </div>
      </article>

      {/* Suggested Reading or Products? */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl mb-8">Share your thoughts on this story</h3>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm italic">Comments are moderated and will appear once approved.</p>
            <button className="mt-6 px-8 py-3 bg-charcoal text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-charcoal/20">
              Post a Comment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
