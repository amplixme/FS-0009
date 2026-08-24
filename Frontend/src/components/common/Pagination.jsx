/**
 * Componente de paginación reutilizable.
 * Muestra botones prev/next y números de página, con "..." cuando hay muchas páginas.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="mt-16 flex justify-center items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
        className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-outline">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={
              page === currentPage
                ? 'w-10 h-10 rounded-lg bg-primary text-on-primary font-bold shadow-md'
                : 'w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors'
            }
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
        className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  );
};

export default Pagination;
