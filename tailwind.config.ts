import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#E4002B", // Cuban red
          foreground: "#FFFFFF",
          hover: "#ff1741",
        },
        secondary: {
          DEFAULT: "#003875", // Deep blue inspired by Cuban flag
          foreground: "#FFFFFF",
          hover: "#004c9e",
        },
        accent: {
          DEFAULT: "#FFD700", // Warm gold
          foreground: "#2D3748",
          hover: "#ffd900",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2C",
          hover: "#F3F4F6",
          active: "#E5E7EB",
          border: "#E2E8F0",
          accent: "#F1F5F9",
          "accent-foreground": "#475569",
          ring: "#94A3B8",
        },
        cuban: {
          red: "#E4002B",
          blue: "#003875",
          white: "#FFFFFF",
          gold: "#FFD700",
          sand: "#F5DEB3",
          palm: "#2E8B57",
        },
      },
      backgroundImage: {
        'cuban-pattern': "url('/patterns/cuban-pattern.svg')",
        'palm-leaves': "url('/patterns/palm-leaves.svg')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(15deg)" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "wave": "wave 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;