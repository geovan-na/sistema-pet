import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AppLayout.css';

/* SVGs */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
);
const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="8" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 18c0 2 2 3 3 3s3-1 3-3c0-1-1.5-2-3-2s-3 1-3 2z"/></svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
);
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 01-2 2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const LogoPaw = () => (
  <svg className="logo-icon" viewBox="0 0 32 32" fill="currentColor" style={{ width: 28, height: 28 }}>
    <circle cx="10" cy="6" r="3"/><circle cx="22" cy="6" r="3"/><circle cx="5" cy="14" r="3"/><circle cx="27" cy="14" r="3"/>
    <path d="M16 28c-4 0-7-3-7-6 0-2 2-5 7-5s7 3 7 5c0 3-3 6-7 6z"/>
  </svg>
);

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sessionString = localStorage.getItem('user_session');
  const user = sessionString ? JSON.parse(sessionString) : null;
  const isAdmin = user && user.role === 'admin';

  // GUARDA DE ROTA: Se não houver sessão ativa, expulsa para /login
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Se tentar acessar rota de funcionários sem ser admin, bloqueia o acesso
    if (location.pathname.startsWith('/app/funcionarios') && !isAdmin) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate, location.pathname, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login', { replace: true });
  };

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Início';
    if (path === '/app/tutores') return 'Lista de Tutores';
    if (path === '/app/tutores/novo') return 'Cadastrar Tutor';
    if (path.includes('/app/tutores/editar')) return 'Editar Tutor';
    if (path === '/app/pets') return 'Lista de Pets';
    if (path === '/app/pets/novo') return 'Cadastrar Pet';
    if (path.includes('/app/pets/editar')) return 'Editar Pet';
    if (path === '/app/funcionarios') return 'Lista de Equipe';
    if (path === '/app/funcionarios/novo') return 'Cadastrar Equipe';
    if (path.includes('/app/funcionarios/editar')) return 'Editar Equipe';
    return 'PetGestão';
  };

  const showBackButton = location.pathname !== '/app';

  if (!user) return null;

  return (
    <div className="app-wrapper">
      {/* Header Superior Mobile */}
      <header className="app-header">
        {showBackButton ? (
          <button className="app-header-back" onClick={() => navigate(-1)} aria-label="Voltar">
            <BackIcon />
          </button>
        ) : (
          <button className="app-header-back" onClick={handleLogout} aria-label="Sair">
            <LogoutIcon />
          </button>
        )}
        <h1>{getHeaderTitle()}</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Sidebar Desktop / Tab Bar Mobile */}
      <nav className="tab-bar">
        {/* Logo visível apenas no Desktop Sidebar */}
        <div className="logo" style={{ padding: '0 16px 20px', marginBottom: 20, borderBottom: '1px solid var(--color-border)', display: 'none' }}>
          <LogoPaw /> PetGestão
        </div>

        <NavLink to="/app" end className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
          <HomeIcon />
          <span>Início</span>
        </NavLink>
        <NavLink to="/app/tutores" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
          <UsersIcon />
          <span>Tutores</span>
        </NavLink>
        <NavLink to="/app/pets" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
          <PawIcon />
          <span>Pets</span>
        </NavLink>

        {/* Exibido apenas se logado como Admin */}
        {isAdmin && (
          <NavLink to="/app/funcionarios" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
            <BriefcaseIcon />
            <span>Equipe</span>
          </NavLink>
        )}

        {/* Botão Sair visível apenas no Desktop Sidebar */}
        <div className="btn-logout-sidebar" style={{ display: 'none' }}>
          <button className="tab-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
            <LogoutIcon />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* Container Principal */}
      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
