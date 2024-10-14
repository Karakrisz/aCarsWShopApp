/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'digital-seed': '#1AC78D',
        'primary': '#BB3434',
        'dark': '#181818',
        'gray': '#B4B4B4',
        'gray-light': '#F3F3F3',
      },
      boxShadow: {
        'big': '0px 1px 10px 0px rgba(0, 0, 0, 0.30)',
        'medium': '0px 1px 7px 0px rgba(0, 0, 0, 0.20)'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1116px',
        '2xl': '1116px',
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@headlessui/tailwindcss')
  ],
}

