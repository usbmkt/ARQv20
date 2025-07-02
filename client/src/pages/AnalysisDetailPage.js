// Página de Detalhes da Análise
const AnalysisDetailPage = () => {
    const [analysis, setAnalysis] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [relatedAnalyses, setRelatedAnalyses] = React.useState([]);

    React.useEffect(() => {
        // Verificar autenticação
        if (!authManager.requireAuth()) {
            return;
        }

        loadAnalysisData();
    }, []);

    const getAnalysisId = () => {
        const hash = window.location.hash;
        const match = hash.match(/\/analysis\/([^\/]+)/);
        return match ? match[1] : null;
    };

    const loadAnalysisData = async () => {
        const id = getAnalysisId();
        if (!id) {
            setError('ID da análise não encontrado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.getAnalysis(id);
            
            if (response.success) {
                setAnalysis(response.data);
                
                // Carregar análises relacionadas
                try {
                    const relatedResponse = await apiService.request(`/api/analysis/related/${id}`);
                    if (relatedResponse.success) {
                        setRelatedAnalyses(relatedResponse.data || []);
                    }
                } catch (relatedError) {
                    console.error('Erro ao carregar análises relacionadas:', relatedError);
                }
            } else {
                setError(response.error || 'Erro ao carregar análise');
            }
        } catch (error) {
            console.error('Erro ao carregar análise:', error);
            setError(error.message || 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
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

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.deleteAnalysis(analysis.id);
            
            if (response.success) {
                router.navigate('/history');
            } else {
                setError(response.error || 'Erro ao excluir análise');
                setLoading(false);
            }
        } catch (error) {
            console.error('Erro ao excluir análise:', error);
            setError(error.message || 'Erro inesperado. Tente novamente.');
            setLoading(false);
        }
    };

    if (loading) {
        return React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'flex justify-center items-center py-8' },
                    React.createElement(LoadingSpinner, { text: 'Carregando análise...' })
                )
            )
        );
    }

    if (error) {
        return React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'container' },
                React.createElement(Alert, {
                    type: 'error',
                    message: error
                }),
                React.createElement('div', { className: 'text-center mt-6' },
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: () => router.navigate('/history')
                    }, 'Voltar para o Histórico')
                )
            )
        );
    }

    if (!analysis) {
        return React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'text-center py-8' },
                    React.createElement('h2', { 
                        className: 'text-2xl font-bold mb-4' 
                    }, 'Análise não encontrada'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: () => router.navigate('/history')
                    }, 'Voltar para o Histórico')
                )
            )
        );
    }

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            // Navigation
            React.createElement('div', { className: 'mb-6' },
                React.createElement('button', {
                    className: 'btn btn-secondary',
                    onClick: () => router.navigate('/history')
                }, '← Voltar para o Histórico')
            ),

            // Analysis Header
            React.createElement('div', { className: 'mb-8' },
                React.createElement('h1', { 
                    className: 'text-3xl font-bold text-gray-900 mb-2' 
                }, `Análise: ${analysis.segmento}`),
                React.createElement('div', { className: 'flex flex-wrap gap-4 text-sm text-gray-600' },
                    React.createElement('span', null, `Criado em: ${formatDate(analysis.created_at)}`),
                    analysis.metadata?.model && React.createElement('span', null, `Modelo: ${analysis.metadata.model}`),
                    analysis.metadata?.processingTimeMs && React.createElement('span', null, 
                        `Tempo de processamento: ${(analysis.metadata.processingTimeMs / 1000).toFixed(1)}s`
                    )
                )
            ),

            // Actions
            React.createElement('div', { className: 'flex gap-4 mb-8' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => router.navigate('/analysis')
                }, 'Nova Análise'),
                React.createElement('button', {
                    className: 'btn btn-danger',
                    onClick: handleDelete
                }, 'Excluir Análise')
            ),

            // Main Content
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
                // Analysis Result (2/3 width on desktop)
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('div', { className: 'card p-6' },
                        React.createElement('h2', { 
                            className: 'text-xl font-semibold mb-4' 
                        }, 'Resultado da Análise'),
                        
                        React.createElement('div', { 
                            className: 'whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200',
                            style: { fontFamily: 'inherit', lineHeight: 1.6 }
                        }, analysis.resultado)
                    )
                ),

                // Sidebar (1/3 width on desktop)
                React.createElement('div', { className: 'md:col-span-1' },
                    // Context
                    analysis.contexto_adicional && React.createElement('div', { className: 'card p-6 mb-6' },
                        React.createElement('h3', { 
                            className: 'text-lg font-semibold mb-3' 
                        }, 'Contexto Adicional'),
                        React.createElement('p', { 
                            className: 'text-gray-700' 
                        }, analysis.contexto_adicional)
                    ),
                    
                    // Related Analyses
                    relatedAnalyses.length > 0 && React.createElement('div', { className: 'card p-6' },
                        React.createElement('h3', { 
                            className: 'text-lg font-semibold mb-3' 
                        }, 'Análises Relacionadas'),
                        React.createElement('ul', { className: 'space-y-3' },
                            relatedAnalyses.map((related) =>
                                React.createElement('li', { key: related.id },
                                    React.createElement('a', {
                                        href: `#/analysis/${related.id}`,
                                        className: 'text-blue-600 hover:text-blue-800',
                                        onClick: (e) => {
                                            e.preventDefault();
                                            router.navigate(`/analysis/${related.id}`);
                                            // Reload data for the new analysis
                                            setTimeout(() => {
                                                loadAnalysisData();
                                            }, 0);
                                        }
                                    }, related.segmento),
                                    React.createElement('div', { 
                                        className: 'text-xs text-gray-500 mt-1' 
                                    }, formatDate(related.created_at))
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};

window.AnalysisDetailPage = AnalysisDetailPage;

