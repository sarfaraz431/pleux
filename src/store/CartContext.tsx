import { createContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

