import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiHeart, FiCalendar } from 'react-icons/fi';
import instagramService from '../services/instagram.service';
import useRaffleStore from '../store/raffleStore';
import './SelectPost.css';

const SelectPost = () => {
  const navigate = useNavigate();
  const { setSelectedPost } = useRaffleStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await instagramService.getPosts(25);
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      toast.error('Erro ao carregar posts. Verifique se sua conta de negócios está configurada.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPost = (post) => {
    setSelectedPostId(post.id);
    setSelectedPost(post);
  };

  const handleContinue = () => {
    if (!selectedPostId) {
      toast.warning('Selecione um post para continuar');
      return;
    }
    navigate('/configure-raffle');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhum post encontrado</h2>
        <p>Certifique-se de que sua conta de negócios do Instagram está configurada corretamente.</p>
      </div>
    );
  }

  return (
    <div className="select-post">
      <div className="page-header">
        <h1>Selecione um Post</h1>
        <p>Escolha o post do Instagram que você deseja sortear</p>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`post-card ${selectedPostId === post.id ? 'selected' : ''}`}
            onClick={() => handleSelectPost(post)}
          >
            <div className="post-image">
              <img
                src={post.media_url || post.thumbnail_url}
                alt={post.caption || 'Post'}
              />
              {selectedPostId === post.id && (
                <div className="selected-badge">✓ Selecionado</div>
              )}
            </div>

            <div className="post-info">
              <p className="post-caption">
                {post.caption
                  ? post.caption.length > 100
                    ? post.caption.substring(0, 100) + '...'
                    : post.caption
                  : 'Sem legenda'}
              </p>

              <div className="post-stats">
                <span>
                  <FiMessageSquare />
                  {post.comments_count || 0}
                </span>
                <span>
                  <FiHeart />
                  {post.like_count || 0}
                </span>
                <span>
                  <FiCalendar />
                  {formatDate(post.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!selectedPostId}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SelectPost;
