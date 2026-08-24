const Footer = () => {
  return (
    <footer className="w-full py-12 mt-20 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xl tight-tracking">
            TuProyecto
          </span>
          <p className="text-label-md font-inter text-slate-500">
            © 2024 TuProyecto. High-end editorial experience.
          </p>
        </div>
        <div className="flex gap-8">
          <a
            className="text-slate-500 hover:text-blue-600 transition-colors text-label-md font-inter"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-slate-500 hover:text-blue-600 transition-colors text-label-md font-inter"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-slate-500 hover:text-blue-600 transition-colors text-label-md font-inter"
            href="#"
          >
            RSS Feed
          </a>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            aria-label="Cambiar idioma"
            className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary transition-all group cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm group-hover:text-white">
              language
            </span>
          </button>
          <button
            type="button"
            aria-label="Compartir"
            className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary transition-all group cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm group-hover:text-white">share</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
