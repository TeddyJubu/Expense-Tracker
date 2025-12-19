/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./template/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Professional dashboard color scheme
                primary: "#a3e635", // Lime green accent
                "primary-dark": "#84cc16", // Slightly darker lime green
                "background-light": "#f8f8f5", 
                "background-dark": "#0a0a2a", // Stark deep navy
                "surface-dark": "#1a1a3a", // Darker navy for cards/surfaces
                "card-dark": "#1a1a3a", 
                "text-offwhite": "#f8f8f8", // Crisp off-white text
                "text-secondary": "#b0b0bb", // Slightly darker off-white for secondary text
                "lime-green": "#a3e635", // Explicit lime green
                "navy-dark": "#0a0a2a", // Explicit deep navy
                "navy-surface": "#1a1a3a", // Explicit surface navy
                "navy-border": "#3a3a4a", // Border color
                "chart-fill": "rgba(163, 230, 53, 0.15)", // Transparent lime for chart
                
                // Shadcn-inspired dark mode with lime accents and neutral base
                border: "#3a3a4a",
                input: "#3a3a4a",
                ring: "#a3e635",
                background: "#0a0a2a",
                foreground: "#f8f8f8",
                secondary: {
                    DEFAULT: "#1a1a3a",
                    foreground: "#f8f8f8",
                },
                destructive: {
                    DEFAULT: "#dc2626",
                    foreground: "#f8f8f8",
                },
                muted: {
                    DEFAULT: "#1a1a3a",
                    foreground: "#b0b0bb",
                },
                accent: {
                    DEFAULT: "#a3e635",
                    foreground: "#0a0a2a",
                },
                popover: {
                    DEFAULT: "#0a0a2a",
                    foreground: "#f8f8f8",
                },
                card: {
                    DEFAULT: "#1a1a3a",
                    foreground: "#f8f8f8",
                },
                // Legacy colors for compatibility
                'surface-highlight': '#27272a',
                success: '#84cc16',
                danger: '#dc2626',
                warning: '#eab308',
            },
            fontFamily: {
                sans: ['Open Sans', 'Noto Sans', 'Inter_400Regular', 'System'],
                mono: ['Roboto Mono', 'monospace'],
                bold: ['Noto Sans', 'Inter_700Bold', 'System'],
                medium: ['Noto Sans', 'Inter_500Medium', 'System'],
            },
            borderRadius: {
                DEFAULT: "1rem",
                lg: "1.5rem",
                xl: "2rem",
                '2xl': "2.5rem",
                full: "9999px",
                sm: "calc(0.5rem - 4px)",
                md: "calc(0.5rem - 2px)",
            },
            boxShadow: {
                'glow': '0 0 15px rgba(163, 230, 53, 0.3)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
            }
        },
    },
    plugins: [],
}
