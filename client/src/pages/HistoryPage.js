// Página de Histórico de Análises
const HistoryPage = () => {
    const [analyses, setAnalyses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [pagination, setPagination] = React.useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    React.useEffect(() => {
        // Verificar autenticação
        if (!authManager.requireAuth()) {
            return;
        }

        loadAnalyses(1);
    }, []);

    const loadAnalyses = async (page = 1) => {
        try {
            setLoading(true);
            const response = await apiService.getAnalysisHistory(page, pagination.limit);
            
            if (response.success) {
                setAnalyses(response.data.analyses || []);
                setPagination({
                    ...pagination,
                    page,
                    total: response.data.pagination?.total || 0,
                    totalPages: response.data.pagination?.totalPages || 0
                });
            } else {
                setError(response.error || 'Erro ao carregar histórico');
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            setError(error.message || 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            loadAnalyses(newPage);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            // Header
            React.createElement('div', { className: 'mb-8' },
                React.createElement('h1', { 
                    className: 'text-3xl font-bold text-gray-900 mb-2' 
                }, 'Histórico de Análises'),
                React.createElement('p', { 
                    className: 'text-gray-600' 
                }, 'Veja todas as suas análises de mercado anteriores.')
            ),

            error && React.createElement(Alert, {
                type: 'error',
                message: error,
                onClose: () => setError('')
            }),

            // Actions
            React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                React.createElement('div', null,
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: () => router.navigate('/analysis')
                    }, '+ Nova Análise')
                ),
                
                !loading && analyses.length > 0 && React.createElement('div', { className: 'text-sm text-gray-600' },
                    `Mostrando ${analyses.length} de ${pagination.total} análises`
                )
            ),

            // Loading State
            loading && React.createElement('div', { className: 'flex justify-center py-8' },
                React.createElement(LoadingSpinner, { text: 'Carregando histórico...' })
            ),

            // Empty State
            !loading && analyses.length === 0 && React.createElement('div', { className: 'card p-8 text-center' },
                React.createElement('h3', { 
                    className: 'text-xl font-semibold mb-4' 
                }, 'Nenhuma análise encontrada'),
                React.createElement('p', { 
                    className: 'text-gray-600 mb-6' 
                }, 'Você ainda não realizou nenhuma análise de mercado.'),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => router.navigate('/analysis')
                }, 'Fazer Primeira Análise')
            ),

            // Analyses List
            !loading && analyses.length > 0 && React.createElement('div', { className: 'space-y-4' },
                analyses.map((analysis) =>
                    React.createElement('div', { 
                        key: analysis.id,
                        className: 'card p-6'
                    },
                        React.createElement('div', { className: 'flex justify-between items-start' },
                            React.createElement('div', null,
                                React.createElement('h3', { 
                                    className: 'text-xl font-semibold mb-1' 
                                }, analysis.segmento),
                                React.createElement('p', { 
                                    className: 'text-sm text-gray-600 mb-4' 
                                }, `Criado em: ${formatDate(analysis.created_at)}`)
                            ),
                            React.createElement('button', {
                                className: 'btn btn-secondary btn-sm',
                                onClick: () => router.navigate(`/analysis/${analysis.id}`)
                            }, 'Ver Detalhes')
                        ),
                        
                        React.createElement('div', { className: 'mt-2' },
                            React.createElement('h4', { 
                                className: 'font-medium mb-1' 
                            }, 'Prévia:'),
                            React.createElement('p', { 
                                className: 'text-gray-700 bg-gray-50 p-3 rounded-lg text-sm' 
                            }, truncateText(analysis.resultado, 200))
                        ),
                        
                        analysis.contexto_adicional && React.createElement('div', { className: 'mt-4 text-sm' },
                            React.createElement('span', { 
                                className: 'text-gray-600 font-medium' 
                            }, 'Contexto adicional: '),
                            React.createElement('span', { 
                                className: 'text-gray-600' 
                            }, truncateText(analysis.contexto_adicional, 100))
                        )
                    )
                )
            ),

            // Pagination
            !loading && pagination.totalPages > 1 && React.createElement('div', { className: 'flex justify-center mt-8' },
                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('button', {
                        className: 'btn btn-secondary btn-sm',
                        disabled: pagination.page === 1,
                        onClick: () => handlePageChange(pagination.page - 1)
                    }, '← Anterior'),
                    
                    React.createElement('span', { 
                        className: 'flex items-center px-4' 
                    }, `Página ${pagination.page} de ${pagination.totalPages}`),
                    
                    React.createElement('button', {
                        className: 'btn btn-secondary btn-sm',
                        disabled: pagination.page === pagination.totalPages,
                        onClick: () => handlePageChange(pagination.page + 1)
                    }, 'Próxima →')
                )
            )
        )
    );
};

window.HistoryPage = HistoryPage;

