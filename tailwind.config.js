/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./template/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Shadcn-inspired dark mode with lime accents and neutral base
                border: "hsl(240 3.7% 15.9%)",
                input: "hsl(240 3.7% 15.9%)",
                ring: "hsl(84 81% 44%)",
                background: "hsl(240 10% 3.9%)",
                foreground: "hsl(0 0% 98%)",
                primary: {
                    DEFAULT: "hsl(84 81% 44%)",
                    foreground: "hsl(240 10% 3.9%)",
                },
                secondary: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                destructive: {
                    DEFAULT: "hsl(0 62.8% 30.6%)",
                    foreground: "hsl(0 0% 98%)",
                },
                muted: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(240 5% 64.9%)",
                },
                accent: {
                    DEFAULT: "hsl(84 81% 44%)",
                    foreground: "hsl(240 10% 3.9%)",
                },
                popover: {
                    DEFAULT: "hsl(240 10% 3.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                card: {
                    DEFAULT: "hsl(240 10% 3.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                // Legacy colors for compatibility
                surface: '#18181b',
                'surface-highlight': '#27272a',
                success: '#84cc16',
                danger: '#dc2626',
                warning: '#eab308',
            },
            fontFamily: {
                sans: ['Noto Sans', 'Inter_400Regular', 'System'],
                bold: ['Noto Sans', 'Inter_700Bold', 'System'],
                medium: ['Noto Sans', 'Inter_500Medium', 'System'],
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
        },
    },
    plugins: [],
}
