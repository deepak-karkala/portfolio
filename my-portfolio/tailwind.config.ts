import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './content/**/*.{js,ts,jsx,tsx,md,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Palette 1: Warm & Earthy
                background: '#FBF8F3', // Warm cream
                primary: '#8B9A8B',     // Sage green
                secondary: '#D4A574',   // Warm terracotta
                accent: '#C85A54',      // Deep coral
                foreground: '#2C2C2C',  // Charcoal text
                
                // Alternative palettes (uncomment to switch)
                // Palette 2: Cool & Professional
                // background: '#FAFBFC', // Cool white
                // primary: '#2C3E50',     // Deep navy
                // secondary: '#7F8C8D',   // Blue-gray
                // accent: '#16A085',      // Teal
                // foreground: '#1A1A1A',  // Dark navy text
                
                // Palette 3: Modern & Sophisticated
                // background: '#FFFFFF', // Pure white
                // primary: '#4A4A4A',     // Charcoal
                // secondary: '#8E5A8E',   // Warm purple
                // accent: '#F4B942',      // Golden amber
                // foreground: '#1C1C1C',  // Near black text
            },
            // Uncomment and customize if you add a custom font
            // fontFamily: {
            //   sans: ['Figtree', 'sans-serif'],
            // },
        },
    },
    plugins: [],
};

export default config; 