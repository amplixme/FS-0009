import { useState, useEffect } from 'react';
import { getAll } from '../services/category.service';

const CategoryFilter = ({ activeCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return null;

  return (
    <>
      {/* Desktop: sidebar vertical */}
      <nav className="hidden lg:flex flex-col gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-3 rounded-xl p-3 shadow-sm transition-all hover:translate-x-1 text-left ${
            !activeCategory
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined">apps</span>
          <span className="font-medium">Todas</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`flex items-center gap-3 rounded-xl p-3 shadow-sm transition-all hover:translate-x-1 text-left ${
              activeCategory === cat.slug
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">label</span>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </nav>

      {/* Mobile: chips horizontales scrolleables */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-6 px-6">
        <button
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-low text-on-surface'
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryFilter;