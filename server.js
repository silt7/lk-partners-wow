const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// Прокси для API запросов
app.use(
  "/restapi",
  createProxyMiddleware({
    target: process.env.REACT_APP_BASE_URL,
    changeOrigin: true,
    headers: {
      "X-API-Key": process.env.X_API_KEY,
    },
    onError: (err, req, res) => {
      console.error("Ошибка прокси:", err);
      res.status(500).send("Ошибка прокси");
    },
  })
);

// Статические файлы React
app.use(express.static(path.join(__dirname, "build")));

// Fallback для SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
