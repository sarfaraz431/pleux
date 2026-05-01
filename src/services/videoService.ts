import { db, storage } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface PromoVideo {
  id?: string;
  type: "upload" | "url";
  url: string;
  linkTo?: string;
  productId?: string;
  category?: string;
  section: "beauty" | "wellness";
  createdAt: any;
}

const COLLECTION_NAME = "promo_videos";

export const videoService = {
  // Get all promotional videos, optionally filtered by section
  getAllVideos: async (section?: "beauty" | "wellness"): Promise<PromoVideo[]> => {
    try {
      let q;
      if (section) {
        q = query(
          collection(db, COLLECTION_NAME), 
          where("section", "==", section)
        );
      } else {
        q = query(collection(db, COLLECTION_NAME));
      }
      
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as PromoVideo[];

      // Sort in-memory to avoid composite index requirements
      return videos.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return [];
    }
  },

  // Add a new video
  addVideo: async (video: Omit<PromoVideo, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...video,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Failed to add video:", error);
      throw error;
    }
  },

  // Delete a video
  deleteVideo: async (id: string, fileUrl?: string): Promise<void> => {
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, COLLECTION_NAME, id));

      // 2. If it was an uploaded file (Firebase Storage), delete the file too
      if (fileUrl && fileUrl.includes("firebasestorage.googleapis.com")) {
        try {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        } catch (err) {
          console.warn("Failed to delete video file from storage, it might have been already deleted:", err);
        }
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      throw error;
    }
  },

  // Convert video file to Base64 (No Storage required, but dangerous for large files)
  uploadVideoFile: async (file: File): Promise<string> => {
    console.warn("WARNING: You are saving a video directly to Firestore as Base64. Firestore has a strict 1MB limit per document. If this video is larger than ~700KB, the save will fail.");
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read video file"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
