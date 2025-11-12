import raffleService from '../src/services/raffle.service.js';

describe('RaffleService', () => {
  describe('performRaffle', () => {
    test('deve selecionar o número correto de vencedores', () => {
      const participants = [
        { username: 'user1', userId: '1', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
        { username: 'user2', userId: '2', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
        { username: 'user3', userId: '3', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
        { username: 'user4', userId: '4', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
        { username: 'user5', userId: '5', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
      ];

      const winners = raffleService.performRaffle(participants, 3);

      expect(winners).toHaveLength(3);
      expect(winners[0]).toHaveProperty('username');
      expect(winners[0]).toHaveProperty('position');
    });

    test('deve lançar erro se número de vencedores > participantes', () => {
      const participants = [
        { username: 'user1', userId: '1', comments: [{ text: 'test', timestamp: new Date() }], commentCount: 1 },
      ];

      expect(() => {
        raffleService.performRaffle(participants, 5);
      }).toThrow();
    });

    test('deve lançar erro se não houver participantes', () => {
      expect(() => {
        raffleService.performRaffle([], 1);
      }).toThrow('Nenhum participante encontrado');
    });
  });

  describe('validateParticipants', () => {
    const comments = [
      { text: 'Eu quero participar!', like_count: 5 },
      { text: 'x', like_count: 0 },
      { text: 'Participo', like_count: 10 },
      { text: 'SPAM SPAM SPAM', like_count: 2 },
    ];

    test('deve filtrar comentários por tamanho mínimo', () => {
      const valid = raffleService.validateParticipants(comments, {
        minCommentLength: 10,
      });

      expect(valid.length).toBe(3);
    });

    test('deve filtrar comentários por palavras obrigatórias', () => {
      const valid = raffleService.validateParticipants(comments, {
        requiredWords: ['particip'],
      });

      expect(valid.length).toBe(2);
    });

    test('deve excluir comentários com palavras proibidas', () => {
      const valid = raffleService.validateParticipants(comments, {
        excludeWords: ['spam'],
      });

      expect(valid.length).toBe(3);
    });

    test('deve filtrar por número mínimo de likes', () => {
      const valid = raffleService.validateParticipants(comments, {
        minLikes: 5,
      });

      expect(valid.length).toBe(2);
    });
  });

  describe('generateStatistics', () => {
    test('deve gerar estatísticas corretas', () => {
      const participants = [
        { username: 'user1', userId: '1', commentCount: 3 },
        { username: 'user2', userId: '2', commentCount: 1 },
        { username: 'user3', userId: '3', commentCount: 2 },
      ];

      const winners = [
        { username: 'user1', userId: '1' },
      ];

      const stats = raffleService.generateStatistics(participants, winners);

      expect(stats.totalParticipants).toBe(3);
      expect(stats.totalComments).toBe(6);
      expect(stats.totalWinners).toBe(1);
      expect(stats.averageCommentsPerParticipant).toBe('2.00');
      expect(stats.mostActiveParticipant.username).toBe('user1');
    });
  });
});
