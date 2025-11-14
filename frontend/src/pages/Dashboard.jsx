import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiAward, FiClock, FiAlertCircle } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isGoogleUser = user?.provider === 'google';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bem-vindo, {user?.name}! 👋</h1>
        <p>Comece um novo sorteio ou veja seus sorteios anteriores</p>
      </div>

      {isGoogleUser && (
        <div className="warning-banner">
          <FiAlertCircle />
          <div>
            <strong>Atenção:</strong> Você está logado com Google. Para realizar sorteios do Instagram,
            você precisa fazer login com sua conta do Instagram/Facebook.
          </div>
        </div>
      )}

      <div className="dashboard-cards">
        <div className="dashboard-card primary-card" onClick={() => navigate('/select-post')}>
          <div className="card-icon">
            <FiAward />
          </div>
          <h2>Novo Sorteio</h2>
          <p>Selecione um post do Instagram e realize um sorteio</p>
          <button className="card-btn">Começar</button>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/history')}>
          <div className="card-icon">
            <FiClock />
          </div>
          <h2>Histórico</h2>
          <p>Veja todos os sorteios que você já realizou</p>
          <button className="card-btn secondary">Ver Histórico</button>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <FiTrendingUp />
          <div>
            <h3>Como Funciona</h3>
            <ol>
              <li>Faça login com sua conta</li>
              <li>Selecione um post do Instagram</li>
              <li>Configure o número de vencedores</li>
              <li>Realize o sorteio e compartilhe o resultado!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
