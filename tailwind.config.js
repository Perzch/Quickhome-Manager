/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,tsx,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'text': '#67748e',
        'title': '#344767',
        'primary': '#174131',
        'error': '#ff1654',
        'danger': '#ee4266',
        'warning': '#ffd23f',
        'success': '#0ead69',
        'info': '#f3fcf0'
      },
      flex: {
        '1': '1 1 0%',
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      zIndex: {
        '99': '99',
        '1': '1',
        '2': '2',
        '3': '3',
      }
    },
  },
  plugins: [],
}

