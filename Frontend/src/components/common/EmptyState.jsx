/**
 * Muestra un estado vacio con icono, mensaje y accion opcional.
 * Se usa cuando no hay datos (Home sin posts, busquedas vacias, etc.)
 */
const EmptyState = ({
  icon = 'inbox',
  message = 'No hay contenido disponible',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="material-symbols-outlined text-5xl text-outline mb-2">{icon}</span>
      <p className="text-on-surface-variant text-center font-medium">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-6 py-2 bg-primary text-on-primary font-bold rounded-full hover:shadow-lg transition-transform active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
