const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        backdrop: 'rgba(28,33,40,0.8)',
        canvas: colors.neutral,
        text: {
          primary: colors.neutral['900'],
          secondary: colors.neutral['600'],
        },
      },
    },
  },
  plugins: [],
};
