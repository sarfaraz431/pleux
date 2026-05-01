import React, { useState, useEffect } from "react";
import { 
  Trash2, RefreshCw, UploadCloud, Edit3, FileText 
} from "lucide-react";
import { blogService, type BlogPost } from "../../services/blogService";
import { beautyCategories, wellnessCategories, emptyBlog } from "./adminTypes";

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
  const [uploadingBlog, setUploadingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlogSubmit = async () => {
    if (!blogForm.title || (!blogImageFile && !editingBlogId)) return alert("Missing fields");
    setUploadingBlog(true);
    try {
      let imageUrl = blogForm.imageUrl;
      if (blogImageFile) {
        imageUrl = await blogService.uploadBlogImage(blogImageFile);
      }
      if (editingBlogId) {
        await blogService.updateBlog(editingBlogId, { ...blogForm, imageUrl });
        setEditingBlogId(null);
      } else {
        await blogService.addBlog({ ...blogForm, imageUrl });
      }
      setBlogForm(emptyBlog);
      setBlogImageFile(null);
      setBlogImagePreview(null);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingBlog(false);
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id!);
    setBlogForm({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      category: blog.category,
      imageUrl: blog.imageUrl
    });
    setBlogImagePreview(blog.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await blogService.deleteBlog(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6 md:gap-8 items-start animate-fade-in">
      {/* Blog Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal flex items-center gap-2">
            <FileText className="text-emerald-500" size={24} />
            {editingBlogId ? "Edit Story" : "New Story"}
          </h2>
          {editingBlogId && (
            <button
              onClick={() => { setEditingBlogId(null); setBlogForm(emptyBlog); setBlogImagePreview(null); }}
              className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-8">Compose botanical journals and research.</p>

        <div className="space-y-5">
          <input
            placeholder="Blog Title"
            value={blogForm.title}
            onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Author Name"
              value={blogForm.author}
              onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
              className="input-field"
            />
            <select
              value={blogForm.category}
              onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
              className="input-field cursor-pointer bg-white"
            >
              {beautyCategories.concat(wellnessCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Image Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${blogImagePreview ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200 hover:border-emerald-300 hover:bg-stone-50"
              }`}
          >
            {blogImagePreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden group shadow-lg">
                <img src={blogImagePreview} alt="Blog Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setBlogImageFile(null); setBlogImagePreview(null); }}
                    className="bg-white text-red-500 text-[10px] font-black px-4 py-2 rounded-full shadow-xl uppercase tracking-widest"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud size={32} className="text-emerald-400 mb-3" />
                <p className="text-xs font-black text-charcoal uppercase tracking-widest">Featured Image</p>
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Click to browse (1200x630 rec.)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBlogImageFile(e.target.files[0]);
                      setBlogImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          <textarea
            placeholder="Tell your story... (Supports plain text and line breaks)"
            value={blogForm.content}
            onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
            className="input-field resize-none h-64 font-serif text-base leading-relaxed"
          />

          <button
            disabled={uploadingBlog}
            onClick={handleBlogSubmit}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${editingBlogId ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200/50" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50"
              } text-white disabled:opacity-50`}
          >
            {uploadingBlog ? "Publishing..." : editingBlogId ? "Update Blog Post" : "Publish to Website"}
          </button>
        </div>
      </div>

      {/* Blogs List */}
      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">Journal Feed</h2>
          <button onClick={fetchData} className="p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-8">All published stories across the store.</p>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">Syncing Stories...</div>
          ) : blogs.map(blog => (
            <div key={blog.id} className="flex flex-col sm:flex-row gap-6 p-4 border border-gray-50 rounded-3xl hover:border-emerald-200 transition-all bg-white shadow-sm hover:shadow-md group">
              <div className="w-full sm:w-40 aspect-video sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">{blog.category}</span>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">• {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : 'Draft'}</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl text-charcoal mb-1 line-clamp-1">{blog.title}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">By {blog.author}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id!)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {blogs.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-300 italic text-sm border-2 border-dashed border-gray-50 rounded-3xl">
              No journal entries published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
