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
        /* ชมพูหลายระดับสำหรับพื้นผิว: page < tint < petal < bloom */
        page: "#FBF3F7",
        tint: "#F7E6EF",
        petal: "#F2D4E3",
        bloom: "#E9B9D0",
        ink: { DEFAULT: "#2A1F27", soft: "#5B4A55", mute: "#7A6872" },
        cream: "#FBF3F7",
        ok: "#15803D",
        warn: "#B45309",
        danger: "#B91C1C",
      },
      fontFamily: {
        sans: ["Anuphan", "Noto Sans Thai", "system-ui", "sans-serif"],
        doc: ["Sarabun", "Noto Sans Thai", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(131, 24, 67, 0.04), 0 10px 30px -14px rgba(131, 24, 67, 0.16)",
        pop: "0 14px 30px -12px rgba(219, 39, 119, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
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
