// Todos os componentes (Header, Pages) e libs (React, ReactRouterDOM)
// são carregados como globais pelo index.html.
// Portanto, não usamos 'import'.

const { BrowserRouter: Router, Route, Routes, Navigate } = ReactRouterDOM;
const { useState, useEffect } = React;

function App() {
    // A função checkAuth() deve vir do auth.js e estar no escopo global
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

    // A função `login` (usada em LoginPage) deve atualizar o estado ou recarregar a página
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            {/* Header agora está definido globalmente */}
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

// Renderiza a aplicação na div #root
ReactDOM.render(<App />, document.getElementById('root'));
