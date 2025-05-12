# Базовый этап сборки
FROM silt7/node-base:20 AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat && \
    npm set fetch-retries 5 && \
    npm set fetch-retry-mintimeout 20000 && \
    npm set fetch-retry-maxtimeout 120000

COPY package*.json ./
RUN npm install --legacy-peer-deps --verbose

COPY . .
RUN npm run build

# Финальный этап
FROM silt7/node-base:20 AS runner
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/config-overrides.js ./config-overrides.js

EXPOSE 3000
CMD ["npm", "start"]