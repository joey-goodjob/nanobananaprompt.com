/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // 包含 @repo/web 包的组件
    "../../packages/web/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 香蕉主题色
        banana: {
          50: '#fffbef',
          100: '#fff4d4',
          200: '#ffe6a9',
          300: '#ffd877',
          400: '#ffc74a',
          500: '#f8b734',
          600: '#d28b1e',
        },
        leaf: '#3a7d44',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#f8b734",
          secondary: "#3a7d44",
          accent: "#ffc74a",
          neutral: "#3a2d15",
          "base-100": "#fffdf5",
          "base-200": "#fff8e0",
          "base-300": "#fff4d3",
        },
      },
      "dark",
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
