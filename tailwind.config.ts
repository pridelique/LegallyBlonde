import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
        ink: { DEFAULT: "#1F2937", soft: "#4B5563", mute: "#6B7280" },
        cream: "#FFFBFA",
        ok: "#15803D",
        warn: "#B45309",
        danger: "#B91C1C",
      },
      fontFamily: {
        sans: ["Anuphan", "Noto Sans Thai", "system-ui", "sans-serif"],
        doc: ["Sarabun", "Noto Sans Thai", "serif"],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(190, 24, 93, 0.18)",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: { floaty: "floaty 7s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
