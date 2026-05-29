/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#fafaf7",
        cream: "#f4f1e8",
        surface: "#ffffff",
        teal: {
          50: "#effbf9",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        "text-muted": "#6b6b66",
        "text-placeholder": "#b3b3a8",
        "border-subtle": "#e8e6dd",
        "border-ink": "#0a0a0a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"DM Serif Display"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["56px", { lineHeight: "60px", letterSpacing: "-0.01em" }],
        "display-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em" }],
        "display-md": ["32px", { lineHeight: "36px" }],
        "display-sm": ["22px", { lineHeight: "28px" }],
        "body-lg": ["17px", { lineHeight: "1.55" }],
        "body-md": ["15px", { lineHeight: "1.55" }],
        "body-sm": ["13px", { lineHeight: "1.5" }],
        micro: ["11px", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderWidth: {
        hard: "1.5px",
      },
      boxShadow: {
        "offset-lg": "8px 8px 0 0 #14b8a6",
        "offset-md": "6px 6px 0 0 #14b8a6",
        "offset-sm": "4px 4px 0 0 #14b8a6",
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "6px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        container: "1200px",
        reading: "760px",
        editorial: "880px",
        prose: "60ch",
      },
    },
  },
  plugins: [],
};
