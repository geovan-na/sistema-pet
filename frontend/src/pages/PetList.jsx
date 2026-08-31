import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petsApi } from '../services/api';

/* SVGs */
const SearchIcon = () => (
  <svg className="search-icon-inside" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ScaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
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

function PetList() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEspecie, setSelectedEspecie] = useState('Todos');
  const [toast, setToast] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      setLoading(true);
      const data = await petsApi.getAll();
      setPets(data);
    } catch (e) {
      showToast('Erro ao carregar lista de pets.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteClick = (pet) => {
    setModalDelete(pet);
  };

  const confirmDelete = async () => {
    if (!modalDelete) return;
    try {
      await petsApi.delete(modalDelete.id);
      showToast('Pet excluído com sucesso!');
      setModalDelete(null);
      loadPets();
    } catch (e) {
      showToast('Erro ao excluir pet.', 'error');
      setModalDelete(null);
    }
  };

  // Formatar data para visualização
  const formatDate = (dateString) => {
    if (!dateString) return 'Não informada';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // Filtragem
  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.nome.toLowerCase().includes(search.toLowerCase()) ||
      (pet.raca && pet.raca.toLowerCase().includes(search.toLowerCase())) ||
      (pet.tutor_nome && pet.tutor_nome.toLowerCase().includes(search.toLowerCase()));

    const matchesEspecie = selectedEspecie === 'Todos' || pet.especie.toLowerCase() === selectedEspecie.toLowerCase();

    return matchesSearch && matchesEspecie;
  });

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
          placeholder="Pesquisar pet por nome, raça ou tutor..." 
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filtros rápidos por chips */}
      <div className="filter-row">
        {['Todos', 'Cachorro', 'Gato', 'Ave', 'Outros'].map((esp) => (
          <button
            key={esp}
            className={`filter-chip ${selectedEspecie === esp ? 'active' : ''}`}
            onClick={() => setSelectedEspecie(esp)}
          >
            {esp === 'Todos' ? 'Todos' : esp + 's'}
          </button>
        ))}
      </div>

      {/* Listagem */}
      {loading ? (
        <div className="list-wrapper">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : filteredPets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
          Nenhum pet encontrado.
        </div>
      ) : (
        <div className="list-wrapper">
          {filteredPets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <div className="card-header-row">
                <div className="card-title-group">
                  <h3>{pet.nome}</h3>
                  <div className="card-subtitle">{pet.especie} {pet.raca ? `• ${pet.raca}` : ''}</div>
                </div>
                <span className="card-badge">{pet.sexo || 'Não informado'}</span>
              </div>

              <div className="card-info-grid">
                <div className="info-item">
                  <UserIcon />
                  <span>Tutor: <strong>{pet.tutor_nome}</strong></span>
                </div>
                <div className="info-item">
                  <CalendarIcon />
                  <span>Nascimento: {formatDate(pet.data_nascimento)}</span>
                </div>
                {pet.peso && (
                  <div className="info-item">
                    <ScaleIcon />
                    <span>Peso: {pet.peso} kg</span>
                  </div>
                )}
              </div>

              {pet.observacoes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', paddingLeft: '4px' }}>
                  {pet.observacoes}
                </div>
              )}

              <div className="card-actions-row">
                <button 
                  className="btn-card-action" 
                  onClick={() => navigate(`/app/pets/editar/${pet.id}`)}
                  aria-label="Editar pet"
                >
                  <EditIcon />
                </button>
                <button 
                  className="btn-card-action danger" 
                  onClick={() => handleDeleteClick(pet)}
                  aria-label="Deletar pet"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão flutuante */}
      <button 
        className="floating-action-btn" 
        onClick={() => navigate('/app/pets/novo')}
        aria-label="Cadastrar novo pet"
      >
        <PlusIcon />
      </button>

      {/* Bottom Sheet modal */}
      {modalDelete && (
        <div className="modal-backdrop" onClick={() => setModalDelete(null)}>
          <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Excluir Pet</h3>
            </div>
            <div className="modal-body">
              Tem certeza que deseja excluir o cadastro de <strong>{modalDelete.nome}</strong>?
              Esta ação é permanente.
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

export default PetList;
