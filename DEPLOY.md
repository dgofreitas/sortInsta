# Guia de Deploy - SortInsta

## 🚀 Deploy com Docker

### Opção 1: Docker Compose (Recomendado)

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd sortInsta

# 2. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# 3. Inicie todos os serviços
docker-compose up -d

# 4. Verifique os logs
docker-compose logs -f

# 5. Acesse a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Parar os serviços:
```bash
docker-compose down

# Para remover volumes também:
docker-compose down -v
```

---

## 🌐 Deploy no Heroku

### Backend

```bash
# 1. Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Criar aplicação
cd backend
heroku create sortinsta-backend

# 4. Adicionar MongoDB Atlas
heroku addons:create mongolab:sandbox

# 5. Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu_jwt_secret_super_seguro
heroku config:set SESSION_SECRET=seu_session_secret_super_seguro
heroku config:set GOOGLE_CLIENT_ID=seu_google_client_id
heroku config:set GOOGLE_CLIENT_SECRET=seu_google_client_secret
heroku config:set FACEBOOK_APP_ID=seu_facebook_app_id
heroku config:set FACEBOOK_APP_SECRET=seu_facebook_app_secret
heroku config:set FRONTEND_URL=https://seu-frontend.vercel.app

# Atualizar callbacks OAuth:
heroku config:set GOOGLE_CALLBACK_URL=https://sortinsta-backend.herokuapp.com/api/auth/google/callback
heroku config:set FACEBOOK_CALLBACK_URL=https://sortinsta-backend.herokuapp.com/api/auth/facebook/callback
heroku config:set INSTAGRAM_CALLBACK_URL=https://sortinsta-backend.herokuapp.com/api/auth/instagram/callback

# 6. Deploy
git push heroku main

# 7. Verificar logs
heroku logs --tail
```

### Frontend (Vercel)

```bash
# 1. Instalar Vercel CLI
yarn global add vercel

# 2. Login
vercel login

# 3. Deploy
cd frontend
vercel

# 4. Configurar variáveis de ambiente no dashboard Vercel
# VITE_API_URL=https://sortinsta-backend.herokuapp.com/api

# 5. Deploy em produção
vercel --prod
```

---

## 🚀 Deploy no Railway

### Opção Integrada (Backend + MongoDB)

```bash
# 1. Criar conta em railway.app

# 2. Instalar Railway CLI
yarn global add @railway/cli

# 3. Login
railway login

# 4. Inicializar projeto
cd backend
railway init

# 5. Adicionar MongoDB
railway add

# 6. Configurar variáveis de ambiente via dashboard

# 7. Deploy
railway up
```

---

## 💾 MongoDB Atlas (Cloud Database)

### Setup

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um novo cluster (Free Tier)
4. Configure:
   - Database User (username/password)
   - Network Access (0.0.0.0/0 para permitir todos)
5. Obtenha a connection string
6. Substitua no `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sortinsta
   ```

---

## 🔒 Configuração de Produção

### URLs de Callback OAuth

Atualize nos dashboards do Google e Facebook:

**Google Console:**
- https://seu-backend.herokuapp.com/api/auth/google/callback

**Facebook Developers:**
- https://seu-backend.herokuapp.com/api/auth/facebook/callback
- https://seu-backend.herokuapp.com/api/auth/instagram/callback

### Variáveis de Ambiente de Produção

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://seu-frontend.vercel.app
MONGODB_URI=mongodb+srv://...

JWT_SECRET=string_super_segura_gerada_aleatoriamente
SESSION_SECRET=outra_string_super_segura_diferente

# Use as mesmas credenciais OAuth, mas atualize as callback URLs
```

### Gerar Secrets Seguros

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

---

## 📊 Monitoramento

### Logs Backend (Heroku)
```bash
heroku logs --tail --app sortinsta-backend
```

### Logs Backend (Railway)
```bash
railway logs
```

### Logs Docker
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🔄 Atualizações

### Docker
```bash
# Rebuild e restart
docker-compose up -d --build
```

### Heroku
```bash
git add .
git commit -m "Update"
git push heroku main
```

### Vercel
```bash
vercel --prod
```

---

## ✅ Checklist de Deploy

Backend:
- [ ] MongoDB Atlas configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Callbacks OAuth atualizados
- [ ] CORS configurado para frontend
- [ ] HTTPS habilitado
- [ ] Logs funcionando

Frontend:
- [ ] VITE_API_URL apontando para backend
- [ ] Build de produção testado
- [ ] PWA funcionando
- [ ] HTTPS habilitado
- [ ] Cache configurado

Segurança:
- [ ] Secrets aleatórios e seguros
- [ ] Rate limiting ativo
- [ ] Helmet configurado
- [ ] CORS restritivo
- [ ] Variáveis sensíveis não commitadas

---

## 🆘 Troubleshooting de Deploy

### "Application Error" no Heroku
```bash
# Verificar logs
heroku logs --tail

# Verificar buildpack
heroku buildpacks

# Adicionar buildpack Node.js se necessário
heroku buildpacks:set heroku/nodejs
```

### CORS Error
- Verifique se FRONTEND_URL está correto no backend
- Verifique se withCredentials está true no axios
- Adicione o domínio no CORS origins

### OAuth Redirect Error
- Verifique se as callback URLs estão corretas nos dashboards
- Certifique-se de usar HTTPS em produção
- Verifique se o domínio está autorizado

---

## 📞 Suporte

Para problemas específicos de deploy, consulte:
- Heroku: https://devcenter.heroku.com/
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
