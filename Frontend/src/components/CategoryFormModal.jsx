import { useState, useEffect } from 'react';

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .replace(/[^a-z0-9\s-]/g, '') // saca caracteres no permitidos
    .trim()
    .replace(/\s+/g, '-') // espacios -> guiones
    .replace(/-+/g, '-'); // colapsa guiones repetidos
};

const CategoryFormModal = ({ isOpen, mode, initialData, onClose, onSubmit, isSaving, serverError }) => {
  const [name, setName] = useState(() => initialData?.name || '');
  const [slug, setSlug] = useState(() => initialData?.slug || '');
  const [slugEditedManually, setSlugEditedManually] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!slugEditedManually) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setSlugEditedManually(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: name.trim(), slug: slug.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="category-modal-title" className="text-xl font-bold text-on-surface">
            {mode === 'edit' ? 'Editar categoría' : 'Crear nueva categoría'}
          </h2>
          <button onClick={onClose} className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-outline mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ej. Tecnología"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wide text-outline mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="tecnologia"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
            <p className="text-xs text-outline mt-1">Solo minúsculas, números y guiones.</p>
          </div>

          {serverError && (
            <p className="text-error text-sm font-semibold mb-4">{serverError}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-full border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-primary text-on-primary font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;