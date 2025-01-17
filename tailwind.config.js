/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          50: '#F5F5F5',
          100: '#E9E9E9',
          200: '#D9D9D9',
          300: '#C4C4C4',
          400: '#9D9D9D',
          500: '#7B7B7B',
          600: '#555555',
          700: '#434343',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          light: '#4CAF50',
          DEFAULT: '#43A047',
          dark: '#388E3C',
        },
        // Dark mode specific colors
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1E1E1E',
            tertiary: '#2D2D2D',
          },
          text: {
            primary: '#E0E0E0',
            secondary: '#A0A0A0',
            accent: '#81C784',
          },
          border: '#404040',
        },
        // Semantic colors that adapt to theme
        success: {
          light: '#4CAF50',
          dark: '#81C784',
        },
        info: {
          light: '#2196F3',
          dark: '#64B5F6',
        },
        warning: {
          light: '#FFA726',
          dark: '#FFB74D',
        },
        error: {
          light: '#F44336',
          dark: '#E57373',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      // Add transitions for smooth theme switching
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        'theme': '200ms',
      },
    },
  },
  plugins: [],
}