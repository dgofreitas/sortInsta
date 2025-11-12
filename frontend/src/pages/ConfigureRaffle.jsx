import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUsers, FiMessageSquare } from 'react-icons/fi';
import instagramService from '../services/instagram.service';
import raffleService from '../services/raffle.service';
import useRaffleStore from '../store/raffleStore';
import './ConfigureRaffle.css';

const ConfigureRaffle = () => {
  const navigate = useNavigate();
  const { selectedPost, raffleConfig, setRaffleConfig, setCurrentRaffle } = useRaffleStore();
  const [loading, setLoading] = useState(false);
  const [commentsData, setCommentsData] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (!selectedPost) {
      navigate('/select-post');
      return;
    }
    fetchComments();
  }, [selectedPost, navigate]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await instagramService.getPostComments(selectedPost.id);
      setCommentsData(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      toast.error('Erro ao carregar comentários do post');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setRaffleConfig({ numberOfWinners: Math.max(1, value) });
  };

  const handleMultipleEntriesChange = (e) => {
    setRaffleConfig({ multipleEntries: e.target.checked });
  };

  const handleStartRaffle = async () => {
    if (!commentsData || commentsData.uniqueParticipants === 0) {
      toast.error('Nenhum participante encontrado');
      return;
    }

    if (raffleConfig.numberOfWinners > commentsData.uniqueParticipants && !raffleConfig.multipleEntries) {
      toast.error('Número de vencedores maior que o número de participantes');
      return;
    }

    try {
      setLoading(true);
      const result = await raffleService.createRaffle({
        postId: selectedPost.id,
        numberOfWinners: raffleConfig.numberOfWinners,
        multipleEntries: raffleConfig.multipleEntries,
      });

      setCurrentRaffle(result);
      toast.success('Sorteio realizado com sucesso!');
      navigate(`/raffle-result/${result.raffle.id}`);
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      toast.error(error.response?.data?.error?.message || 'Erro ao realizar sorteio');
    } finally {
      setLoading(false);
    }
  };

  if (loadingComments) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando comentários...</p>
      </div>
    );
  }

  return (
    <div className="configure-raffle">
      <div className="page-header">
        <h1>Configurar Sorteio</h1>
        <p>Defina as configurações do seu sorteio</p>
      </div>

      <div className="raffle-content">
        <div className="post-preview">
          <h2>Post Selecionado</h2>
          <div className="preview-card">
            <img
              src={selectedPost?.media_url || selectedPost?.thumbnail_url}
              alt="Post"
            />
            <div className="preview-info">
              <p>{selectedPost?.caption?.substring(0, 100)}...</p>
              <div className="preview-stats">
                <span>
                  <FiMessageSquare />
                  {commentsData?.totalComments || 0} comentários
                </span>
                <span>
                  <FiUsers />
                  {commentsData?.uniqueParticipants || 0} participantes únicos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="raffle-config">
          <h2>Configurações</h2>

          <div className="config-card">
            <div className="form-group">
              <label htmlFor="numberOfWinners">Número de Vencedores</label>
              <input
                type="number"
                id="numberOfWinners"
                min="1"
                max={commentsData?.uniqueParticipants || 1}
                value={raffleConfig.numberOfWinners}
                onChange={handleNumberChange}
              />
              <span className="form-hint">
                Máximo: {commentsData?.uniqueParticipants || 0} participantes
              </span>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={raffleConfig.multipleEntries}
                  onChange={handleMultipleEntriesChange}
                />
                <span>Permitir múltiplas entradas</span>
              </label>
              <span className="form-hint">
                Cada comentário conta como uma entrada (usuário pode ganhar mais de uma vez)
              </span>
            </div>

            <div className="info-box">
              <h3>ℹ️ Informações</h3>
              <ul>
                <li>O sorteio é totalmente aleatório e justo</li>
                <li>Todos os comentários serão considerados</li>
                <li>O resultado será salvo no histórico</li>
                <li>
                  {raffleConfig.multipleEntries
                    ? 'Modo: Cada comentário é uma entrada'
                    : 'Modo: Um participante = uma entrada'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => navigate('/select-post')}>
          Voltar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleStartRaffle}
          disabled={loading || !commentsData || commentsData.uniqueParticipants === 0}
        >
          {loading ? 'Realizando Sorteio...' : '🎲 Realizar Sorteio'}
        </button>
      </div>
    </div>
  );
};

export default ConfigureRaffle;
