const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: false // Desativado para permitir o carregamento de scripts externos no frontend
}));

// Configuração CORS
const corsOptions = {
  origin: process.env.CORS_ORIGINS === '*' ? true : (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware de compressão
app.use(compression());

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Muitas requisições deste IP, tente novamente em alguns minutos.'
  }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../client/public')));

// Importar rotas
const analysisRoutes = require('./routes/analysis');
const userRoutes = require('./routes/user');

// Usar rotas
app.use('/api/analysis', analysisRoutes);
app.use('/api/users', userRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota API raiz
app.get('/api', (req, res) => {
  res.json({
    message: 'ARQ6 API - Análise de Mercado com IA',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      analysis: '/api/analysis',
      users: '/api/users'
    }
  });
});

// Middleware de tratamento de erros para API
app.use('/api', (err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'Verifique a sintaxe do JSON enviado'
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas API não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe`
  });
});

// Rota para todas as outras requisições - Serve o frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor unificado rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;

