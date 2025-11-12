import logger from '../utils/logger.js';

class RaffleService {
  /**
   * Realizar sorteio de comentários
   * @param {Array} participants - Lista de participantes
   * @param {Number} numberOfWinners - Número de vencedores
   * @returns {Array} - Lista de vencedores
   */
  performRaffle(participants, numberOfWinners) {
    if (!participants || participants.length === 0) {
      throw new Error('Nenhum participante encontrado');
    }

    if (numberOfWinners > participants.length) {
      throw new Error(
        `Número de vencedores (${numberOfWinners}) maior que o número de participantes (${participants.length})`
      );
    }

    // Criar array de participantes para sorteio
    // Cada participante aparece uma vez (sorteio único por usuário)
    const rafflePool = [...participants];

    // Embaralhar array usando algoritmo Fisher-Yates
    for (let i = rafflePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rafflePool[i], rafflePool[j]] = [rafflePool[j], rafflePool[i]];
    }

    // Selecionar vencedores
    const winners = rafflePool.slice(0, numberOfWinners);

    logger.info(`Sorteio realizado: ${winners.length} vencedores de ${participants.length} participantes`);

    return winners.map((winner, index) => ({
      position: index + 1,
      username: winner.username,
      userId: winner.userId,
      comment: winner.comments[0].text, // Primeiro comentário do usuário
      timestamp: winner.comments[0].timestamp,
      totalComments: winner.commentCount,
    }));
  }

  /**
   * Realizar sorteio com múltiplas entradas por participante
   * (Cada comentário é uma entrada)
   */
  performRaffleWithMultipleEntries(participants, numberOfWinners) {
    if (!participants || participants.length === 0) {
      throw new Error('Nenhum participante encontrado');
    }

    // Criar pool de entradas (cada comentário é uma entrada)
    const rafflePool = [];
    participants.forEach((participant) => {
      participant.comments.forEach((comment) => {
        rafflePool.push({
          username: participant.username,
          userId: participant.userId,
          comment: comment.text,
          timestamp: comment.timestamp,
        });
      });
    });

    if (numberOfWinners > rafflePool.length) {
      throw new Error(
        `Número de vencedores (${numberOfWinners}) maior que o número total de entradas (${rafflePool.length})`
      );
    }

    // Embaralhar
    for (let i = rafflePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rafflePool[i], rafflePool[j]] = [rafflePool[j], rafflePool[i]];
    }

    // Selecionar vencedores (pode ter duplicatas se o mesmo usuário comentou várias vezes)
    const winners = rafflePool.slice(0, numberOfWinners);

    logger.info(
      `Sorteio com múltiplas entradas realizado: ${winners.length} vencedores de ${rafflePool.length} entradas`
    );

    return winners.map((winner, index) => ({
      position: index + 1,
      ...winner,
    }));
  }

  /**
   * Validar critérios de participação
   * @param {Array} comments - Comentários
   * @param {Object} criteria - Critérios de validação
   * @returns {Array} - Comentários válidos
   */
  validateParticipants(comments, criteria = {}) {
    const {
      minCommentLength = 0,
      requiredWords = [],
      excludeWords = [],
      minLikes = 0,
    } = criteria;

    return comments.filter((comment) => {
      // Validar tamanho mínimo do comentário
      if (comment.text && comment.text.length < minCommentLength) {
        return false;
      }

      // Validar palavras obrigatórias
      if (requiredWords.length > 0) {
        const hasRequiredWords = requiredWords.some((word) =>
          comment.text?.toLowerCase().includes(word.toLowerCase())
        );
        if (!hasRequiredWords) {
          return false;
        }
      }

      // Excluir comentários com palavras proibidas
      if (excludeWords.length > 0) {
        const hasExcludedWords = excludeWords.some((word) =>
          comment.text?.toLowerCase().includes(word.toLowerCase())
        );
        if (hasExcludedWords) {
          return false;
        }
      }

      // Validar número mínimo de likes
      if (comment.like_count < minLikes) {
        return false;
      }

      return true;
    });
  }

  /**
   * Gerar estatísticas do sorteio
   */
  generateStatistics(participants, winners) {
    const totalComments = participants.reduce(
      (sum, p) => sum + p.commentCount,
      0
    );

    const avgCommentsPerParticipant = totalComments / participants.length;

    const mostActiveParticipant = participants.reduce((max, p) =>
      p.commentCount > max.commentCount ? p : max
    );

    return {
      totalParticipants: participants.length,
      totalComments,
      totalWinners: winners.length,
      averageCommentsPerParticipant: avgCommentsPerParticipant.toFixed(2),
      mostActiveParticipant: {
        username: mostActiveParticipant.username,
        comments: mostActiveParticipant.commentCount,
      },
    };
  }
}

export default new RaffleService();
