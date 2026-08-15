import { useEffect, useRef, useState, useCallback } from 'react';

const useDebounceCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

const SearchBar = ({
  value: externalValue = '',
  onSearch,
  placeholder = 'Buscar artículos...',
  className = '',
  showClearButton = true
}) => {
  const inputRef = useRef(null);
  const [hasText, setHasText] = useState(Boolean(externalValue));
  const debouncedSearch = useDebounceCallback(onSearch, 300);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== externalValue) {
      inputRef.current.value = externalValue;
      setHasText(Boolean(externalValue));
    }
  }, [externalValue]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setHasText(Boolean(newValue));
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setHasText(false);
    debouncedSearch('');
  }, [debouncedSearch]);

  const showClear = showClearButton && hasText;
  const rightPadding = showClearButton ? 'pr-12' : 'pr-6';

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={externalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full ${rightPadding} py-4 bg-surface-container-lowest border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg placeholder:text-outline/50`}
      />
      {showClear && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-4 text-outline hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
          aria-label="Limpiar búsqueda"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;