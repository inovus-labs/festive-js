import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "standalone",
    emptyOutDir: false,
    minify: "esbuild",
    sourcemap: false,
    lib: {
      entry: "entry.glob.js",
      name: "Festive",
      fileName: () => "festive-js.js",
      formats: ["iife"]
    },
    rollupOptions: {
      treeshake: true,
      output: {
        banner: "/*! Festive.js – MIT License */"
      }
    },
    target: "es2018",
    cssCodeSplit: false
  },
  esbuild: {
    drop: ["console", "debugger"]
  }
});
