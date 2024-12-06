# Базовый образ с Node.js для сборки приложения
FROM node:18 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Используем базовый образ Nginx для раздачи собранного приложения
FROM nginx:alpine

# Копируем собранное приложение в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем файл конфигурации Nginx, если нужно (опционально)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт, на котором работает Nginx
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
