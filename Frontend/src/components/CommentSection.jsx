import { useState, useEffect } from "react";
import { getByPostId, update, deleteComment } from "../services/comment.service";
import { useAuth } from "../context/useAuth";
import Spinner from "./common/Spinner";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import ConfirmModal from "./common/ConfirmModal";

/*
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};*/

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshComments = () => setReloadKey((prev) => prev + 1);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getByPostId(postId);
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, reloadKey]);

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleSave = async () => {
    const trimmed = editingContent.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);
      await update(editingId, trimmed);
      setEditingId(null);
      setEditingContent("");
      refreshComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(deleteTarget.id);
      setDeleteTarget(null);
      refreshComments();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="max-w-[720px] mx-auto mt-16 pt-8 border-t border-outline-variant/20">
      <h3 className="text-2xl font-bold text-on-surface mb-6">
        Comentarios{comments.length > 0 && ` (${comments.length})`}
      </h3>

      {loading ? (
        <Spinner size="md" text="Cargando comentarios..." />
      ) : error ? (
        <p className="text-error text-sm text-center py-8">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-on-surface-variant text-center py-8">
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      ) : (
        <ul className="flex flex-col gap-6">
          {comments.map((comment) => {
            const isOwn = user && user.id === comment.authorId;
            const isEditing = editingId === comment.id;

            return (
              <li key={comment.id} className="group flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed shrink-0">
                  {comment.author?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-bold text-on-surface text-sm truncate">
                        {comment.author?.name || "Usuario"}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    {isOwn && !isEditing && (
                      <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(comment)}
                          aria-label="Editar comentario"
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(comment)}
                          aria-label="Eliminar comentario"
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows="3"
                        autoFocus
                        className="w-full bg-surface-container-low rounded-lg p-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/30 outline-none border border-outline-variant/40 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-1.5 rounded-full border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving || !editingContent.trim()}
                          className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-40"
                        >
                          {isSaving ? "Guardando..." : "Guardar"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {comment.content}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar comentario"
        message="¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer."
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </section>
  );
};

export default CommentSection;