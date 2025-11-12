import axios from 'axios';
import logger from '../utils/logger.js';

class InstagramService {
  constructor() {
    this.baseURL = process.env.INSTAGRAM_GRAPH_API_BASE_URL || 'https://graph.instagram.com';
    this.version = process.env.INSTAGRAM_GRAPH_API_VERSION || 'v18.0';
  }

  /**
   * Obter conta de negócios do Instagram vinculada à página do Facebook
   */
  async getInstagramBusinessAccount(accessToken, facebookPageId) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.version}/${facebookPageId}`,
        {
          params: {
            fields: 'instagram_business_account',
            access_token: accessToken,
          },
        }
      );

      return response.data.instagram_business_account?.id || null;
    } catch (error) {
      logger.error('Erro ao obter conta de negócios do Instagram:', error.response?.data || error.message);
      throw new Error('Não foi possível obter a conta do Instagram');
    }
  }

  /**
   * Obter posts recentes do Instagram
   */
  async getRecentPosts(accessToken, instagramAccountId, limit = 25) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${instagramAccountId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
            limit,
            access_token: accessToken,
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      logger.error('Erro ao obter posts do Instagram:', error.response?.data || error.message);
      throw new Error('Não foi possível obter os posts do Instagram');
    }
  }

  /**
   * Obter detalhes de um post específico
   */
  async getPost(accessToken, postId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${postId}`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
            access_token: accessToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Erro ao obter post do Instagram:', error.response?.data || error.message);
      throw new Error('Post não encontrado');
    }
  }

  /**
   * Obter todos os comentários de um post (com paginação)
   */
  async getAllComments(accessToken, postId) {
    try {
      let allComments = [];
      let url = `${this.baseURL}/${postId}/comments`;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axios.get(url, {
          params: {
            fields: 'id,text,username,timestamp,like_count,from',
            access_token: accessToken,
            limit: 100, // Máximo permitido pela API
          },
        });

        if (response.data.data) {
          allComments = allComments.concat(response.data.data);
        }

        // Verificar se há próxima página
        if (response.data.paging && response.data.paging.next) {
          url = response.data.paging.next;
        } else {
          hasNextPage = false;
        }

        // Segurança contra loops infinitos
        if (allComments.length > 10000) {
          logger.warn(`Limite de 10000 comentários atingido para o post ${postId}`);
          break;
        }
      }

      logger.info(`Total de ${allComments.length} comentários obtidos para o post ${postId}`);
      return allComments;
    } catch (error) {
      logger.error('Erro ao obter comentários do Instagram:', error.response?.data || error.message);
      throw new Error('Não foi possível obter os comentários do post');
    }
  }

  /**
   * Obter respostas de um comentário específico
   */
  async getCommentReplies(accessToken, commentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${commentId}/replies`,
        {
          params: {
            fields: 'id,text,username,timestamp,from',
            access_token: accessToken,
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      logger.error('Erro ao obter respostas do comentário:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Processar comentários para o sorteio
   * Remove duplicatas e organiza participantes
   */
  processCommentsForRaffle(comments) {
    const participantsMap = new Map();

    comments.forEach((comment) => {
      const username = comment.username || comment.from?.username;
      const userId = comment.from?.id || comment.id;

      if (username && userId) {
        if (participantsMap.has(userId)) {
          // Incrementar contagem de comentários do usuário
          const participant = participantsMap.get(userId);
          participant.commentCount++;
          participant.comments.push({
            text: comment.text,
            timestamp: comment.timestamp,
          });
        } else {
          // Adicionar novo participante
          participantsMap.set(userId, {
            username,
            userId,
            commentCount: 1,
            comments: [
              {
                text: comment.text,
                timestamp: comment.timestamp,
              },
            ],
          });
        }
      }
    });

    return Array.from(participantsMap.values());
  }

  /**
   * Validar token de acesso do Instagram
   */
  async validateAccessToken(accessToken) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/debug_token`,
        {
          params: {
            input_token: accessToken,
            access_token: accessToken,
          },
        }
      );

      return response.data.data.is_valid;
    } catch (error) {
      logger.error('Erro ao validar token:', error.response?.data || error.message);
      return false;
    }
  }
}

export default new InstagramService();
