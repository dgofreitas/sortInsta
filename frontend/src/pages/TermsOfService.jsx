import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/login" className="back-link">← Voltar</Link>

        <h1>Termos de Serviço</h1>
        <p className="last-updated">Última atualização: 13 de novembro de 2025</p>

        <section>
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o SortInsta, você concorda em cumprir e estar vinculado aos seguintes
            Termos de Serviço. Se você não concordar com algum destes termos, não use nosso serviço.
          </p>
        </section>

        <section>
          <h2>2. Descrição do Serviço</h2>
          <p>
            O SortInsta é uma plataforma que permite realizar sorteios aleatórios e transparentes
            de comentários em posts do Instagram. O serviço é fornecido "como está" e pode ser
            modificado ou descontinuado a qualquer momento.
          </p>
        </section>

        <section>
          <h2>3. Requisitos de Uso</h2>
          <p>Para usar o SortInsta, você deve:</p>
          <ul>
            <li>Ter pelo menos 13 anos de idade</li>
            <li>Fornecer informações precisas e completas durante o registro</li>
            <li>Manter a segurança de sua conta e senha</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
            <li>Possuir uma conta Business do Instagram para acessar funcionalidades completas</li>
          </ul>
        </section>

        <section>
          <h2>4. Conduta do Usuário</h2>
          <p>Você concorda em NÃO:</p>
          <ul>
            <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada</li>
            <li>Tentar obter acesso não autorizado a qualquer parte do serviço</li>
            <li>Interferir ou interromper o funcionamento do serviço</li>
            <li>Coletar ou armazenar dados de outros usuários sem autorização</li>
            <li>Usar o serviço para promover fraudes em sorteios</li>
            <li>Violar os termos de serviço do Instagram, Facebook ou Google</li>
            <li>Realizar sorteios que violem leis locais ou regulamentos de jogos de azar</li>
          </ul>
        </section>

        <section>
          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo, recursos e funcionalidades do SortInsta, incluindo mas não limitado a
            texto, gráficos, logos, ícones, imagens e software, são propriedade do SortInsta e
            protegidos por leis de propriedade intelectual.
          </p>
        </section>

        <section>
          <h2>6. Privacidade e Dados</h2>
          <p>
            Seu uso do SortInsta também é regido por nossa <Link to="/privacy-policy">Política de Privacidade</Link>.
            Por favor, revise-a para entender como coletamos, usamos e protegemos suas informações.
          </p>
        </section>

        <section>
          <h2>7. Sorteios e Responsabilidade</h2>
          <p>
            O SortInsta fornece uma ferramenta para realizar sorteios aleatórios. No entanto:
          </p>
          <ul>
            <li>Você é responsável por cumprir todas as leis e regulamentos aplicáveis ao realizar sorteios</li>
            <li>Você é responsável por definir e comunicar as regras do sorteio aos participantes</li>
            <li>Você é responsável pela entrega de prêmios aos vencedores</li>
            <li>O SortInsta não se responsabiliza por disputas entre organizadores e participantes</li>
            <li>Não garantimos que o serviço estará disponível 100% do tempo</li>
          </ul>
        </section>

        <section>
          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            Na máxima extensão permitida por lei, o SortInsta não será responsável por quaisquer
            danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo
            mas não limitado a perda de lucros, dados, uso ou outros prejuízos intangíveis.
          </p>
        </section>

        <section>
          <h2>9. Modificações do Serviço</h2>
          <p>
            Reservamos o direito de modificar ou descontinuar, temporária ou permanentemente,
            o serviço (ou qualquer parte dele) com ou sem aviso prévio. Você concorda que não
            seremos responsáveis perante você ou terceiros por qualquer modificação, suspensão
            ou descontinuação do serviço.
          </p>
        </section>

        <section>
          <h2>10. Rescisão</h2>
          <p>
            Podemos encerrar ou suspender seu acesso ao serviço imediatamente, sem aviso prévio,
            por qualquer motivo, incluindo mas não limitado a violação destes Termos de Serviço.
            Você pode encerrar sua conta a qualquer momento através da <Link to="/data-deletion">página de deleção de dados</Link>.
          </p>
        </section>

        <section>
          <h2>11. Integração com Terceiros</h2>
          <p>
            O SortInsta integra com serviços de terceiros (Instagram, Facebook, Google).
            Você deve cumprir os termos de serviço desses provedores. Não somos responsáveis
            por mudanças, interrupções ou término desses serviços de terceiros.
          </p>
        </section>

        <section>
          <h2>12. Lei Aplicável</h2>
          <p>
            Estes Termos de Serviço serão regidos e interpretados de acordo com as leis do Brasil,
            sem considerar conflitos de disposições legais.
          </p>
        </section>

        <section>
          <h2>13. Alterações nos Termos</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos você
            sobre mudanças significativas através do email cadastrado. Seu uso continuado do serviço
            após tais modificações constituirá sua aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2>14. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
          </p>
          <ul>
            <li>Email: suporte@sortinsta.com</li>
          </ul>
        </section>

        <section>
          <h2>15. Disposições Gerais</h2>
          <p>
            Se qualquer disposição destes Termos for considerada inválida ou inexequível,
            as disposições restantes permanecerão em pleno vigor e efeito. Nossa falha em
            exercer ou fazer cumprir qualquer direito não constitui uma renúncia a tal direito.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
