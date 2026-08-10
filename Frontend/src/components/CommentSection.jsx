import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getByPostId, create } from "../services/comment.service";
import { useAuth } from "../context/useAuth";
import Spinner from "./common/Spinner";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const refreshComments = () => setReloadKey((prev) => prev + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await create(postId, content.trim());
      setContent("");
      refreshComments();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed shrink-0">
                {comment.author?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-on-surface text-sm">
                    {comment.author?.name || "Usuario"}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm mt-1">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-white border border-outline-variant/40 p-4 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí un comentario..."
            rows={3}
            disabled={submitting}
            className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 resize-none disabled:opacity-60"
            style={{ border: "none", boxShadow: "none" }}
          />
          {submitError && (
            <p className="text-error text-sm mt-2">{submitError}</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-6 py-2 rounded-full bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-on-surface-variant text-sm text-center mt-8 py-4 border-t border-outline-variant/20">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Inicia sesión
          </Link>{" "}
          para comentar
        </p>
      )}
    </section>
  );
};

export default CommentSection;