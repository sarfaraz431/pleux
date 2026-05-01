import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  useEffect(() => {
    // If the video takes too long or fails, forcefully close it after 5 seconds
    const fallbackTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    // Also check if they've already seen it this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
      clearTimeout(fallbackTimer);
    }

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 300); // short delay after video ends before fading out
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* Mobile Video */}
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover md:hidden"
          >
            <source src="/Cinematic_intro_animation_202604261803.mp4" type="video/mp4" />
          </video>

          {/* Desktop Video */}
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover hidden md:block"
          >
            <source src="/Cinematic_intro_animation_202604261758.mp4" type="video/mp4" />
          </video>

          {/* Skip Button */}
          <button
            onClick={() => {
              setShowSplash(false);
              sessionStorage.setItem("hasSeenSplash", "true");
            }}
            className="absolute bottom-10 right-6 md:right-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 hover:scale-105 shadow-xl"
          >
            Skip Intro
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
