// Página de Registro
const RegisterPage = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
        nome: '',
        empresa: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

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

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { confirmPassword, ...userData } = formData;
            const result = await authManager.register(userData);
            
            if (result.success) {
                setSuccess('Conta criada com sucesso! Você pode fazer login agora.');
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    nome: '',
                    empresa: ''
                });
                
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    router.navigate('/login');
                }, 2000);
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
                        }, 'Criar Conta'),
                        React.createElement('p', { 
                            className: 'text-gray-600' 
                        }, 'Cadastre-se no ARQ6 e comece a analisar')
                    ),

                    error && React.createElement(Alert, {
                        type: 'error',
                        message: error,
                        onClose: () => setError('')
                    }),

                    success && React.createElement(Alert, {
                        type: 'success',
                        message: success
                    }),

                    React.createElement('form', { onSubmit: handleSubmit },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { 
                                className: 'form-label',
                                htmlFor: 'nome'
                            }, 'Nome Completo'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'nome',
                                name: 'nome',
                                className: 'form-input',
                                value: formData.nome,
                                onChange: handleChange,
                                required: true,
                                disabled: loading
                            })
                        ),

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
                                htmlFor: 'empresa'
                            }, 'Empresa (opcional)'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'empresa',
                                name: 'empresa',
                                className: 'form-input',
                                value: formData.empresa,
                                onChange: handleChange,
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
                                disabled: loading,
                                minLength: 6
                            })
                        ),

                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { 
                                className: 'form-label',
                                htmlFor: 'confirmPassword'
                            }, 'Confirmar Senha'),
                            React.createElement('input', {
                                type: 'password',
                                id: 'confirmPassword',
                                name: 'confirmPassword',
                                className: 'form-input',
                                value: formData.confirmPassword,
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
                                React.createElement(LoadingSpinner, { size: 'sm', text: 'Criando conta...' }) :
                                'Criar Conta'
                        )
                    ),

                    React.createElement('div', { className: 'text-center mt-6' },
                        React.createElement('p', { className: 'text-gray-600' },
                            'Já tem uma conta? ',
                            React.createElement('a', {
                                href: '#/login',
                                className: 'text-blue-600 hover:text-blue-800',
                                onClick: (e) => {
                                    e.preventDefault();
                                    router.navigate('/login');
                                }
                            }, 'Faça login')
                        )
                    )
                )
            )
        )
    );
};

window.RegisterPage = RegisterPage;

