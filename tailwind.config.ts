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
          DEFAULT: "#FFB347", // Cuban Golden Orange
          foreground: "#FFFFFF",
          hover: "#FFA533",
        },
        secondary: {
          DEFAULT: "#40E0D0", // Light Turquoise
          foreground: "#000000",
          hover: "#2CCBBB",
        },
        accent: {
          DEFAULT: "#F5F5DC", // Cream
          foreground: "#000000",
          hover: "#EBEBE2",
        },
        cuba: {
          golden: "#FFB347",     // Main Golden Orange
          turquoise: "#40E0D0",  // Light Turquoise
          cream: "#F5F5DC",      // Cream
          wood: "#8B4513",       // Natural Wood Brown
          text: "#333333",       // Main Text Color
          textLight: "#666666",  // Secondary Text Color
          coral: "#FF6B6B",      // Warm Coral
          sand: "#F4D03F",       // Warm Sand
          ocean: "#2E86C1",      // Ocean Blue
          palm: "#27AE60",       // Palm Green
          havana: "#CD853F",     // Havana Brown
          sunset: "#FF7F50",     // Sunset Orange
          warmBeige: "#FDE1D3",  // Warm Beige
          softYellow: "#FEF7CD", // Soft Yellow
          softOrange: "#FEC6A1", // Soft Orange
          offwhite: "#F8F8F8",   // Off White Color
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
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        title: ['Lora', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
        'fluid-base': 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
        'fluid-lg': 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
        'fluid-xl': 'clamp(1.56rem, 1vw + 1.31rem, 2.11rem)',
        'fluid-2xl': 'clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)',
        'fluid-3xl': 'clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)',
      },
      backgroundImage: {
        'cuba-gradient': 'linear-gradient(135deg, #FFB347 0%, #40E0D0 100%)',
        'sunset-gradient': 'linear-gradient(to right, #FFB347, #FF7F50)',
        'beach-gradient': 'linear-gradient(to bottom, #40E0D0, #F5F5DC)',
        'warm-gradient': 'linear-gradient(to right, #FDE1D3, #FEC6A1)',
        'golden-shimmer': 'linear-gradient(90deg, transparent, rgba(255,179,71,0.2), transparent)',
        'havana-pattern': 'repeating-linear-gradient(45deg, #FFB34710 0px, #FFB34710 2px, transparent 2px, transparent 10px)',
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;