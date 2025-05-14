const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer();

const target =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL // Для продакшена
    : process.env.REACT_APP_BASE_URL_DEV; // Для разработки

const apiKey = process.env.X_API_KEY; // Получаем API-ключ

module.exports = function (app) {
  app.use("/restapi", (req, res) => {
    proxy.web(req, res, {
      target: target,
      changeOrigin: true,
      headers: {
        "X-API-Key": apiKey,
      },
    });

    proxy.on("error", (err) => {
      console.error("Ошибка прокси:", err);
      res.status(500).send("Ошибка прокси");
    });
  });
};
