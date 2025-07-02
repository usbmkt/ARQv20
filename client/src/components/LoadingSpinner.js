// Componente Loading Spinner
const LoadingSpinner = ({ size = 'md', text = 'Carregando...' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6', 
        lg: 'w-8 h-8'
    };

    return React.createElement('div', { 
        className: 'flex flex-col items-center justify-center gap-2' 
    },
        React.createElement('div', { 
            className: `loading ${sizeClasses[size] || sizeClasses.md}` 
        }),
        text && React.createElement('span', { 
            className: 'text-sm text-gray-600' 
        }, text)
    );
};

window.LoadingSpinner = LoadingSpinner;

