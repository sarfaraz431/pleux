import React, { useState, useEffect } from "react";
import { 
  RefreshCw, User, Shield, Sparkles 
} from "lucide-react";
import { getAdmins, promoteUserByEmail, updateUserRole, type UserProfile } from "../../services/userService";

const TeamManager: React.FC = () => {
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async () => {
    if (!newAdminEmail) return;
    setUpdating(true);
    try {
      await promoteUserByEmail(newAdminEmail.trim().toLowerCase());
      setNewAdminEmail("");
      fetchData();
    } catch (error: any) {
      alert(error.message || "Failed to promote user");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "super-admin" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateUserRole(userId, newRole);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8 items-start animate-fade-in">
      {/* Team Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={120} /></div>
        <h2 className="font-serif text-xl md:text-2xl text-charcoal flex items-center gap-2 mb-2 relative z-10">
          <Shield className="text-emerald-500" size={24} />
          Access Control
        </h2>
        <p className="text-xs text-gray-400 mb-8 relative z-10">Manage permissions and team membership.</p>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Team Member Email</label>
            <input
              type="email"
              placeholder="teammate@pleux.life"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            disabled={updating}
            onClick={handlePromote}
            className="w-full py-4 rounded-2xl bg-charcoal hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all disabled:opacity-50"
          >
            {updating ? "Updating Permissions..." : "Promote to Admin"}
          </button>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
            <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">
              <Sparkles size={12} className="inline mr-1 mb-0.5" />
              Promoted users gain full access to the product catalog, analytics, and storefront management tools.
            </p>
          </div>
        </div>
      </div>

      {/* Admins List */}
      <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 md:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal">Active Administrators</h2>
          <button onClick={fetchData} className="p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-8">Authorized users with system-level permissions.</p>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">Syncing Authority Feed...</div>
          ) : admins.map(admin => (
            <div key={admin.uid} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 border border-gray-50 rounded-2xl sm:rounded-3xl bg-stone-50/30 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs shadow-inner flex-shrink-0">
                  {admin.displayName?.[0]?.toUpperCase() || admin.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-charcoal truncate">{admin.displayName || "Active User"}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium truncate">{admin.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleUpdateRole(admin.uid, admin.role || "admin")}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all flex-shrink-0 ${admin.role === 'super-admin' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
              >
                {admin.role || "admin"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManager;
