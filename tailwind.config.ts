import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fbf8ee",
          100: "#f5efd2",
          200: "#ebde9f",
          300: "#dfca6c",
          400: "#d3b442",
          500: "#b8972e",
          600: "#987523",
          700: "#74541e",
          800: "#5d441f",
          900: "#4f3920",
          950: "#2d1f0e",
        },
        royal: {
          maroon: "#58111A",
          burgundy: "#3F0A11",
          emerald: "#0B3C2B",
          navy: "#0A192F",
          champagne: "#F7E7CE",
          ivory: "#FFFFF0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "Great Vibes", "Alex Brush", "cursive"],
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        marcellus: ["Marcellus", "serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
