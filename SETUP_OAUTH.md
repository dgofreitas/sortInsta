# 🔑 Guia Rápido: Configurar OAuth para Testes

## ⚠️ Problema Atual

O botão "Continuar com Google" não funciona porque as credenciais OAuth não estão configuradas.

No arquivo `backend/.env`, você tem valores de exemplo:
```env
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

## ✅ Solução Rápida

### Opção 1: Configurar Google OAuth (Recomendado para Teste)

#### Passo 1: Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Criar Projeto"**
3. Nome: `SortInsta Test`
4. Clique em **"Criar"**

#### Passo 2: Configurar OAuth

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** → **"ID do cliente OAuth 2.0"**
3. Se pedir, configure a **Tela de consentimento OAuth**:
   - Tipo: **Externo**
   - Nome do app: `SortInsta`
   - Email de suporte: seu email
   - Domínios autorizados: deixe em branco
   - Salve
4. Volte para criar as credenciais:
   - Tipo de aplicativo: **Aplicativo da Web**
   - Nome: `SortInsta Backend`
   - **URIs de redirecionamento autorizados:**
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Clique em **"Criar"**

#### Passo 3: Copiar Credenciais

Você receberá:
- **ID do cliente**: algo como `123456789-abc.apps.googleusercontent.com`
- **Chave secreta do cliente**: algo como `GOCSPX-aBcDeF123456`

#### Passo 4: Atualizar .env

```bash
# Parar os containers
docker compose down

# Editar o arquivo .env
nano backend/.env
```

Atualize estas linhas:
```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeF123456
```

#### Passo 5: Reiniciar

```bash
# Reconstruir e iniciar
docker compose up -d

# Ver logs
docker compose logs -f backend
```

Agora o botão **"Continuar com Google"** deve funcionar! 🎉

---

## 🔍 Como Verificar se Funcionou

1. Acesse: http://localhost:3000
2. Clique em **"Continuar com Google"**
3. Você será redirecionado para a página de login do Google
4. Após fazer login, voltará para o app autenticado

---

## 📝 Para Configurar Facebook/Instagram (Opcional)

### Obter Credenciais Facebook

1. Acesse: https://developers.facebook.com/
2. Clique em **"Meus Apps"** → **"Criar App"**
3. Escolha: **"Consumidor"**
4. Nome do app: `SortInsta Test`
5. Email de contato: seu email
6. Crie o app

### Adicionar Facebook Login

1. No dashboard do app, clique em **"Adicionar Produto"**
2. Encontre **"Facebook Login"** e clique em **"Configurar"**
3. Escolha **"Web"**
4. URL do site: `http://localhost:3000`
5. Salve

### Configurar URIs de Redirecionamento

1. Menu lateral: **"Facebook Login"** → **"Configurações"**
2. **URIs de redirecionamento OAuth válidos:**
   ```
   http://localhost:5000/api/auth/facebook/callback
   ```
3. Salve as alterações

### Obter Credenciais

1. Menu lateral: **"Configurações"** → **"Básico"**
2. Copie:
   - **ID do App**: `1234567890123456`
   - **Chave Secreta do App**: clique em **"Mostrar"**

### Atualizar .env

```env
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abc123def456...
```

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

✅ Verifique se a URI de redirecionamento no Google/Facebook é EXATAMENTE:
```
http://localhost:5000/api/auth/google/callback
```

### Erro: "invalid_client"

✅ Verifique se copiou corretamente:
- Client ID / App ID
- Client Secret / App Secret

### Botão ainda não funciona

✅ Abra o Console do Navegador (F12) e veja os erros
✅ Verifique os logs do backend:
```bash
docker compose logs backend
```

### MongoDB não conecta

✅ O docker-compose já configura tudo! Mas se der erro, use:
```env
MONGODB_URI=mongodb://mongodb:27017/sortinsta
```
(Note: `mongodb` é o nome do serviço no docker-compose)

---

## 📚 Links Úteis

- Google Cloud Console: https://console.cloud.google.com/
- Facebook Developers: https://developers.facebook.com/
- Instagram Business API: https://developers.facebook.com/docs/instagram-api

---

## 💡 Dica

Para desenvolvimento, você só precisa configurar **Google OAuth** inicialmente. Facebook/Instagram pode ser configurado depois quando for testar a funcionalidade de sorteios do Instagram.
