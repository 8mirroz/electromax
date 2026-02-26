import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "1.5rem",
        lg: "1.5rem",
        xl: "1.5rem",
        "2xl": "1.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.45" }], // 13px for better readability on dense UI labels
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          900: "#1e3a8a",
          DEFAULT: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
export default config;
