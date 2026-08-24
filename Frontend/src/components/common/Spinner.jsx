/**
 * Componente reutilizable de spinner de carga.
 * Se usa para indicar estados de carga en Home, PostDetail, etc.
 */
const Spinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span
        className={`material-symbols-outlined animate-spin text-primary ${
          sizeClasses[size] || sizeClasses.md
        }`}
      >
        progress_activity
      </span>
      {text && <p className="text-on-surface-variant text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Spinner;
