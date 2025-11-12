# 🛠️ Comandos Úteis - SortInsta

## 📦 Instalação

### Instalar tudo de uma vez
```bash
chmod +x install.sh && ./install.sh
```

### Instalar Backend
```bash
cd backend
yarn install
```

### Instalar Frontend
```bash
cd frontend
yarn install
```

---

## 🚀 Inicialização

### Iniciar com Script
```bash
chmod +x start.sh && ./start.sh
```

### Iniciar Backend
```bash
cd backend
yarn dev        # Desenvolvimento
yarn start          # Produção
```

### Iniciar Frontend
```bash
cd frontend
yarn dev        # Desenvolvimento
yarn build      # Build de produção
yarn preview    # Preview do build
```

### Iniciar com Docker
```bash
docker-compose up -d        # Iniciar
docker-compose down         # Parar
docker-compose logs -f      # Ver logs
docker-compose restart      # Reiniciar
```

---

## 🧪 Testes

### Backend
```bash
cd backend
yarn test                    # Rodar todos os testes
yarn test --watch         # Modo watch
yarn test --coverage      # Com coverage
```

### Frontend
```bash
cd frontend
yarn lint               # Verificar lint
yarn lint --fix      # Corrigir automaticamente
```

---

## 🗄️ MongoDB

### Local
```bash
# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl stop mongod

# Acessar MongoDB shell
mongosh
mongosh mongodb://localhost:27017/sortinsta
```

### Docker
```bash
# Iniciar container MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ver status
docker ps | grep mongodb

# Parar
docker stop mongodb

# Remover
docker rm mongodb

# Acessar shell
docker exec -it mongodb mongosh
```

### Comandos MongoDB úteis
```javascript
// No mongosh
use sortinsta
show collections
db.users.find().pretty()
db.raffles.find().pretty()
db.raffles.countDocuments()
db.users.countDocuments()

// Limpar banco
db.raffles.deleteMany({})
db.users.deleteMany({})
```

---

## 🔍 Debug

### Ver logs Backend
```bash
cd backend
tail -f logs/combined.log
tail -f logs/error.log
```

### Ver logs Docker
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
docker-compose logs -f --tail=100 backend
```

### Ver processos rodando
```bash
# Ver porta 5000 (backend)
lsof -i :5000
netstat -tulpn | grep 5000

# Ver porta 3000 (frontend)
lsof -i :3000
netstat -tulpn | grep 3000

# Matar processo
kill -9 <PID>
lsof -ti:5000 | xargs kill -9
```

---

## 🔐 Variáveis de Ambiente

### Gerar secrets seguros
```bash
# Método 1 - Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Método 2 - OpenSSL
openssl rand -hex 64

# Método 3 - Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

### Verificar variáveis
```bash
# Backend
cd backend
cat .env

# Verificar se está carregando
node -e "require('dotenv').config(); console.log(process.env.PORT)"
```

---

## 📦 Build e Deploy

### Build Frontend
```bash
cd frontend
yarn build
ls -lh dist/

# Testar build localmente
yarn preview
```

### Build Docker Images
```bash
# Backend
cd backend
docker build -t sortinsta-backend .

# Frontend
cd frontend
docker build -t sortinsta-frontend .

# Ambos com docker-compose
docker-compose build
```

### Deploy Heroku
```bash
# Backend
cd backend
heroku create sortinsta-backend
git push heroku main
heroku logs --tail

# Configurar variáveis
heroku config:set KEY=value
```

### Deploy Vercel
```bash
cd frontend
vercel
vercel --prod
```

---

## 🧹 Limpeza

### Limpar node_modules
```bash
# Backend
cd backend && rm -rf node_modules && yarn install

# Frontend
cd frontend && rm -rf node_modules && yarn install

# Ambos
rm -rf backend/node_modules frontend/node_modules
cd backend && yarn install
cd ../frontend && yarn install
```

### Limpar builds
```bash
cd frontend
rm -rf dist/

cd backend
rm -rf logs/*.log
```

### Limpar Docker
```bash
docker-compose down -v           # Remove volumes
docker system prune -a           # Limpa tudo
docker volume prune              # Remove volumes órfãos
docker image prune -a            # Remove imagens não usadas
```

---

## 🔧 Manutenção

### Atualizar dependências
```bash
# Backend
cd backend
yarn outdated
yarn upgrade
yarn audit

# Frontend
cd frontend
yarn outdated
yarn upgrade
yarn audit
```

### Verificar vulnerabilidades
```bash
yarn audit
yarn audit --fix
```

### Reinstalar do zero
```bash
# Backend
cd backend
rm -rf node_modules yarn.lock
yarn install

# Frontend
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

---

## 📊 Monitoramento

### Performance Backend
```bash
# Ver uso de memória
node --trace-warnings src/server.js
node --max-old-space-size=4096 src/server.js

# Profiling
node --inspect src/server.js
# Abrir chrome://inspect
```

### Performance Frontend
```bash
# Análise de bundle
cd frontend
yarn build
npx vite-bundle-analyzer
```

---

## 🔄 Git

### Commits semânticos
```bash
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "fix: corrige bug X"
git commit -m "docs: atualiza README"
git commit -m "style: formata código"
git commit -m "refactor: refatora componente Y"
git commit -m "test: adiciona testes"
git commit -m "chore: atualiza dependências"
```

### Branches
```bash
git checkout -b feature/nova-feature
git checkout -b fix/corrige-bug
git push origin feature/nova-feature
```

---

## 🐛 Troubleshooting Rápido

### Porta já em uso
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB não conecta
```bash
# Verificar status
sudo systemctl status mongod

# Iniciar
sudo systemctl start mongod

# Verificar conexão
mongosh --eval "db.serverStatus()"
```

### Módulos não encontrados
```bash
# Limpar cache yarn
yarn cache clean

# Reinstalar
rm -rf node_modules yarn.lock
yarn install
```

### Erro de permissão (Linux/Mac)
```bash
# Scripts
chmod +x install.sh
chmod +x start.sh

# Yarn global (se necessário)
sudo chown -R $(whoami) ~/.yarn
```

---

## 📱 PWA

### Testar PWA localmente
```bash
cd frontend
yarn build
npx serve -s dist

# Ou
yarn preview
```

### Debug Service Worker
```
# Chrome DevTools
Application > Service Workers
Console > Clear site data
```

---

## 💡 Dicas Úteis

### Watch mode em tudo
```bash
# Backend com nodemon
cd backend
yarn dev

# Frontend com Vite HMR
cd frontend
yarn dev

# Testes com watch
yarn test --watch
```

### Ambiente múltiplo
```bash
# Criar múltiplos .env
.env.development
.env.production
.env.test

# Usar
NODE_ENV=production node src/server.js
```

### Aliases úteis (adicionar ao ~/.bashrc ou ~/.zshrc)
```bash
alias si-backend="cd ~/sortInsta/backend && yarn dev"
alias si-frontend="cd ~/sortInsta/frontend && yarn dev"
alias si-mongo="docker start mongodb"
alias si-logs="cd ~/sortInsta/backend && tail -f logs/combined.log"
```

---

## 📞 Comandos de Ajuda

```bash
yarn --help
docker --help
docker-compose --help
mongosh --help
node --help
git --help
```

---

**💡 Dica:** Adicione estes comandos aos seus favoritos para acesso rápido!
