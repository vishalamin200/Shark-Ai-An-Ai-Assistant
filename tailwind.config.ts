import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar"; 
import taiwindTypography from '@tailwindcss/typography'


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--color-primary)",
        chat:"var(--color-chat)",
        secondary:"var(--color-secondary)",
        lesswhite:"var(--less-white)"
      },
    },
  },
  plugins: [tailwindScrollbar, taiwindTypography], 
};

export default config;
