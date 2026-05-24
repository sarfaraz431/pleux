export type Product = {
  id: string;
  name: string;
  price: number;
  /** Backward-compatible single image */
  image: string;
  description: string;
  rating: number;
  section?: "beauty" | "wellness";
  category?: string;
  /** Premium multi-image support. If missing, fall back to `image`. */
  images?: string[];
};


