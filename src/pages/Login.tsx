import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { Mail, Lock, ArrowRight, AlertCircle, RefreshCcw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { reloadUser, unverifiedUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (unverifiedUser) {
      setUnverified(true);
    }
  }, [unverifiedUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Force reload to bypass Firebase local cache
      await userCredential.user.reload();
      
      // 1. Mandatory Verification Check
      if (!userCredential.user.emailVerified) {
        setUnverified(true);
        setLoading(false);
        return;
      }
      
      // 2. Redirect based on login mode
      if (isAdminLogin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Check your credentials.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const userToVerify = unverifiedUser || auth.currentUser;
    if (userToVerify) {
      setResending(true);
      try {
        await sendEmailVerification(userToVerify);
        alert("Verification email sent! Please check your inbox.");
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/too-many-requests') {
          alert("Too many requests. Please wait a few minutes before trying again.");
        } else {
          alert(err.message || "Failed to send email. Please wait a moment and try again.");
        }
      } finally {
        setResending(false);
      }
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Google sign-in failed.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset link has been sent to your email!");
    } catch (err: any) {
      setError(err.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-8 pb-12" style={{ background: "linear-gradient(135deg, #f4fbf6 0%, #e8f5ed 100%)" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-glow-soft p-8 md:p-10 border transition-all duration-500 ${isAdminLogin ? 'border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.1)]' : 'border-white/50'}`}
      >
        {/* Back to Home Link */}
        <div className="absolute top-6 left-6 md:-left-16 md:top-0">
          <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 shadow-sm hover:scale-105 transition-all">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </div>

        <div className="text-center mb-8 mt-2 md:mt-0">
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => setIsAdminLogin(!isAdminLogin)}
              className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest transition-all ${
                isAdminLogin 
                ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {isAdminLogin ? "🛡️ Admin Mode Active" : "Customer Login"}
            </button>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
            {isAdminLogin ? "Admin Portal" : "Welcome Back"}
          </h1>
          
          {/* Prominent Signup Prompt */}
          {!isAdminLogin ? (
            <p className="text-gray-500 text-sm">
              First time here?{" "}
              <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Secure dashboard access for PLEUX+ management
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {unverified && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="text-amber-500 shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">Verify your Email</p>
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                  We need to make sure you're real. Please check your inbox and click the verification link.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resending ? <RefreshCcw size={12} className="animate-spin" /> : null}
                {resending ? "Sending..." : "Resend Verification"}
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    await auth.currentUser?.reload();
                    if (auth.currentUser?.emailVerified) {
                      // Hard reload guarantees AuthContext recalculates isAdmin correctly
                      window.location.reload(); 
                    } else {
                      alert("Email not yet verified. Please click the link in your inbox (check Spam).");
                    }
                  } catch (e) {
                    console.error("Reload error:", e);
                  }
                }}
                className="w-full py-2 bg-white border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-emerald-50"
              >
                <CheckCircle2 size={12} />
                I've Verified My Email
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              {isAdminLogin ? "Admin Email" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isAdminLogin ? 'text-amber-300' : 'text-gray-300'}`} size={16} />
              <input 
                type="email" 
                required 
                placeholder={isAdminLogin ? "admin@pleux.com" : "ananya@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field pl-11 transition-all ${isAdminLogin ? 'focus:ring-amber-200 border-amber-100' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              {!isAdminLogin && (
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-pleux-500 hover:underline uppercase tracking-widest"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isAdminLogin ? 'text-amber-300' : 'text-gray-300'}`} size={16} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field pl-11 transition-all ${isAdminLogin ? 'focus:ring-amber-200 border-amber-100' : ''}`}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-full font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              isAdminLogin 
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
              : 'btn-primary'
            } disabled:opacity-50`}
            style={isAdminLogin ? {} : { background: "linear-gradient(135deg, #10b981, #047857)" }}
          >
            {loading ? (isAdminLogin ? "Authenticating..." : "Signing in...") : (isAdminLogin ? "Enter Dashboard" : "Sign In")} 
            <ArrowRight size={16} />
          </button>
        </form>

        {!isAdminLogin && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-3 text-gray-400">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-1">
              <button 
                onClick={handleGoogle}
                className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Sign in with Google
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
              New to PLEUX+?{" "}
              <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
                Sign up for free
              </Link>
            </p>
          </>
        )}

        {isAdminLogin && (
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            Authorized access only. All activity is logged.<br/>
            <button onClick={() => setIsAdminLogin(false)} className="text-amber-600 font-bold hover:underline mt-2">Back to Customer Login</button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;


