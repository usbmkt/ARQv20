// Utilitários de autenticação
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
        this.init();
    }

    init() {
        // Verificar se há token salvo
        const token = localStorage.getItem('auth_token');
        if (token) {
            this.loadUserProfile();
        }
    }

    async loadUserProfile() {
        try {
            const response = await apiService.getProfile();
            if (response.success) {
                this.currentUser = response.data.user;
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            this.logout();
        }
    }

    async login(credentials) {
        try {
            const response = await apiService.login(credentials);
            if (response.success) {
                this.currentUser = response.data.user;
                this.notifyListeners();
                return { success: true, user: this.currentUser };
            }
            return { success: false, error: response.error || 'Erro no login' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        try {
            const response = await apiService.register(userData);
            if (response.success) {
                return { success: true, message: response.message };
            }
            return { success: false, error: response.error || 'Erro no registro' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            this.currentUser = null;
            this.notifyListeners();
        }
    }

    isAuthenticated() {
        return !!this.currentUser && apiService.isAuthenticated();
    }

    getUser() {
        return this.currentUser;
    }

    // Sistema de listeners para mudanças de estado
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentUser));
    }

    // Verificar se precisa fazer login
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    }
}

// Instância global
const authManager = new AuthManager();

// Exportar para uso global
window.authManager = authManager;

