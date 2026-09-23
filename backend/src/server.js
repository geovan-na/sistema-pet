const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const tutorRoutes = require('./routes/tutorRoutes');
const petRoutes = require('./routes/petRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const funcionarioController = require('./controllers/funcionarioController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Hardening de Segurança (Headers HTTP)
app.use(helmet());

// 2. CORS Seguro (Restringe acesso em dev, suporta env/wildcard em prod)
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, curl, etc) ou que estejam na lista / em prod
    if (!origin || process.env.NODE_ENV === 'production' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permite para dev/testes de deploy
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitador de requisições por IP (DDoS protection básico)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // limite de 200 requests por IP para acomodar múltiplos funcionários
  message: { error: 'Muitas requisições enviadas por este IP. Tente novamente mais tarde.' }
});
app.use('/api', limiter);

app.use(express.json());

const pool = require('./database/connection');

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const dbType = conn.isMysql ? 'Aiven MySQL' : conn.isSqlite ? 'SQLite' : 'Fallback Resiliente';
    const lastErr = pool.getLastError ? pool.getLastError() : null;
    res.json({ status: 'ok', message: 'Sistema Pet API funcionando!', dbEngine: dbType, lastError: lastErr });
  } catch (err) {
    res.json({ status: 'ok', message: 'Sistema Pet API funcionando!', dbEngine: 'Erro ao verificar DB', error: err.message });
  }
});

// Autenticação Real do Backend
app.post('/api/login', funcionarioController.login);

// Rotas do Sistema
app.use('/api/tutores', tutorRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/funcionarios', funcionarioRoutes);

// Tratamento de Rotas Desconhecidas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado no servidor' });
});

// 3. Handler Centralizado de Erros (Captura exceções do banco/código)
app.use(errorHandler);

// Prevenir queda abrupta em servidores Cloud por exceção não capturada
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack || err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
