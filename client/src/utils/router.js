// Sistema de roteamento simples
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Escutar mudanças no hash
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    // Registrar rota
    addRoute(path, component) {
        this.routes[path] = component;
    }

    // Navegar para rota
    navigate(path) {
        window.location.hash = `#${path}`;
    }

    // Lidar com mudança de rota
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash] || this.routes['/404'] || this.routes['/'];
        
        if (route) {
            this.currentRoute = hash;
            this.renderRoute(route);
        }
    }

    // Renderizar rota
    renderRoute(component) {
        const app = document.getElementById('app');
        if (app && component) {
            ReactDOM.render(React.createElement(component), app);
        }
    }

    // Obter rota atual
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Verificar se rota requer autenticação
    requireAuth(routes) {
        const currentHash = window.location.hash.slice(1) || '/';
        
        if (routes.includes(currentHash) && !authManager.isAuthenticated()) {
            this.navigate('/login');
            return false;
        }
        return true;
    }
}

// Instância global
const router = new Router();

// Exportar para uso global
window.router = router;

