import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tutoresApi, petsApi } from '../services/api';

/* Ícones SVG */
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
);
const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="8" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 18c0 2 2 3 3 3s3-1 3-3c0-1-1.5-2-3-2s-3 1-3 2z"/></svg>
);

function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ tutores: 0, pets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tutores, pets] = await Promise.all([
          tutoresApi.getAll(),
          petsApi.getAll()
        ]);
        setCounts({
          tutores: tutores.length,
          pets: pets.length
        });
      } catch (error) {
        console.error('Erro ao carregar dados do painel:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Banner de boas-vindas */}
      <div className="dashboard-hero">
        <h2>Painel de Gestão</h2>
        <p>Acompanhe e gerencie com rapidez o cadastro de tutores e pets da sua clínica.</p>
      </div>

      {/* Indicadores numéricos */}
      <div className="stats-grid-mini">
        <div className="stat-card" onClick={() => navigate('/app/tutores')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-icon">
            <UsersIcon />
          </div>
          {loading ? (
            <div className="skeleton" style={{ width: 40, height: 32 }} />
          ) : (
            <div className="stat-card-number">{counts.tutores}</div>
          )}
          <div className="stat-card-label">Tutores</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/app/pets')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-icon">
            <PawIcon />
          </div>
          {loading ? (
            <div className="skeleton" style={{ width: 40, height: 32 }} />
          ) : (
            <div className="stat-card-number">{counts.pets}</div>
          )}
          <div className="stat-card-label">Pets</div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h3>Ações rápidas</h3>
        <div className="action-buttons-list">
          <Link to="/app/tutores/novo" className="btn btn-primary" style={{ width: '100%' }}>
            Cadastrar Tutor
          </Link>
          <Link to="/app/pets/novo" className="btn btn-outline" style={{ width: '100%' }}>
            Cadastrar Pet
          </Link>
          <a
            href="/"
            className="btn btn-outline"
            style={{ width: '100%', borderColor: '#d6d3d1', color: '#78716c' }}
          >
            Voltar para Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
