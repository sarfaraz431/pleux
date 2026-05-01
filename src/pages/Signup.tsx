import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Send Verification Email
      await sendEmailVerification(userCredential.user);
      setSuccess(true);
      
      // We don't navigate yet, we want them to see the message
      // and go to their email to verify
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-8 pb-12" style={{ background: "linear-gradient(135deg, #f4fbf6 0%, #e8f5ed 100%)" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-glow-soft p-8 md:p-10 border border-white/50"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pleux-50 text-pleux-500 text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            <Sparkles size={10} /> Joined 50k+ members
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Start your personalized beauty journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-bold text-charcoal mb-4">Check your Inbox</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              We've sent a verification link to <span className="font-bold text-charcoal">{email}</span>. 
              Please verify your email to unlock all features of PLEUX+.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline group"
            >
              Back to Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Ananya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="email" 
                    required 
                    placeholder="ananya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="password" 
                    required 
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 rounded-full text-white font-bold tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #10b981, #047857)" }}
              >
                {loading ? "Creating account..." : "Join PLEUX+"} <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in here</Link>
            </p>
          </>
        )}

        <p className="text-[10px] text-center text-gray-400 mt-6 leading-relaxed">
          By signing up, you agree to our <Link to="#" className="underline">Terms</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;


