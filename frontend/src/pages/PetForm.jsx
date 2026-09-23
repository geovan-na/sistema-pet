import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { petsApi, tutoresApi } from '../services/api';

function PetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    especie: 'Cachorro',
    raca: '',
    sexo: 'Macho',
    data_nascimento: '',
    peso: '',
    observacoes: '',
    tutor_id: ''
  });

  const [tutores, setTutores] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    initFormData();
  }, [id]);

  async function initFormData() {
    try {
      setLoadingForm(true);
      const [tutoresRes, petRes] = await Promise.allSettled([
        tutoresApi.getAll(),
        isEdit ? petsApi.getById(id) : Promise.resolve(null)
      ]);

      if (tutoresRes.status === 'fulfilled') {
        setTutores(tutoresRes.value || []);
      } else {
        showToast('Erro ao carregar lista de tutores.', 'error');
      }

      if (isEdit) {
        if (petRes.status === 'fulfilled' && petRes.value) {
          const pet = petRes.value;
          let formattedDate = '';
          if (pet.data_nascimento) {
            formattedDate = pet.data_nascimento.substring(0, 10);
          }

          setFormData({
            nome: pet.nome || '',
            especie: pet.especie || 'Cachorro',
            raca: pet.raca || '',
            sexo: pet.sexo || 'Macho',
            data_nascimento: formattedDate,
            peso: pet.peso !== null && pet.peso !== undefined ? pet.peso.toString() : '',
            observacoes: pet.observacoes || '',
            tutor_id: pet.tutor_id !== null && pet.tutor_id !== undefined ? pet.tutor_id.toString() : ''
          });
        } else {
          showToast('Erro ao carregar dados do pet.', 'error');
        }
      }
    } catch (e) {
      showToast('Erro ao carregar dados do formulário.', 'error');
    } finally {
      setLoadingForm(false);
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome || formData.nome.trim() === '') {
      newErrors.nome = 'Nome do pet é obrigatório';
    }
    if (!formData.especie || formData.especie.trim() === '') {
      newErrors.especie = 'Espécie é obrigatória';
    }
    if (!formData.tutor_id) {
      newErrors.tutor_id = 'Tutor responsável é obrigatório';
    }
    
    if (formData.peso && formData.peso.trim() !== '') {
      const numPeso = parseFloat(formData.peso);
      if (isNaN(numPeso) || numPeso <= 0) {
        newErrors.peso = 'O peso deve ser maior que zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        tutor_id: parseInt(formData.tutor_id),
        peso: formData.peso ? parseFloat(formData.peso) : null
      };

      if (isEdit) {
        await petsApi.update(id, payload);
        showToast('Pet atualizado com sucesso!');
      } else {
        await petsApi.create(payload);
        showToast('Pet cadastrado com sucesso!');
      }
      setTimeout(() => navigate('/app/pets'), 1000);
    } catch (e) {
      const apiError = e.response?.data?.error || 'Erro ao salvar cadastro do pet.';
      showToast(apiError, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-alert toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="form-card">
        {loadingForm ? (
          <div>
            <div className="skeleton-text" style={{ height: 40, marginBottom: 20 }} />
            <div className="skeleton-text" style={{ height: 40, marginBottom: 20 }} />
            <div className="skeleton-text" style={{ height: 40, marginBottom: 20 }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* Nome do Pet */}
            <div className="form-group">
              <label htmlFor="nome">Nome do Pet</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className={`form-control ${errors.nome ? 'form-control-error' : ''}`}
                placeholder="Ex: Thor, Mel..."
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                autoFocus
              />
              {errors.nome && <span className="form-error-msg">{errors.nome}</span>}
            </div>

            {/* Espécie */}
            <div className="form-group">
              <label htmlFor="especie">Espécie</label>
              <select
                id="especie"
                name="especie"
                className="form-control"
                value={formData.especie}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Raça */}
            <div className="form-group">
              <label htmlFor="raca">Raça</label>
              <input
                type="text"
                id="raca"
                name="raca"
                className="form-control"
                placeholder="Ex: Golden, Persa... (opcional)"
                value={formData.raca}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Sexo */}
            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                name="sexo"
                className="form-control"
                value={formData.sexo}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            {/* Tutor Responsável */}
            <div className="form-group">
              <label htmlFor="tutor_id">Tutor Responsável</label>
              <select
                id="tutor_id"
                name="tutor_id"
                className={`form-control ${errors.tutor_id ? 'form-control-error' : ''}`}
                value={formData.tutor_id}
                onChange={handleChange}
                disabled={loading || tutores.length === 0}
              >
                <option value="">Selecione o tutor...</option>
                {tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nome}
                  </option>
                ))}
              </select>
              {tutores.length === 0 && (
                <span className="form-error-msg" style={{ color: 'var(--color-primary)' }}>
                  Nenhum tutor cadastrado. Cadastre um tutor antes de adicionar o pet.
                </span>
              )}
              {errors.tutor_id && <span className="form-error-msg">{errors.tutor_id}</span>}
            </div>

            {/* Data de Nascimento */}
            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                className="form-control"
                value={formData.data_nascimento}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Peso */}
            <div className="form-group">
              <label htmlFor="peso">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                id="peso"
                name="peso"
                className={`form-control ${errors.peso ? 'form-control-error' : ''}`}
                placeholder="Ex: 12.5 (opcional)"
                value={formData.peso}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.peso && <span className="form-error-msg">{errors.peso}</span>}
            </div>

            {/* Observações */}
            <div className="form-group">
              <label htmlFor="observacoes">Observações Médicas / Gerais</label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows="3"
                className="form-control"
                placeholder="Alergias, vacinas pendentes, comportamento..."
                value={formData.observacoes}
                onChange={handleChange}
                disabled={loading}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Botões */}
            <div className="form-buttons-row">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate('/app/pets')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || tutores.length === 0}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

export default PetForm;
