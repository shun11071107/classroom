// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ← ここが大事な変更点です！
    autoprefixer: {},
  },
}