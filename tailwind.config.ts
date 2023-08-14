/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./node_modules/vue-tailwind-datepicker/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans TC', ...defaultTheme.fontFamily.sans],
        serif: ['Noto Serif TC', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: {
          100: '#e2efda',
          200: '#c6deb5',
          300: '#a9ce91',
          400: '#8dbd6c',
          500: '#70ad47',
          600: '#5a8a39',
          700: '#43682b',
          800: '#2d451c',
          900: '#16230e',
        },
        'vtd-primary': colors.sky,
        'vtd-secondary': colors.white,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
