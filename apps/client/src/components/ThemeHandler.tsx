"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeHandler() {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme background class to the body
    if (theme) {
      document.body.className = `${theme}-bg`; 
    }
  }, [theme]);

  return null;
}