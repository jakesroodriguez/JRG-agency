import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion", "gsap", "lenis"],
          "vendor-icons": ["lucide-react", "react-icons"],
          "three-core": ["three"],
          "three-addons": ["three-stdlib", "@react-three/fiber", "@react-three/drei"]
        }
      }
    },
    chunkSizeWarningLimit: 3000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ["console.log", "console.info", "console.debug"]
      },
      format: {
        comments: false
      }
    }
  },
  optimizeDeps: {
    include: ["three", "gsap", "lenis", "react", "react-dom", "react-router-dom"]
  }
});