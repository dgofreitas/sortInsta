import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import instagramService from '../services/instagram.service.js';
import raffleService from '../services/raffle.service.js';
import Raffle from '../models/Raffle.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * POST /api/raffle
 * Criar e executar um sorteio
 */
router.post(
  '/',
  [
    body('postId').notEmpty().withMessage('ID do post é obrigatório'),
    body('numberOfWinners')
      .isInt({ min: 1 })
      .withMessage('Número de vencedores deve ser no mínimo 1'),
    body('multipleEntries')
      .optional()
      .isBoolean()
      .withMessage('multipleEntries deve ser um booleano'),
  ],
  async (req, res, next) => {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Dados inválidos', details: errors.array() },
        });
      }

      const { postId, numberOfWinners, multipleEntries = false, criteria = {} } = req.body;

      // Buscar usuário e token
      const user = await User.findById(req.user.id);
      if (!user || !user.accessToken) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token de acesso não encontrado' },
        });
      }

      // Obter informações do post
      logger.info(`Iniciando sorteio para o post ${postId}`);
      const post = await instagramService.getPost(user.accessToken, postId);

      // Obter comentários
      logger.info(`Obtendo comentários do post ${postId}`);
      const comments = await instagramService.getAllComments(user.accessToken, postId);

      if (comments.length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'Nenhum comentário encontrado no post' },
        });
      }

      // Validar participantes se houver critérios
      let validComments = comments;
      if (Object.keys(criteria).length > 0) {
        validComments = raffleService.validateParticipants(comments, criteria);
        logger.info(`${validComments.length} comentários válidos de ${comments.length} totais`);
      }

      // Processar comentários
      const participants = instagramService.processCommentsForRaffle(validComments);

      if (participants.length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'Nenhum participante válido encontrado' },
        });
      }

      if (numberOfWinners > participants.length && !multipleEntries) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Número de vencedores (${numberOfWinners}) maior que participantes únicos (${participants.length})`,
          },
        });
      }

      // Realizar sorteio
      logger.info(`Realizando sorteio: ${numberOfWinners} vencedores de ${participants.length} participantes`);
      const winners = multipleEntries
        ? raffleService.performRaffleWithMultipleEntries(participants, numberOfWinners)
        : raffleService.performRaffle(participants, numberOfWinners);

      // Gerar estatísticas
      const statistics = raffleService.generateStatistics(participants, winners);

      // Salvar sorteio no banco de dados
      const raffle = await Raffle.create({
        user: user._id,
        postId,
        postUrl: post.permalink,
        postCaption: post.caption,
        postImage: post.media_url || post.thumbnail_url,
        numberOfWinners,
        totalComments: comments.length,
        uniqueParticipants: participants.length,
        winners,
        allParticipants: participants.map((p) => ({
          username: p.username,
          userId: p.userId,
          commentCount: p.commentCount,
        })),
        status: 'completed',
        completedAt: new Date(),
      });

      logger.info(`Sorteio ${raffle._id} criado com sucesso`);

      res.json({
        success: true,
        data: {
          raffle: {
            id: raffle._id,
            postId: raffle.postId,
            postUrl: raffle.postUrl,
            postImage: raffle.postImage,
            numberOfWinners: raffle.numberOfWinners,
            completedAt: raffle.completedAt,
          },
          winners,
          statistics,
        },
      });
    } catch (error) {
      logger.error('Erro ao realizar sorteio:', error);

      // Tentar salvar sorteio com status de falha
      try {
        await Raffle.create({
          user: req.user.id,
          postId: req.body.postId,
          postUrl: '',
          numberOfWinners: req.body.numberOfWinners,
          totalComments: 0,
          uniqueParticipants: 0,
          winners: [],
          allParticipants: [],
          status: 'failed',
        });
      } catch (saveError) {
        logger.error('Erro ao salvar sorteio com falha:', saveError);
      }

      next(error);
    }
  }
);

/**
 * GET /api/raffle
 * Obter histórico de sorteios do usuário
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const raffles = await Raffle.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-allParticipants'); // Não retornar todos os participantes na listagem

    const total = await Raffle.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: {
        raffles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Erro ao obter histórico de sorteios:', error);
    next(error);
  }
});

/**
 * GET /api/raffle/:id
 * Obter detalhes de um sorteio específico
 */
router.get('/:id', async (req, res, next) => {
  try {
    const raffle = await Raffle.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!raffle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Sorteio não encontrado' },
      });
    }

    res.json({
      success: true,
      data: raffle,
    });
  } catch (error) {
    logger.error('Erro ao obter sorteio:', error);
    next(error);
  }
});

/**
 * DELETE /api/raffle/:id
 * Deletar um sorteio
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const raffle = await Raffle.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!raffle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Sorteio não encontrado' },
      });
    }

    res.json({
      success: true,
      message: 'Sorteio deletado com sucesso',
    });
  } catch (error) {
    logger.error('Erro ao deletar sorteio:', error);
    next(error);
  }
});

export default router;
