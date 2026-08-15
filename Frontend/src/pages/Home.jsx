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
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  const urlPage = searchParams.get('page');
  const urlSort = searchParams.get('sort');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [toast, setToast] = useState({
    visible: !!location.state?.successMessage,
    message: location.state?.successMessage || '',
    type: 'success',
  });

  // Estado local para el input de búsqueda (no controlado, usa defaultValue)
  const [searchInputValue, setSearchInputValue] = useState(urlSearch || '');

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construir params solo con valores significativos (no undefined ni strings vacíos)
        const params = {};
        if (urlSearch) params.search = urlSearch;
        if (urlCategory) params.category = urlCategory;
        if (urlPage) params.page = urlPage;
        if (urlSort) params.sort = urlSort;

        const data = await getAll(params);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [urlSearch, urlCategory, urlPage, urlSort]);

  const handleSearchChange = (value) => {
    setSearchInputValue(value);
    // Navegar con replace y resetear page a 1 al buscar
    setSearchParams({ search: value, page: '1' }, { replace: true });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearchParams({ category, page: '1' }, { replace: true });
  };

  const hasActiveFilters = !!urlSearch || !!urlCategory;

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary-container/10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-extrabold text-on-surface mb-6 tight-tracking leading-tight">Últimas publicaciones</h1>
            <div className="relative flex items-center">
              <SearchBar
                placeholder="Buscar artículos..."
                value={searchInputValue}
                onSearch={handleSearchChange}
                className=""
                showClearButton={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chips de categorías - mobile */}
      <div className="mb-6 lg:hidden">
        <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
      </div>

      <div className="flex gap-12">
        {/* Sidebar Navigation Shell */}
        <aside className="w-64 hidden lg:block sticky top-24 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
          <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchInputValue('');
                setSearchParams({ search: undefined, category: undefined, page: '1' }, { replace: true });
              }}
              className="w-full mt-2 rounded-md px-3 py-2 text-sm text-primary/90 bg-primary/10 border border-primary/20 hover:bg-primary/5 transition-colors text-center"
            >
              Limpiar filtros
            </button>
          )}
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
              message={hasActiveFilters ? 'No se encontraron artículos' : 'Todavía no hay publicaciones.'}
              actionLabel={hasActiveFilters ? 'Refinar búsqueda' : 'Crear primera publicación'}
              onAction={() => hasActiveFilters ? navigate('/') : navigate('/post')}
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
          {posts.length > 0 && (
            <Pagination
              currentPage={parseInt(urlPage) || 1}
              totalPages={data ? data.totalPages : 1}
              siblingCount={1}
              onPageChange={(page) => {
                setSearchParams({ ...(urlSearch ? { search: urlSearch } : {}), category: urlCategory, page: String(page) }, { replace: true });
              }}
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