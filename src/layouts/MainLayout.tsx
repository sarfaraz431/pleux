import Navbar from "../components/layout/Navbar";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8E8EE] to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

