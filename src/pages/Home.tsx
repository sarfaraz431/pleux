import { useEffect } from "react";
import Hero from "../components/home/Hero";
import ShowcaseSection from "../components/home/ShowcaseSection";
import VideoPromotion from "../components/home/VideoPromotion";
import PromotionalBanners from "../components/home/PromotionalBanners";
import CategorySection from "../components/home/CategorySection";
import BestsellerSection from "../components/home/BestsellerSection";
import ReviewsSection from "../components/home/ReviewsSection";
import SEOHead from "../components/layout/SEOHead";

const Home = () => {
  useEffect(() => {
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
      <SEOHead
        title="Premium Botanical Skincare & Plant-Based Wellness"
        description="Discover PLEUX+, the ultimate destination for premium botanical skincare, plant-based beauty, and natural wellness. Elevate your daily ritual with pure, science-backed formulas."
        url="/"
        type="website"
        keywords="plix, plixlife, plex, plux, botanical skincare, plant-based beauty, premium cosmetics, organic wellness, vegan skincare, natural serums, sustainable beauty, PLEUX"
        jsonLd={{
          "@type": "WebSite",
          name: "PLEUX+",
          url: "https://pleux.com/",
          description: "Premium botanical skincare and plant-based wellness formulations.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://pleux.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
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

