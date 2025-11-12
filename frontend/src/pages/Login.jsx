import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import useAuthStore from '../store/authStore';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    const authStatus = searchParams.get('auth');
    if (authStatus === 'success') {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else if (authStatus === 'error') {
      toast.error('Erro ao fazer login. Tente novamente.');
    }
  }, [isAuthenticated, navigate, searchParams]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">SortInsta</h1>
          <p className="login-subtitle">
            Sorteie comentários do Instagram de forma fácil e transparente
          </p>
        </div>

        <div className="login-buttons">
          <button
            className="login-btn google-btn"
            onClick={authService.loginWithGoogle}
          >
            <FcGoogle className="btn-icon" />
            <span>Continuar com Google</span>
          </button>

          <button
            className="login-btn facebook-btn"
            onClick={authService.loginWithFacebook}
          >
            <FaFacebook className="btn-icon" />
            <span>Continuar com Facebook</span>
          </button>

          <button
            className="login-btn instagram-btn"
            onClick={authService.loginWithInstagram}
          >
            <FaInstagram className="btn-icon" />
            <span>Continuar com Instagram</span>
          </button>
        </div>

        <div className="login-footer">
          <p>
            Ao fazer login, você concorda com nossos Termos de Serviço e
            Política de Privacidade.
          </p>
        </div>
      </div>

      <div className="login-features">
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <h3>Sorteios Justos</h3>
          <p>Algoritmo aleatório garantindo transparência total</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Rápido e Fácil</h3>
          <p>Realize sorteios em poucos cliques</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>100% Seguro</h3>
          <p>Seus dados protegidos com OAuth</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
