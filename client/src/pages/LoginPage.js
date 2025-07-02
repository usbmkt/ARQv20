// Página de Login
const LoginPage = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        // Redirecionar se já estiver logado
        if (authManager.isAuthenticated()) {
            router.navigate('/dashboard');
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
        setLoading(true);
        setError('');

        try {
            const result = await authManager.login(formData);
            
            if (result.success) {
                router.navigate('/dashboard');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { 
                className: 'max-w-md mx-auto' 
            },
                React.createElement('div', { className: 'card p-8' },
                    React.createElement('div', { className: 'text-center mb-6' },
                        React.createElement('h1', { 
                            className: 'text-2xl font-bold text-gray-900 mb-2' 
                        }, 'Entrar'),
                        React.createElement('p', { 
                            className: 'text-gray-600' 
                        }, 'Acesse sua conta ARQ6')
                    ),

                    error && React.createElement(Alert, {
                        type: 'error',
                        message: error,
                        onClose: () => setError('')
                    }),

                    React.createElement('form', { onSubmit: handleSubmit },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { 
                                className: 'form-label',
                                htmlFor: 'email'
                            }, 'Email'),
                            React.createElement('input', {
                                type: 'email',
                                id: 'email',
                                name: 'email',
                                className: 'form-input',
                                value: formData.email,
                                onChange: handleChange,
                                required: true,
                                disabled: loading
                            })
                        ),

                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { 
                                className: 'form-label',
                                htmlFor: 'password'
                            }, 'Senha'),
                            React.createElement('input', {
                                type: 'password',
                                id: 'password',
                                name: 'password',
                                className: 'form-input',
                                value: formData.password,
                                onChange: handleChange,
                                required: true,
                                disabled: loading
                            })
                        ),

                        React.createElement('button', {
                            type: 'submit',
                            className: 'btn btn-primary w-full',
                            disabled: loading
                        }, 
                            loading ? 
                                React.createElement(LoadingSpinner, { size: 'sm', text: 'Entrando...' }) :
                                'Entrar'
                        )
                    ),

                    React.createElement('div', { className: 'text-center mt-6' },
                        React.createElement('p', { className: 'text-gray-600' },
                            'Não tem uma conta? ',
                            React.createElement('a', {
                                href: '#/register',
                                className: 'text-blue-600 hover:text-blue-800',
                                onClick: (e) => {
                                    e.preventDefault();
                                    router.navigate('/register');
                                }
                            }, 'Cadastre-se')
                        )
                    )
                )
            )
        )
    );
};

window.LoginPage = LoginPage;

