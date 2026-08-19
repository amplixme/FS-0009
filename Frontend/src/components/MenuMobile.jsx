import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getAll as getAllCategories } from '../services/category.service';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

const MenuMobile = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    let active = true;
    getAllCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err) => console.error('Error al cargar categorías en el menú:', err));
    return () => {
      active = false;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div className="fixed inset-0 z-40 bg-on-background/20 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer Lateral */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 h-full w-80 max-w-[85vw] rounded-r-2xl shadow-2xl flex flex-col font-inter antialiased overflow-hidden"
      >
        {/* Header del Menú: Perfil */}
        <header className="flex items-center gap-4 p-8 bg-surface-container-low/50">
          {isAuthenticated ? (
            <>
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-xl font-bold">
                  {getInitials(user?.name)}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-on-surface truncate">{user?.name}</h2>
                <p className="text-sm text-on-surface-variant font-medium truncate">{user?.email}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">person</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-on-surface">Invitado</h2>
                <p className="text-sm text-on-surface-variant font-medium">Inicia sesión para crear contenido</p>
              </div>
            </>
          )}
        </header>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">home</span>
            <span className="font-medium">Inicio</span>
          </Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">login</span>
                <span className="font-medium">Iniciar sesión</span>
              </Link>
              <Link to="/register" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">person_add</span>
                <span className="font-medium">Registrarse</span>
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link to="/post" onClick={onClose} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-lg px-4 py-3 flex items-center gap-4">
              <span className="material-symbols-outlined">edit</span>
              <span>Escribir artículo</span>
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">admin_panel_settings</span>
              <span className="font-medium">Admin</span>
            </Link>
          )}

          {/* Categorías: desde la API real */}
          <div className="mt-8 mb-4">
            <div className="flex items-center justify-between px-4 mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant/70">Categorías</h3>
              <span className="material-symbols-outlined text-sm text-outline">category</span>
            </div>
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-sm text-on-surface-variant/60">Sin categorías disponibles</p>
            ) : (
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/?category=${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                    >
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Footer del Menú */}
        {isAuthenticated && (
          <footer className="p-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-4 text-error px-4 py-3 hover:bg-error-container/20 rounded-lg w-full font-bold"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Cerrar Sesión</span>
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default MenuMobile;