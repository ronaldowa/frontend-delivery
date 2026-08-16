// Tailwind theme configuration for the frontend design system.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Named colors keep utility classes aligned with the product palette.
      colors: {
        ink: "#17211f",
        mint: "#d7f2df",
        ocean: "#1f6f8b",
        coral: "#f06f5f",
        amber: "#f5b84b",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
