/**
 * Modal de confirmacion reutilizable. Soporte modo danger (rojo) para acciones destructivas.
 * Se usara en Card 3 (FS0009-28) para confirmar eliminacion de posts.
 */
const ConfirmModal = ({
  isOpen,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`material-symbols-outlined text-2xl ${
              danger ? 'text-error' : 'text-primary'
            }`}
          >
            {danger ? 'warning' : 'info'}
          </span>
          <h3 className="text-lg font-bold text-on-surface">{title}</h3>
        </div>

        <p className="text-on-surface-variant mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${
              danger
                ? 'bg-error text-on-error hover:bg-error/90'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;