const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/user');
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', userRoutes);
app.use('/api', analysisRoutes);

// Servir arquivos estáticos do frontend
// Aponta para a pasta 'client' para que as rotas /src e /public funcionem
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Rota para o health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Redirecionar todas as outras rotas para o index.html do frontend
// Garante que o React Router consiga lidar com as rotas do lado do cliente
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'public', 'index.html'));
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor unificado rodando na porta ${PORT}`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🌐 Frontend: http://localhost:${PORT}`);
        console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
}

module.exports = app;
