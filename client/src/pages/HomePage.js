// Página Inicial
const HomePage = () => {
    const [user, setUser] = React.useState(authManager.getUser());

    React.useEffect(() => {
        const handleAuthChange = (newUser) => {
            setUser(newUser);
        };

        authManager.addListener(handleAuthChange);
        return () => authManager.removeListener(handleAuthChange);
    }, []);

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            // Hero Section
            React.createElement('section', { className: 'text-center py-8 mb-8' },
                React.createElement('h1', { 
                    className: 'text-4xl font-bold text-gray-900 mb-4' 
                }, 'ARQ6 - Análise de Mercado com IA'),
                
                React.createElement('p', { 
                    className: 'text-xl text-gray-600 mb-8 max-w-2xl mx-auto' 
                }, 'Plataforma avançada de análise de mercado com inteligência artificial. Obtenha insights profundos e estratégicos baseados em dados reais da internet.'),
                
                user ? 
                    React.createElement('div', { className: 'flex gap-4 justify-center' },
                        React.createElement('button', {
                            className: 'btn btn-primary btn-lg',
                            onClick: () => router.navigate('/analysis')
                        }, 'Nova Análise'),
                        
                        React.createElement('button', {
                            className: 'btn btn-secondary btn-lg',
                            onClick: () => router.navigate('/dashboard')
                        }, 'Ver Dashboard')
                    ) :
                    React.createElement('div', { className: 'flex gap-4 justify-center' },
                        React.createElement('button', {
                            className: 'btn btn-primary btn-lg',
                            onClick: () => router.navigate('/register')
                        }, 'Começar Agora'),
                        
                        React.createElement('button', {
                            className: 'btn btn-secondary btn-lg',
                            onClick: () => router.navigate('/login')
                        }, 'Fazer Login')
                    )
            ),

            // Features Section
            React.createElement('section', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' },
                React.createElement('div', { className: 'card p-6 text-center' },
                    React.createElement('div', { 
                        className: 'text-3xl mb-4',
                        style: { color: '#2563eb' }
                    }, '🤖'),
                    React.createElement('h3', { 
                        className: 'text-xl font-semibold mb-2' 
                    }, 'IA Avançada'),
                    React.createElement('p', { 
                        className: 'text-gray-600' 
                    }, 'Powered by Gemini 2.5 Pro para análises profundas e precisas')
                ),
                
                React.createElement('div', { className: 'card p-6 text-center' },
                    React.createElement('div', { 
                        className: 'text-3xl mb-4',
                        style: { color: '#2563eb' }
                    }, '🌐'),
                    React.createElement('h3', { 
                        className: 'text-xl font-semibold mb-2' 
                    }, 'Dados Reais'),
                    React.createElement('p', { 
                        className: 'text-gray-600' 
                    }, 'Pesquisas automáticas na web para insights baseados em dados atuais')
                ),
                
                React.createElement('div', { className: 'card p-6 text-center' },
                    React.createElement('div', { 
                        className: 'text-3xl mb-4',
                        style: { color: '#2563eb' }
                    }, '📊'),
                    React.createElement('h3', { 
                        className: 'text-xl font-semibold mb-2' 
                    }, 'Análises Completas'),
                    React.createElement('p', { 
                        className: 'text-gray-600' 
                    }, 'Perfis de avatar ideais, tendências de mercado e insights estratégicos')
                )
            ),

            // How it Works Section
            React.createElement('section', { className: 'card p-8 mb-8' },
                React.createElement('h2', { 
                    className: 'text-3xl font-bold text-center mb-6' 
                }, 'Como Funciona'),
                
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { 
                            className: 'w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4' 
                        },
                            React.createElement('span', { 
                                className: 'text-blue-600 font-bold' 
                            }, '1')
                        ),
                        React.createElement('h4', { 
                            className: 'font-semibold mb-2' 
                        }, 'Defina o Segmento'),
                        React.createElement('p', { 
                            className: 'text-sm text-gray-600' 
                        }, 'Informe o segmento de mercado que deseja analisar')
                    ),
                    
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { 
                            className: 'w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4' 
                        },
                            React.createElement('span', { 
                                className: 'text-blue-600 font-bold' 
                            }, '2')
                        ),
                        React.createElement('h4', { 
                            className: 'font-semibold mb-2' 
                        }, 'IA Pesquisa'),
                        React.createElement('p', { 
                            className: 'text-sm text-gray-600' 
                        }, 'Nossa IA faz pesquisas automáticas na web')
                    ),
                    
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { 
                            className: 'w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4' 
                        },
                            React.createElement('span', { 
                                className: 'text-blue-600 font-bold' 
                            }, '3')
                        ),
                        React.createElement('h4', { 
                            className: 'font-semibold mb-2' 
                        }, 'Análise Profunda'),
                        React.createElement('p', { 
                            className: 'text-sm text-gray-600' 
                        }, 'Gemini 2.5 Pro processa e analisa os dados')
                    ),
                    
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { 
                            className: 'w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4' 
                        },
                            React.createElement('span', { 
                                className: 'text-blue-600 font-bold' 
                            }, '4')
                        ),
                        React.createElement('h4', { 
                            className: 'font-semibold mb-2' 
                        }, 'Receba Insights'),
                        React.createElement('p', { 
                            className: 'text-sm text-gray-600' 
                        }, 'Obtenha análises detalhadas e acionáveis')
                    )
                )
            ),

            // CTA Section
            !user && React.createElement('section', { className: 'text-center py-8' },
                React.createElement('div', { className: 'card p-8' },
                    React.createElement('h2', { 
                        className: 'text-2xl font-bold mb-4' 
                    }, 'Pronto para começar?'),
                    React.createElement('p', { 
                        className: 'text-gray-600 mb-6' 
                    }, 'Cadastre-se agora e faça sua primeira análise de mercado gratuita.'),
                    React.createElement('button', {
                        className: 'btn btn-primary btn-lg',
                        onClick: () => router.navigate('/register')
                    }, 'Cadastrar Grátis')
                )
            )
        )
    );
};

window.HomePage = HomePage;

