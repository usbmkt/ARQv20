// Não precisa de import React se ele estiver global
// Não usar 'export default' na abordagem de scripts globais

function Header() {
    // Supondo que ReactRouterDOM está global
    const { Link, useNavigate } = ReactRouterDOM;
    // Supondo que as funções de auth estão globais
    const isAuthenticated = checkAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        // Forçar recarregamento para atualizar o estado da aplicação
        window.location.reload();
    };

    return (
        <header className="bg-dark text-white p-3">
            <nav className="container d-flex justify-content-between align-items-center">
                <Link to="/" className="navbar-brand text-white fs-4">ARQv20</Link>
                <div>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline-light me-2">Dashboard</Link>
                            <Link to="/analysis" className="btn btn-outline-light me-2">Análise</Link>
                            <Link to="/history" className="btn btn-outline-light me-2">Histórico</Link>
                            <button onClick={handleLogout} className="btn btn-danger">Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                            <Link to="/register" className="btn btn-primary">Registrar</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
