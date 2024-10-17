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
    //   backgroundImage: {
		// 'stars': 'url("/images/starBg.png")',
		// 'forest': 'url("/images/forestBg.png")',
		// 'snow': 'url("/images/snowBg.png")',
		// 'haunt': 'url("/images/hauntBg.png")',
		// 'city': 'url("/images/cityBg.png")',
    //   },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: 'var(--primary)',
        note1: 'var(--note1)',
        note2: 'var(--note2)',
       },
      // themeVariants: {
      //   'star': {
      //     backgroundImage: 'url("/images/starBg.png")',
      //     colors: {
      //       //'text': '#fdd835', //yellow
      //       primary: {
      //         DEFAULT:'#82C5FFD9',
      //       },note2:{
      //         DEFAULT:'#5F89FF',
      //       },note3:{
      //         DEFAULT:'#0D1D2CD9',
      //     },
      //   },
      //   'snow': {
      //     backgroundImage: 'url("/images/snowBg.png")',
      //     colors: {
      //       //'text': '#ffffff',  // white text for snow theme
      //       primary: {
      //         DEFAULT:'#BDBDBDD9',
      //       },note2:{
      //         DEFAULT:'#EFEBF0',
      //       },note3:{
      //         DEFAULT:'#333322D9',
      //     },
      //     },
      //   },
      //   'city': {
      //     backgroundImage: 'url("/images/cityBg.png")',
      //     colors: {
      //       //'text': '#fafafa',  // light gray text for city theme
      //       primary: {
      //         DEFAULT:'#EFACCD',
      //       },note2:{
      //         DEFAULT:'#C175D4',
      //       },note3:{
      //         DEFAULT:'#36083F',
      //     },
      //     },
      //   },
      //   'forest': {
      //     backgroundImage: 'url("/images/forestBg.png")',
      //     colors: {
      //       //'text': '#fafafa',  // light gray text for forest theme
      //       primary: {
      //         DEFAULT:'#5FDAFF',
      //       },note2:{
      //         DEFAULT:'#8AFF82',
      //       },note3:{
      //         DEFAULT:'#03200F',
      //     },
      //     },
      //   },
      //   'haunt': {
      //     backgroundImage: 'url("/images/hauntBg.png")',
      //     colors: {
      //       //'text': '#fafafa',  // light gray text for haunt theme
      //       primary: {
      //         DEFAULT:'#F2AD8C',
      //       },note2:{
      //         DEFAULT:'#F24545',
      //       },note3:{
      //         DEFAULT:'#2F1515',
      //     },
      //     },
      //},
      //},
    //},
  },
      animation:{
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  plugins: [],
};
export default config;
