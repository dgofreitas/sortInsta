import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCalendar, FiUsers, FiAward, FiTrash2, FiEye } from 'react-icons/fi';
import raffleService from '../services/raffle.service';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchRaffles();
  }, [pagination.page]);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const data = await raffleService.getRaffles(pagination.page, pagination.limit);
      setRaffles(data.raffles);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast.error('Erro ao carregar histórico de sorteios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este sorteio?')) {
      return;
    }

    try {
      await raffleService.deleteRaffle(id);
      toast.success('Sorteio deletado com sucesso');
      fetchRaffles();
    } catch (error) {
      console.error('Erro ao deletar sorteio:', error);
      toast.error('Erro ao deletar sorteio');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando histórico...</p>
      </div>
    );
  }

  if (raffles.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhum sorteio realizado ainda</h2>
        <p>Comece seu primeiro sorteio agora!</p>
        <button className="btn btn-primary" onClick={() => navigate('/select-post')}>
          Novo Sorteio
        </button>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="page-header">
        <h1>Histórico de Sorteios</h1>
        <p>Veja todos os sorteios que você já realizou</p>
      </div>

      <div className="history-list">
        {raffles.map((raffle) => (
          <div key={raffle._id} className="history-card">
            <div className="history-image">
              {raffle.postImage ? (
                <img src={raffle.postImage} alt="Post" />
              ) : (
                <div className="placeholder-image">
                  <FiAward />
                </div>
              )}
            </div>

            <div className="history-content">
              <div className="history-header">
                <h3>
                  {raffle.postCaption
                    ? raffle.postCaption.length > 80
                      ? raffle.postCaption.substring(0, 80) + '...'
                      : raffle.postCaption
                    : 'Sorteio Instagram'}
                </h3>
                <span className={`status-badge ${raffle.status}`}>
                  {raffle.status === 'completed' ? '✓ Concluído' : raffle.status}
                </span>
              </div>

              <div className="history-stats">
                <span>
                  <FiUsers />
                  {raffle.uniqueParticipants} participantes
                </span>
                <span>
                  <FiAward />
                  {raffle.numberOfWinners} vencedores
                </span>
                <span>
                  <FiCalendar />
                  {formatDate(raffle.completedAt || raffle.createdAt)}
                </span>
              </div>

              <div className="winners-preview">
                <strong>Vencedores:</strong>
                <div className="winners-tags">
                  {raffle.winners.slice(0, 3).map((winner, index) => (
                    <span key={index} className="winner-tag">
                      @{winner.username}
                    </span>
                  ))}
                  {raffle.winners.length > 3 && (
                    <span className="winner-tag more">
                      +{raffle.winners.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="history-actions">
              <button
                className="action-btn view"
                onClick={() => navigate(`/raffle-result/${raffle._id}`)}
                title="Ver detalhes"
              >
                <FiEye />
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(raffle._id)}
                title="Deletar"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {pagination.page} de {pagination.pages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
