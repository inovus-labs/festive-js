
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    minify: "esbuild",
    sourcemap: false,
    lib: {
      entry: "entry.glob.js",
      name: "Festive",
      fileName: () => "festive.js",
      formats: ["iife"]
    },
    rollupOptions: {
      treeshake: true,
      output: {
        banner: "/* Festive.js | (c) 2020-2024 Inovus Labs | MIT License */",
        extend: true
      }
    },
    target: "es2018",
    cssCodeSplit: false
  },
  esbuild: { drop: ["console", "debugger"] }
});
