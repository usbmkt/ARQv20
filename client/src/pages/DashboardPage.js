// Página de Dashboard
const DashboardPage = () => {
    const [user, setUser] = React.useState(authManager.getUser());
    const [stats, setStats] = React.useState(null);
    const [recentAnalyses, setRecentAnalyses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        // Verificar autenticação
        if (!authManager.requireAuth()) {
            return;
        }

        loadDashboardData();

        const handleAuthChange = (newUser) => {
            setUser(newUser);
            if (!newUser) {
                router.navigate('/login');
            }
        };

        authManager.addListener(handleAuthChange);
        return () => authManager.removeListener(handleAuthChange);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Carregar estatísticas e histórico em paralelo
            const [statsResponse, historyResponse] = await Promise.all([
                apiService.getStats(),
                apiService.getAnalysisHistory(1, 5)
            ]);

            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

            if (historyResponse.success) {
                setRecentAnalyses(historyResponse.data.analyses || []);
            }
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            setError('Erro ao carregar dados do dashboard');
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

    if (loading) {
        return React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'flex justify-center items-center py-8' },
                    React.createElement(LoadingSpinner, { text: 'Carregando dashboard...' })
                )
            )
        );
    }

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            // Header
            React.createElement('div', { className: 'mb-8' },
                React.createElement('h1', { 
                    className: 'text-3xl font-bold text-gray-900 mb-2' 
                }, `Bem-vindo, ${user?.nome || 'Usuário'}!`),
                React.createElement('p', { 
                    className: 'text-gray-600' 
                }, 'Aqui está um resumo das suas análises de mercado.')
            ),

            error && React.createElement(Alert, {
                type: 'error',
                message: error,
                onClose: () => setError('')
            }),

            // Stats Cards
            stats && React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' },
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('span', { className: 'stat-number' }, stats.totalAnalyses || 0),
                    React.createElement('span', { className: 'stat-label' }, 'Total de Análises')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('span', { className: 'stat-number' }, stats.thisMonth || 0),
                    React.createElement('span', { className: 'stat-label' }, 'Este Mês')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('span', { className: 'stat-number' }, stats.topSegments?.length || 0),
                    React.createElement('span', { className: 'stat-label' }, 'Segmentos Analisados')
                )
            ),

            // Quick Actions
            React.createElement('div', { className: 'card p-6 mb-8' },
                React.createElement('h2', { 
                    className: 'text-xl font-semibold mb-4' 
                }, 'Ações Rápidas'),
                React.createElement('div', { className: 'flex gap-4' },
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: () => router.navigate('/analysis')
                    }, '+ Nova Análise'),
                    React.createElement('button', {
                        className: 'btn btn-secondary',
                        onClick: () => router.navigate('/history')
                    }, 'Ver Histórico Completo')
                )
            ),

            // Recent Analyses
            React.createElement('div', { className: 'card p-6' },
                React.createElement('h2', { 
                    className: 'text-xl font-semibold mb-4' 
                }, 'Análises Recentes'),
                
                recentAnalyses.length > 0 ? 
                    React.createElement('div', { className: 'space-y-4' },
                        recentAnalyses.map((analysis, index) =>
                            React.createElement('div', { 
                                key: analysis.id || index,
                                className: 'border-b border-gray-200 pb-4 last:border-b-0'
                            },
                                React.createElement('div', { className: 'flex justify-between items-start' },
                                    React.createElement('div', null,
                                        React.createElement('h3', { 
                                            className: 'font-medium text-gray-900' 
                                        }, `Segmento: ${analysis.segmento}`),
                                        React.createElement('p', { 
                                            className: 'text-sm text-gray-600 mt-1' 
                                        }, `Criado em: ${formatDate(analysis.created_at)}`)
                                    ),
                                    React.createElement('button', {
                                        className: 'btn btn-secondary btn-sm',
                                        onClick: () => router.navigate(`/analysis/${analysis.id}`)
                                    }, 'Ver Detalhes')
                                )
                            )
                        )
                    ) :
                    React.createElement('div', { className: 'text-center py-8' },
                        React.createElement('p', { 
                            className: 'text-gray-600 mb-4' 
                        }, 'Você ainda não fez nenhuma análise.'),
                        React.createElement('button', {
                            className: 'btn btn-primary',
                            onClick: () => router.navigate('/analysis')
                        }, 'Fazer Primeira Análise')
                    )
            ),

            // Top Segments
            stats?.topSegments?.length > 0 && React.createElement('div', { className: 'card p-6 mt-8' },
                React.createElement('h2', { 
                    className: 'text-xl font-semibold mb-4' 
                }, 'Seus Segmentos Mais Analisados'),
                React.createElement('div', { className: 'space-y-2' },
                    stats.topSegments.slice(0, 5).map((segment, index) =>
                        React.createElement('div', { 
                            key: index,
                            className: 'flex justify-between items-center py-2'
                        },
                            React.createElement('span', { 
                                className: 'font-medium' 
                            }, segment.segmento),
                            React.createElement('span', { 
                                className: 'text-sm text-gray-600' 
                            }, `${segment.count} análise${segment.count > 1 ? 's' : ''}`)
                        )
                    )
                )
            )
        )
    );
};

window.DashboardPage = DashboardPage;

