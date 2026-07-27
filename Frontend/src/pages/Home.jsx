import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAll } from '../services/post.service';
import PostCard from '../components/PostCard';
// Componentes comunes extraidos para reutilizar en PostDetail, busquedas, etc.
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: !!location.state?.successMessage,
    message: location.state?.successMessage || '',
    type: 'success',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary-container/10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-extrabold text-on-surface mb-6 tight-tracking leading-tight">Últimas publicaciones</h1>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
              <input className="w-full pl-12 pr-6 py-4 bg-surface-container-lowest border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg placeholder:text-outline/50" placeholder="Buscar artículos..." type="text" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex gap-12">
        {/* Sidebar Navigation Shell */}
        <aside className="h-screen sticky top-24 w-64 hidden lg:flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 rounded-xl p-3 shadow-sm transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">palette</span>
                  <span className="font-medium">Design</span>
                </div>
                <span className="text-xs bg-primary/10 px-2 py-1 rounded-full font-bold">24</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">terminal</span>
                  <span className="font-medium">Engineering</span>
                </div>
                <span className="text-xs text-slate-400">18</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span className="font-medium">Product</span>
                </div>
                <span className="text-xs text-slate-400">12</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">diversity_3</span>
                  <span className="font-medium">Culture</span>
                </div>
                <span className="text-xs text-slate-400">9</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">newspaper</span>
                  <span className="font-medium">News</span>
                </div>
                <span className="text-xs text-slate-400">31</span>
              </a>
            </nav>
          </div>
          <div className="mt-auto border-t border-surface-container-high pt-6 flex flex-col gap-2">
            <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
              <span className="material-symbols-outlined">help</span>
              <span className="font-medium">Help</span>
            </a>
            <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium">Settings</span>
            </a>
          </div>
        </aside>
        {/* Main Content Grid */}
        <div className="flex-1">
          {/* Estos 3 estados (loading/error/vacio) antes eran divs inline. 
              Se reemplazaron por componentes comunes para consistencia visual 
              y reutilizarlos en PostDetail, busquedas, etc. */}
          {loading && <Spinner size="lg" text="Cargando publicaciones..." />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={() => { setError(null); setLoading(true); }} />
          )}

          {!loading && !error && posts.length === 0 && (
            <EmptyState
              icon="article"
              message="Todavía no hay publicaciones."
              actionLabel="Crear primera publicación"
              onAction={() => navigate('/post')}
            />
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {/* Pagination */}
          <nav className="mt-16 flex justify-center items-center gap-2">
            <button className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">3</button>
            <span className="px-2 text-outline">...</span>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">12</button>
            <button className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Home;