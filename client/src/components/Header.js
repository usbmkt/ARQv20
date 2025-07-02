// Componente Header
const Header = () => {
    const [user, setUser] = React.useState(authManager.getUser());

    React.useEffect(() => {
        const handleAuthChange = (newUser) => {
            setUser(newUser);
        };

        authManager.addListener(handleAuthChange);
        return () => authManager.removeListener(handleAuthChange);
    }, []);

    const handleLogout = async () => {
        await authManager.logout();
        router.navigate('/');
    };

    return React.createElement('header', { className: 'header' },
        React.createElement('div', { className: 'container' },
            React.createElement('a', { 
                href: '#/', 
                className: 'logo',
                onClick: (e) => {
                    e.preventDefault();
                    router.navigate('/');
                }
            }, 'ARQ6'),
            
            React.createElement('nav', { className: 'nav' },
                user ? [
                    React.createElement('a', {
                        key: 'dashboard',
                        href: '#/dashboard',
                        className: 'nav-link',
                        onClick: (e) => {
                            e.preventDefault();
                            router.navigate('/dashboard');
                        }
                    }, 'Dashboard'),
                    
                    React.createElement('a', {
                        key: 'analysis',
                        href: '#/analysis',
                        className: 'nav-link',
                        onClick: (e) => {
                            e.preventDefault();
                            router.navigate('/analysis');
                        }
                    }, 'Nova Análise'),
                    
                    React.createElement('a', {
                        key: 'history',
                        href: '#/history',
                        className: 'nav-link',
                        onClick: (e) => {
                            e.preventDefault();
                            router.navigate('/history');
                        }
                    }, 'Histórico'),
                    
                    React.createElement('div', { 
                        key: 'user-menu',
                        className: 'flex items-center gap-4' 
                    },
                        React.createElement('span', { 
                            className: 'text-sm text-gray-600' 
                        }, `Olá, ${user.nome}`),
                        
                        React.createElement('button', {
                            className: 'btn btn-secondary btn-sm',
                            onClick: handleLogout
                        }, 'Sair')
                    )
                ] : [
                    React.createElement('a', {
                        key: 'login',
                        href: '#/login',
                        className: 'nav-link',
                        onClick: (e) => {
                            e.preventDefault();
                            router.navigate('/login');
                        }
                    }, 'Entrar'),
                    
                    React.createElement('a', {
                        key: 'register',
                        href: '#/register',
                        className: 'btn btn-primary btn-sm',
                        onClick: (e) => {
                            e.preventDefault();
                            router.navigate('/register');
                        }
                    }, 'Cadastrar')
                ]
            )
        )
    );
};

window.Header = Header;

