import { useState, useEffect } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import { tutoresApi } from '../services/api';

/* SVGs */
const SearchIcon = () => (
  <svg className="search-icon-inside" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
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

function TutorList() {
  const navigate = useNav();
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [modalDelete, setModalDelete] = useState(null); // Armazena objeto tutor a deletar

  useEffect(() => {
    loadTutores();
  }, []);

  async function loadTutores() {
    try {
      setLoading(true);
      const data = await tutoresApi.getAll();
      setTutores(data);
    } catch (e) {
      showToast('Erro ao carregar lista de tutores.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteClick = (tutor) => {
    setModalDelete(tutor);
  };

  const confirmDelete = async () => {
    if (!modalDelete) return;
    try {
      await tutoresApi.delete(modalDelete.id);
      showToast('Tutor excluído com sucesso!');
      setModalDelete(null);
      loadTutores();
    } catch (e) {
      // Captura o erro 409 (se tiver pet vinculado) ou outros
      const apiError = e.response?.data?.error || 'Erro ao excluir tutor.';
      showToast(apiError, 'error');
      setModalDelete(null);
    }
  };

  // Filtro dinâmico
  const filteredTutores = tutores.filter(t => 
    t.nome.toLowerCase().includes(search.toLowerCase()) ||
    (t.email && t.email.toLowerCase().includes(search.toLowerCase())) ||
    (t.telefone && t.telefone.includes(search))
  );

  return (
    <div>
      {/* Toast de Alerta */}
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
          placeholder="Pesquisar tutor por nome, e-mail ou telefone..." 
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de Cards */}
      {loading ? (
        <div className="list-wrapper">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : filteredTutores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
          Nenhum tutor encontrado.
        </div>
      ) : (
        <div className="list-wrapper">
          {filteredTutores.map((tutor) => (
            <div className="tutor-card" key={tutor.id}>
              <div className="card-header-row">
                <div className="card-title-group">
                  <h3>{tutor.nome}</h3>
                  <div className="card-subtitle">CADASTRADO</div>
                </div>
              </div>
              
              <div className="card-info-grid">
                {tutor.telefone && (
                  <div className="info-item">
                    <PhoneIcon />
                    <span>{tutor.telefone}</span>
                  </div>
                )}
                {tutor.email && (
                  <div className="info-item">
                    <MailIcon />
                    <span>{tutor.email}</span>
                  </div>
                )}
                {tutor.endereco && (
                  <div className="info-item">
                    <MapIcon />
                    <span>{tutor.endereco}</span>
                  </div>
                )}
              </div>

              <div className="card-actions-row">
                <button 
                  className="btn-card-action" 
                  onClick={() => navigate(`/app/tutores/editar/${tutor.id}`)}
                  aria-label="Editar"
                >
                  <EditIcon />
                </button>
                <button 
                  className="btn-card-action danger" 
                  onClick={() => handleDeleteClick(tutor)}
                  aria-label="Deletar"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Adição Flutuante */}
      <button 
        className="floating-action-btn" 
        onClick={() => navigate('/app/tutores/novo')}
        aria-label="Cadastrar novo tutor"
      >
        <PlusIcon />
      </button>

      {/* Bottom Sheet Modal de Confirmação de Exclusão */}
      {modalDelete && (
        <div className="modal-backdrop" onClick={() => setModalDelete(null)}>
          <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Excluir Tutor</h3>
            </div>
            <div className="modal-body">
              Tem certeza que deseja excluir o cadastro de <strong>{modalDelete.nome}</strong>?
              Esta ação é permanente e só será permitida se não houver pets vinculados ao tutor.
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

export default TutorList;
