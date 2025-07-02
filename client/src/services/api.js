// Configuração da API
const API_BASE_URL = ''; // Caminho relativo para a API no mesmo servidor

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('auth_token');
    }

    // Configurar token de autenticação
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    // Headers padrão
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Fazer requisição HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await axios(url, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            
            if (error.response) {
                // Erro de resposta do servidor
                throw new Error(error.response.data.message || error.response.data.error || 'Erro na requisição');
            } else if (error.request) {
                // Erro de rede
                throw new Error('Erro de conexão. Verifique sua internet.');
            } else {
                // Outro erro
                throw new Error('Erro inesperado. Tente novamente.');
            }
        }
    }

    // Métodos de autenticação
    async register(userData) {
        return this.request('/api/users/register', {
            method: 'POST',
            data: userData,
        });
    }

    async login(credentials) {
        const response = await this.request('/api/users/login', {
            method: 'POST',
            data: credentials,
        });

        if (response.success && response.data.session) {
            this.setToken(response.data.session.access_token);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/api/users/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.setToken(null);
        }
    }

    async getProfile() {
        return this.request('/api/users/profile');
    }

    async updateProfile(userData) {
        return this.request('/api/users/profile', {
            method: 'PUT',
            data: userData,
        });
    }

    // Métodos de análise
    async createAnalysis(analysisData) {
        return this.request('/api/analysis/market', {
            method: 'POST',
            data: analysisData,
        });
    }

    async getAnalysisHistory(page = 1, limit = 10) {
        return this.request(`/api/analysis/history?page=${page}&limit=${limit}`);
    }

    async getAnalysis(id) {
        return this.request(`/api/analysis/${id}`);
    }

    async deleteAnalysis(id) {
        return this.request(`/api/analysis/${id}`, {
            method: 'DELETE',
        });
    }

    async getStats() {
        return this.request('/api/analysis/stats/overview');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return !!this.token;
    }
}

// Instância global da API
const apiService = new ApiService();

// Interceptor para lidar com erros de autenticação
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('Token inválido')) {
        apiService.setToken(null);
        window.location.href = '/login';
    }
});

// Exportar para uso global
window.apiService = apiService;

