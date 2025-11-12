# FAQ - Perguntas Frequentes

## 🤔 Perguntas Gerais

### O que é o SortInsta?

O SortInsta é uma aplicação web que permite realizar sorteios justos e transparentes de comentários do Instagram. É perfeito para influenciadores, empresas e criadores de conteúdo que desejam fazer giveaways.

### É gratuito?

Sim! O SortInsta é totalmente gratuito e open-source.

### É seguro?

Sim! Usamos OAuth 2.0 para autenticação, não armazenamos senhas, e todos os dados são criptografados. Nunca solicitamos informações sensíveis.

### Posso usar para sorteios comerciais?

Sim, mas certifique-se de seguir os Termos de Serviço do Instagram e as leis locais sobre sorteios e promoções.

---

## 🔐 Autenticação

### Por que preciso fazer login?

Para acessar seus posts e comentários do Instagram de forma segura através da API oficial.

### Quais dados vocês coletam?

Apenas: nome, email, foto de perfil e token de acesso temporário para a API do Instagram. Não armazenamos senhas.

### Como desconectar minha conta?

Faça logout no app e revogue o acesso em:
- Google: https://myaccount.google.com/permissions
- Facebook/Instagram: https://www.facebook.com/settings?tab=applications

### Por que localhost funciona para OAuth?

Durante o desenvolvimento, você pode usar `http://localhost:5000` nos callbacks OAuth. Isso funciona porque:

1. **Fluxo OAuth:** Você clica em "Login" → seu navegador acessa Meta/Google → você faz login → Meta/Google redireciona **seu navegador** de volta para localhost
2. **Quem acessa localhost:** É o **seu navegador** (no seu computador) que acessa o localhost, não os servidores da Meta/Google
3. **Redirecionamento:** A Meta apenas envia um comando HTTP para o navegador redirecionar (HTTP 302), não acessa seu localhost diretamente

**⚠️ Em produção:** Você DEVE usar URLs públicas com HTTPS:
- ✅ `https://seu-dominio.com/api/auth/facebook/callback`
- ❌ `http://localhost:5000/...` (não funcionará quando deployado)

---

## 📱 Instagram

### Preciso de uma conta de negócios?

Sim, para acessar a API do Instagram Graph é necessário ter uma conta de negócios vinculada a uma página do Facebook.

### Como converter minha conta para negócios?

1. Vá para Configurações > Conta
2. Selecione "Mudar para conta profissional"
3. Escolha "Negócios"
4. Vincule a uma página do Facebook

### Por que não vejo meus posts?

Possíveis razões:
- Conta não é de negócios
- Conta não está vinculada a uma página do Facebook
- Permissões da API não foram concedidas
- Token de acesso expirou (refaça o login)

### Posso usar com conta pessoal?

Não diretamente. A API do Instagram requer conta de negócios. Use as opções de login com Google ou Facebook para funcionalidades limitadas.

---

## 🎲 Sorteios

### Como funciona o algoritmo de sorteio?

Usamos o algoritmo Fisher-Yates, um método matematicamente comprovado como justo e aleatório.

### Um usuário pode ganhar duas vezes?

Depende da configuração:
- **Modo Padrão**: Cada usuário único = 1 entrada (não pode ganhar 2x)
- **Múltiplas Entradas**: Cada comentário = 1 entrada (pode ganhar múltiplas vezes)

### Comentários deletados são contados?

Não. Apenas comentários que ainda existem no momento do sorteio são considerados.

### Posso filtrar participantes?

Sim! Você pode:
- Definir número mínimo de caracteres
- Exigir palavras específicas
- Excluir palavras proibidas
- Filtrar por número mínimo de likes

### Respostas a comentários contam?

Atualmente, apenas comentários principais são considerados. Respostas não são incluídas.

---

## 🔧 Problemas Técnicos

### "Erro ao carregar posts"

**Soluções:**
1. Verifique se é uma conta de negócios
2. Refaça o login
3. Verifique permissões da API
4. Aguarde alguns minutos e tente novamente

### "Token inválido ou expirado"

**Solução:** Faça logout e login novamente. Tokens expiram após alguns dias.

### "Conta de negócios não vinculada"

