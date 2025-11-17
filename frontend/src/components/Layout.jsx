import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiClock, FiLogOut, FiMenu } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Reset imageError quando o usuário mudar
  React.useEffect(() => {
    setImageError(false);
  }, [user?.profilePicture]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>SortInsta</h1>
          </div>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <FiHome />
              <span>Início</span>
            </Link>
            <Link
              to="/select-post"
              className={`nav-link ${isActive('/select-post') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <FiGrid />
              <span>Novo Sorteio</span>
            </Link>
            <Link
              to="/history"
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <FiClock />
              <span>Histórico</span>
            </Link>
          </nav>

          <div className="header-right">
            <div className="user-info">
              {user?.profilePicture && !imageError ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{user?.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut />
            </button>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 SortInsta. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;
