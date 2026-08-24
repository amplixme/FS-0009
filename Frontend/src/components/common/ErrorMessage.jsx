/**
 * Muestra un error con icono y boton de reintento opcional.
 * Se usa en Home, PostDetail y cualquier peticion API que pueda fallar.
 */
const ErrorMessage = ({ message = 'Ocurrió un error', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="material-symbols-outlined text-5xl text-error mb-2">error</span>
      <p className="text-error text-center font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-2 bg-primary text-on-primary font-bold rounded-full hover:shadow-lg transition-transform active:scale-95"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
