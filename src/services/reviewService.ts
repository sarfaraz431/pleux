import { collection, doc, addDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, collectionGroup } from "firebase/firestore";
import { db } from "./firebase";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  message?: string; // Supporting both for compatibility
  section: "beauty" | "wellness";
  photoUrl?: string;
  createdAt: any;
}

export const getReviews = async (productId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, `products/${productId}/reviews`);
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error("Error getting reviews:", error);
    return [];
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const reviewsRef = collectionGroup(db, "reviews");
    const snapshot = await getDocs(reviewsRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    
    // Sort in-memory to avoid requiring a Firebase Index
    return data.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error getting all reviews:", error);
    return [];
  }
};

export const addReview = async (
  productId: string, 
  userId: string, 
  userName: string, 
  rating: number, 
  comment: string, 
  section: "beauty" | "wellness",
  photoFile?: File | null
) => {
  try {
    let photoUrl = "";
    
    // Compress and convert photo to Base64 if provided
    if (photoFile) {
      photoUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 600;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedBase64 = canvas.toDataURL("image/webp", 0.6);
            resolve(compressedBase64);
          };
          img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
      });
    }

    const reviewsRef = collection(db, `products/${productId}/reviews`);
    await addDoc(reviewsRef, {
      productId,
      userId,
      userName,
      rating,
      comment,
      section,
      ...(photoUrl ? { photoUrl } : {}),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const deleteReview = async (productId: string, reviewId: string) => {
  try {
    await deleteDoc(doc(db, `products/${productId}/reviews/${reviewId}`));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
