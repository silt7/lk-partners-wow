const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// Проверка обязательных переменных
const baseUrl = process.env.REACT_APP_BASE_URL;
const apiKey = process.env.X_API_KEY;

if (!baseUrl) {
  console.warn(
    "⚠️ Внимание: переменная окружения REACT_APP_BASE_URL не задана! Прокси не будет работать."
  );
}
if (!apiKey) {
  console.warn(
    "⚠️ Внимание: переменная окружения X_API_KEY не задана! Прокси будет работать без ключа."
  );
}

// Прокси для API запросов (только если baseUrl задан)
if (baseUrl) {
  app.use(
    "/restapi",
    createProxyMiddleware({
      target: baseUrl,
      changeOrigin: true,
      headers: {
        ...(apiKey ? { "X-API-Key": apiKey } : {}),
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log("➡️ Прокси запрос:", req.method, req.originalUrl);
      },
      onError: (err, req, res) => {
        console.error("Ошибка прокси:", err);
        res.status(500).send("Ошибка прокси");
      },
    })
  );
}

// Статические файлы React
app.use(express.static(path.join(__dirname, "build")));

// Fallback для SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;

// Обработка ошибок сервера
process.on("uncaughtException", (err) => {
  console.error("Необработанная ошибка:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Необработанное отклонение промиса:", reason);
  process.exit(1);
});

app
  .listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`📁 Статические файлы из: ${path.join(__dirname, "build")}`);
    console.log(`🌐 Прокси API: ${baseUrl || "не настроен"}`);
  })
  .on("error", (err) => {
    console.error("❌ Ошибка запуска сервера:", err);
    process.exit(1);
  });
