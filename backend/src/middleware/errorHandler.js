// Middleware centralizado de tratamento de erros

const errorHandler = (err, req, res, next) => {
  console.error('Erro na requisição:', err.stack || err.message);

  // Tratar erros do SQLite (ex: violação de constraint de chave estrangeira)
  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(409).json({ 
      error: 'Conflito de integridade referencial. Verifique se o tutor existe ou se há vínculos ativos.' 
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    error: message,
    // Exibe detalhes apenas em desenvolvimento
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
