import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';

const Pagination = ({ 
  currentpage = 1, 
  totalPages = 1, 
  siblings = 1,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentpage) return;
    navigate({
      pathname: '/',
      search: createSearchParams({ ...Object.fromEntries(searchParams), page }).toString()
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPagesNum = Math.max(1, totalPages);

    for (let i = Math.max(1, currentpage - siblings); i <= Math.min(totalPagesNum, currentpage + siblings); i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = generatePageNumbers();
  const showLeftEllipsis = pageNumbers[0] > 1;
  const showRightEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

  return (
    <nav className={`mt-16 flex justify-center items-center gap-2 ${className}`}>
      <button
        onClick={() => handlePageClick(currentpage - 1)}
        disabled={currentpage === 1}
        className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {showLeftEllipsis && (
        <span className="px-2 text-outline">...</span>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-10 h-10 rounded-lg font-bold transition-all ${
            page === currentpage
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface hover:bg-surface-container-low'
          }`}
        >
          {page}
        </button>
      ))}

      {showRightEllipsis && (
        <span className="px-2 text-outline">...</span>
      )}

      <button
        onClick={() => handlePageClick(currentpage + 1)}
        disabled={currentpage === totalPages}
        className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página siguiente"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  );
};

export default Pagination;