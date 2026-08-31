import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tutoresApi } from '../services/api';

function TutorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadTutor();
    }
  }, [id]);

  async function loadTutor() {
    try {
      setLoading(true);
      const tutor = await tutoresApi.getById(id);
      setFormData({
        nome: tutor.nome || '',
        telefone: tutor.telefone || '',
        email: tutor.email || '',
        endereco: tutor.endereco || ''
      });
    } catch (e) {
      showToast('Erro ao carregar dados do tutor.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome || formData.nome.trim() === '') {
      newErrors.nome = 'Nome completo é obrigatório';
    }
    
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato de e-mail inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo modificado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await tutoresApi.update(id, formData);
        showToast('Tutor atualizado com sucesso!');
      } else {
        await tutoresApi.create(formData);
        showToast('Tutor cadastrado com sucesso!');
      }
      setTimeout(() => navigate('/app/tutores'), 1000);
    } catch (e) {
      const apiError = e.response?.data?.error || 'Erro ao salvar cadastro do tutor.';
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
        <form onSubmit={handleSubmit}>
          
          {/* Nome */}
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className={`form-control ${errors.nome ? 'form-control-error' : ''}`}
              placeholder="Digite o nome do tutor..."
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
            {errors.nome && <span className="form-error-msg">{errors.nome}</span>}
          </div>

          {/* Telefone */}
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              className="form-control"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* E-mail */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'form-control-error' : ''}`}
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="form-error-msg">{errors.email}</span>}
          </div>

          {/* Endereço */}
          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              className="form-control"
              placeholder="Rua, número, bairro..."
              value={formData.endereco}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Botões */}
          <div className="form-buttons-row">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => navigate('/app/tutores')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default TutorForm;
