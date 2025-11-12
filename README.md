# 🎉 SortInsta - Sorteador de Instagram

Sistema completo para realizar sorteios de comentários do Instagram de forma justa, transparente e segura.

## 📋 Características

- ✅ Autenticação via OAuth (Google, Facebook, Instagram)
- ✅ Integração completa com a API do Instagram Graph
- ✅ Sorteios aleatórios e justos com algoritmo Fisher-Yates
- ✅ Interface moderna e responsiva (PWA)
- ✅ Histórico de sorteios
- ✅ Compartilhamento de resultados
- ✅ Download de resultados
- ✅ Suporte a múltiplas entradas por participante
- ✅ Estatísticas detalhadas
- ✅ Segurança com JWT e proteção de dados

## 🏗️ Arquitetura

### Backend
- **Node.js** + **Express.js**
- **MongoDB** para persistência de dados
- **Passport.js** para autenticação OAuth
- **JWT** para gerenciamento de sessões
- **Winston** para logging
- **Helmet** e **CORS** para segurança

### Frontend
- **React 18** com hooks
- **Vite** para build otimizado
- **React Router** para navegação
- **Zustand** para gerenciamento de estado
- **PWA** com service workers
- **Framer Motion** para animações

## 📁 Estrutura do Projeto

```
sortInsta/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── passport.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Raffle.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── instagram.routes.js
│   │   │   └── raffle.routes.js
│   │   ├── services/
│   │   │   ├── instagram.service.js
│   │   │   └── raffle.service.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── pwa-192x192.png
│   │   └── pwa-512x512.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SelectPost.jsx
│   │   │   ├── ConfigureRaffle.jsx
│   │   │   ├── RaffleResult.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── instagram.service.js
│   │   │   └── raffle.service.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── raffleStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ e Yarn
- MongoDB 6+
- Conta no [Facebook Developers](https://developers.facebook.com/)
- Conta no [Google Cloud Console](https://console.cloud.google.com/)

### 1. Configurar Aplicativo Facebook/Instagram

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo aplicativo
3. Adicione os produtos:
   - **Facebook Login**
   - **Instagram Basic Display**
   - **Instagram Graph API**
4. Configure os URLs de redirecionamento:
   
   **⚠️ IMPORTANTE - Desenvolvimento Local:**
   - ✅ `http://localhost:5000/api/auth/facebook/callback`
   - ✅ `http://localhost:5000/api/auth/instagram/callback`
   
   **Nota:** A Meta permite `localhost` APENAS para desenvolvimento e testes. Para testar localmente:
   - O navegador redireciona você para a Meta → você faz login → a Meta redireciona de volta para seu `localhost`
   - Isso funciona porque é o **seu navegador** que acessa o localhost, não os servidores da Meta
   - A Meta nunca precisa "acessar" seu localhost diretamente
   
   **📌 Para Produção:**
   - Use URLs públicas como: `https://seu-dominio.com/api/auth/facebook/callback`
   - HTTPS é obrigatório em produção
   
5. Anote o **App ID** e **App Secret**

### 2. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google+ API**
4. Crie credenciais OAuth 2.0
5. Configure a URL de redirecionamento:
   
   **⚠️ Desenvolvimento:**
   - ✅ `http://localhost:5000/api/auth/google/callback`
   
   **📌 Produção:**
   - `https://seu-dominio.com/api/auth/google/callback`
   
6. Anote o **Client ID** e **Client Secret**

### 3. Instalar Backend

```bash
cd backend
yarn install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

Configurar `.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb://localhost:27017/sortinsta

JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRE=7d

SESSION_SECRET=seu_session_secret_super_seguro

GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=seu_facebook_app_id
FACEBOOK_APP_SECRET=seu_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

INSTAGRAM_APP_ID=seu_instagram_app_id
INSTAGRAM_APP_SECRET=seu_instagram_app_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Instalar Frontend

```bash
cd frontend
yarn install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Editar .env
nano .env
```

