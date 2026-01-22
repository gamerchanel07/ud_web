/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F2A44',      // Navy Glass
        secondary: '#3FA9F5',    // Aqua Light
        accent: '#B7E7F7',       // Glass Blue
        dark: '#051e3e',         // Very dark navy
        darkBg: '#0a2a44',       // Dark ocean background
        ocean: {
          50: '#f0f7ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#3fa9f5',
          700: '#0f2a44',
          800: '#082f49',
          900: '#051e3e',
        }
      },
      backdropBlur: {
        md: '10px',
        lg: '20px',
        xl: '40px',
      }
    },
  },
  plugins: [],
}

