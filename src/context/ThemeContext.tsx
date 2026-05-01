import React, { createContext, useContext, useState, useEffect } from "react";

type Section = "beauty" | "wellness";

interface ThemeContextType {
  section: Section;
  setSection: (section: Section) => void;
  colors: {
    primary: string;
    light: string;
    dark: string;
    text: string;
    border: string;
    bg: string;
    hover: string;
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [section, setSection] = useState<Section>("beauty");

  const colors = section === "beauty"
    ? {
        primary: "bg-emerald-600",
        light:   "bg-emerald-50",
        dark:    "bg-emerald-950",
        text:    "text-emerald-600",
        border:  "border-emerald-100",
        bg:      "bg-emerald-50/30",
        hover:   "hover:bg-emerald-50",
      }
    : {
        primary: "bg-purple-600",
        light:   "bg-purple-50",
        dark:    "bg-purple-950",
        text:    "text-purple-600",
        border:  "border-purple-100",
        bg:      "bg-purple-50/30",
        hover:   "hover:bg-purple-50",
      };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--theme-primary",
      section === "beauty" ? "#059669" : "#9333ea"
    );
  }, [section]);

  return (
    <ThemeContext.Provider value={{ section, setSection, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};


