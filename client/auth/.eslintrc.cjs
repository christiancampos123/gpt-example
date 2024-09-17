module.exports = {
  extends: './node_modules/standard/eslintrc.json',
  env: {
    browser: true, // Esto permite variables globales del navegador como `localStorage` y `sessionStorage`
    es6: true // Para soportar características de ES6+
  },
  globals: {
    // Aquí puedes añadir variables globales
  },
  rules: {
    // Aquí puedes añadir o sobrescribir reglas específicas
  }
}
