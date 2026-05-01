import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { products as dummyProducts } from "../data/products";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  rating?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        console.log("Firebase Products:", data);

        if (data.length > 0) {
          setProducts(data);
        } else {
          console.warn("No products found in Firebase, using dummy data.");
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        console.warn("Falling back to dummy data due to error.");
        setProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

