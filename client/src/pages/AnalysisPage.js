// Página de Nova Análise
const AnalysisPage = () => {
    const [formData, setFormData] = React.useState({
        segmento: '',
        contexto_adicional: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [showTips, setShowTips] = React.useState(true);

    React.useEffect(() => {
        // Verificar autenticação
        if (!authManager.requireAuth()) {
            return;
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpar erro ao digitar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.segmento.trim()) {
            setError('Por favor, informe o segmento de mercado');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const user = authManager.getUser();
            const analysisData = {
                ...formData,
                usuario_id: user.id
            };

            const response = await apiService.createAnalysis(analysisData);
            
            if (response.success) {
                setResult(response.data);
                setFormData({
                    segmento: '',
                    contexto_adicional: ''
                });
                setShowTips(false);
            } else {
                setError(response.error || 'Erro ao criar análise');
            }
        } catch (error) {
            console.error('Erro na análise:', error);
            setError(error.message || 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            // Header
            React.createElement('div', { className: 'mb-8' },
                React.createElement('h1', { 
                    className: 'text-3xl font-bold text-gray-900 mb-2' 
                }, 'Nova Análise de Mercado'),
                React.createElement('p', { 
                    className: 'text-gray-600' 
                }, 'Informe o segmento de mercado para obter uma análise detalhada com IA.')
            ),

            error && React.createElement(Alert, {
                type: 'error',
                message: error,
                onClose: () => setError('')
            }),

            // Form and Tips in 2 columns on desktop
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
                // Form Column (2/3 width on desktop)
                React.createElement('div', { className: 'md:col-span-2' },
                    React.createElement('div', { className: 'card p-6' },
                        React.createElement('form', { onSubmit: handleSubmit },
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', { 
                                    className: 'form-label',
                                    htmlFor: 'segmento'
                                }, 'Segmento de Mercado'),
                                React.createElement('input', {
                                    type: 'text',
                                    id: 'segmento',
                                    name: 'segmento',
                                    className: 'form-input',
                                    value: formData.segmento,
                                    onChange: handleChange,
                                    placeholder: 'Ex: Marketing Digital, E-commerce, Saúde e Bem-estar',
                                    required: true,
                                    disabled: loading
                                })
                            ),

                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', { 
                                    className: 'form-label',
                                    htmlFor: 'contexto_adicional'
                                }, 'Contexto Adicional (opcional)'),
                                React.createElement('textarea', {
                                    id: 'contexto_adicional',
                                    name: 'contexto_adicional',
                                    className: 'form-input form-textarea',
                                    value: formData.contexto_adicional,
                                    onChange: handleChange,
                                    placeholder: 'Forneça informações adicionais para uma análise mais precisa...',
                                    disabled: loading,
                                    rows: 5
                                })
                            ),

                            React.createElement('button', {
                                type: 'submit',
                                className: 'btn btn-primary w-full',
                                disabled: loading
                            }, 
                                loading ? 
                                    React.createElement(LoadingSpinner, { size: 'sm', text: 'Analisando... (pode levar até 1 minuto)' }) :
                                    'Analisar Mercado'
                            )
                        )
                    ),

                    // Results Section (appears after analysis)
                    result && React.createElement('div', { className: 'analysis-result mt-8' },
                        React.createElement('h2', { 
                            className: 'text-2xl font-bold mb-4' 
                        }, `Análise: ${result.segmento}`),
                        
                        React.createElement('div', { className: 'mb-4' },
                            React.createElement('h3', { 
                                className: 'text-lg font-semibold mb-2' 
                            }, 'Resultado da Análise:'),
                            React.createElement('div', { 
                                className: 'whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200',
                                style: { fontFamily: 'inherit', lineHeight: 1.6 }
                            }, result.resultado || result.analysis)
                        ),
                        
                        // Mostrar informações do provedor AI se disponível
                        result.metadata && React.createElement('div', { className: 'mb-4 text-sm text-gray-600' },
                            React.createElement('div', { className: 'flex gap-4' },
                                result.metadata.provider && React.createElement('span', null, 
                                    `Provedor: ${result.metadata.provider}`
                                ),
                                result.metadata.model && React.createElement('span', null, 
                                    `Modelo: ${result.metadata.model}`
                                ),
                                result.metadata.processingTimeMs && React.createElement('span', null, 
                                    `Tempo: ${(result.metadata.processingTimeMs / 1000).toFixed(1)}s`
                                )
                            )
                        ),
                        
                        React.createElement('div', { className: 'flex justify-between mt-6' },
                            React.createElement('button', {
                                className: 'btn btn-secondary',
                                onClick: () => {
                                    setResult(null);
                                    setShowTips(true);
                                }
                            }, 'Nova Análise'),
                            
                            React.createElement('button', {
                                className: 'btn btn-primary',
                                onClick: () => router.navigate('/history')
                            }, 'Ver Histórico')
                        )
                    )
                ),

                // Tips Column (1/3 width on desktop)
                showTips && React.createElement('div', { className: 'md:col-span-1' },
                    React.createElement('div', { className: 'card p-6 bg-blue-50 border border-blue-100' },
                        React.createElement('h3', { 
                            className: 'text-lg font-semibold text-blue-800 mb-4' 
                        }, 'Dicas para Melhores Resultados'),
                        
                        React.createElement('ul', { className: 'space-y-3' },
                            React.createElement('li', { className: 'flex gap-2' },
                                React.createElement('span', { 
                                    className: 'text-blue-600 font-bold' 
                                }, '•'),
                                React.createElement('span', null, 'Seja específico com o segmento de mercado')
                            ),
                            React.createElement('li', { className: 'flex gap-2' },
                                React.createElement('span', { 
                                    className: 'text-blue-600 font-bold' 
                                }, '•'),
                                React.createElement('span', null, 'Adicione contexto para análises mais precisas')
                            ),
                            React.createElement('li', { className: 'flex gap-2' },
                                React.createElement('span', { 
                                    className: 'text-blue-600 font-bold' 
                                }, '•'),
                                React.createElement('span', null, 'A análise pode levar até 1 minuto para ser gerada')
                            ),
                            React.createElement('li', { className: 'flex gap-2' },
                                React.createElement('span', { 
                                    className: 'text-blue-600 font-bold' 
                                }, '•'),
                                React.createElement('span', null, 'Todas as análises são salvas no seu histórico')
                            )
                        ),
                        
                        React.createElement('div', { className: 'mt-6 p-3 bg-white rounded-lg border border-blue-100' },
                            React.createElement('h4', { 
                                className: 'font-semibold text-gray-800 mb-2' 
                            }, 'Exemplos de Segmentos:'),
                            React.createElement('ul', { className: 'text-sm space-y-1 text-gray-600' },
                                React.createElement('li', null, '• Marketing Digital B2B'),
                                React.createElement('li', null, '• E-commerce de Moda Sustentável'),
                                React.createElement('li', null, '• Aplicativos de Fitness'),
                                React.createElement('li', null, '• Consultoria Financeira para PMEs')
                            )
                        )
                    )
                )
            )
        )
    );
};

window.AnalysisPage = AnalysisPage;