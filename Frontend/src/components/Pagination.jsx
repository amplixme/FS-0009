import { useCallback } from 'react';

const Pagination = ({ currentPage, totalPages, siblingCount = 1, onPageChange }) => {
  const handlePageChange = useCallback(
    (page) => {
      if (onPageChange) {
        onPageChange(page);
      }
    },
    [onPageChange]
  );

  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const pageNumbers = [];

  if (totalPages <= siblingCount * 2 + 3) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (currentPage < siblingCount + 2) {
      pageNumbers.push('...');
      for (let i = 2; i <= siblingCount + 1; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage > totalPages - siblingCount - 1) {
      for (let i = totalPages - siblingCount; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else {
      pageNumbers.push('...');
      const start = currentPage - siblingCount;
      const end = currentPage + siblingCount;
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return (
    <nav aria-label="Page navigation" className="flex items-center gap-2">
      <button
        disabled={isFirstPage}
        onClick={() => handlePageChange(isFirstPage ? 1 : currentPage - 1)}
        className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-container-low"
      >
        Anterior
      </button>

      {pageNumbers.map((page) => {
        if (page === '...') {
          return (
            <span key="ellipsis" className="text-xs text-on-surface-variant">
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            disabled={page === currentPage}
            onClick={() => handlePageChange(page)}
            className={`
              rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-surface-container-low'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={isLastPage}
        onClick={() => handlePageChange(isLastPage ? totalPages : currentPage + 1)}
        className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-container-low"
      >
        Siguiente
      </button>
    </nav>
  );
};

export default Pagination;