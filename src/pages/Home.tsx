import { useEffect } from "react";
import Hero from "../components/home/Hero";
import ShowcaseSection from "../components/home/ShowcaseSection";
import VideoPromotion from "../components/home/VideoPromotion";
import PromotionalBanners from "../components/home/PromotionalBanners";
import CategorySection from "../components/home/CategorySection";
import BestsellerSection from "../components/home/BestsellerSection";
import ReviewsSection from "../components/home/ReviewsSection";

const Home = () => {
  useEffect(() => {
    document.title = "PLEUX+ | Premium Botanical Skincare & Wellness";
    
    // Check for scroll parameter (from Navbar toggle on other pages)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scroll') === 'hero') {
      setTimeout(() => {
        const el = document.getElementById('hero-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  return (
    <>
      <Hero />
      <ShowcaseSection />
      <VideoPromotion />
      <PromotionalBanners location="hero" />
      <CategorySection />
      <PromotionalBanners location="middle" />
      <BestsellerSection />
      <ReviewsSection />
    </>
  );
};

export default Home;

