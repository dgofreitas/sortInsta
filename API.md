# 📡 API Documentation - SortInsta

Base URL: `http://localhost:5000/api`

---

## 🔐 Autenticação

### Iniciar Login com Google
```
GET /auth/google
```

**Descrição:** Redireciona para página de login do Google

**Resposta:** Redirect para Google OAuth

---

### Callback Google
```
GET /auth/google/callback
```

**Descrição:** Callback após autenticação Google

**Resposta:** Redirect para frontend com token em cookie

---

### Iniciar Login com Facebook
```
GET /auth/facebook
```

**Descrição:** Redireciona para página de login do Facebook

---

### Callback Facebook
```
GET /auth/facebook/callback
```

**Descrição:** Callback após autenticação Facebook

---

### Iniciar Login com Instagram
```
GET /auth/instagram
```

**Descrição:** Redireciona para página de login do Instagram (via Facebook)

---

### Callback Instagram
```
GET /auth/instagram/callback
```

**Descrição:** Callback após autenticação Instagram

---

### Obter Usuário Atual
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```
ou cookie `token`

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "João Silva",
    "provider": "google",
    "providerId": "123456789",
    "profilePicture": "https://...",
    "lastLogin": "2025-11-11T10:00:00.000Z",
    "createdAt": "2025-11-01T10:00:00.000Z"
  }
}
```

**Resposta Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Não autenticado"
  }
}
```

---

### Logout
```
POST /auth/logout
```

**Resposta Success (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 📸 Instagram

### Listar Posts
```
GET /instagram/posts?limit=25
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional): Número de posts (default: 25, max: 100)

**Resposta Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "17841234567890123",
      "caption": "Meu post incrível!",
      "media_type": "IMAGE",
      "media_url": "https://...",
      "permalink": "https://instagram.com/p/...",
      "timestamp": "2025-11-11T10:00:00+0000",
      "like_count": 150,
      "comments_count": 45
    }
  ]
}
```

---

### Obter Post Específico
```
GET /instagram/posts/:postId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "17841234567890123",
    "caption": "Meu post incrível!",
    "media_type": "IMAGE",
    "media_url": "https://...",
    "permalink": "https://instagram.com/p/...",
    "timestamp": "2025-11-11T10:00:00+0000",
    "like_count": 150,
    "comments_count": 45
  }
}
```

---

### Obter Comentários de um Post
```
GET /instagram/posts/:postId/comments
```

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "totalComments": 45,
    "uniqueParticipants": 38,
    "comments": [
      {
        "id": "17851234567890123",
        "text": "Quero participar!",
        "username": "usuario123",
        "timestamp": "2025-11-11T10:05:00+0000",
        "like_count": 5,
        "from": {
          "id": "123456789",
          "username": "usuario123"
        }
      }
    ],
    "participants": [
      {
        "username": "usuario123",
        "userId": "123456789",
        "commentCount": 2,
        "comments": [
          {
            "text": "Quero participar!",
            "timestamp": "2025-11-11T10:05:00+0000"
          },
          {
            "text": "Participando de novo!",
            "timestamp": "2025-11-11T11:00:00+0000"
          }
        ]
      }
    ]
  }
}
```

---

### Configurar Conta de Negócios
```
POST /instagram/business-account
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "facebookPageId": "123456789"
}
```

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "instagramBusinessAccountId": "17841234567890123"
  }
}
```

---

## 🎲 Sorteios

### Criar e Executar Sorteio
```
POST /raffle
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "postId": "17841234567890123",
  "numberOfWinners": 3,
  "multipleEntries": false,
  "criteria": {
    "minCommentLength": 10,
    "requiredWords": ["participo"],
    "excludeWords": ["spam"],
    "minLikes": 0
  }
}
```

**Body Parameters:**
- `postId` (required): ID do post do Instagram
- `numberOfWinners` (required): Número de vencedores (min: 1)
- `multipleEntries` (optional): Permitir múltiplas entradas (default: false)
- `criteria` (optional): Critérios de validação
  - `minCommentLength`: Tamanho mínimo do comentário
  - `requiredWords`: Array de palavras obrigatórias
  - `excludeWords`: Array de palavras proibidas
  - `minLikes`: Número mínimo de likes no comentário

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "raffle": {
      "id": "507f1f77bcf86cd799439011",
      "postId": "17841234567890123",
      "postUrl": "https://instagram.com/p/...",
      "postImage": "https://...",
      "numberOfWinners": 3,
      "completedAt": "2025-11-11T10:00:00.000Z"
    },
    "winners": [
      {
        "position": 1,
        "username": "vencedor1",
        "userId": "123456789",
        "comment": "Quero participar!",
        "timestamp": "2025-11-11T10:05:00+0000",
        "totalComments": 2
      },
      {
        "position": 2,
        "username": "vencedor2",
        "userId": "987654321",
        "comment": "Participando!",
        "timestamp": "2025-11-11T10:10:00+0000",
        "totalComments": 1
      }
    ],
    "statistics": {
      "totalParticipants": 38,
      "totalComments": 45,
      "totalWinners": 3,
      "averageCommentsPerParticipant": "1.18",
      "mostActiveParticipant": {
        "username": "usuario_ativo",
        "comments": 5
      }
    }
  }
}
```

