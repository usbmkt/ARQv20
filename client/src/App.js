// Aplicativo Principal
const App = () => {
    React.useEffect(() => {
        // Configurar rotas
        router.addRoute('/', HomePage);
        router.addRoute('/login', LoginPage);
        router.addRoute('/register', RegisterPage);
        router.addRoute('/dashboard', DashboardPage);
        router.addRoute('/analysis', AnalysisPage);
        router.addRoute('/history', HistoryPage);
        router.addRoute('/analysis/:id', AnalysisDetailPage);
        router.addRoute('/404', NotFoundPage);
        
        // Inicializar roteamento
        router.handleRoute();
    }, []);

    return React.createElement('div', { className: 'app' },
        React.createElement(Header),
        React.createElement('div', { id: 'app' })
    );
};

// Renderizar aplicativo
ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
);

