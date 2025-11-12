# Contribuindo para o SortInsta

Obrigado por considerar contribuir para o SortInsta! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor abra uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. observado
- Screenshots (se aplicável)
- Ambiente (OS, Node version, navegador)

### Sugerindo Melhorias

Sugestões são bem-vindas! Abra uma issue com:

- Descrição clara da feature
- Por que seria útil
- Exemplos de uso (se aplicável)

### Pull Requests

1. **Fork o repositório**

2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/sortInsta.git
   cd sortInsta
   ```

3. **Crie uma branch**
   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/meu-bug-fix
   ```

4. **Faça suas alterações**
   - Siga o estilo de código existente
   - Adicione testes se aplicável
   - Atualize a documentação se necessário

5. **Commit suas mudanças**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

   Use commits semânticos:
   - `feat`: Nova funcionalidade
   - `fix`: Correção de bug
   - `docs`: Mudanças na documentação
   - `style`: Formatação, ponto-e-vírgula, etc
   - `refactor`: Refatoração de código
   - `test`: Adição de testes
   - `chore`: Manutenção

6. **Push para seu fork**
   ```bash
   git push origin feature/minha-feature
   ```

7. **Abra um Pull Request**
   - Descreva suas mudanças
   - Referencie issues relacionadas
   - Aguarde review

## Configuração de Desenvolvimento

```bash
# Instalar dependências
cd backend && yarn install
cd ../frontend && yarn install

# Rodar testes
cd backend && yarn test

# Verificar lint
cd frontend && yarn lint
```

## Estilo de Código

### Backend (JavaScript/Node.js)
- Use ES6+ modules
- 2 espaços para indentação
- Ponto-e-vírgula obrigatório
- Nomes descritivos de variáveis
- Comentários em português

### Frontend (React)
- Componentes funcionais com hooks
- Props destructuring
- 2 espaços para indentação
- CSS em arquivos separados
- Nomes de arquivos em PascalCase para componentes

## Estrutura de Commits

```
tipo(escopo): mensagem curta

Descrição mais detalhada (opcional)

Closes #123
```

Exemplo:
```
feat(raffle): adiciona filtro por número mínimo de likes

Implementa validação de comentários baseada no número
de likes recebidos.

Closes #45
```

## Testes

- Adicione testes para novas funcionalidades
- Mantenha coverage acima de 70%
- Execute `yarn test` antes de commitar

## Documentação

- Atualize README.md se necessário
- Documente novas funcionalidades
- Adicione comentários em código complexo
- Atualize CHANGELOG.md

## Código de Conduta

### Nosso Compromisso

Nos comprometemos a tornar a participação em nosso projeto uma experiência livre de assédio para todos.

### Comportamento Esperado

- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

### Comportamento Inaceitável

- Assédio de qualquer tipo
- Trolling ou comentários insultuosos
- Publicação de informação privada
- Conduta não profissional

### Aplicação

Instâncias de comportamento inaceitável podem ser reportadas contatando a equipe do projeto.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License.

## Dúvidas?

Sinta-se à vontade para abrir uma issue com suas dúvidas!

## Reconhecimentos

Todos os contribuidores serão reconhecidos no README.md!

---

**Obrigado por contribuir! 🚀**
