const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'comments', label: 'Más comentados' },
];

const SortSelector = ({ value = 'newest', onChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label="Ordenar publicaciones">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === option.value
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortSelector;