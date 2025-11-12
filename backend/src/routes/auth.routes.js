import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

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
router.get('/instagram', (req, res) => {
  // Instagram usa a API do Facebook com permissões específicas
  const instagramScopes = [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
  ];

  passport.authenticate('facebook', {
    scope: instagramScopes,
    authType: 'rerequest',
  })(req, res);
});

// Callback Instagram
router.get(
  '/instagram/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Atualizar provider para instagram
      req.user.provider = 'instagram';
      await req.user.save();

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
