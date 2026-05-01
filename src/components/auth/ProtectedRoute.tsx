import { type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isVerified, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-4 border-pleux-200 border-t-pleux-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isVerified) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Shield size={40} />
        </div>
        <h1 className="font-serif text-3xl text-charcoal mb-3">Restricted Access</h1>
        <p className="text-gray-500 max-w-sm mb-8">
          This area is for PLEUX+ administrators only. Your account does not have the required permissions.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="btn-primary"
          style={{ background: "linear-gradient(135deg,#e63368,#fb7185)" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;