**Resposta Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Dados inválidos",
    "details": [
      {
        "field": "numberOfWinners",
        "message": "Número de vencedores deve ser no mínimo 1"
      }
    ]
  }
}
```

---

### Listar Sorteios
```
GET /raffle?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10, max: 50)

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "raffles": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "postId": "17841234567890123",
        "postUrl": "https://instagram.com/p/...",
        "postCaption": "Meu post incrível!",
        "postImage": "https://...",
        "numberOfWinners": 3,
        "totalComments": 45,
        "uniqueParticipants": 38,
        "winners": [
          {
            "username": "vencedor1",
            "userId": "123456789"
          }
        ],
        "status": "completed",
        "completedAt": "2025-11-11T10:00:00.000Z",
        "createdAt": "2025-11-11T09:55:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### Obter Sorteio Específico
```
GET /raffle/:id
```

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439011",
    "postId": "17841234567890123",
    "postUrl": "https://instagram.com/p/...",
    "postCaption": "Meu post incrível!",
    "postImage": "https://...",
    "numberOfWinners": 3,
    "totalComments": 45,
    "uniqueParticipants": 38,
    "winners": [
      {
        "username": "vencedor1",
        "userId": "123456789",
        "comment": "Quero participar!",
        "timestamp": "2025-11-11T10:05:00+0000"
      }
    ],
    "allParticipants": [
      {
        "username": "usuario1",
        "userId": "123456789",
        "commentCount": 2
      }
    ],
    "status": "completed",
    "completedAt": "2025-11-11T10:00:00.000Z",
    "createdAt": "2025-11-11T09:55:00.000Z"
  }
}
```

---

### Deletar Sorteio
```
DELETE /raffle/:id
```

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta Success (200):**
```json
{
  "success": true,
  "message": "Sorteio deletado com sucesso"
}
```

**Resposta Error (404):**
```json
{
  "success": false,
  "error": {
    "message": "Sorteio não encontrado"
  }
}
```

---

## 🏥 Health Check

### Verificar Status da API
```
GET /health
```

**Resposta Success (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-11-11T10:00:00.000Z"
}
```

---

## 🔢 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Não encontrado |
| 429 | Muitas requisições |
| 500 | Erro interno do servidor |

---

## 🔒 Segurança

### Rate Limiting

- **Janela:** 15 minutos
- **Máximo:** 100 requisições
- **Header de resposta quando limitado:**
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1699704600
  ```

### CORS

Apenas o frontend configurado em `FRONTEND_URL` pode acessar a API.

### Headers de Segurança (Helmet)

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (em produção)

---

## 📝 Exemplos de Uso

### JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Login
window.location.href = 'http://localhost:5000/api/auth/google';

// Obter posts
const posts = await api.get('/instagram/posts?limit=25');

// Criar sorteio
const raffle = await api.post('/raffle', {
  postId: '17841234567890123',
  numberOfWinners: 3,
  multipleEntries: false,
});
```

### cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Obter usuário (com token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/auth/me

# Criar sorteio
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"postId":"17841234567890123","numberOfWinners":3}' \
     http://localhost:5000/api/raffle
```

---

## 🐛 Debugging

### Ativar logs detalhados

```env
NODE_ENV=development
```

### Ver logs em tempo real

```bash
tail -f logs/combined.log
```

---

## 📞 Suporte

Para problemas com a API, abra uma issue no GitHub.

---

*Documentação atualizada em: 11 de novembro de 2025*