Configurar `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SortInsta
VITE_APP_DESCRIPTION=Sorteador de Instagram
```

### 5. Iniciar MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Ou com Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 6. Iniciar Aplicação

**Backend:**
```bash
cd backend
yarn dev
```

**Frontend:**
```bash
cd frontend
yarn dev
```

Acesse: http://localhost:3000

## 📱 Build para Produção

### Backend

```bash
cd backend
yarn start
```

### Frontend

```bash
cd frontend
yarn build
yarn preview
```

## 🔒 Segurança

- ✅ OAuth 2.0 para autenticação
- ✅ JWT para gerenciamento de sessões
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Sanitização de entrada
- ✅ Variáveis de ambiente para credenciais
- ✅ HTTPS recomendado para produção

## 🎯 Funcionalidades Principais

### 1. Autenticação
- Login com Google, Facebook ou Instagram
- Sessões seguras com JWT
- Refresh automático de tokens

### 2. Sorteios
- Seleção de posts do Instagram
- Configuração de número de vencedores
- Opção de múltiplas entradas
- Sorteio justo com algoritmo Fisher-Yates
- Validação de participantes

### 3. Resultados
- Visualização de vencedores
- Estatísticas detalhadas
- Compartilhamento social
- Download de resultados
- Animações e confetes

### 4. Histórico
- Lista de todos os sorteios
- Filtros e paginação
- Detalhes completos
- Exclusão de sorteios

## 🧪 Testando a Aplicação

1. Faça login com uma das opções (Google, Facebook, Instagram)
2. Configure sua conta de negócios do Instagram (necessário para acessar posts)
3. Clique em "Novo Sorteio"
4. Selecione um post com comentários
5. Configure o número de vencedores
6. Clique em "Realizar Sorteio"
7. Veja os resultados e compartilhe!

## 🔧 Troubleshooting

### Erro: "Conta de negócios do Instagram não vinculada"
- Certifique-se de que sua conta do Instagram é uma conta de negócios
- Vincule sua conta de negócios a uma página do Facebook
- Use o endpoint `/api/instagram/business-account` para configurar

### Erro: "Token de acesso inválido"
- Refaça o login
- Verifique se as permissões do app estão corretas
- Confirme que o app está em modo de produção (não desenvolvimento)

### Erro ao conectar ao MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env`
- Teste a conexão: `mongosh mongodb://localhost:27017`

## 🚀 Deploy

### Backend (Heroku, Railway, etc.)

1. Configure as variáveis de ambiente
2. Configure o MongoDB (Atlas recomendado)
3. Atualize os URLs de callback OAuth
4. Deploy:

```bash
git push heroku main
```

### Frontend (Vercel, Netlify, etc.)

1. Configure as variáveis de ambiente
2. Build do projeto:

```bash
yarn build
```

3. Deploy da pasta `dist`

## 📄 API Endpoints

### Autenticação
- `GET /api/auth/google` - Login com Google
- `GET /api/auth/facebook` - Login com Facebook
- `GET /api/auth/instagram` - Login com Instagram
- `GET /api/auth/me` - Dados do usuário atual
- `POST /api/auth/logout` - Logout

### Instagram
- `GET /api/instagram/posts` - Listar posts
- `GET /api/instagram/posts/:id` - Detalhes do post
- `GET /api/instagram/posts/:id/comments` - Comentários do post
- `POST /api/instagram/business-account` - Configurar conta de negócios

### Sorteios
- `POST /api/raffle` - Criar sorteio
- `GET /api/raffle` - Listar sorteios
- `GET /api/raffle/:id` - Detalhes do sorteio
- `DELETE /api/raffle/:id` - Deletar sorteio

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar sorteios justos no Instagram.

## 🙏 Agradecimentos

- Facebook Graph API
- Instagram Basic Display API
- Comunidade React
- Todos os contribuidores

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

**Nota:** Este projeto é para fins educacionais e de demonstração. Certifique-se de seguir os Termos de Serviço do Instagram e Facebook ao usar suas APIs.
