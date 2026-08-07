import { useState, useEffect } from "react";
import { getByPostId } from "../services/comment.service";
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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // eslint-disable-next-line no-unused-vars -- se usa al integrar el form de FS0009-47
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
    </section>
  );
};

export default CommentSection;