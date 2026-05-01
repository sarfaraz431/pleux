import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User
} from "firebase/auth";
import { auth } from "../services/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

interface AuthContextType {
  user: User | null;
  unverifiedUser: User | null;
  isAdmin: boolean;
  isVerified: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const SUPER_ADMINS = (import.meta.env.VITE_ADMIN_EMAIL || "")
  .split(",")
  .map((e: string) => e.trim());

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const verified = currentUser?.emailVerified || false;
      setIsVerified(verified);
      
      if (currentUser) {
        if (verified) {
          setUser(currentUser);
          setUnverifiedUser(null);
        } else {
          setUser(null);
          setUnverifiedUser(currentUser);
        }

        // 1. Check if they are a Super Admin in .env (Fallback)
        const isSuper = SUPER_ADMINS.includes(currentUser.email || "");
        
        // 2. Check their role in Firestore
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsAdmin(verified && (isSuper || userData.role === "admin"));
          } else {
            // New User: Create their profile
            const role = isSuper ? "admin" : "customer";
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: role,
              createdAt: serverTimestamp()
            });
            setIsAdmin(verified && isSuper);
          }
        } catch (error: any) {
          console.error("❌ [Firebase Sync Error]:", error);
          setIsAdmin(verified && isSuper);
        }
      } else {
        setUser(null);
        setUnverifiedUser(null);
        setIsAdmin(false);
        setIsVerified(false);
      }
      
      setLoading(false);
    });
    
    // Auto-reload verification status when user returns to tab
    const handleFocus = async () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        console.log("🔄 [Auth] Auto-checking verification status...");
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          console.log("✅ [Auth] Email verified! Updating session...");
          window.location.reload(); // Hard reload to clear all states and trigger onAuthStateChanged
        }
      }
    };
    window.addEventListener("focus", handleFocus);
    
    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const logout = () => signOut(auth);

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const verified = auth.currentUser.emailVerified;
      setIsVerified(verified);
      
      if (verified) {
        setUser({ ...auth.currentUser });
        setUnverifiedUser(null);
      } else {
        setUser(null);
        setUnverifiedUser({ ...auth.currentUser });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, unverifiedUser, isAdmin, isVerified, loading, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


