import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../services/post.service";



export default function Post() {
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveArticle = async (e) => {
    const newErrors = {};
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    try {

      if (!formData.title) {
        newErrors.title = 'El título no puede estar vacío'
      }

      if (!formData.content) {
        newErrors.content = 'El contenido no puede estar vacío'
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const response = await create({
        'title': formData.title,
        'content': formData.content,
        'published': isPublished
      })

      console.log(response);

      navigate(`/posts/${response.id}`, {
        state: { successMessage: 'Post creado con éxito' },
      });

      setIsSaved(true);
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      setErrors((prev) => ({
        ...prev,
        server: error.message || "Ocurrió un error al guardar el artículo."
      }));
    } finally {
      setIsSaving(false);
    }
  };

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

      <form onSubmit={handleSaveArticle} className="pt-32 pb-40 px-6 max-w-[800px] mx-auto">
        {/* Cover Upload Area */}
        {/* <section className="mb-12 group">
          <div className="w-full aspect-[21/9] rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed transition-all duration-300">
            <span className="material-symbols-outlined text-4xl text-outline mb-3 group-hover:text-primary">image</span>
            <p className="text-on-surface-variant font-medium">Arrastra una imagen o haz clic para subir</p>
            <p className="text-xs text-outline mt-1 uppercase tracking-widest">Recomendado: 1920x1080px</p>
          </div>
        </section> */}

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
            <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-semibold">
              Tecnología
              <button type="button" className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
            </span>
            <button type="button" className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
              Añadir categoría
            </button>
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

          {errors.server && (
            <p className="text-error text-sm font-semibold mb-4">{errors.server}</p>
          )}

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
                <input className="sr-only peer" type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
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
              {isSaved ? 'Artículo Guardado' : 'Borrador no guardado'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-error hover:text-error/80 transition-all duration-200 ease-in-out">
              Descartar
            </button>
            <div className="h-4 w-px bg-outline-variant/20"></div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 text-primary font-bold hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              <span className="text-[10px] uppercase tracking-widest">
                {isSaving ? 'Guardando artículo...' : isSaved ? 'Artículo Guardado ✓' : 'Guardar Artículo'}
              </span>
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}