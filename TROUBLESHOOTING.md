# Устранение проблем с Docker

## Проблема: Контейнер падает и перезапускается

### Причины и решения:

#### 1. Отсутствие переменных окружения

**Проблема**: В логах видны предупреждения о `X_API_KEY` и других переменных.

**Решение**: Запускайте контейнер с переменными окружения:

```bash
docker run -d \
  --name lk-partners-app \
  -p 3000:3000 \
  -e REACT_APP_BASE_URL=http://localhost:8080 \
  -e X_API_KEY=your-api-key \
  -e REACT_APP_CABINET=your-cabinet \
  -e REACT_APP_DOMAIN=your-domain \
  -e REACT_APP_YANDEX_CLIENT_ID=your-client-id \
  -e REACT_APP_YANDEX_CLIENT_URI=http://localhost:3000 \
  -e SECURE_API_KEY=your-secure-key \
  lk-partners-app
```

#### 2. Использование скрипта запуска

Запустите готовый скрипт:

```bash
./docker-run.sh
```

#### 3. Проверка логов

Для диагностики проблем:

```bash
# Просмотр логов контейнера
docker logs lk-partners-app

# Просмотр логов в реальном времени
docker logs -f lk-partners-app

# Проверка статуса контейнера
docker ps -a
```

#### 4. Проверка сборки

Убедитесь, что приложение собирается корректно:

```bash
# Локальная сборка для тестирования
npm run build
```

#### 5. Проверка зависимостей

Убедитесь, что все зависимости установлены:

```bash
npm ci --legacy-peer-deps
```

### Частые ошибки:

1. **"Container is not running, status: restarting"**

   - Проверьте логи: `docker logs lk-partners-app`
   - Убедитесь, что порт 3000 не занят другим процессом

2. **"Cannot find module 'express'"**

   - Пересоберите образ: `docker build -t lk-partners-app .`

3. **"REACT_APP_BASE_URL is not defined"**
   - Передайте переменные окружения при запуске контейнера

### Команды для отладки:

```bash
# Остановка всех контейнеров
docker stop $(docker ps -q)

# Удаление всех контейнеров
docker rm $(docker ps -aq)

# Очистка образов
docker system prune -a

# Пересборка и запуск
docker build -t lk-partners-app .
./docker-run.sh
```
