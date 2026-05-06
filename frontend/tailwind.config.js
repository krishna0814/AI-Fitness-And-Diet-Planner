/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        fitness: {
          navy: {
            50: '#F0F9FF',
            500: '#1E3A8A',
            600: '#1E40AF',
            700: '#1D4ED8',
          },
          emerald: {
            400: '#4ADE80',
            500: '#10B981',
            600: '#059669',
          },
          amber: {
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
          },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(30, 58, 138, 0.4)',
        'glow-success': '0 0 25px rgba(16, 185, 129, 0.5)',
        'glow-energy': '0 0 30px rgba(245, 158, 11, 0.6)',
      },
    },
  },
  plugins: [],
}
