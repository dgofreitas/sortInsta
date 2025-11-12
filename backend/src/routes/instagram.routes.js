import express from 'express';
import { authenticate } from '../middleware/auth.js';
import instagramService from '../services/instagram.service.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * GET /api/instagram/posts
 * Obter posts recentes do Instagram
 */
router.get('/posts', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    if (!user.accessToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de acesso do Instagram não encontrado. Faça login novamente.' },
      });
    }

    // Se não tiver instagramBusinessAccountId, tentar obter
    if (!user.instagramBusinessAccountId) {
      // Aqui seria necessário obter o ID da página do Facebook primeiro
      // Por simplicidade, vamos assumir que o usuário tem uma conta de negócios
      return res.status(400).json({
        success: false,
        error: {
          message: 'Conta de negócios do Instagram não vinculada. Vincule sua conta de negócios nas configurações.',
        },
      });
    }

    const limit = parseInt(req.query.limit) || 25;
    const posts = await instagramService.getRecentPosts(
      user.accessToken,
      user.instagramBusinessAccountId,
      limit
    );

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    logger.error('Erro ao obter posts:', error);
    next(error);
  }
});

/**
 * GET /api/instagram/posts/:postId
 * Obter detalhes de um post específico
 */
router.get('/posts/:postId', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.accessToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de acesso não encontrado' },
      });
    }

    const post = await instagramService.getPost(user.accessToken, req.params.postId);

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    logger.error('Erro ao obter post:', error);
    next(error);
  }
});

/**
 * GET /api/instagram/posts/:postId/comments
 * Obter comentários de um post
 */
router.get('/posts/:postId/comments', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.accessToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de acesso não encontrado' },
      });
    }

    const comments = await instagramService.getAllComments(
      user.accessToken,
      req.params.postId
    );

    const participants = instagramService.processCommentsForRaffle(comments);

    res.json({
      success: true,
      data: {
        totalComments: comments.length,
        uniqueParticipants: participants.length,
        comments,
        participants,
      },
    });
  } catch (error) {
    logger.error('Erro ao obter comentários:', error);
    next(error);
  }
});

/**
 * POST /api/instagram/business-account
 * Configurar conta de negócios do Instagram
 */
router.post('/business-account', async (req, res, next) => {
  try {
    const { facebookPageId } = req.body;

    if (!facebookPageId) {
      return res.status(400).json({
        success: false,
        error: { message: 'ID da página do Facebook é obrigatório' },
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.accessToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de acesso não encontrado' },
      });
    }

    const instagramAccountId = await instagramService.getInstagramBusinessAccount(
      user.accessToken,
      facebookPageId
    );

    if (!instagramAccountId) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conta de negócios do Instagram não encontrada para esta página' },
      });
    }

    user.instagramBusinessAccountId = instagramAccountId;
    await user.save();

    res.json({
      success: true,
      data: {
        instagramBusinessAccountId: instagramAccountId,
      },
    });
  } catch (error) {
    logger.error('Erro ao configurar conta de negócios:', error);
    next(error);
  }
});

export default router;
