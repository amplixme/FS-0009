/**
 * Modal de confirmacion reutilizable. Soporte modo danger (rojo) para acciones destructivas.
 * Se usara en Card 3 (FS0009-28) para confirmar eliminacion de posts.
 */
import { useEffect } from 'react';

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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md sm:mx-4 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 max-h-[90dvh] overflow-y-auto"
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
          <h3 id="confirm-modal-title" className="text-lg font-bold text-on-surface">{title}</h3>
        </div>

        <p className="text-on-surface-variant mb-6">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2 rounded-full border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-5 py-2 rounded-full font-bold text-sm transition-colors ${
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