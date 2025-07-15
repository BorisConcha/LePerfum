# Etapa 1: construir la app Angular
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: servir la app con NGINX
FROM nginx:alpine
COPY --from=build /app/dist/* /usr/share/nginx/html
