/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DEDBC8",
        cinema: {
          gold: "#C2A88F",
          goldMuted: "#9E7E63",
          goldLight: "#EFE8E1",
          amber: "#A8896C",
          cream: "#E1E0CC",
          bone: "#DEDBC8",
          paper: "#F5F3EC",
          navy: "#1B365D",
          slate: "#2C3E50",
          crimson: "#FF1E1E",
          emerald: "#10B981",
          obsidian: "#08080A",
          void: "#000000",
        },
      },
      fontFamily: {
        sans: ['Almarai', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        estrella: ['Estrella', 'sans-serif'],
        alata: ['Alata', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
