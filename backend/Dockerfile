# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar Yarn v1 (clássico) - mais estável para Docker
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# Configurar registry público do Yarn
RUN yarn config set registry https://registry.yarnpkg.com

# Copiar package files
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile --production

# Copiar código fonte
COPY . .

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 5000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=5000

# Iniciar aplicação
CMD ["yarn", "start"]
