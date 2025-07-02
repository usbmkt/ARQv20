// Página 404 (Not Found)
const NotFoundPage = () => {
    return React.createElement('div', { className: 'main' },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'flex flex-col items-center justify-center py-12' },
                React.createElement('h1', { 
                    className: 'text-6xl font-bold text-gray-900 mb-4' 
                }, '404'),
                React.createElement('h2', { 
                    className: 'text-2xl font-semibold text-gray-700 mb-6' 
                }, 'Página não encontrada'),
                React.createElement('p', { 
                    className: 'text-gray-600 mb-8 text-center max-w-md' 
                }, 'A página que você está procurando não existe ou foi movida.'),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => router.navigate('/')
                }, 'Voltar para a Página Inicial')
            )
        )
    );
};

window.NotFoundPage = NotFoundPage;

