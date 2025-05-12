FROM node:16-alpine

WORKDIR /app

ENV NPM_CONFIG_FETCH_TIMEOUT=120000

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]