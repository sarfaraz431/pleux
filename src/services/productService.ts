import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { products as dummyProducts } from "../data/products";

import type { Product } from "../types/Product";

const productRef = collection(db, "products");

export const uploadProductImage = async (file: File): Promise<string> => {
  // Client-side compression and conversion to Base64 (No Firebase Storage required)
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Optimal size for quality and string length
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert directly to a WebP Base64 string to save in Firestore
        const base64String = canvas.toDataURL("image/webp", 0.6);
        resolve(base64String);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// ⚡ Check if Firebase is actually configured
const isFirebaseConfigured = 
  import.meta.env.VITE_API_KEY && 
  import.meta.env.VITE_API_KEY !== "xxxx";

// ⚡ In-memory cache for lightning-fast performance
let cachedProducts: Product[] | null = null;

// ✅ GET PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  if (cachedProducts) {
    return cachedProducts;
  }

  if (!isFirebaseConfigured) {
    return dummyProducts as Product[];
  }

  try {
    const snapshot = await getDocs(productRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    })) as Product[];

    if (data.length > 0) {
      cachedProducts = data;
      return data;
    }
    
    console.warn("No products in Firebase, returning dummy data.");
    return dummyProducts as Product[];
  } catch (error) {
    console.error("Firebase fetch failed, returning dummy data:", error);
    return dummyProducts as Product[];
  }
};

// ✅ ADD PRODUCT
export const addProduct = async (product: Omit<Product, "id">) => {
  cachedProducts = null; // Clear cache to show new product
  return await addDoc(productRef, product);
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  cachedProducts = null; // Clear cache
  const docRef = doc(db, "products", id);
  return await deleteDoc(docRef);
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (id: string, product: Partial<Product>) => {
  cachedProducts = null; // Clear cache
  const docRef = doc(db, "products", id);
  return await updateDoc(docRef, product);
};

