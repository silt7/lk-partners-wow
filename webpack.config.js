const path = require("path");

module.exports = {
  // Остальные настройки Webpack
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"], // Указываем папку src и node_modules
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Поддерживаемые расширения
  },
};
