import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from "fs"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ⭐ IMPORTANT FOR RENDER SPA ROUTING
    {
      name: "copy-redirects",
      closeBundle() {
        const src = path.resolve(__dirname, "public/_redirects")
        const dest = path.resolve(__dirname, "dist/_redirects")

        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
          console.log("✔ _redirects copied to dist")
        } else {
          console.log("❌ public/_redirects missing")
        }
      }
    }
  ],

  server:{port:5174},

  resolve: {
    dedupe: ["react", "react-dom"]
  }
})