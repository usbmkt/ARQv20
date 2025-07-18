const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const analysisRoutes = require('./routes/analysis');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP para permitir scripts inline do frontend
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);

// Servir arquivos estáticos do frontend
// Aponta para a pasta 'client' para que as rotas /src e /public funcionem
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Rota para o health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('../package.json').version
  });
});

// Rota de informações da API
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'ARQ6 API - Análise de Mercado com IA',
    version: require('../package.json').version,
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      users: '/api/users',
      analysis: '/api/analysis'
    },
    aiProviders: {
      current: process.env.AI_PROVIDER || 'gemini',
      available: ['gemini', 'deepseek', 'both']
    }
  });
});

// Redirecionar todas as outras rotas para o index.html do frontend
// Garante que o React Router consiga lidar com as rotas do lado do cliente
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'public', 'index.html'));
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor unificado rodando na porta ${PORT}`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🤖 Provedor AI: ${process.env.AI_PROVIDER || 'gemini'}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🌐 Frontend: http://localhost:${PORT}`);
        console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
}

module.exports = app;
