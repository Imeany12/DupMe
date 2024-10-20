import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
		'stars': 'url("/images/starBg.png")',
		'forest': 'url("/images/forestBg.png")',
		'snow': 'url("/images/snowBg.png")',
		'haunt': 'url("/images/hauntBg.png")',
		'city': 'url("/images/cityBg.png")',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        note: 'var(--note)',
        note1: 'var(--note1)',
        note2: 'var(--note2)',
       },
  },
      animation:{
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  plugins: [],
};
export default config;
