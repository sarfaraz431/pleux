import React, { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, ImageIcon, Edit3 } from "lucide-react";

import { 
  getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage 
} from "../../services/productService";
import type { Product } from "../../types/Product";
import { beautyCategories, wellnessCategories, emptyProduct } from "./adminTypes";
import { useProducts } from "../../context/ProductContext";

const ProductManager: React.FC = () => {
  const { refreshProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productImagesFiles, setProductImagesFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data);
      // Sync global context as well
      await refreshProducts();
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    // When creating: require 1-6 images.
    // When editing: allow saving without changing images (backward compatible), but if new files are selected, check limit.
    const fileCount = productImagesFiles.length;
    if (!editingProductId && fileCount === 0) {
      return alert("Please select at least one image (1-6 images required).");
    }
    if (fileCount > 6) {
      return alert("You can upload a maximum of 6 images. Please remove some images.");
    }

    setUploadingImages(true);
    try {
      // Upload images (if user picked new ones)
      // (admin form currently doesn't type `images`, so we fall back to empty array)
      let imagesUrls: string[] = [];


      if (productImagesFiles.length > 0) {
        const uploaded = await Promise.all(productImagesFiles.map((f) => uploadProductImage(f)));
        imagesUrls = uploaded;
      }

      // Ensure we always have a single `image` field for backward compatibility.
      const imageUrl = imagesUrls[0] ?? productForm.image;

      const finalProduct = {

        ...productForm,
        image: imageUrl,
        // Save multi-image array only when we have > 0 images.
        images: imagesUrls.length > 0 ? imagesUrls : undefined,
        price: Number(productForm.price),
        rating: Number(productForm.rating) || 5,
        section: productForm.section as any,
        category: productForm.category,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, finalProduct);
        setEditingProductId(null);
      } else {
        await addProduct({ ...finalProduct, rating: 5 });
      }

      setProductForm(emptyProduct);
      setProductImagesFiles([]);
      setImagePreviews([]);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Operation failed. Please check console for details.");
    } finally {
      setUploadingImages(false);
    }
  };


  return (
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-10 items-start animate-fade-in relative z-10 w-full">
      {/* Product Form Column */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">
            {editingProductId ? "Update Product" : "New Formula"}
          </h2>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Plus size={20} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-8 font-light">Enter details for the new botanical addition.</p>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Product Name</label>
              <input
                placeholder="e.g. Vitamin C Serum"
                value={productForm.name}
                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Price (₹)</label>
              <input
                type="number"
                placeholder="499"
                value={productForm.price}
                onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Section</label>
              <select
                value={productForm.section}
                onChange={e => setProductForm({ ...productForm, section: e.target.value as any, category: e.target.value === "beauty" ? beautyCategories[0] : wellnessCategories[0] })}
                className="input-field cursor-pointer bg-white"
              >
                <option value="beauty">Beauty</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category</label>
              <select
                value={productForm.category}
                onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                className="input-field cursor-pointer bg-white"
              >
                {(productForm.section === "beauty" ? beautyCategories : wellnessCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const files = Array.from(e.dataTransfer.files ?? []);
              if (files.length > 0) {
                if (files.length > 6) {
                  alert("You can select a maximum of 6 images. Only the first 6 will be added.");
                }
                const limited = files.slice(0, 6);
                setProductImagesFiles(limited);
                setImagePreviews(limited.map((f) => URL.createObjectURL(f)));
              }
            }}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center transition-all ${isDragging ? "border-emerald-500 bg-emerald-50/50 scale-[1.02]" : "border-gray-100 hover:border-emerald-200"}
              ${imagePreviews.length > 0 ? "min-h-[180px]" : "min-h-[120px]"}`}
          >
            {imagePreviews.length > 0 ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-charcoal uppercase tracking-widest">Selected Images</p>
                  <button
                    type="button"
                    onClick={() => {
                      setProductImagesFiles([]);
                      setImagePreviews([]);
                    }}
                    className="text-[10px] font-black text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={`${src}-${idx}`} className="relative rounded-xl overflow-hidden border border-emerald-50 bg-white shadow-sm">
                      <img src={src} className="w-full h-20 object-cover" alt={`Preview ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() => {
                          setProductImagesFiles((prev) => prev.filter((_, i) => i !== idx));
                          setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length > 0) {
                        if (files.length > 6) {
                          alert("You can select a maximum of 6 images. Only the first 6 will be added.");
                        }
                        const limited = files.slice(0, 6);
                        setProductImagesFiles(limited);
                        setImagePreviews(limited.map((f) => URL.createObjectURL(f)));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Replace selection (click to re-upload, max 6)
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ImageIcon size={24} className="text-emerald-400 mb-2" />
                <p className="text-[10px] font-black text-charcoal uppercase tracking-widest">Product Images (1 - 6)</p>
                <p className="text-[10px] text-gray-400 mt-1">Drag & drop or click to browse (1 to 6 images)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length > 0) {
                      if (files.length > 6) {
                        alert("You can select a maximum of 6 images. Only the first 6 will be added.");
                      }
                      const limited = files.slice(0, 6);
                      setProductImagesFiles(limited);
                      setImagePreviews(limited.map((f) => URL.createObjectURL(f)));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>


          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Description</p>
            {editingProductId && (
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm(emptyProduct);
                  setProductImagesFiles([]);
                  setImagePreviews([]);
                }}
                className="text-[10px] font-black uppercase text-red-500 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <textarea
            placeholder="Describe the botanical benefits..."
            value={productForm.description}
            onChange={e => setProductForm({ ...productForm, description: e.target.value })}
            className="input-field resize-none h-24"
          />

          <button
            disabled={uploadingImages}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${editingProductId ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200/50" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50"
              } text-white disabled:opacity-50`}
          >
            {uploadingImages ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
          </button>

        </div>
      </div>

      {/* Catalog Column */}
      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-2">Product Catalog</h2>
        <p className="text-xs text-gray-400 mb-8">Full inventory listing for both sections.</p>
        <div className="space-y-4">
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw size={40} className="text-emerald-200 animate-spin" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Syncing Botanical Catalog...</p>
            </div>
          ) : products.map(p => (
            <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-50 rounded-2xl hover:border-emerald-100 transition-all bg-white shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-charcoal truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.section === 'beauty' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                    {p.section}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">• {p.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <p className="text-xs sm:text-sm font-black text-charcoal">₹{p.price}</p>
                <button onClick={() => {
                  setEditingProductId(p.id!);
                  setProductForm({ 
                    name: p.name,
                    price: String(p.price),
                    image: p.image,
                    images: (p.images && p.images.length ? p.images : undefined),
                    description: p.description,
                    rating: String(p.rating || 5),
                    section: (p.section as "beauty" | "wellness") || "beauty",
                    category: p.category || ""
                  });
                  // Previews for currently saved images (no re-upload needed unless user changes selection)
                  setProductImagesFiles([]);
                  const currentImages = (p.images && p.images.length ? p.images : [p.image]).slice(0, 8);
                  setImagePreviews(currentImages);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="p-1.5 text-gray-300 hover:text-emerald-500 transition-colors"><Edit3 size={14} /></button>

                <button onClick={() => deleteProduct(p.id!).then(fetchData)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
