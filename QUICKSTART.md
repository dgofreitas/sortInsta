# Guia de Início Rápido - SortInsta

## 🚀 Começando em 5 minutos

### 1. Clone e Instale

```bash
# Clone o repositório (ou extraia os arquivos)
cd sortInsta

# Instale as dependências do backend
cd backend
yarn install

# Instale as dependências do frontend
cd ../frontend
yarn install
```

### 2. Configure o MongoDB

**Opção A - Docker (Recomendado):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Opção B - Instalação Local:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Mac
brew install mongodb-community
```

### 3. Configure as Credenciais OAuth

#### Google OAuth:

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto
3. Navegue para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copie o Client ID e Client Secret

#### Facebook/Instagram OAuth:

1. Acesse: https://developers.facebook.com/
2. Clique em "My Apps" > "Create App"
3. Escolha "Consumer" como tipo de app
4. Adicione os produtos:
   - Facebook Login
   - Instagram Basic Display
5. Configure:
   - Valid OAuth Redirect URIs: `http://localhost:5000/api/auth/facebook/callback`
   - Instagram Redirect URIs: `http://localhost:5000/api/auth/instagram/callback`
6. Copie o App ID e App Secret

### 4. Configure as Variáveis de Ambiente

**Backend (.env):**
```bash
cd backend
cp .env.example .env
nano .env  # ou use seu editor preferido
```

Preencha com suas credenciais:
```env
# Básico
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sortinsta

# Segurança (gere strings aleatórias seguras)
JWT_SECRET=cole_uma_string_aleatoria_muito_longa_aqui
SESSION_SECRET=cole_outra_string_aleatoria_muito_longa_aqui

# Google OAuth (cole suas credenciais)
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_google_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth (cole suas credenciais)
FACEBOOK_APP_ID=seu_facebook_app_id_aqui
FACEBOOK_APP_SECRET=seu_facebook_app_secret_aqui
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Instagram OAuth (mesmas credenciais do Facebook)
INSTAGRAM_APP_ID=seu_facebook_app_id_aqui
INSTAGRAM_APP_SECRET=seu_facebook_app_secret_aqui
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env
nano .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SortInsta
VITE_APP_DESCRIPTION=Sorteador de Instagram
```

### 5. Inicie a Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
yarn dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn dev
```

### 6. Acesse a Aplicação

Abra seu navegador em: http://localhost:3000

## ✅ Checklist de Verificação

- [ ] MongoDB está rodando
- [ ] Backend iniciou sem erros (porta 5000)
- [ ] Frontend iniciou sem erros (porta 3000)
- [ ] Consegue acessar http://localhost:3000
- [ ] Página de login está carregando
- [ ] Botões de login estão visíveis
- [ ] Yarn está instalado (yarn --version)

## 🔍 Testando o Login

### Teste com Google:
1. Clique em "Continuar com Google"
2. Selecione sua conta Google
3. Autorize as permissões
4. Você será redirecionado para o Dashboard

### Teste com Instagram:
1. Clique em "Continuar com Instagram"
2. Faça login na sua conta do Instagram
3. **Importante:** Use uma conta de negócios do Instagram
4. Autorize as permissões
5. Você será redirecionado para o Dashboard

## 🎯 Realizando Seu Primeiro Sorteio

1. **Configurar Conta de Negócios:**
   - Se usar Instagram, certifique-se de ter uma conta de negócios
   - Vincule sua conta a uma página do Facebook
   - Isso é necessário para acessar a API do Instagram

2. **Selecionar um Post:**
   - Clique em "Novo Sorteio"
   - Selecione um post que tenha comentários
   - Clique em "Continuar"

3. **Configurar o Sorteio:**
   - Defina o número de vencedores
   - Escolha se permite múltiplas entradas
   - Clique em "Realizar Sorteio"

4. **Ver Resultado:**
   - Veja os vencedores com animação
   - Compartilhe o resultado
   - Baixe como arquivo de texto

## 🐛 Problemas Comuns

### "Erro ao conectar ao MongoDB"
```bash
# Verifique se o MongoDB está rodando
sudo systemctl status mongod

# Ou inicie o MongoDB
sudo systemctl start mongod

# Com Docker
docker ps | grep mongodb
docker start mongodb
```

### "Token inválido ou expirado"
- Faça logout e login novamente
- Limpe os cookies do navegador
- Verifique se as credenciais OAuth estão corretas

### "Conta de negócios não vinculada"
- Sua conta do Instagram deve ser uma conta de negócios
- Vincule a conta a uma página do Facebook
- Tutorial: https://help.instagram.com/502981923235522

### Porta já em uso
```bash
# Matar processo na porta 5000
lsof -ti:5000 | xargs kill -9

# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

## 📚 Próximos Passos

1. **Explore as funcionalidades:**
   - Realize vários sorteios
   - Teste diferentes configurações
   - Veja o histórico

2. **Customize o projeto:**
   - Altere cores e estilos
   - Adicione novos recursos
   - Melhore a interface

3. **Deploy para produção:**
   - Configure HTTPS
   - Use MongoDB Atlas
   - Deploy no Heroku/Vercel

## 🆘 Precisa de Ajuda?

- Consulte o README.md completo
- Verifique os logs do console
- Abra uma issue no GitHub

## 🎉 Pronto!

Você agora tem um sorteador de Instagram totalmente funcional!
