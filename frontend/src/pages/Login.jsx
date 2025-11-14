import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import useAuthStore from '../store/authStore';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

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

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha email e senha');
      return;
    }

    if (isRegistering && !name) {
      toast.error('Preencha seu nome');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await authService.register(name, email, password);
        toast.success('Conta criada com sucesso!');
      } else {
        await authService.loginWithEmail(email, password);
        toast.success('Login realizado com sucesso!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">SortInsta</h1>
          <p className="login-subtitle">
            Sorteie comentários do Instagram de forma fácil e transparente
          </p>
        </div>

        <form className="login-form" onSubmit={handleEmailLogin}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required={isRegistering}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn primary-btn"
            disabled={loading}
          >
            {loading ? 'Aguarde...' : isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>

          <button
            type="button"
            className="toggle-mode-btn"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </form>

        <div className="divider">
          <span>ou</span>
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
            className="login-btn instagram-btn"
            onClick={authService.loginWithInstagram}
          >
            <FaInstagram className="btn-icon" />
            <span>Continuar com Instagram</span>
          </button>
        </div>

        <div className="login-footer">
          <p>
            Ao fazer login, você concorda com nossos{' '}
            <Link to="/terms-of-service">Termos de Serviço</Link> e{' '}
            <Link to="/privacy-policy">Política de Privacidade</Link>.
          </p>
          <p className="footer-links">
            <Link to="/data-deletion">Excluir Dados</Link>
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
