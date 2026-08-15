import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getAll } from '../services/post.service';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || null;
  const urlSearch = searchParams.get('search') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlSort = searchParams.get('sort') || 'newest';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (urlCategory) params.category = urlCategory;
        if (urlSearch.trim()) params.search = urlSearch.trim();
        if (urlPage > 1) params.page = urlPage;
        if (urlSort !== 'newest') params.sort = urlSort;

        const response = await getAll(params);
        setPosts(response.posts || []);
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [urlCategory, urlSearch, urlPage, urlSort]);

  const handleSearch = useCallback((searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate({ pathname: '/', search: params.toString() }, { replace: true });
  }, [navigate, searchParams]);

  const handleCategoryChange = useCallback((category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    params.delete('search');
    navigate({ pathname: '/', search: params.toString() }, { replace: true });
  }, [navigate, searchParams]);

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    navigate({ pathname: '/', search: params.toString() }, { replace: true });
  }, [navigate, searchParams]);

  const hasActiveFilters = urlCategory || urlSearch.trim();

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      <section className="mb-8">
        <div className="max-w-2xl mx-auto">
          <SearchBar
            value={urlSearch}
            onSearch={handleSearch}
            placeholder="Buscar artículos..."
            showClearButton={!!urlSearch.trim()}
          />
        </div>
      </section>

      <section className="mb-6 lg:hidden">
        <CategoryFilter activeCategory={urlCategory} onSelectCategory={handleCategoryChange} />
      </section>

      <div className="flex gap-12">
        <aside className="w-64 hidden lg:block sticky top-24 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
          <CategoryFilter activeCategory={urlCategory} onSelectCategory={handleCategoryChange} />
          
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="mt-4 w-full px-4 py-2 text-sm text-slate-600 hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </aside>

        <div className="flex-1">
          {loading && <Spinner size="lg" text="Cargando publicaciones..." />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          )}

          {!loading && !error && posts.length === 0 && (
            <EmptyState
              icon={urlSearch.trim() ? "search" : "article"}
              message={urlSearch.trim() ? "No se encontraron artículos" : "Todavía no hay publicaciones."}
              actionLabel={urlSearch.trim() ? "Limpiar búsqueda" : "Crear primera publicación"}
              onAction={urlSearch.trim() ? clearSearch : () => navigate('/post')}
            />
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <Pagination 
            currentPage={urlPage} 
            totalPages={totalPages} 
          />
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-outline">
        {total > 0 && (
          <>
            Mostrando {Math.min((urlPage - 1) * 10 + 1, total)} - {Math.min(urlPage * 10, total)} de {total} publicaciones
          </>
        )}
      </div>

      <Toast
        message={location?.state?.successMessage || ''}
        type="success"
        isVisible={!!location?.state?.successMessage}
        onClose={() => {}}
      />
    </div>
  );
};

export default Home;