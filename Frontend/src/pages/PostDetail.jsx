/**
 * Pagina de detalle de un post.
 * Obtiene el post por ID de la URL, muestra contenido completo,
 * y botones Editar/Eliminar solo si el usuario es el autor.
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getById, deletePost } from '../services/post.service';
import { useAuth } from '../context/useAuth';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getById(id);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" text="Cargando post..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return (
      <EmptyState
        icon="article"
        message="Post no encontrado"
        actionLabel="Volver a inicio"
        onAction={() => navigate('/')}
      />
    );
  }

  const authorName = post.author?.name || 'Autor desconocido';
  const isAuthor = user && user.id === post.authorId;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(id);
      setShowDeleteModal(false);
      navigate('/', { state: { successMessage: 'Post eliminado correctamente' } });
    } catch (err) {
      setShowDeleteModal(false);
      setToast({ visible: true, message: err.message || 'Error al eliminar el post', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-on-surface truncate">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Article Canvas */}
        <article className="lg:col-span-8">
          {/* Hero Section */}
          <div className="relative w-full max-w-[800px] mx-auto mb-10 group">
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-surface-container-low shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-primary/30">article</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="max-w-[720px] mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 py-6 border-y border-outline-variant/20">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-on-surface">{authorName}</div>
                <div className="flex items-center gap-3 text-label-md text-on-surface-variant">
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose max-w-[720px] mx-auto text-lg leading-relaxed text-on-surface-variant font-body">
            <p>{post.content}</p>
          </div>

          {/* Edit/Delete buttons - solo visible si es el autor */}
          {isAuthor && (
            <div className="flex items-center justify-end gap-3 mt-16 pt-8 border-t border-outline-variant/20 max-w-[720px] mx-auto">
              <Link
                to={`/posts/${post.id}/edit`}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-outline text-on-surface hover:bg-surface-container transition-all text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-error text-error hover:bg-error-container transition-all text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Eliminar
              </button>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 space-y-10">
            {/* Table of Contents placeholder */}
            <div className="bg-surface-container-low rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span className="material-symbols-outlined">list_alt</span>
                <h4 className="font-bold uppercase tracking-wider text-xs">Tabla de contenidos</h4>
              </div>
              <nav className="flex flex-col gap-3 font-medium text-on-surface-variant">
                <span className="flex items-center gap-2 text-on-surface-variant/60">
                  <span className="w-1 h-1 rounded-full bg-primary/30"></span>
                  Contenido del artículo
                </span>
              </nav>
            </div>

            {/* Newsletter Sidebar */}
            <div className="bg-primary p-8 rounded-2xl text-on-primary">
              <h4 className="font-bold text-xl mb-2">Mantente al día</h4>
              <p className="text-sm opacity-80 mb-6">Recibe las mejores historias de diseño y tecnología cada semana.</p>
              <input
                className="w-full bg-white/10 border-white/20 rounded-full px-4 py-2 text-sm placeholder:text-white/40 focus:ring-2 ring-white/50 border-none mb-3"
                placeholder="tu@email.com"
                type="email"
              />
              <button className="w-full bg-white text-primary font-bold py-2 rounded-full hover:bg-opacity-90 transition-all">
                Unirse
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Eliminar publicación"
        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
        confirmLabel={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        danger
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default PostDetail;
