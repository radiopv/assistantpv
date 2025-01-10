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
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0072BB", // Cuban Ocean Blue
          foreground: "#FFFFFF",
          hover: "#005d99",
        },
        secondary: {
          DEFAULT: "#FF2400", // Cuban Warm Orange/Red
          foreground: "#FFFFFF",
          hover: "#cc1d00",
        },
        accent: {
          DEFAULT: "#FFD700", // Cuban Gold
          foreground: "#000000",
          hover: "#ccac00",
        },
        cuba: {
          turquoise: "#0072BB", // Ocean Blue
          red: "#FF2400",      // Warm Red
          gold: "#FFD700",     // Warm Gold
          coral: "#FF6B6B",    // Coral Red
          emerald: "#50C878",  // Emerald Green
          pink: "#FFB6C1",     // Soft Pink
          sand: "#F4D03F",     // Sand Yellow
          offwhite: "#F5F5F5", // Light Background
          warmBeige: "#FDE1D3", // Warm Beige
          softYellow: "#FEF7CD", // Soft Yellow
          softOrange: "#FEC6A1", // Soft Orange
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        title: ['Playfair Display', 'serif'],
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
        "golden-light": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "golden-light": "golden-light 15s linear infinite",
      },
      backgroundImage: {
        'cuba-gradient': 'linear-gradient(135deg, #0072BB 0%, #005d99 100%)',
        'sunset-gradient': 'linear-gradient(to right, #FF2400, #FFD700)',
        'beach-gradient': 'linear-gradient(to bottom, #0072BB, #F5F5F5)',
        'warm-gradient': 'linear-gradient(to right, #FDE1D3, #FEC6A1)',
        'golden-shimmer': 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;