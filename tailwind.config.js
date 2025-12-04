/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'mixtape-black': '#000000',
                'mixtape-surface': '#121212',
                'accent-green': '#1DB954',
                'accent-rose': '#EE3124',
                'accent-pink': '#FFB5B5',
                'accent-blue': '#2E77D0',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
                mono: ['DM Mono', 'monospace'],
            },
            backgroundImage: {
                'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E')",
            }
        }
    },
    plugins: [],
}
