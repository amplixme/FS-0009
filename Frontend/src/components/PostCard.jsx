/**
 * Tarjeta de post reutilizable en Home.
 * Se envuelve en Link para navegar al detalle (/posts/:id).
 * Click en un badge de categoria navega a /?category=slug (filtra la lista).
 */
import { Link, useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatRelativeTime";

const MAX_VISIBLE_BADGES = 3;
/*
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};*/

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const authorName = post.author?.name || "Autor desconocido";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const categories = post.categories || [];
  const visibleBadges = categories.slice(0, MAX_VISIBLE_BADGES);
  const remainingCount = categories.length - MAX_VISIBLE_BADGES;

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/?category=${slug}`);
  };

  return (
    <Link to={`/posts/${post.id}`} className="block">
      <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Placeholder de imagen*/}
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="material-symbols-outlined text-5xl text-primary/30">
              article
            </span>
          )}
        </div>

        <div className="p-8">
          {/* Badges de categorías */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {visibleBadges.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => handleCategoryClick(e, cat.slug)}
                className="inline-flex items-center px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-extrabold uppercase tracking-widest rounded-full hover:bg-primary hover:text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[12px] mr-1">
                  label
                </span>
                {cat.name}
              </button>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full">
                +{remainingCount}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-on-surface mb-3 tight-tracking line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 text-sm">
            {post.content}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-on-primary-fixed">
                {authorInitial}
              </div>
              <div>
                <p className="text-xs font-bold">{authorName}</p>
                <p className="text-[10px] text-outline">
                  {formatRelativeTime(post.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-outline">
              <span className="material-symbols-outlined text-sm">forum</span>
              <span className="text-xs font-medium">
                {post._count?.comments ?? 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
