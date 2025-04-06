'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ThemeHandler() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply theme background class to the body
    setMounted(true);
    if (theme) {
      document.body.className = `${theme}-bg`;
    }
  }, [theme]);

  if (!mounted) return null;

  return null;
}
