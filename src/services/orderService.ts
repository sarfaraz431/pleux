import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";

export interface Order {
  id?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: any;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
}

const orderRef = collection(db, "orders");

export const saveOrder = async (order: Omit<Order, "id" | "status">) => {
  return await addDoc(orderRef, {
    ...order,
    status: "PENDING",
    createdAt: Timestamp.now()
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const docRef = doc(db, "orders", id);
  return await updateDoc(docRef, { status });
};

export const getAnalytics = async (days: number) => {
  const now = new Date();
  const currentCutoff = new Date();
  currentCutoff.setDate(now.getDate() - days);
  
  const previousCutoff = new Date();
  previousCutoff.setDate(now.getDate() - (days * 2));

  // 1. Fetch Current Period Orders
  const currentQ = query(orderRef, where("createdAt", ">=", Timestamp.fromDate(currentCutoff)), orderBy("createdAt", "desc"));
  const currentSnap = await getDocs(currentQ);
  const currentOrders = currentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

  // 2. Fetch Previous Period Orders (for Growth Calculation)
  const previousQ = query(orderRef, 
    where("createdAt", ">=", Timestamp.fromDate(previousCutoff)), 
    where("createdAt", "<", Timestamp.fromDate(currentCutoff)),
    orderBy("createdAt", "desc")
  );
  const previousSnap = await getDocs(previousQ);
  const previousOrders = previousSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

  // ONLY count PAID orders for revenue
  const currentRevenue = currentOrders.filter(o => o.status === "PAID").reduce((sum, o) => sum + o.total, 0);
  const previousRevenue = previousOrders.filter(o => o.status === "PAID").reduce((sum, o) => sum + o.total, 0);

  // Status Counts
  const statusCounts = {
    pending: currentOrders.filter(o => o.status === "PENDING").length,
    confirmed: currentOrders.filter(o => o.status === "CONFIRMED").length,
    paid: currentOrders.filter(o => o.status === "PAID").length,
    cancelled: currentOrders.filter(o => o.status === "CANCELLED").length,
  };

  // 📈 Dynamic Growth Calculation
  let growth = 0;
  if (previousRevenue > 0) {
    growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  } else if (currentRevenue > 0) {
    growth = 100; // 100% growth if there were no previous sales
  }

  // Items sold counts only PAID or CONFIRMED orders
  const totalItemsSold = currentOrders
    .filter(o => o.status === "PAID" || o.status === "CONFIRMED")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
  
  // Best selling products (from current period, PAID/CONFIRMED only)
  const productSales: Record<string, { name: string, count: number }> = {};
  currentOrders
    .filter(o => o.status === "PAID" || o.status === "CONFIRMED")
    .forEach(o => {
      o.items.forEach(i => {
        if (!productSales[i.id]) productSales[i.id] = { name: i.name, count: 0 };
        productSales[i.id].count += i.qty;
      });
    });
  
  const bestSellers = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5);

  return {
    totalRevenue: currentRevenue,
    totalItemsSold,
    orderCount: currentOrders.length,
    statusCounts,
    growth: parseFloat(growth.toFixed(1)),
    bestSellers,
    recentOrders: currentOrders.slice(0, 10)
  };
};


