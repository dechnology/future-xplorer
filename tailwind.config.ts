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
      height: {
        '1/12': '8.33333%',
        '2/12': '16.66667%',
        '3/12': '25%',
        '4/12': '33.33333%',
        '5/12': '41.66667%',
        '6/12': '50%',
        '7/12': '58.33333%',
        '8/12': '66.66667%',
        '9/12': '75%',
        '10/12': '83.33333%',
        '11/12': '91.66667%',
        '12/12': '100%',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
