/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#1A3C34', // Forest Green
                surface: '#0D211C',    // Deep Charcoal Green
                primary: {
                    DEFAULT: '#FDF8E1', // Rich Cream (now primary for text/elements)
                    soft: '#2D5A4C',    // Sage Green
                    dark: '#F5F1E0',    // Muted Cream
                    accent: '#C5D86D',  // Lime Sage
                },
                secondary: '#C5D86D',  // Accent Green
                accent: '#C5D86D',     // Accent Green
                text: {
                    main: '#FDF8E1',   // Cream text
                    muted: '#AAB3AC',  // Muted sage text
                }
            },
            borderRadius: {
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
                rounded: ['Fredoka', 'sans-serif'], // Added Fredoka for extra cuteness
            },
            boxShadow: {
                'cute': '0 8px 30px rgba(0, 0, 0, 0.04)',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
}
