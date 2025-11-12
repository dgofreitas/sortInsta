# 🔵 Guia Completo: Configurar Facebook OAuth

## 📋 O que você vai precisar

- Conta no Facebook (pessoal)
- 10-15 minutos
- Acesso ao terminal para reiniciar o Docker

---

## 🚀 Passo a Passo

### 1️⃣ Criar Aplicativo no Facebook Developers

1. **Acesse:** https://developers.facebook.com/
2. **Faça login** com sua conta do Facebook
3. Clique em **"Meus Apps"** (canto superior direito)
4. Clique no botão **"Criar App"**

### 2️⃣ Escolher Tipo de App

Na tela "O que seu app faz?":
- Selecione: **"Consumidor"** (ou "Consumer")
- Clique em **"Avançar"**

### 3️⃣ Informações Básicas do App

Preencha:
- **Nome de exibição do app:** `SortInsta Desenvolvimento`
- **Email de contato do app:** seu-email@exemplo.com
- **Finalidade do app:** Selecione "Você mesmo ou sua própria empresa"

Clique em **"Criar app"**

⚠️ **Importante:** Pode ser solicitada verificação de segurança (CAPTCHA)

### 4️⃣ Adicionar Produto: Facebook Login

1. No **Dashboard do App**, você verá uma lista de produtos
2. Encontre **"Facebook Login"** 
3. Clique em **"Configurar"** ou **"Adicionar produto"**
4. Escolha a plataforma: **"Web"**
5. **URL do site:** `http://localhost:3000`
6. Clique em **"Salvar"** e depois **"Continuar"**
7. Pode pular os próximos passos (Quickstart)

### 5️⃣ Configurar URIs de Redirecionamento OAuth

1. No menu lateral esquerdo, clique em:
   - **"Facebook Login"** → **"Configurações"**

2. Na seção **"URIs de redirecionamento OAuth válidos"**, adicione:
   ```
   http://localhost:5000/api/auth/facebook/callback
   ```

3. **IMPORTANTE:** Role a página e clique em **"Salvar alterações"** (canto inferior direito)

### 6️⃣ Configurar Permissões Básicas

1. No menu lateral, vá em **"Casos de uso do app"**
2. Clique em **"Personalizar"** ao lado de "Autenticação e solicitação de dados de contas"
3. Certifique-se de que estas permissões estão ativas:
   - ✅ `email`
   - ✅ `public_profile`

### 7️⃣ Obter as Credenciais

1. No menu lateral, clique em:
   - **"Configurações"** → **"Básico"**

2. Você verá:
   - **ID do App:** `123456789012345` (copie este número)
   - **Chave Secreta do App:** clique em **"Mostrar"** (pode pedir sua senha do Facebook)

3. **Copie ambos os valores!**

---

## ⚙️ Configurar no SortInsta

### 8️⃣ Atualizar arquivo .env

1. **Pare o Docker:**
   ```bash
   cd ~/sortInsta
   docker compose down
   ```

2. **Edite o arquivo .env:**
   ```bash
   nano backend/.env
   ```

3. **Atualize estas linhas:**
   ```env
   # Facebook OAuth
   FACEBOOK_APP_ID=123456789012345
   FACEBOOK_APP_SECRET=abc123def456ghi789jkl...
   FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
   ```

4. **Salve:**
   - No nano: `Ctrl + O`, `Enter`, `Ctrl + X`

### 9️⃣ Reiniciar o Docker

```bash
docker compose up -d
```

### 🔟 Verificar Logs

```bash
docker compose logs -f backend
```

Procure por mensagens de erro. Deve ver:
```
Servidor rodando na porta 5000 em modo development
MongoDB conectado com sucesso
```

---

## ✅ Testar a Integração

1. **Abra o navegador:** http://localhost:3000

2. **Clique em "Continuar com Facebook"**

3. **O que deve acontecer:**
   - Você é redirecionado para o Facebook
   - O Facebook pede permissão para o app acessar seus dados básicos
   - Você clica em "Continuar como [Seu Nome]"
   - É redirecionado de volta para o SortInsta já autenticado

4. **Se deu certo:** Você verá o Dashboard! 🎉

---

## 🐛 Problemas Comuns e Soluções

### ❌ Erro: "URL bloqueada: O redirecionamento falhou"

**Causa:** URI de redirecionamento não configurada corretamente

**Solução:**
1. Volte para Facebook Developers
2. **Facebook Login → Configurações**
3. Verifique se está EXATAMENTE: `http://localhost:5000/api/auth/facebook/callback`
4. ⚠️ Sem espaços, sem `/` no final, com `http://` (não `https://`)
5. Clique em **"Salvar alterações"**

