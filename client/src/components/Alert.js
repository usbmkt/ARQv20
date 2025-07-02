// Componente Alert
const Alert = ({ type = 'info', message, onClose }) => {
    const typeClasses = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return React.createElement('div', { 
        className: `alert ${typeClasses[type]}` 
    },
        React.createElement('div', { 
            className: 'flex items-center justify-between' 
        },
            React.createElement('div', { 
                className: 'flex items-center gap-2' 
            },
                React.createElement('span', { 
                    className: 'font-semibold' 
                }, icons[type]),
                React.createElement('span', null, message)
            ),
            onClose && React.createElement('button', {
                onClick: onClose,
                className: 'text-lg font-bold opacity-70 hover:opacity-100',
                style: { background: 'none', border: 'none', cursor: 'pointer' }
            }, '×')
        )
    );
};

window.Alert = Alert;

