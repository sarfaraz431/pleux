import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Banner {
  id?: string;
  imageUrl: string;
  linkTo: string;
  section: "beauty" | "wellness";
  isActive: boolean;
  size: "rectangle" | "square";
  location: "hero" | "middle" | "side";
  isClickable: boolean;
}

const COLLECTION_NAME = 'banners';

export const bannerService = {
  // Get all active banners for a specific section
  getBanners: async (section: "beauty" | "wellness"): Promise<Banner[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const banners: Banner[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Banner;
        if (data.isActive && data.section === section) {
          banners.push({ ...data, id: doc.id });
        }
      });
      
      // Return default banners if none exist in DB yet (for immediate UI satisfaction)
      if (banners.length === 0) {
        if (section === "beauty") {
          return [
            { id: "default1", imageUrl: "https://images.unsplash.com/photo-1615397323282-3112b329bc0b?w=1200&q=80", linkTo: "/products", section: "beauty", isActive: true, size: "rectangle", location: "hero", isClickable: true },
          ];
        } else {
          return [
            { id: "default2", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80", linkTo: "/products", section: "wellness", isActive: true, size: "rectangle", location: "hero", isClickable: true },
          ];
        }
      }
      
      return banners;
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Fallback to defaults on error
      if (section === "beauty") {
        return [
          { id: "default1", imageUrl: "https://images.unsplash.com/photo-1615397323282-3112b329bc0b?w=1200&q=80", linkTo: "/products", section: "beauty", isActive: true, size: "rectangle", location: "hero", isClickable: true },
        ];
      } else {
        return [
          { id: "default2", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80", linkTo: "/products", section: "wellness", isActive: true, size: "rectangle", location: "hero", isClickable: true },
        ];
      }
    }
  },

  // Admin: Get all banners (active and inactive)
  getAllAdminBanners: async (): Promise<Banner[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const banners: Banner[] = [];
      querySnapshot.forEach((doc) => {
        banners.push({ ...(doc.data() as Banner), id: doc.id });
      });
      return banners;
    } catch (error) {
      console.error("Error fetching admin banners:", error);
      return [];
    }
  },

  // Compress and generate Base64 banner image (No Storage required)
  uploadBannerImage: async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1400; // Optimal size for high-res banners and base64 length
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert directly to a WebP Base64 string to save in Firestore
          const base64String = canvas.toDataURL("image/webp", 0.7);
          resolve(base64String);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Admin: Add a new banner (Using Base64 directly like products for CORS safety)
  addBanner: async (banner: Omit<Banner, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), banner);
      return docRef.id;
    } catch (error) {
      console.error("Error adding banner:", error);
      throw error;
    }
  },

  // Admin: Toggle banner active state
  toggleBanner: async (id: string, isActive: boolean): Promise<void> => {
    try {
      const bannerRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(bannerRef, { isActive });
    } catch (error) {
      console.error("Error toggling banner:", error);
      throw error;
    }
  },

  // Admin: Delete a banner
  deleteBanner: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  }
};


