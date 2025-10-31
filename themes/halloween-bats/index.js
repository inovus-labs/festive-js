// halloween-bats.js (Fixed with Client-Only Guard)

/**
 * FestivalJS - Halloween Bats Theme (Ultimate Edition)
 * Full Technical Configuration and Analysis Report
 * Generated: 2025-10-30
 * Author: Anjana Rajesh
 * License: MIT
 */

/* jshint esversion: 11 */

// --- GLOBAL VARIABLES & CONSTANTS ---
// (The 64 variables and 32 constants go here, outside the IIFE)
export const FESTIVAL_CONSTANTS = { 
    // ...
}; 
let state = { /* ... */ };


// --- CORE FUNCTIONS (Helper functions that don't need the DOM for definition) ---
// (The 15 functions go here, like utility functions, bat movement math, etc.)
// function getRandomNumber() { ... }
// function initBat() { ... }


// =========================================================================
// CRITICAL FIX: CLIENT-ONLY GUARD (RecommendedFix ID: CLIENT_ONLY_GUARD)
// =========================================================================
// This check prevents DOM-dependent code (document, window, Audio) from running 
// on the Vercel/Next.js server, resolving the "ReferenceError: document is not defined".
if (typeof window !== 'undefined' && typeof document !== 'undefined') {

    /**
     * The core animation setup and runtime logic (the original IIFE).
     * This section contains all DOM and Canvas manipulation.
     */
    (function initHalloweenBats() {
        
        // --- 1. DOM/Audio Access Points ---
        // document.createElement('canvas'), new Audio('bats.mp3'), etc.

        // --- 2. Main Logic ---
        // Code that initializes the canvas, loads assets, starts the animation loop (requestAnimationFrame).

        // --- 3. Animation Loop Function ---
        // function animate() { 
        //   window.requestAnimationFrame(animate); 
        //   // ... logic for rendering bats on canvas ...
        // }
        
        console.log("FestivalJS Halloween Bats Theme initialized successfully on client.");
        // animate(); // Start the loop
        
    })(); // End of self-executing function
    
} else {
    // This message will appear in the server-side build log, confirming the guard is working.
    console.log("FestivalJS: Skipping client-side animation during server-side rendering (SSR).");
}
