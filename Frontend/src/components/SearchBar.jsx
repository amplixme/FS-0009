import { useEffect, useRef, useState, useCallback } from 'react';

const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const debounced = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { debounced, cancel };
};

const SearchBar = ({
  defaultValue = '',
  onSearch,
  placeholder = 'Buscar artículos...',
  delay = 300,
  className = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  const { debounced: debouncedSearch, cancel: cancelSearch } = useDebouncedCallback(
    onSearch,
    delay
  );

  // Sincroniza el input cuando defaultValue cambia desde fuera (URL, limpiar filtros)
  const [prevDefault, setPrevDefault] = useState(defaultValue);
  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue);
    setValue(defaultValue);
  }

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    debouncedSearch(next);
  };

  const handleClear = () => {
    cancelSearch();
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full pl-12 ${value ? 'pr-12' : 'pr-6'} py-4 bg-surface-container-lowest border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg placeholder:text-outline/50`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 flex items-center justify-center w-6 h-6 rounded-full text-outline hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
