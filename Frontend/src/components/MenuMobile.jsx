//import React from 'react';
import { Link } from 'react-router-dom';

const MenuMobile = ({ isOpen, onClose, role, userName = 'Alex Rivera', userEmail = 'alex@ejemplo.com' }) => {
  if (!isOpen) return null;

  // role/userName/userEmail llegan con valores por defecto (mockup) hasta conectar al AuthContext real en FS0009-17

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div className="fixed inset-0 z-40 bg-on-background/20 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer Lateral */}
      <aside className="fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 h-full w-80 rounded-r-2xl shadow-2xl flex flex-col font-inter antialiased overflow-hidden">
        
        {/* Header del Menú: Perfil */}
        <header className="flex flex-col p-8 gap-4 bg-surface-container-low/50">
          <div className="relative w-16 h-16">
            <img className="w-16 h-16 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB62b7yMm1NQoaVoxOLJVYpdgjgjS7ldvZHJ_awq6AzaUJ1Gr_D7HExHtqBdHan9pACW90EZl5G1_8SKAQ7oUN2m7CkbCQGunYi_3tjAwWcwHL4lQRnFuuupJBY2xeWoaE6_mn4UJ8q1jhq9Mlehw31qmBiZRZlJJF2WaXPNOE7jttKozVj3EjvSXL3OXY95A2gGTbuiHBGfmgcwbMhrfrdz4EMyx-He1th5I7xHM3dmJ-eVYzbbCHsvW06f18V3ux0U3Yi3abBKAN8" alt="Profile" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-on-surface">{userName}</h2>
            <p className="text-sm text-on-surface-variant font-medium">{userEmail}</p>
          </div>
        </header>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">home</span>
            <span className="font-medium">Inicio</span>
          </Link>
          
          <Link to="/write" onClick={onClose} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-lg px-4 py-3 flex items-center gap-4">
            <span className="material-symbols-outlined">edit</span>
            <span>Escribir artículo</span>
          </Link>

          {/* Solo muestra Admin si el rol es 'admin' */}
          {role === 'admin' && (
            <Link to="/admin" onClick={onClose} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">admin_panel_settings</span>
              <span className="font-medium">Admin</span>
            </Link>
          )}

          {/* Categorías: igual para todos los roles */}
          {/* Datos hardcodeados del mockup — conectar a API de categorías reales cuando exista esa card */}
          <div className="mt-8 mb-4">
            <div className="flex items-center justify-between px-4 mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant/70">Categorías</h3>
              <span className="material-symbols-outlined text-sm text-outline">category</span>
            </div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                  <span className="font-medium">Tecnología</span>
                  <span className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md text-on-surface-variant group-hover:bg-white transition-colors">24</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                  <span className="font-medium">Diseño</span>
                  <span className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md text-on-surface-variant group-hover:bg-white transition-colors">18</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                  <span className="font-medium">Programación</span>
                  <span className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md text-on-surface-variant group-hover:bg-white transition-colors">42</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                  <span className="font-medium">DevOps</span>
                  <span className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md text-on-surface-variant group-hover:bg-white transition-colors">12</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                  <span className="font-medium">Opinión</span>
                  <span className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md text-on-surface-variant group-hover:bg-white transition-colors">7</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer del Menú */}
        <footer className="p-6 border-t border-slate-100 dark:border-slate-800">
          <button type="button" className="flex items-center gap-4 text-error px-4 py-3 hover:bg-error-container/20 rounded-lg w-full font-bold">
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default MenuMobile;