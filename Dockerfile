# Базовый этап сборки
FROM silt7/node-base:20 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Финальный этап
FROM silt7/node-base:20 AS base
WORKDIR /app

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