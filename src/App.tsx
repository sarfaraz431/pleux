import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FloatingWhatsApp from "./components/layout/FloatingWhatsApp";

import SplashScreen from "./components/layout/SplashScreen";

import OurStory from "./pages/OurStory";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import TrackOrder from "./pages/TrackOrder";
import WhyChooseUsPage from "./pages/WhyChooseUsPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SplashScreen />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

