// Adiciona um listener que espera a página carregar completamente antes de executar o código.
// Isso garante que React, ReactDOM e ReactRouterDOM estejam disponíveis.
window.addEventListener('DOMContentLoaded', () => {

    // Todos os componentes e bibliotecas são carregados como globais pelo index.html.
    const { useState } = React;
    const { BrowserRouter: Router, Route, Routes, Navigate } = ReactRouterDOM;

    function App() {
        // A função checkAuth() vem do auth.js e já deve estar no escopo global
        const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

        const handleLogin = () => {
            setIsAuthenticated(true);
        };

        return (
            <Router>
                {/* O componente Header já foi carregado globalmente */}
                <Header />
                <main className="container my-4">
                    <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/" element={<HomePage />} />
                        <Route 
                            path="/login" 
                            element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLogin} /> : <Navigate to="/dashboard" />} 
                        />
                        <Route 
                            path="/register" 
                            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} 
                        />

                        {/* Rotas Protegidas */}
                        <Route 
                            path="/dashboard" 
                            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/analysis" 
                            element={isAuthenticated ? <AnalysisPage /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/analysis/:id" 
                            element={isAuthenticated ? <AnalysisDetailPage /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/history" 
                            element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />} 
                        />
                    
                        {/* Rota não encontrada */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </Router>
        );
    }

    // Renderiza a aplicação na div #root.
    ReactDOM.render(<App />, document.getElementById('root'));
});