---

### ❌ Erro: "Invalid OAuth redirect URI"

**Solução:**
- A URI deve começar com `http://localhost` (não `http://127.0.0.1`)
- Certifique-se de salvar as alterações no Facebook Developers

---

### ❌ Erro: "App Not Setup: This app is still in development mode"

**Isso é NORMAL!** Durante desenvolvimento, apenas você (o desenvolvedor) consegue fazer login.

**Para permitir outros usuários testarem:**
1. Facebook Developers → **"Funções do app"**
2. Adicione pessoas como **"Testadores"** ou **"Desenvolvedores"**
3. Eles receberão um convite por email/Facebook

**Para publicar o app (produção):**
- Você precisará preencher mais informações
- Adicionar Política de Privacidade
- Passar por revisão do Facebook (leva alguns dias)

---

### ❌ Botão não faz nada / Não redireciona

**Verificar:**

1. **Console do navegador (F12):**
   ```
   Procure por erros em vermelho
   ```

2. **Logs do backend:**
   ```bash
   docker compose logs backend | grep -i error
   ```

3. **Testar rota manualmente:**
   ```bash
   curl http://localhost:5000/api/auth/facebook
   ```
   
   Deve retornar HTML com redirecionamento para Facebook

4. **Variáveis de ambiente:**
   ```bash
   docker compose exec backend env | grep FACEBOOK
   ```
   
   Verifique se FACEBOOK_APP_ID e FACEBOOK_APP_SECRET estão corretos

---

### ❌ Erro: "Can't Load URL: The domain of this URL isn't included"

**Solução:**
1. Facebook Developers → **"Configurações"** → **"Básico"**
2. Role até **"Domínios do App"**
3. Adicione: `localhost`
4. Salve

---

## 📸 Instagram (Mesmo App do Facebook)

**Boa notícia:** As credenciais do Facebook funcionam para Instagram também!

No seu `.env`, use as **MESMAS credenciais**:

```env
# Instagram OAuth (via Facebook)
INSTAGRAM_APP_ID=123456789012345
INSTAGRAM_APP_SECRET=abc123def456ghi789jkl...
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback
```

**Para ativar Instagram no seu app:**

1. Facebook Developers → Dashboard do seu app
2. Adicione o produto: **"Instagram Basic Display"**
3. Configure a URI de redirecionamento:
   ```
   http://localhost:5000/api/auth/instagram/callback
   ```

⚠️ **Importante:** Para acessar posts e comentários do Instagram, você precisa:
- Conta de negócios no Instagram
- Vincular a uma Página do Facebook
- Usar Instagram Graph API (mais complexo)

---

## 🔒 Segurança

### ⚠️ NUNCA compartilhe sua `FACEBOOK_APP_SECRET`

- Não commite no Git
- Não poste em fóruns/chats
- Se vazou acidentalmente: **regenere a chave** no Facebook Developers

### Para Produção (quando fazer deploy)

1. Altere as URLs de callback:
   ```env
   FACEBOOK_CALLBACK_URL=https://seu-dominio.com/api/auth/facebook/callback
   ```

2. Configure no Facebook Developers:
   - Adicione o domínio em **"Domínios do App"**
   - Atualize os **URIs de redirecionamento OAuth** com HTTPS

3. Mude o app para **"Modo Ativo"** (Live)

---

## 📚 Links Úteis

- **Facebook Developers:** https://developers.facebook.com/
- **Documentação Facebook Login:** https://developers.facebook.com/docs/facebook-login/
- **Guia de Permissões:** https://developers.facebook.com/docs/permissions/reference
- **Status de APIs:** https://developers.facebook.com/status/

---

## ✨ Próximos Passos

Depois de configurar o Facebook OAuth:

1. ✅ Teste o login com Facebook
2. 📝 Configure o Instagram OAuth (opcional, mesmas credenciais)
3. 🎯 Configure uma conta de negócios no Instagram
4. 🎉 Teste criar um sorteio!

---

## 💡 Dica Pro

**Modo Desenvolvimento vs Produção:**

Durante desenvolvimento:
- Use `http://localhost` nos callbacks
- Apenas você consegue fazer login
- Não precisa de Política de Privacidade

Para produção:
- Use `https://seu-dominio.com` nos callbacks
- Precisa publicar o app (revisão do Facebook)
- Obrigatório ter Política de Privacidade pública

---

**🎉 Pronto! Agora você pode fazer login com Facebook no SortInsta!**

Algum problema? Abra uma issue no GitHub ou confira o arquivo `FAQ.md`.
