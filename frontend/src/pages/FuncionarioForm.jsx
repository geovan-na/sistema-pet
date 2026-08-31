import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { funcionariosApi } from '../services/api';

function FuncionarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    role: 'comum'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadFuncionario();
    }
  }, [id]);

  async function loadFuncionario() {
    try {
      setLoadingForm(true);
      const func = await funcionariosApi.getById(id);
      setFormData({
        nome: func.nome || '',
        email: func.email || '',
        senha: '', // Mantemos senha vazia na edição (só altera se digitar nova)
        cargo: func.cargo || '',
        role: func.role || 'comum'
      });
    } catch (e) {
      showToast('Erro ao carregar dados do funcionário.', 'error');
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
      newErrors.nome = 'Nome completo é obrigatório';
    }
    if (!formData.cargo || formData.cargo.trim() === '') {
      newErrors.cargo = 'Cargo é obrigatório';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'E-mail é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato de e-mail inválido';
      }
    }

    // Senha é obrigatória apenas no cadastro
    if (!isEdit && (!formData.senha || formData.senha.trim() === '')) {
      newErrors.senha = 'Senha de acesso é obrigatória';
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
      if (isEdit) {
        await funcionariosApi.update(id, formData);
        showToast('Cadastro atualizado com sucesso!');
      } else {
        await funcionariosApi.create(formData);
        showToast('Funcionário cadastrado com sucesso!');
      }
      setTimeout(() => navigate('/app/funcionarios'), 1000);
    } catch (e) {
      const apiError = e.response?.data?.error || 'Erro ao salvar dados do funcionário.';
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
            <div className="skeleton-text" style={{ height: 40 }} />
            <div className="skeleton-text" style={{ height: 40 }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* Nome */}
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className={`form-control ${errors.nome ? 'form-control-error' : ''}`}
                placeholder="Nome completo do funcionário..."
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                autoFocus
              />
              {errors.nome && <span className="form-error-msg">{errors.nome}</span>}
            </div>

            {/* E-mail */}
            <div className="form-group">
              <label htmlFor="email">E-mail de Acesso</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'form-control-error' : ''}`}
                placeholder="nome@petgestao.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            {/* Senha */}
            <div className="form-group">
              <label htmlFor="senha">Senha {isEdit ? '(deixe em branco para não alterar)' : ''}</label>
              <input
                type="password"
                id="senha"
                name="senha"
                className={`form-control ${errors.senha ? 'form-control-error' : ''}`}
                placeholder={isEdit ? 'Nova senha de acesso...' : 'Digite a senha de acesso...'}
                value={formData.senha}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.senha && <span className="form-error-msg">{errors.senha}</span>}
            </div>

            {/* Cargo */}
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input
                type="text"
                id="cargo"
                name="cargo"
                className={`form-control ${errors.cargo ? 'form-control-error' : ''}`}
                placeholder="Ex: Veterinário, Recepcionista..."
                value={formData.cargo}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.cargo && <span className="form-error-msg">{errors.cargo}</span>}
            </div>

            {/* Nível de Acesso (Role) */}
            <div className="form-group">
              <label htmlFor="role">Nível de Acesso</label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="comum">Comum (Apenas gerenciar tutores e pets)</option>
                <option value="admin">Administrador (Total + Gestão de funcionários)</option>
              </select>
            </div>

            {/* Botões */}
            <div className="form-buttons-row">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate('/app/funcionarios')}
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
        )}
      </div>
    </div>
  );
}

export default FuncionarioForm;
