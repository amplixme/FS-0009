import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getAll } from '../services/post.service';
import PostCard from '../components/PostCard';
// Componentes comunes extraidos para reutilizar en PostDetail, busquedas, etc.
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import CategoryFilter from '../components/CategoryFilter';
import SortSelector from '../components/SortSelector';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/common/Pagination';

const POSTS_PER_PAGE = 4;
const SORT_VALUES = ['newest', 'oldest', 'comments'];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlPage = Number(searchParams.get('page')) || 1;
  const rawSort = searchParams.get('sort');
  const urlSort = SORT_VALUES.includes(rawSort) ? rawSort : 'newest';
  const hasActiveFilters = Boolean(urlSearch) || Boolean(urlCategory);

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    visible: !!location.state?.successMessage,
    message: location.state?.successMessage || '',
    type: 'success',
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAll(
          {
            page: urlPage,
            limit: POSTS_PER_PAGE,
            category: urlCategory || undefined,
            search: urlSearch || undefined,
            sort: urlSort,
          },
          controller.signal
        );
        setPosts(data.data);
        setTotalPosts(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, [urlSearch, urlCategory, urlPage, urlSort]);

  const updateParams = (mutations) => {
    const params = new URLSearchParams(searchParams);
    mutations(params);
    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    updateParams((params) => {
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      params.delete('page'); // volver a la página 1 al cambiar la búsqueda
    });
  };

  const handleSelectCategory = (slug) => {
    updateParams((params) => {
      if (slug) {
        params.set('category', slug);
      } else {
        params.delete('category');
      }
      params.delete('page'); // volver a la página 1 al cambiar de categoría
    });
  };

  const handleClearFilters = () => {
    updateParams((params) => {
      params.delete('search');
      params.delete('category');
      params.delete('page');
    });
  };

  const handlePageChange = (page) => {
    updateParams((params) => {
      if (page > 1) {
        params.set('page', page);
      } else {
        params.delete('page');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue) => {
    updateParams((params) => {
      params.set('sort', sortValue);
      params.delete('page'); // volver a la página 1 al cambiar el ordenamiento
    });
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative p-6 md:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary-container/10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6 tight-tracking leading-tight">Últimas publicaciones</h1>
            <SearchBar defaultValue={urlSearch} onSearch={handleSearchChange} />
          </div>
        </div>
      </section>

      {/* Chips de categorías - mobile */}
      <div className="mb-6 lg:hidden">
        <CategoryFilter activeCategory={urlCategory} onSelectCategory={handleSelectCategory} />
      </div>

      <div className="flex gap-12">
        {/* Sidebar Navigation Shell */}
        <aside className="w-64 hidden lg:block sticky top-24 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
          <CategoryFilter activeCategory={urlCategory} onSelectCategory={handleSelectCategory} />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
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
              icon={hasActiveFilters ? 'search_off' : 'article'}
              message={
                hasActiveFilters
                  ? 'No se encontraron artículos para tu búsqueda.'
                  : 'Todavía no hay publicaciones.'
              }
              actionLabel={
                hasActiveFilters
                  ? 'Limpiar filtros'
                  : 'Crear primera publicación'
              }
              onAction={() =>
                hasActiveFilters ? handleClearFilters() : navigate('/post')
              }
            />
          )}

          {hasActiveFilters && !loading && !error && posts.length > 0 && (
            <p className="mb-8 text-sm text-outline">
              {totalPosts} {totalPosts === 1 ? 'resultado' : 'resultados'}
              {urlSearch && (
                <>
                  {' '}para <strong className="text-on-surface">"{urlSearch}"</strong>
                </>
              )}
            </p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <SortSelector value={urlSort} onChange={handleSortChange} />
            </div>
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