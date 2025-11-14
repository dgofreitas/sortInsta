import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/login" className="back-link">← Voltar</Link>

        <h1>Política de Privacidade</h1>
        <p className="last-updated">Última atualização: 13 de novembro de 2025</p>

        <section>
          <h2>1. Informações que Coletamos</h2>
          <p>O SortInsta coleta as seguintes informações:</p>
          <ul>
            <li><strong>Informações de Conta:</strong> Nome, email e senha (quando você se registra com email)</li>
            <li><strong>Informações de OAuth:</strong> Quando você faz login com Google, Facebook ou Instagram, coletamos seu nome, email e foto de perfil fornecidos por esses serviços</li>
            <li><strong>Dados do Instagram:</strong> Quando você conecta sua conta Business do Instagram, acessamos posts públicos e comentários para realizar sorteios</li>
            <li><strong>Dados de Uso:</strong> Informações sobre como você usa nossa plataforma, incluindo sorteios realizados e configurações</li>
          </ul>
        </section>

        <section>
          <h2>2. Como Usamos suas Informações</h2>
          <p>Utilizamos as informações coletadas para:</p>
          <ul>
            <li>Fornecer, operar e manter nosso serviço</li>
            <li>Permitir que você realize sorteios de comentários do Instagram</li>
            <li>Autenticar sua identidade e gerenciar sua conta</li>
            <li>Melhorar, personalizar e expandir nosso serviço</li>
            <li>Comunicar com você sobre atualizações e suporte</li>
          </ul>
        </section>

        <section>
          <h2>3. Compartilhamento de Informações</h2>
          <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:</p>
          <ul>
            <li>Quando exigido por lei ou ordem judicial</li>
            <li>Para proteger nossos direitos legais</li>
            <li>Com provedores de serviços que nos auxiliam (ex: hospedagem)</li>
          </ul>
        </section>

        <section>
          <h2>4. Armazenamento e Segurança</h2>
          <p>
            Seus dados são armazenados em servidores seguros e protegidos. Utilizamos criptografia
            para proteger senhas e dados sensíveis. Implementamos medidas de segurança técnicas e
            organizacionais para proteger suas informações contra acesso não autorizado.
          </p>
        </section>

        <section>
          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar a exclusão de sua conta e dados</li>
            <li>Revogar permissões concedidas a qualquer momento</li>
            <li>Exportar seus dados</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies e Tecnologias Similares</h2>
          <p>
            Utilizamos cookies essenciais para manter sua sessão ativa. Não utilizamos cookies
            de rastreamento ou publicidade.
          </p>
        </section>

        <section>
          <h2>7. Integração com Terceiros</h2>
          <p>
            O SortInsta integra com Instagram, Facebook e Google para autenticação. Consulte as
            políticas de privacidade destes serviços para entender como seus dados são tratados:
          </p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a></li>
            <li><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de Privacidade do Facebook</a></li>
            <li><a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Instagram</a></li>
          </ul>
        </section>

        <section>
          <h2>8. Menores de Idade</h2>
          <p>
            Nosso serviço não é destinado a menores de 13 anos. Não coletamos intencionalmente
            informações de crianças menores de 13 anos.
          </p>
        </section>

        <section>
          <h2>9. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você
            sobre mudanças significativas através do email cadastrado ou de um aviso em nosso site.
          </p>
        </section>

        <section>
          <h2>10. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
          </p>
          <ul>
            <li>Email: privacidade@sortinsta.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
