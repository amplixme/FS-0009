import { useState, useEffect } from 'react';
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser,
  updateUser,
  deletePost,
  getAllComments,
  deleteComment,
} from '../services/admin.service';
import { getAll as getAllPosts } from '../services/post.service';
import { useAuth } from '../context/useAuth';
import Spinner from '../components/common/Spinner';
import ConfirmModal from '../components/common/ConfirmModal';
import UserFormModal from '../components/UserFormModal';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Admin = () => {
  const { user: currentUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postDeleteTarget, setPostDeleteTarget] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const [commentDeleteTarget, setCommentDeleteTarget] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const [roleTarget, setRoleTarget] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [editTarget, setEditTarget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);

  const [showAllUsers, setShowAllUsers] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await getStats();
      const usersData = await getAllUsers();
      const postsData = await getAllPosts();
      const commentsData = await getAllComments();
      setStats(statsData);
      setUsers(usersData);
      setPosts(postsData.data || postsData);
      setComments(commentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const statsData = await getStats();
        const usersData = await getAllUsers();
        const postsData = await getAllPosts();
        const commentsData = await getAllComments();
        setStats(statsData);
        setUsers(usersData);
        setPosts(postsData.data || postsData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleConfirmRoleChange = async () => {
    const newRole = roleTarget.role === 'ADMIN' ? 'USER' : 'ADMIN';

    try {
      setIsChangingRole(true);
      await updateUserRole(roleTarget.id, newRole);
      setRoleTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setRoleTarget(null);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      await createUser(data);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = async (data) => {
    try {
      setIsEditing(true);
      setEditError(null);
      await updateUser(editTarget.id, data);
      setEditTarget(null);
      fetchData();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleConfirmDeletePost = async () => {
    try {
      setIsDeletingPost(true);
      await deletePost(postDeleteTarget.id);
      setPostDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setPostDeleteTarget(null);
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleConfirmDeleteComment = async () => {
    try {
      setIsDeletingComment(true);
      await deleteComment(commentDeleteTarget.id);
      setCommentDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setCommentDeleteTarget(null);
    } finally {
      setIsDeletingComment(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-8 max-w-7xl mx-auto w-full">
      {/* Título de la página */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
          Panel de Administración
        </h1>
        <p className="text-on-surface-variant">Gestión general de la plataforma y usuarios.</p>
      </div>

      {loading ? (
        <Spinner size="md" text="Cargando panel..." />
      ) : error ? (
        <p className="text-error text-sm text-center py-8">{error}</p>
      ) : (
        <>
          {/* Sección de estadísticas */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-medium text-sm">Usuarios</span>
                <span className="material-symbols-outlined text-primary">people</span>
              </div>
              <div className="text-[36px] font-bold leading-tight">{stats.totalUsers}</div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-medium text-sm">Posts</span>
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <div className="text-[36px] font-bold leading-tight">{stats.totalPosts}</div>
              {stats.postsToday > 0 && (
                <div className="text-xs text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>
                    {stats.postsToday} nuevo{stats.postsToday !== 1 ? 's' : ''} hoy
                  </span>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-medium text-sm">Comentarios</span>
                <span className="material-symbols-outlined text-primary">chat</span>
              </div>
              <div className="text-[36px] font-bold leading-tight">{stats.totalComments}</div>
            </div>
          </section>

          {/* Posts por categoría */}
          {stats.postsByCategory && stats.postsByCategory.length > 0 && (
            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-12">
              <h2 className="text-xl font-bold mb-4">Posts por categoría</h2>
              <div className="flex flex-wrap gap-3">
                {stats.postsByCategory.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-surface-container-low px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-on-surface-variant">{cat.postCount}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Usuarios + Comentarios recientes, lado a lado */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
            {/* Sección de usuarios */}
            <section className="xl:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between border-b border-surface-container-low">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Usuarios</h2>
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {users.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAllUsers((prev) => !prev)}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    {showAllUsers ? 'Ver menos' : 'Ver todos'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateError(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Nuevo usuario
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Rol</th>
                      <th className="px-6 py-4">Fecha de registro</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {(showAllUsers ? users : users.slice(0, 5)).map((u) => {
                      const isSelf = u.id === currentUser?.id;

                      return (
                        <tr key={u.id}>
                          <td className="px-6 py-4 font-medium">{u.name}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                u.role === 'ADMIN'
                                  ? 'bg-primary text-on-primary'
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => setRoleTarget(u)}
                              className="px-3 py-1 border border-outline-variant rounded-full text-xs hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Cambiar rol
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditError(null);
                                setEditTarget(u);
                              }}
                              className="px-3 py-1 border border-outline-variant rounded-full text-xs hover:bg-surface-container-low transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => setDeleteTarget(u)}
                              className="text-error hover:bg-error-container/20 p-1 rounded-full transition-colors inline-flex align-middle disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección de comentarios recientes (al lado de usuarios) */}
            <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-surface-container-low">
                <h2 className="text-xl font-bold">Comentarios recientes</h2>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-grow">
                {comments.length === 0 ? (
                  <p className="text-on-surface-variant text-sm text-center py-4">
                    No hay comentarios todavía.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex flex-col gap-2 pb-4 border-b border-surface-container-low last:border-0 last:pb-0"
                    >
                      <p className="text-sm text-on-surface italic line-clamp-2">
                        "{comment.content}"
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">
                            @{comment.author?.name || 'Usuario'}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            En: {comment.post?.title || '—'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCommentDeleteTarget(comment)}
                          className="text-error p-1 rounded-full hover:bg-error-container/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sección de posts recientes */}
          <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm mb-12">
            <div className="p-6 border-b border-surface-container-low">
              <h2 className="text-xl font-bold">Publicaciones recientes</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Autor</th>
                    <th className="px-6 py-4">Categorías</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.coverImage && (
                            <div className="w-10 h-10 rounded bg-surface-container-high overflow-hidden flex-shrink-0">
                              <img
                                src={post.coverImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {post.author?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.categories?.map((cat) => (
                            <span
                              key={cat.id}
                              className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setPostDeleteTarget(post)}
                          className="text-error hover:bg-error-container/20 p-1 rounded-full transition-colors inline-flex align-middle"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(roleTarget)}
        title="Cambiar rol de usuario"
        message={
          roleTarget
            ? `¿Estás seguro de que deseas cambiar el rol de ${roleTarget.name} de ${roleTarget.role} a ${roleTarget.role === 'ADMIN' ? 'USER' : 'ADMIN'}?`
            : ''
        }
        confirmLabel={isChangingRole ? 'Cambiando...' : 'Cambiar rol'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setRoleTarget(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar usuario"
        message={
          deleteTarget
            ? `¿Estás seguro de que deseas eliminar a ${deleteTarget.name}? Se eliminarán también todos sus posts y comentarios. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />

      <ConfirmModal
        isOpen={Boolean(postDeleteTarget)}
        title="Eliminar post"
        message={
          postDeleteTarget
            ? `¿Estás seguro de que deseas eliminar "${postDeleteTarget.title}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={isDeletingPost ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeletePost}
        onCancel={() => setPostDeleteTarget(null)}
        danger
      />

      <UserFormModal
        key={isCreateModalOpen ? 'create-open' : 'create-closed'}
        isOpen={isCreateModalOpen}
        mode="create"
        initialData={null}
        onSubmit={handleCreateUser}
        onCancel={() => setIsCreateModalOpen(false)}
        isSubmitting={isCreating}
        error={createError}
      />

      <UserFormModal
        key={editTarget ? `edit-${editTarget.id}` : 'edit-closed'}
        isOpen={Boolean(editTarget)}
        mode="edit"
        initialData={editTarget}
        onSubmit={handleEditUser}
        onCancel={() => setEditTarget(null)}
        isSubmitting={isEditing}
        error={editError}
      />

      <ConfirmModal
        isOpen={Boolean(commentDeleteTarget)}
        title="Eliminar comentario"
        message="¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer."
        confirmLabel={isDeletingComment ? 'Eliminando...' : 'Eliminar'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setCommentDeleteTarget(null)}
        danger
      />
    </main>
  );
};

export default Admin;
