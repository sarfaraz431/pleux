import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

export interface UserProfile {
  id?: string;
  uid: string; // Adding uid as it's often used interchangeably with id in auth
  email: string;
  displayName?: string;
  role: "admin" | "super-admin" | "customer";
  createdAt?: string;
}

const userRef = collection(db, "users");

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map(doc => ({ id: doc.id, uid: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getAdmins = async (): Promise<UserProfile[]> => {
  try {
    const q = query(userRef, where("role", "in", ["admin", "super-admin"]));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, uid: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

export const updateUserRole = async (userId: string, role: "admin" | "super-admin" | "customer") => {
  const docRef = doc(db, "users", userId);
  return await updateDoc(docRef, { role });
};

export const promoteUserByEmail = async (email: string) => {
  const q = query(userRef, where("email", "==", email.trim()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("User not found. They must sign up first!");
  
  const userId = snapshot.docs[0].id;
  return await updateUserRole(userId, "admin");
};


