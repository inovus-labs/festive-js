
import { defineConfig } from "vite";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf-8"));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * Copyright (c) 2025 ${pkg.author}
 * Licensed under the ${pkg.license} License
 * Built: ${new Date().toISOString()}
 */
`;

const isMinified = process.env.BUILD_MODE === 'min';

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    minify: isMinified ? "esbuild" : false,
    sourcemap: false,
    lib: {
      entry: "entry.glob.js",
      name: "Festive",
      fileName: () => isMinified ? "festive.min.js" : "festive.js",
      formats: ["iife"]
    },
    rollupOptions: {
      treeshake: true,
      output: {
        banner: isMinified ? "" : banner,
        extend: true
      }
    },
    target: "es2018",
    cssCodeSplit: false
  },
  esbuild: isMinified ? { drop: ["console", "debugger"] } : undefined
});
