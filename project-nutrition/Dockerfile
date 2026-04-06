# Stage 1: Build da aplicacao
FROM node:22-alpine AS build

WORKDIR /app

# Instala dependencias primeiro (camada cacheada)
COPY package.json package-lock.json ./
RUN npm ci

# Variavel de ambiente injetada em build-time pelo Vite
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

# Copia codigo e faz o build
COPY . .
RUN npm run build

# Stage 2: Servir os arquivos estaticos
FROM node:22-alpine

WORKDIR /app

# Instala o serve para servir arquivos estaticos
RUN npm install -g serve

# Copia apenas o build (imagem final leve, sem node_modules de dev)
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