**Solução:** Configure sua conta:
1. Crie uma página no Facebook
2. Vincule sua conta do Instagram à página
3. Use o endpoint de configuração no app

### "Nenhum comentário encontrado"

**Possíveis causas:**
- Post realmente não tem comentários
- Comentários foram deletados
- Permissões da API não incluem leitura de comentários
- Post é muito antigo (API limita posts antigos)

### "Erro ao realizar sorteio"

**Soluções:**
1. Verifique sua conexão com internet
2. Recarregue a página
3. Verifique se há comentários válidos
4. Tente com um número menor de vencedores

---

## 💾 Dados e Privacidade

### Onde os dados são armazenados?

Em um banco de dados MongoDB seguro. Apenas resultados de sorteios são salvos.

### Quanto tempo os dados ficam armazenados?

Permanentemente, mas você pode deletar seus sorteios a qualquer momento no histórico.

### Posso exportar meus dados?

Sim! Use o botão "Baixar" na tela de resultado para exportar como texto.

### O que acontece se eu deletar minha conta?

Todos os seus sorteios serão removidos permanentemente.

---

## 🌐 Compatibilidade

### Quais navegadores são suportados?

- Chrome/Edge (recomendado)
- Firefox
- Safari
- Opera

Versões modernas (últimos 2 anos).

### Funciona em celular?

Sim! O SortInsta é totalmente responsivo e funciona como PWA (Progressive Web App).

### Posso instalar como app?

Sim! No Chrome/Edge, clique no ícone de instalação na barra de endereços.

### Funciona offline?

Parcialmente. A interface carrega offline, mas funcionalidades que requerem API (login, buscar posts, etc.) precisam de internet.

---

## 🚀 Performance

### Quantos comentários o sistema suporta?

Até 10.000 comentários por post. Posts com mais comentários serão truncados.

### Quanto tempo demora um sorteio?

- Posts pequenos (<100 comentários): ~2-5 segundos
- Posts médios (100-1000): ~10-20 segundos
- Posts grandes (1000+): ~30-60 segundos

### Por que demora tanto?

A API do Instagram tem rate limits. Precisamos fazer múltiplas requisições para posts com muitos comentários.

---

## 💰 Monetização

### Tem planos pagos?

Atualmente não. O projeto é totalmente gratuito.

### Posso usar comercialmente?

Sim, mas siga a licença MIT e os Termos do Instagram.

### Aceitam doações?

Agradeceríamos! (Adicione seu link de doação aqui)

---

## 🛠️ Desenvolvimento

### Como contribuir?

Veja CONTRIBUTING.md para detalhes.

### Encontrei um bug, o que faço?

Abra uma issue no GitHub com:
- Descrição do problema
- Passos para reproduzir
- Screenshots
- Console logs (F12 no navegador)

### Posso fazer um fork?

Sim! O projeto é open-source (MIT License).

### Como rodar localmente?

Veja QUICKSTART.md para instruções detalhadas.

---

## 📞 Suporte

### Como obter ajuda?

1. Consulte esta FAQ
2. Leia a documentação (README.md)
3. Abra uma issue no GitHub
4. Entre em contato (adicione seus contatos)

### Horário de suporte?

Este é um projeto open-source mantido por voluntários. Respondemos quando possível.

### Tem Discord/Telegram?

(Adicione seus links de comunidade aqui)

---

## 🔮 Futuro

### Quais features estão planejadas?

Veja CHANGELOG.md para o roadmap completo. Highlights:
- Filtros avançados
- Múltiplos posts simultâneos
- Integração com Twitter
- Dashboard de analytics
- Tema dark

### Quando sairá a versão X?

Não temos datas fixas. Contribuições aceleram o desenvolvimento!

### Posso sugerir features?

Sim! Abra uma issue com sua sugestão.

---

## 📜 Legal

### Qual a licença?

MIT License - veja LICENSE para detalhes.

### Posso usar para fins comerciais?

Sim, mas siga a licença e os Termos do Instagram.

### Isso viola os Termos do Instagram?

Não. Usamos apenas APIs oficiais com autenticação adequada.

---

**Não encontrou sua resposta? Abra uma issue!**
