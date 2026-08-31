import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const LogoPaw = () => (
  <svg className="logo-icon" viewBox="0 0 32 32" fill="currentColor" style={{ width: 36, height: 36 }}>
    <circle cx="10" cy="6" r="3"/><circle cx="22" cy="6" r="3"/><circle cx="5" cy="14" r="3"/><circle cx="27" cy="14" r="3"/>
    <path d="M16 28c-4 0-7-3-7-6 0-2 2-5 7-5s7 3 7 5c0 3-3 6-7 6z"/>
  </svg>
);

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(email, senha);
      
      // Salva os dados de sessão reais retornados pelo backend
      localStorage.setItem('user_session', JSON.stringify(data));
      navigate('/app');
    } catch (e) {
      const apiError = e.response?.data?.error || 'Erro na autenticação. Verifique e-mail e senha.';
      setErro(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <LogoPaw /> PetGestão
        </div>
        <p>Acesso restrito para funcionários da clínica</p>

        {erro && (
          <div className="form-error-msg" style={{ marginBottom: 16, fontSize: '0.85rem', textAlign: 'center' }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail Corporativo</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="ex: nome@petgestao.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              className="form-control"
              placeholder="Digite sua senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 12 }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <a 
          href="/" 
          style={{ display: 'block', marginTop: 20, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}
        >
          Voltar para a Landing Page
        </a>
      </div>
    </div>
  );
}

export default Login;
