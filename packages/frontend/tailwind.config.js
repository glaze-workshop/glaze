const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  purge: {
    enabled: isProduction,
    content: [
      './src/**/*.html',
      './src/**/*.ts',
      './src/**/*.tsx']
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
