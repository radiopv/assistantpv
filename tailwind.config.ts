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
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "#333333", // Changed to a darker color
        primary: {
          DEFAULT: "#FF6F61", // Cuban Coral Red
          foreground: "#333333", // Changed to darker color
          hover: "#FF8C42", // Cuban Orange
        },
        secondary: {
          DEFAULT: "#FFD966", // Cuban Pastel Yellow
          foreground: "#333333", // Changed to darker color
          hover: "#FFE599",
        },
        accent: {
          DEFAULT: "#00B8D4", // Cuban Turquoise
          foreground: "#333333", // Changed to darker color
          hover: "#00A0BA",
        },
        cuba: {
          coral: "#FF6F61",     // Warm Coral Red
          yellow: "#FFD966",    // Pastel Yellow
          turquoise: "#00B8D4", // Vibrant Turquoise
          mint: "#6DD47E",      // Tropical Mint
          orange: "#FF8C42",    // Intense Orange
          sand: "#F4E3C1",      // Soft Sand Beige
          text: "#333333",      // Darker text color
          textLight: "#666666", // Darker light text
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "#333333", // Changed to darker color
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "#666666", // Changed to darker color
        },
        card: {
          DEFAULT: "#F4E3C1", // Using Cuban Sand color
          foreground: "#333333", // Changed to darker color
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        title: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Ajout d'une police décorative pour les titres
      },
      fontSize: {
        'fluid-sm': 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
        'fluid-base': 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
        'fluid-lg': 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
        'fluid-xl': 'clamp(1.56rem, 1vw + 1.31rem, 2.11rem)',
        'fluid-2xl': 'clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)',
        'fluid-3xl': 'clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)',
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
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      backgroundImage: {
        'cuba-gradient': 'linear-gradient(135deg, #FF6F61 0%, #FF8C42 100%)',
        'sunset-gradient': 'linear-gradient(to right, #FF6F61, #FFD966)',
        'ocean-gradient': 'linear-gradient(to bottom, #00B8D4, #F4E3C1)',
        'warm-gradient': 'linear-gradient(to right, #F4E3C1, #FFD966)',
      },
      boxShadow: {
        'cuba': '0 4px 14px 0 rgba(255, 111, 97, 0.1)',
        'cuba-md': '0 6px 20px 0 rgba(255, 111, 97, 0.15)',
        'cuba-lg': '0 8px 30px 0 rgba(255, 111, 97, 0.2)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
