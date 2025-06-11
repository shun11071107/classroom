// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}", // componentsフォルダ内のtsxファイルも対象
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}