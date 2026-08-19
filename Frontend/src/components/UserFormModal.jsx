import { useState } from "react";

const UserFormModal = ({ isOpen, mode, initialData, onSubmit, onCancel, isSubmitting, error }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "USER");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, email, role };
    if (mode === "create") {
      data.password = password;
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md overflow-hidden max-h-[90dvh] flex flex-col pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
          <h2 className="text-xl font-bold text-on-surface">
            {mode === "create" ? "Crear nuevo usuario" : "Editar usuario"}
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
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
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
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
              disabled={isSubmitting}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40 disabled:opacity-60"
            />
          </div>

          {mode === "create" && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isSubmitting}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Selector de rol
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    checked={role === "USER"}
                    onChange={() => setRole("USER")}
                    disabled={isSubmitting}
                    className="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded-full checked:border-primary transition-all"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                </div>
                <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                  USER
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={role === "ADMIN"}
                    onChange={() => setRole("ADMIN")}
                    disabled={isSubmitting}
                    className="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded-full checked:border-primary transition-all"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                </div>
                <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                  ADMIN
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-on-surface-variant font-semibold border-2 border-outline-variant hover:bg-surface-container-low transition-all disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creando..."
                  : "Guardando..."
                : mode === "create"
                ? "Crear usuario"
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;