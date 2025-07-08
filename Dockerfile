FROM node:20.11.1-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
# Устанавливаем зависимости для сервера
RUN npm install express http-proxy-middleware

# Копируем сервер
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]

# # Финальный этап
# FROM node:20.11.1-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# # Создаем non-root пользователя
# # RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# # USER appuser
# COPY --from=base /app/node_modules ./node_modules
# COPY --from=base /app/build ./build
# COPY --from=base /app/public ./public
# COPY --from=base /app/src ./src
# COPY --from=base /app/package.json ./package.json
# COPY --from=base /app/config-overrides.js ./config-overrides.js
# EXPOSE 3000

# CMD ["npm", "start"]

# FROM node:20.11.1-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --legacy-peer-deps
# COPY . .
# RUN npm run build

# # Финальный образ
# FROM node:20.11.1-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# RUN npm install -g serve

# COPY --from=build /app/build ./build

# EXPOSE 3000

# CMD ["serve", "-s", "build", "-l", "3000"]