import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Ocurrió un error inesperado al renderizar la aplicación.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
