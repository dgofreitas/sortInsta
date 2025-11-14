import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Rota de registro com email/senha
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nome, email e senha são obrigatórios' },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'A senha deve ter no mínimo 6 caracteres' },
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email já cadastrado' },
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'local',
    });

    // Gerar token
    const token = generateToken(user);

    logger.info(`Novo usuário registrado: ${user.email}`);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      },
    });
  } catch (error) {
    logger.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar conta' },
    });
  }
});

// Rota de login com email/senha
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email e senha são obrigatórios' },
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.provider !== 'local') {
      return res.status(401).json({
        success: false,
        error: { message: 'Email ou senha inválidos' },
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Email ou senha inválidos' },
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token
    const token = generateToken(user);

    logger.info(`Usuário logado: ${user.email}`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      },
    });
  } catch (error) {
    logger.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao fazer login' },
    });
  }
});

// Rota de autenticação Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback Google
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      // Definir cookie com token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      // Redirecionar para o frontend
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?auth=success`);
    } catch (error) {
      logger.error('Erro no callback Google:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?auth=error`);
    }
  }
);

// Rota de autenticação Facebook
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);

// Callback Facebook
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}/dashboard?auth=success`);
    } catch (error) {
      logger.error('Erro no callback Facebook:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?auth=error`);
    }
  }
);

// Rota de autenticação Instagram (via Facebook)
router.get('/instagram',
  passport.authenticate('instagram', {
    scope: [
      'email',
      'public_profile',
      'instagram_basic',
      'pages_show_list',
      'pages_read_engagement',
      'business_management'
    ],
    authType: 'rerequest',
  })
);

// Callback Instagram
router.get(
  '/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}/dashboard?auth=success`);
    } catch (error) {
      logger.error('Erro no callback Instagram:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?auth=error`);
    }
  }
);

// Rota de logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Erro no logout:', err);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro ao fazer logout' },
      });
    }

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  });
});

// Rota para deletar conta e todos os dados
router.delete('/delete-account', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email é obrigatório' },
      });
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    // Deletar histórico de sorteios do usuário
    const Raffle = (await import('../models/Raffle.js')).default;
    await Raffle.deleteMany({ userId: user._id });

    // Deletar usuário
    await User.findByIdAndDelete(user._id);

    logger.info(`Conta deletada: ${email}`);

    // Limpar cookie e sessão
    res.clearCookie('token');
    if (req.session) {
      req.session.destroy();
    }

    res.json({
      success: true,
      message: 'Conta e todos os dados foram excluídos com sucesso',
    });
  } catch (error) {
    logger.error('Erro ao deletar conta:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao excluir conta' },
    });
  }
});

