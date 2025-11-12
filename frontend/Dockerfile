# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar Yarn v1 (clássico) - mais estável para Docker
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# Configurar registry público do Yarn
RUN yarn config set registry https://registry.yarnpkg.com

# Copiar package files
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para o build
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_APP_NAME=SortInsta
ARG VITE_APP_DESCRIPTION=Sorteador de Instagram

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION

# Build da aplicação
RUN yarn build

# Estágio de produção
FROM nginx:alpine

# Copiar build para nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
