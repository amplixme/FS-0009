import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getAll } from '../services/post.service';
import PostCard from '../components/PostCard';
// Componentes comunes extraidos para reutilizar en PostDetail, busquedas, etc.
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/common/Pagination';

const POSTS_PER_PAGE = 4;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlPage = Number(searchParams.get('page')) || 1;

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: !!location.state?.successMessage,
    message: location.state?.successMessage || '',
    type: 'success',
  });
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll({
          page: urlPage,
          limit: POSTS_PER_PAGE,
          category: activeCategory,
        });
        setPosts(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, urlPage]);

  const handleSelectCategory = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page'); // volver a la página 1 al cambiar de categoría
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page);
    } else {
      params.delete('page');
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Chips de categorías - mobile */}
      <div className="mb-6 lg:hidden">
        <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
      </div>

      <div className="flex gap-12">
        {/* Sidebar Navigation Shell */}
        <aside className="w-64 hidden lg:block sticky top-24 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
          <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
        </aside>

        {/* Main Content Grid */}
        <div className="flex-1">
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

          {!loading && !error && posts.length > 0 && (
            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
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