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

// 2. CORS Seguro (Restringe acesso externo não autorizado)
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
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

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sistema Pet API funcionando com SQLite!' });
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
