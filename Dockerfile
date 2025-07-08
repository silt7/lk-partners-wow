FROM node:20.11.1-alpine AS base
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Устанавливаем зависимости для сервера
RUN npm install express http-proxy-middleware

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]