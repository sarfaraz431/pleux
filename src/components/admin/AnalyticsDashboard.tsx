import React, { useState, useEffect } from "react";
import { 
  IndianRupee, TrendingUp, TrendingDown, ShoppingCart, Users, BarChart3, Calendar, RefreshCw 
} from "lucide-react";
import { getAnalytics, updateOrderStatus } from "../../services/orderService";

interface AnalyticsDashboardProps {
  timeRange: number;
  setTimeRange: (range: number) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ timeRange, setTimeRange }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const fetchData = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loadingAnalytics && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-fade-in">
        <RefreshCw size={48} className="text-emerald-200 animate-spin" />
        <p className="text-xs text-gray-400 font-black uppercase tracking-[0.3em]">Gathering Business Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Business Analytics</h2>
          <p className="text-sm text-gray-400">Track your store performance and growth</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {[
            { label: "3D", value: 3 },
            { label: "10D", value: 10 },
            { label: "20D", value: 20 },
            { label: "1M", value: 30 },
            { label: "3M", value: 90 },
          ].map(r => (
            <button key={r.value} onClick={() => setTimeRange(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === r.value ? "bg-charcoal text-white" : "text-gray-400 hover:bg-gray-50"}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loadingAnalytics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />)}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><IndianRupee size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Revenue</p>
              <h3 className="text-3xl md:text-4xl font-black text-charcoal">₹{analytics?.totalRevenue?.toLocaleString() || 0}</h3>

              {analytics?.growth !== 0 ? (
                <div className={`flex items-center gap-1 text-[10px] font-bold mt-4 w-fit px-3 py-1 rounded-full ${analytics?.growth >= 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}`}>
                  {analytics?.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {analytics?.growth > 0 ? "+" : ""}{analytics?.growth}% {analytics?.growth >= 0 ? "Growth" : "Decrease"}
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 font-bold mt-4 bg-gray-50 w-fit px-3 py-1 rounded-full uppercase tracking-widest">Market Stable</div>
              )}
            </div>

            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShoppingCart size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Units Sold</p>
              <h3 className="text-3xl md:text-4xl font-black text-charcoal">{analytics?.totalItemsSold || 0}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Across {analytics?.orderCount || 0} botanical orders</p>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Users size={80} /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Velocity</p>
              <h3 className="text-3xl md:text-4xl font-black text-charcoal">{analytics?.orderCount || 0}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">New transactions in {timeRange}D</p>
            </div>
          </div>

          {/* Status Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center group hover:bg-amber-50/30 transition-colors">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">Pending</p>
              <p className="text-3xl font-black text-charcoal">{analytics?.statusCounts?.pending || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center group hover:bg-blue-50/30 transition-colors">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Confirmed</p>
              <p className="text-3xl font-black text-charcoal">{analytics?.statusCounts?.confirmed || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center group hover:bg-emerald-50/30 transition-colors">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Paid</p>
              <p className="text-3xl font-black text-charcoal">{analytics?.statusCounts?.paid || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center group hover:bg-red-50/30 transition-colors">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Cancelled</p>
              <p className="text-3xl font-black text-charcoal">{analytics?.statusCounts?.cancelled || 0}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bestsellers List */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl md:text-2xl text-charcoal">Top Moving Inventory</h3>
                <BarChart3 size={20} className="text-emerald-500" />
              </div>
              <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest font-bold">Highest velocity products by unit count</p>
              {analytics?.bestSellers?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.bestSellers.map((item: any, idx: number) => (
                    <div key={item.name} className="flex items-center gap-4 group">
                      <span className="w-6 text-xs font-black text-gray-300 group-hover:text-pink-500 transition-colors">0{idx + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-charcoal group-hover:translate-x-1 transition-transform">{item.name}</p>
                        <div className="w-full bg-gray-50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-pink-500 rounded-full"
                            style={{ width: `${(item.count / Math.max(1, analytics.totalItemsSold)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-black text-charcoal">{item.count} Sold</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-300 italic text-sm">No confirmed sales data yet.</div>
              )}
            </div>

            {/* Recent Orders Feed */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl md:text-2xl text-charcoal">Live Transactions</h3>
                <Calendar size={20} className="text-emerald-500" />
              </div>
              <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest font-bold">Real-time order pipeline management</p>
              <div className="space-y-4">
                {analytics?.recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-charcoal">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {order.items.length} items • ₹{order.total}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <select
                        value={order.status || "PENDING"}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value as any).then(fetchData);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-tighter cursor-pointer outline-none ${order.status === "PAID" ? "text-emerald-600 bg-emerald-50" :
                          order.status === "CONFIRMED" ? "text-blue-600 bg-blue-50" :
                            order.status === "CANCELLED" ? "text-red-500 bg-red-50" :
                              "text-amber-600 bg-amber-50"
                          }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <p className="text-[10px] text-gray-300">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
