import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');

const Header = ({ onMenuToggle, isMenuOpen }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const activeClass = "text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1 font-inter tracking-tight";
    const inactiveClass = "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-inter tracking-tight";

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">

                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tight-tracking">
                            TuProyecto
                        </Link>

                        <nav className="hidden md:flex gap-6">
                            <Link to="/" className={location.pathname === "/" ? activeClass : inactiveClass}>Latest</Link>
                            <a href="#" className={inactiveClass}>Popular</a>
                            <a href="#" className={inactiveClass}>Newsletter</a>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className={location.pathname === "/admin" ? activeClass : inactiveClass}>Admin</Link>
                            )}
                        </nav>
                    </div>


                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Hola, {user.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="hidden md:block px-5 py-2 text-slate-600 font-medium hover:bg-slate-50 transition-colors duration-200 rounded-full"
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden md:block px-5 py-2 text-slate-600 font-medium hover:bg-slate-50 transition-colors duration-200 rounded-full"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden md:block px-6 py-2 bg-primary text-on-primary font-bold rounded-full hover:shadow-lg transition-transform active:scale-95 duration-200"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {/* dispara el menú (MenuMobile) al hacer click */}
                        <button
                            type="button"
                            onClick={onMenuToggle}
                            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 cursor-pointer transition-transform hover:scale-105 flex items-center justify-center bg-primary/10"
                        >
                            {isAuthenticated ? (
                                <span className="text-primary font-bold text-sm">
                                    {getInitials(user?.name) || '?'}
                                </span>
                            ) : (
                                <span className="material-symbols-outlined text-primary">menu</span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            
        </>
    );
};

export default Header;