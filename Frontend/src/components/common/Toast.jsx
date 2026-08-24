/**
 * Toast de notificaciones con auto dismiss. Soporta success, error e info.
 * Se usara para feedback rapido: post creado, editado, eliminado, etc.
 */
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-primary',
      text: 'text-on-primary',
      icon: 'check_circle',
    },
    error: {
      bg: 'bg-error',
      text: 'text-on-error',
      icon: 'error',
    },
    info: {
      bg: 'bg-inverse-surface',
      text: 'text-inverse-on-surface',
      icon: 'info',
    },
  };

  const s = styles[type] || styles.success;

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 animate-slide-up flex">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg w-full sm:w-auto ${s.bg} ${s.text}`}
      >
        <span className="material-symbols-outlined text-lg">{s.icon}</span>
        <span className="font-medium text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
