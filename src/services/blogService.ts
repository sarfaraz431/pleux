import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  createdAt: Timestamp;
  category: string;
}

const COLLECTION_NAME = 'blogs';

export const blogService = {
  // Get all blogs sorted by date
  getBlogs: async (): Promise<BlogPost[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  },

  // Get a single blog by ID
  getBlogById: async (id: string): Promise<BlogPost | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      return null;
    }
  },

  // Add a new blog
  addBlog: async (blog: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...blog,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding blog:", error);
      throw error;
    }
  },

  // Update a blog
  updateBlog: async (id: string, blog: Partial<BlogPost>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, blog);
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete a blog
  deleteBlog: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  },

  // Helper: Compress and generate Base64 blog image (No Storage required)
  uploadBlogImage: async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
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
  }
};
