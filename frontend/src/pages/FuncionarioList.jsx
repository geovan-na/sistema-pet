import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionariosApi } from '../services/api';

/* SVGs */
const SearchIcon = () => (
  <svg className="search-icon-inside" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="12" y2="12"/></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
);

function FuncionarioList() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);

  // Obter usuário logado atual para evitar que se delete a si mesmo
  const currentSession = JSON.parse(localStorage.getItem('user_session') || '{}');

  useEffect(() => {
    loadFuncionarios();
  }, []);

  async function loadFuncionarios() {
    try {
      setLoading(true);
      const data = await funcionariosApi.getAll();
      setFuncionarios(data);
    } catch (e) {
      showToast('Erro ao carregar lista de funcionários.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteClick = (func) => {
    if (func.id === currentSession.id) {
      showToast('Você não pode excluir o seu próprio usuário logado.', 'error');
      return;
    }
    setModalDelete(func);
  };

  const confirmDelete = async () => {
    if (!modalDelete) return;
    try {
      await funcionariosApi.delete(modalDelete.id);
      showToast('Funcionário removido com sucesso!');
      setModalDelete(null);
      loadFuncionarios();
    } catch (e) {
      showToast('Erro ao remover funcionário.', 'error');
      setModalDelete(null);
    }
  };

  const filteredFuncionarios = funcionarios.filter(f => 
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.cargo.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-alert toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="search-bar-wrapper">
        <SearchIcon />
        <input 
          type="text" 
          placeholder="Pesquisar funcionário por nome, cargo ou e-mail..." 
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="list-wrapper">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : filteredFuncionarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
          Nenhum funcionário cadastrado.
        </div>
      ) : (
        <div className="list-wrapper">
          {filteredFuncionarios.map((func) => (
            <div className="tutor-card" key={func.id}>
              <div className="card-header-row">
                <div className="card-title-group">
                  <h3>{func.nome}</h3>
                  <div className="card-subtitle">{func.cargo}</div>
                </div>
                <span className="card-badge" style={{ backgroundColor: func.role === 'admin' ? '#dcfce7' : '#f5f5f4', color: func.role === 'admin' ? '#15803d' : '#57534e' }}>
                  {func.role === 'admin' ? 'Admin' : 'Comum'}
                </span>
              </div>

              <div className="card-info-grid">
                <div className="info-item">
                  <MailIcon />
                  <span>{func.email}</span>
                </div>
                <div className="info-item">
                  <BriefcaseIcon />
                  <span>Cargo: {func.cargo}</span>
                </div>
              </div>

              <div className="card-actions-row">
                <button 
                  className="btn-card-action" 
                  onClick={() => navigate(`/app/funcionarios/editar/${func.id}`)}
                  aria-label="Editar funcionário"
                >
                  <EditIcon />
                </button>
                {func.id !== currentSession.id && (
                  <button 
                    className="btn-card-action danger" 
                    onClick={() => handleDeleteClick(func)}
                    aria-label="Remover funcionário"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão flutuante de adição */}
      <button 
        className="floating-action-btn" 
        onClick={() => navigate('/app/funcionarios/novo')}
        aria-label="Cadastrar novo funcionário"
      >
        <PlusIcon />
      </button>

      {/* Bottom Sheet modal */}
      {modalDelete && (
        <div className="modal-backdrop" onClick={() => setModalDelete(null)}>
          <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Remover Funcionário</h3>
            </div>
            <div className="modal-body">
              Tem certeza que deseja remover o funcionário <strong>{modalDelete.nome}</strong>?
              Esta ação é permanente e ele perderá acesso ao sistema de forma imediata.
            </div>
            <div className="form-buttons-row">
              <button className="btn btn-outline" onClick={() => setModalDelete(null)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} 
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FuncionarioList;
