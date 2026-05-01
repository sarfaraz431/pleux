import { db } from "./firebase";
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";

export interface Coupon {
  id?: string;
  code: string;
  discount: number; // percentage
  active: boolean;
}

const couponRef = collection(db, "coupons");

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const snapshot = await getDocs(couponRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const addCoupon = async (coupon: Omit<Coupon, "id">) => {
  return await addDoc(couponRef, { ...coupon, code: coupon.code.toUpperCase().trim() });
};

export const deleteCoupon = async (id: string) => {
  return await deleteDoc(doc(db, "coupons", id));
};

export const updateCoupon = async (id: string, coupon: Partial<Coupon>) => {
  return await updateDoc(doc(db, "coupons", id), coupon);
};

export const validateCoupon = async (code: string): Promise<Coupon | null> => {
  try {
    const q = query(couponRef, where("code", "==", code.toUpperCase().trim()), where("active", "==", true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;
  } catch (error) {
    console.error("Error validating coupon:", error);
    return null;
  }
};


