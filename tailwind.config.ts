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
        primary: {
          DEFAULT: "#00f260", // vibrant premium green
          light: "#33ff80",
          dark: "#0575e6", // mixing in some electric blue for premium gradient
        },
        bg: {
          dark: "#0a0a0a", // deep OLED black
          card: "rgba(20, 20, 20, 0.6)", // glassmorphism card background
          "card-hover": "rgba(30, 30, 30, 0.8)",
        },
        text: {
          main: "#ffffff",
          muted: "#a1a1aa",
          dim: "#71717a",
        },
        accent: "#f59e0b",
        danger: "#ef4444",
        warning: "#fbbf24",
        info: "#3b82f6",
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(to right, #0575e6, #00f260)',
        'premium-glow': 'radial-gradient(circle at center, rgba(0, 242, 96, 0.15) 0%, transparent 70%)',
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [],
};
export default config;
