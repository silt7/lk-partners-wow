# Базовый этап сборки
FROM node:20.11.1-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Финальный этап
FROM node:20.11.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем non-root пользователя
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/build ./build
COPY --from=base /app/public ./public
COPY --from=base /app/src ./src
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/config-overrides.js ./config-overrides.js
EXPOSE 3000

CMD ["npm", "start"]