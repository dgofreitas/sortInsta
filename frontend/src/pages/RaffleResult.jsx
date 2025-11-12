import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiAward, FiShare2, FiDownload, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
import raffleService from '../services/raffle.service';
import useRaffleStore from '../store/raffleStore';
import './RaffleResult.css';

const RaffleResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRaffle, resetRaffle } = useRaffleStore();
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (currentRaffle && currentRaffle.raffle.id === id) {
      setRaffle(currentRaffle);
      setLoading(false);
    } else {
      fetchRaffle();
    }

    // Esconder confete após 5 segundos
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [id, currentRaffle]);

  const fetchRaffle = async () => {
    try {
      setLoading(true);
      const data = await raffleService.getRaffle(id);
      setRaffle({ raffle: data, winners: data.winners, statistics: null });
    } catch (error) {
      console.error('Erro ao buscar sorteio:', error);
      toast.error('Sorteio não encontrado');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const text = `🎉 Resultado do Sorteio!\n\nVencedores:\n${raffle.winners
      .map((w, i) => `${i + 1}. @${w.username}`)
      .join('\n')}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Resultado do Sorteio - SortInsta',
          text,
        })
        .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Resultado copiado para a área de transferência!');
    }
  };

  const handleDownload = () => {
    const text = `Resultado do Sorteio - SortInsta\n\n${raffle.winners
      .map((w, i) => `${i + 1}. @${w.username} - ${w.comment}`)
      .join('\n')}\n\nTotal de participantes: ${raffle.statistics?.totalParticipants || 0}\nTotal de comentários: ${raffle.statistics?.totalComments || 0}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorteio-${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Resultado baixado!');
  };

  const handleNewRaffle = () => {
    resetRaffle();
    navigate('/select-post');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando resultado...</p>
      </div>
    );
  }

  if (!raffle) {
    return null;
  }

  return (
    <div className="raffle-result">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: ['#E4405F', '#833AB4', '#F77737', '#FCAF45'][Math.floor(Math.random() * 4)],
            }} />
          ))}
        </div>
      )}

      <div className="result-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="trophy"
        >
          <FiAward />
        </motion.div>
        <h1>🎉 Sorteio Realizado!</h1>
        <p>Confira os vencedores do sorteio</p>
      </div>

      {raffle.statistics && (
        <div className="statistics">
          <div className="stat-card">
            <h3>{raffle.statistics.totalParticipants}</h3>
            <p>Participantes</p>
          </div>
          <div className="stat-card">
            <h3>{raffle.statistics.totalComments}</h3>
            <p>Comentários</p>
          </div>
          <div className="stat-card">
            <h3>{raffle.statistics.totalWinners}</h3>
            <p>Vencedores</p>
          </div>
        </div>
      )}

      <div className="winners-section">
        <h2>🏆 Vencedores</h2>
        <div className="winners-list">
          {raffle.winners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="winner-card"
            >
              <div className="winner-position">#{winner.position || index + 1}</div>
              <div className="winner-info">
                <h3>@{winner.username}</h3>
                <p className="winner-comment">"{winner.comment}"</p>
                {winner.totalComments > 1 && (
                  <span className="comment-count">
                    {winner.totalComments} comentários
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          <FiHome /> Início
        </button>
        <button className="btn btn-outline" onClick={handleShare}>
          <FiShare2 /> Compartilhar
        </button>
        <button className="btn btn-outline" onClick={handleDownload}>
          <FiDownload /> Baixar
        </button>
        <button className="btn btn-primary" onClick={handleNewRaffle}>
          🎲 Novo Sorteio
        </button>
      </div>
    </div>
  );
};

export default RaffleResult;
