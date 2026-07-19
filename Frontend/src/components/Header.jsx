import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ role, onMenuToggle }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">

                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tight-tracking">
                            TuProyecto
                        </Link>

                        <nav className="hidden md:flex gap-6">
                            <Link to="/" className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1 font-inter tracking-tight">Latest</Link>
                            <a href="#" className="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-inter tracking-tight">Popular</a>
                            <a href="#" className="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-inter tracking-tight">Newsletter</a>
                            {role === 'admin' && (
                                <Link to="/admin" className="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-inter tracking-tight">Admin</Link>
                            )}
                        </nav>
                    </div>


                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="hidden md:block text-sm font-semibold text-on-surface">
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:block px-5 py-2 text-slate-600 font-medium hover:bg-slate-50 transition-colors duration-200 rounded-full"
                                >
                                    Log Out
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
                            aria-label="Abrir menú"
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 cursor-pointer transition-transform hover:scale-105"
                        >
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT95iqiYxi6VZXmrtLvbsuXkNVD367C45aiXNvED7mI-XevT2y4sbMA_NgYjv00TpUJL3vsTnmUBtnvrmSBHbXwPx-Xjum6GGBODPuq-P3ntfsg9lF7VaQ9VUkDVO8S2FEKTR-1xCuNW3mMO3uTar5TF_Fbj1s28RUobKNEY-1ujJ640oG2sxkptBCQtWUOLFcThP4Yd434sLN56Rv8KaZiSV6FoGRtzHoxqeQ0rcWnmHuXPhBlOOFMqVwiCnS8RHJLc7HWGoi1cqE"
                                alt="User profile"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </div>
            </header>

            
        </>
    );
};

export default Header;