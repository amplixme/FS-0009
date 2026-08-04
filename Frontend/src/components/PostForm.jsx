/**
 * Formulario reutilizable para crear y editar posts.
 * Recibe datos iniciales y callback onSubmit.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll as getAllCategories } from '../services/category.service';
import ImageUpload from './common/ImageUpload';

const PostForm = ({
  initialData = null,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar artículo',
  serverError = null,
  onDiscard,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
    categoryIds: initialData?.categories?.map((c) => c.id) || [],
    coverImage: initialData?.coverImage || null,
  });
  const [errors, setErrors] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        published: initialData.published || false,
        categoryIds: initialData.categories?.map((c) => c.id) || [],
        coverImage: initialData.coverImage || null,
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setAvailableCategories(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (categoryId) => {
    setFormData((prev) => {
      const current = prev.categoryIds || [];
      const isSelected = current.includes(categoryId);
      return {
        ...prev,
        categoryIds: isSelected
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId],
      };
    });
  };

  const handleCoverChange = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = 'El título no puede estar vacío';
    }
    if (!formData.content) {
      newErrors.content = 'El contenido no puede estar vacío';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await onSubmit(formData);
  };

  const handleDiscard = onDiscard || (() => navigate(-1));

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 w-full no-border tonal-shift bg-surface-container-low font-inter tracking-tight">
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Editor</span>
          <div className="h-6 w-px bg-outline-variant/30"></div>
          <span className="text-sm font-medium text-on-surface-variant">Drafting Article</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-5 py-2 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors duration-200">
            Preview
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="pt-32 pb-40 px-6 max-w-[800px] mx-auto">
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-error-container/30 border border-error/20">
            <p className="text-error text-sm font-semibold">{serverError}</p>
          </div>
        )}

        {/* Cover Image */}
        <section className="mb-8">
          <ImageUpload value={formData.coverImage} onChange={handleCoverChange} />
        </section>

        {/* Article Title */}
        <section className="mb-8">
          <input
            name="title"
            className="w-full bg-transparent border-none p-0 text-[3.5rem] font-extrabold tracking-tight placeholder:text-on-surface-variant/30 focus:ring-0 leading-[1.1] text-on-surface"
            placeholder="Título del artículo"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-error text-xs ml-1">{errors.title}</p>}
        </section>

        {/* Categories & Metadata */}
        <section className="mb-12 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isSelected = formData.categoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-secondary-fixed text-on-secondary-fixed'
                      : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Editor Content */}
        <article className="min-h-[400px]">
          <textarea
            name="content"
            className="prose-editor w-full text-[1.125rem] leading-[1.75] text-on-surface placeholder:text-outline/40 focus:outline-none bg-transparent resize-none"
            placeholder="Escribe tu artículo aquí..."
            rows={12}
            value={formData.content}
            onChange={handleChange}
          />
          {errors.content && <p className="text-error text-xs ml-1">{errors.content}</p>}
        </article>

        {/* Settings Section */}
        <section className="mt-20 pt-12 border-t border-outline-variant/15">
          <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl">
            <div>
              <h4 className="font-bold text-on-surface">Visibilidad y Programación</h4>
              <p className="text-sm text-on-surface-variant">Configura cuándo será visible este artículo para tus lectores.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-on-surface">Publicar ahora</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Footer / Sticky Bottom Bar */}
        <footer className="fixed bottom-0 left-0 w-full bg-slate-50 dark:bg-slate-950 flex justify-between items-center px-6 py-3 border-t border-slate-200/10 z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-[10px] uppercase tracking-widest font-medium text-slate-400 dark:text-slate-500">
              {isLoading ? 'Guardando...' : 'Borrador no guardado'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleDiscard} className="text-[10px] uppercase tracking-widest font-bold text-error hover:text-error/80 transition-all duration-200 ease-in-out">
              Descartar
            </button>
            <div className="h-4 w-px bg-outline-variant/20"></div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 text-primary font-bold hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              <span className="text-[10px] uppercase tracking-widest">
                {isLoading ? 'Guardando...' : submitLabel}
              </span>
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default PostForm;