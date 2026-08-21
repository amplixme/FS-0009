import { useState } from "react";
import ImageUpload from "./common/ImageUpload";

const BIO_MAX_LENGTH = 200;

const ProfileFormModal = ({ isOpen, mode, initialData, onSubmit, onCancel, isSubmitting, error }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, bio, avatarUrl };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
          <h2 className="text-xl font-bold text-on-surface">
            {mode === "create" ? "Crear perfil" : "Editar perfil"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Avatar
            </label>
            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
              disabled={isSubmitting}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40 disabled:opacity-60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Biografía
              </label>
              <span
                className={`text-xs font-medium ${
                  bio.length >= BIO_MAX_LENGTH ? "text-error" : "text-on-surface-variant"
                }`}
              >
                {bio.length}/{BIO_MAX_LENGTH}
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
              placeholder="Ej: Desarrollador Full Stack"
              rows={3}
              maxLength={BIO_MAX_LENGTH}
              disabled={isSubmitting}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40 disabled:opacity-60 resize-none"
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-on-surface-variant font-semibold border-2 border-outline-variant hover:bg-surface-container-low transition-all disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creando..."
                  : "Actualizando datos..."
                : mode === "create"
                ? "Crear perfil"
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormModal;