import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import authService from '../services/auth.service';
import api from '../services/api';
import './LegalPages.css';

const DataDeletion = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!confirmDelete) {
      toast.error('Você deve confirmar a exclusão da conta');
      return;
    }

    if (isAuthenticated && user?.email !== email) {
      toast.error('O email não corresponde ao da conta logada');
      return;
    }

    setLoading(true);
    try {
      await api.delete('/auth/delete-account', {
        data: { email }
      });

      toast.success('Sua conta e todos os dados foram excluídos com sucesso');

      if (isAuthenticated) {
        await authService.logout();
        logout();
      }

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/login" className="back-link">← Voltar</Link>

        <h1>Política de Deleção de Dados</h1>
        <p className="last-updated">Última atualização: 13 de novembro de 2025</p>

        <section>
          <h2>1. Direito à Exclusão de Dados</h2>
          <p>
            De acordo com as leis de proteção de dados, você tem o direito de solicitar a
            exclusão de suas informações pessoais e de sua conta no SortInsta a qualquer momento.
          </p>
        </section>

        <section>
          <h2>2. O que é Excluído</h2>
          <p>Quando você solicita a exclusão de sua conta, removemos permanentemente:</p>
          <ul>
            <li>Suas informações de perfil (nome, email, foto)</li>
            <li>Suas credenciais de autenticação</li>
            <li>Histórico de sorteios realizados</li>
            <li>Configurações da conta</li>
            <li>Tokens de acesso de serviços integrados (Instagram, Facebook, Google)</li>
            <li>Quaisquer outras informações associadas à sua conta</li>
          </ul>
        </section>

        <section>
          <h2>3. O que NÃO é Excluído</h2>
          <p>
            Podemos reter certos dados por períodos limitados quando exigido por lei ou por
            razões legítimas de negócios:
          </p>
          <ul>
            <li>Logs de sistema para segurança e auditoria (mantidos por até 90 dias)</li>
            <li>Informações necessárias para cumprir obrigações legais</li>
            <li>Dados agregados e anonimizados usados para análises (que não identificam você pessoalmente)</li>
          </ul>
        </section>

        <section>
          <h2>4. Prazo de Exclusão</h2>
          <p>
            A exclusão de seus dados é processada imediatamente após a confirmação da solicitação.
            Alguns dados em backups podem levar até 90 dias para serem completamente removidos
            de nossos sistemas.
          </p>
        </section>

        <section>
          <h2>5. Revogação de Permissões de Terceiros</h2>
          <p>
            Ao excluir sua conta, recomendamos também revogar as permissões concedidas ao
            SortInsta nas seguintes plataformas:
          </p>
          <ul>
            <li>
              <strong>Google:</strong> Acesse{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                Google Permissions
              </a>
            </li>
            <li>
              <strong>Facebook:</strong> Acesse{' '}
              <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer">
                Facebook Apps and Websites
              </a>
            </li>
            <li>
              <strong>Instagram:</strong> Acesse{' '}
              <a href="https://www.instagram.com/accounts/manage_access/" target="_blank" rel="noopener noreferrer">
                Instagram Apps and Websites
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Consequências da Exclusão</h2>
          <p>Após a exclusão de sua conta:</p>
          <ul>
            <li>Você não poderá mais acessar o SortInsta com essa conta</li>
            <li>Todos os sorteios e configurações serão perdidos permanentemente</li>
            <li>A exclusão é <strong>irreversível</strong> e não pode ser desfeita</li>
            <li>Você poderá criar uma nova conta no futuro, mas os dados antigos não serão recuperados</li>
          </ul>
        </section>

        <section>
          <h2>7. Alternativas à Exclusão</h2>
          <p>Se você está considerando excluir sua conta, considere estas alternativas:</p>
          <ul>
            <li>Simplesmente fazer logout e não usar mais o serviço</li>
            <li>Revogar permissões de acesso aos serviços integrados</li>
            <li>Entrar em contato conosco para discutir preocupações específicas</li>
          </ul>
        </section>

        <section>
          <h2>8. Como Solicitar a Exclusão</h2>
          <p>
            Para excluir sua conta e dados, preencha o formulário abaixo. Se você estiver logado,
            a exclusão será processada imediatamente. Se não estiver logado, enviaremos um email
            de confirmação para verificar sua identidade.
          </p>
        </section>

        <div className="deletion-form-container">
          <form onSubmit={handleDeleteAccount} className="deletion-form">
            <h3>⚠️ Excluir Minha Conta</h3>
            <p className="warning-text">
              Esta ação é <strong>permanente e irreversível</strong>. Todos os seus dados serão excluídos.
            </p>

            {isAuthenticated && (
              <div className="current-user-info">
                <p>Conta logada: <strong>{user?.email}</strong></p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                Confirme seu email {isAuthenticated && '(deve corresponder à conta logada)'}:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  required
                />
                <span>
                  Eu entendo que esta ação é permanente e todos os meus dados serão excluídos
                  definitivamente. Não poderei recuperar minha conta ou dados após a exclusão.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="delete-btn"
              disabled={loading || !confirmDelete}
            >
              {loading ? 'Excluindo...' : 'Excluir Minha Conta Permanentemente'}
            </button>
          </form>
        </div>

        <section>
          <h2>9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre a exclusão de dados ou precisar de assistência,
            entre em contato conosco:
          </p>
          <ul>
            <li>Email: privacidade@sortinsta.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DataDeletion;
