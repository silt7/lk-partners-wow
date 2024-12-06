FROM node:20.11.1-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Переходим к финальному этапу
FROM node:20.11.1-alpine AS runner
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]