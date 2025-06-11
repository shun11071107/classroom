// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ← 必ずこれに！
    autoprefixer: {},
  },
}