# 📦 1. Этап сборки
FROM node:16-alpine AS builder

WORKDIR /app

# Увеличиваем таймауты и оставляем dev-зависимости
ENV NPM_CONFIG_FETCH_TIMEOUT=120000

# Копируем lock-файл и устанавливаем ВСЕ зависимости (включая dev)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Копируем код и собираем
COPY . .
RUN npm run build


# 🚀 2. Этап рантайма
FROM node:16-alpine AS runner

WORKDIR /app

# Устанавливаем только прод-зависимости
ENV NODE_ENV=production
ENV NPM_CONFIG_FETCH_TIMEOUT=120000

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Копируем только нужное из builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Порт (если Express, то нужно слушать 0.0.0.0)
EXPOSE 3000

# Если у тебя есть сервер — запускай его
# Если просто статик — можно заменить на serve
CMD ["npm", "start"]