import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-black text-blue-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        Página no encontrada
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;