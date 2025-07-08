#!/bin/bash

# Скрипт для запуска Docker контейнера с переменными окружения

echo "🐳 Запуск Docker контейнера..."

# Остановка существующих контейнеров
docker stop lk-partners-app 2>/dev/null || true
docker rm lk-partners-app 2>/dev/null || true

# Сборка образа
docker build -t lk-partners-app .

# Запуск контейнера с переменными окружения
docker run -d \
  --name lk-partners-app \
  -p 3000:3000 \
  -e REACT_APP_BASE_URL=http://localhost:8080 \
  -e X_API_KEY=test-api-key \
  -e REACT_APP_CABINET=test-cabinet \
  -e REACT_APP_DOMAIN=localhost \
  -e REACT_APP_YANDEX_CLIENT_ID=test-client-id \
  -e REACT_APP_YANDEX_CLIENT_URI=http://localhost:3000 \
  -e SECURE_API_KEY=test-secure-key \
  lk-partners-app

echo "✅ Контейнер запущен!"
echo "🌐 Приложение доступно по адресу: http://localhost:3000"
echo "📋 Логи контейнера: docker logs lk-partners-app" 