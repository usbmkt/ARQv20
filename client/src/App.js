// Todos os componentes (Header, Pages) e libs (React, ReactRouterDOM)
// são carregados como globais pelo index.html.

function App() {
    // Desestruturando React e ReactRouterDOM dentro da função para garantir
    // que as bibliotecas já existam no escopo global quando o componente for executado.
    const { useState } = React;
    const { BrowserRouter: Router, Route, Routes, Navigate } = ReactRouterDOM;

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
// O ReactDOM já deve estar disponível globalmente neste ponto.
ReactDOM.render(<App />, document.getElementById('root'));
