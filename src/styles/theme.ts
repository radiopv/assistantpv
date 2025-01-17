export const theme = {
  colors: {
    primary: {
      DEFAULT: "#0072BB",      // Ocean Blue (Cuba turquoise)
      hover: "#005a94",
      light: "#3399cc",
    },
    secondary: {
      DEFAULT: "#FEC6A1",      // Soft Orange
      hover: "#fdb88a",
      light: "#ffd4b8",
    },
    accent: {
      DEFAULT: "#FFD700",      // Cuban Gold
      hover: "#ccac00",
      light: "#ffe44d",
    },
    success: {
      DEFAULT: "#50C878",      // Emerald Green
      hover: "#3ea15d",
      light: "#7dd49a",
    },
    warning: {
      DEFAULT: "#F4D03F",      // Sand Yellow
      hover: "#e6c02f",
      light: "#f7dc6f",
    },
    urgent: {
      DEFAULT: "#FF6B6B",      // Coral Red
      hover: "#ff5252",
      light: "#ff8f8f",
    },
  },
  gradients: {
    primary: "linear-gradient(135deg, #0072BB 0%, #3399cc 100%)",
    secondary: "linear-gradient(135deg, #FEC6A1 0%, #fdb88a 100%)",
    accent: "linear-gradient(135deg, #FFD700 0%, #ffe44d 100%)",
    urgent: "linear-gradient(135deg, #FF6B6B 0%, #ff5252 100%)",
    cuba: "linear-gradient(135deg, #0072BB 0%, #FEC6A1 100%)",
    sunset: "linear-gradient(to right, #FF6B6B, #FFD700)",
    beach: "linear-gradient(to bottom, #0072BB, #FFF9F5)",
    warm: "linear-gradient(to right, #FDE1D3, #FEC6A1)",
  },
}

export type ThemeColors = keyof typeof theme.colors;
export type ThemeGradients = keyof typeof theme.gradients;