// Endpoint para política de deleção de dados (Meta/Facebook)
// GET: Usado pelo Meta para verificar se a URL existe e está acessível
router.get('/data-deletion-callback', (req, res) => {
  // Retornar uma página HTML simples que explica o processo
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Política de Deleção de Dados - SortInsta</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 { color: #E4405F; }
        .button {
          display: inline-block;
          background: #E4405F;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 20px;
        }
        .button:hover { background: #d12e4a; }
      </style>
    </head>
    <body>
      <h1>Política de Deleção de Dados do Usuário</h1>
      <p>
        Esta página atende aos requisitos de Política de Exclusão de Dados da Plataforma Facebook/Meta.
      </p>
      <h2>Como excluir seus dados</h2>
      <p>
        Para solicitar a exclusão de sua conta e todos os dados associados do SortInsta:
      </p>
      <ol>
        <li>Acesse a página de exclusão de dados</li>
        <li>Insira seu endereço de email</li>
        <li>Confirme a exclusão</li>
        <li>Todos os seus dados serão permanentemente removidos</li>
      </ol>
      <p>
        <strong>O que será excluído:</strong>
      </p>
      <ul>
        <li>Informações de perfil</li>
        <li>Histórico de sorteios</li>
        <li>Tokens de autenticação</li>
        <li>Todas as configurações da conta</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/data-deletion" class="button">
        Ir para Página de Exclusão de Dados
      </a>
      <p style="margin-top: 40px; color: #666; font-size: 14px;">
        Se você tiver dúvidas, entre em contato: privacidade@sortinsta.com
      </p>
    </body>
    </html>
  `);
});

// GET: Política de Privacidade (para Meta)
router.get('/privacy-policy', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Política de Privacidade - SortInsta</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 { color: #E4405F; margin-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .last-updated { color: #666; font-style: italic; margin-bottom: 30px; }
        ul { margin-left: 20px; }
        li { margin-bottom: 8px; }
        a { color: #E4405F; }
      </style>
    </head>
    <body>
      <h1>Política de Privacidade</h1>
      <p class="last-updated">Última atualização: 13 de novembro de 2025</p>

      <h2>1. Informações que Coletamos</h2>
      <p>O SortInsta coleta as seguintes informações:</p>
      <ul>
        <li><strong>Informações de Conta:</strong> Nome, email e senha</li>
        <li><strong>Informações de OAuth:</strong> Nome, email e foto de perfil do Google/Facebook/Instagram</li>
        <li><strong>Dados do Instagram:</strong> Posts públicos e comentários para sorteios</li>
        <li><strong>Dados de Uso:</strong> Sorteios realizados e configurações</li>
      </ul>

      <h2>2. Como Usamos suas Informações</h2>
      <ul>
        <li>Fornecer e operar nosso serviço</li>
        <li>Realizar sorteios de comentários</li>
        <li>Autenticar e gerenciar sua conta</li>
        <li>Melhorar nosso serviço</li>
      </ul>

      <h2>3. Compartilhamento de Informações</h2>
      <p>Não vendemos ou compartilhamos suas informações com terceiros, exceto quando exigido por lei.</p>

      <h2>4. Seus Direitos</h2>
      <ul>
        <li>Acessar suas informações</li>
        <li>Corrigir dados incorretos</li>
        <li>Solicitar exclusão de conta</li>
        <li>Revogar permissões</li>
      </ul>

      <h2>5. Contato</h2>
      <p>Email: privacidade@sortinsta.com</p>

      <p style="margin-top: 40px;">
        <a href="${process.env.FRONTEND_URL}/privacy-policy">Ver versão completa</a>
      </p>
    </body>
    </html>
  `);
});

// GET: Termos de Serviço (para Meta)
router.get('/terms-of-service', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Termos de Serviço - SortInsta</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 { color: #E4405F; margin-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .last-updated { color: #666; font-style: italic; margin-bottom: 30px; }
        ul { margin-left: 20px; }
        li { margin-bottom: 8px; }
        a { color: #E4405F; }
      </style>
    </head>
    <body>
      <h1>Termos de Serviço</h1>
      <p class="last-updated">Última atualização: 13 de novembro de 2025</p>

      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao usar o SortInsta, você concorda com estes Termos de Serviço.
      </p>

      <h2>2. Descrição do Serviço</h2>
      <p>
        O SortInsta permite realizar sorteios de comentários do Instagram de forma aleatória e transparente.
      </p>

      <h2>3. Requisitos de Uso</h2>
      <ul>
        <li>Ter pelo menos 13 anos</li>
        <li>Fornecer informações precisas</li>
        <li>Manter segurança da conta</li>
        <li>Possuir conta Business do Instagram (para funcionalidades completas)</li>
      </ul>

      <h2>4. Conduta do Usuário</h2>
      <p>Você concorda em NÃO:</p>
      <ul>
        <li>Usar para finalidades ilegais</li>
        <li>Interferir no funcionamento</li>
        <li>Violar termos do Instagram/Facebook/Google</li>
        <li>Promover fraudes em sorteios</li>
      </ul>

      <h2>5. Responsabilidade</h2>
      <ul>
        <li>Você é responsável por cumprir leis ao realizar sorteios</li>
        <li>Você define e comunica regras aos participantes</li>
        <li>Você entrega prêmios aos vencedores</li>
      </ul>

      <h2>6. Limitação de Responsabilidade</h2>
      <p>
        O SortInsta não será responsável por danos diretos ou indiretos decorrentes do uso do serviço.
      </p>

      <h2>7. Contato</h2>
      <p>Email: suporte@sortinsta.com</p>

      <p style="margin-top: 40px;">
        <a href="${process.env.FRONTEND_URL}/terms-of-service">Ver versão completa</a>
      </p>
    </body>
    </html>
  `);
});

// POST: Processa callback de deleção do Meta quando o usuário solicita via Facebook
router.post('/data-deletion-callback', async (req, res) => {
  try {
    const { signed_request } = req.body;

    // Se o Meta enviar um signed_request, processar aqui
    if (signed_request) {
      logger.info('Recebido callback de deleção do Meta:', signed_request);

      // TODO: Decodificar signed_request e processar deleção
      // O signed_request contém o user_id do Facebook
      // Você pode implementar a deleção automática aqui se desejar
    }

    // Retornar resposta de sucesso conforme documentação do Meta
    // https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
    res.status(200).json({
      url: `${process.env.FRONTEND_URL}/data-deletion`,
      confirmation_code: `DEL_${Date.now()}`,
    });
  } catch (error) {
    logger.error('Erro no callback de deleção:', error);
    res.status(200).json({
      url: `${process.env.FRONTEND_URL}/data-deletion`,
      confirmation_code: `DEL_${Date.now()}`,
    });
  }
});


// Rota para obter informações do usuário atual
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Não autenticado' },
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.id).select('-accessToken -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Erro ao obter dados do usuário:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Token inválido ou expirado' },
    });
  }
});

export default router;
