//import React from 'react';

const Home = () => {
  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary-container/10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-extrabold text-on-surface mb-6 tight-tracking leading-tight">Últimas publicaciones</h1>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
              <input className="w-full pl-12 pr-6 py-4 bg-surface-container-lowest border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg placeholder:text-outline/50" placeholder="Buscar artículos..." type="text" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex gap-12">
        {/* Sidebar Navigation Shell */}
        <aside className="h-screen sticky top-24 w-64 hidden lg:flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tight-tracking">Categorías</h3>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 rounded-xl p-3 shadow-sm transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">palette</span>
                  <span className="font-medium">Design</span>
                </div>
                <span className="text-xs bg-primary/10 px-2 py-1 rounded-full font-bold">24</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">terminal</span>
                  <span className="font-medium">Engineering</span>
                </div>
                <span className="text-xs text-slate-400">18</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span className="font-medium">Product</span>
                </div>
                <span className="text-xs text-slate-400">12</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">diversity_3</span>
                  <span className="font-medium">Culture</span>
                </div>
                <span className="text-xs text-slate-400">9</span>
              </a>
              <a className="flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:translate-x-1" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">newspaper</span>
                  <span className="font-medium">News</span>
                </div>
                <span className="text-xs text-slate-400">31</span>
              </a>
            </nav>
          </div>
          <div className="mt-auto border-t border-surface-container-high pt-6 flex flex-col gap-2">
            <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
              <span className="material-symbols-outlined">help</span>
              <span className="font-medium">Help</span>
            </a>
            <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium">Settings</span>
            </a>
          </div>
        </aside>
        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Article Card 1 */}
            <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                <img alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="clean workspace with a modern laptop showing code, aesthetic desk setup with plants and soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2yhCgGZgV8OCo-ExNttlVt8QArc3_O1B5A1vYDbhJz0Oq4fVnbAOFTbym6tXaZKCmOr1f49okZ5Cq2yavKJmGAwnzEYTBGNQZ_LnkpBWiYYxJE1futY2XqlKCK5-8SKVL_Xo-DJHhUxRyMW2XPx2OY51TSE3g3xeEeRHjEPh4VakvWwFw3KiNPCxQGU_mR25TaJ5Os40is1WHlmwqiytbaYLpx0gPjAKvdNtjckPW0bdNlRrNP29DelhzA-3uWZ2kLZWAgjSZp5GB" />
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4">Ingeniería</span>
                <h2 className="text-2xl font-bold text-on-surface mb-3 tight-tracking line-clamp-2 leading-tight group-hover:text-primary transition-colors">Arquitectura Limpia en Aplicaciones Modernas</h2>
                <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 text-sm">Exploramos cómo los principios de Clean Architecture pueden salvar tu proyecto del caos técnico mientras escalas rápidamente en entornos ágiles.</p>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
                      <img alt="Author" className="w-full h-full object-cover" data-alt="professional portrait of a man in his 30s wearing glasses, minimalist creative background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWFnbWLCR5qcTlygWuVQ0jVdcznNUGu4czDeJQ2o0geBKkN2Y8vcbMgkqLqP65hjYMoOkPhBZkFbidcrf_clvcBTSORfxlPAyVxk8dVQy0ZIwkr0MG2T7tFb4vyuWqmvdRWqEx8Ta0Z_P88d9OXxP6OwKyN_SspyNHE4NOBkX6LVFla6bEDRPU_3XaQQNuhjalNhUx4C_78vXL2omATKwL8ZexvLNNlE4stAAozSezQ1UBs9SATSNboUc_fCSAsHpdyJgUOCX9EPcO" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Alex Rivera</p>
                      <p className="text-[10px] text-outline">Oct 12, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    <span className="text-xs font-medium">14</span>
                  </div>
                </div>
              </div>
            </article>
            {/* Article Card 2 */}
            <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                <img alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="minimalist graphic design interface with vibrant gradients and clean typography on a tablet screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC0H4Jwn1lhV6_rGgvKz_2TYN03oe4sI0uO_bjyMXDdr6FXOfNiwX-twpt5N-tvTbFfp1xgfb8HMCEcm1AibxHHUjsVgzDHE2M3HhJAq8QqHV9v3E9T6xJpOSXDdbGHtQR09Fc2uaR2XQB-VPkopseNV9SP6WdLcIOcHussiEiYX8rrRI8IWSJT5J_Kow2fzKWesOFH8ncAADrw7hB8IeVxEo6lFUMIf2Xg3og7Ue4wdjrrBZX0sQn_vZlijNSxuIWIqQGam1M4FTC" />
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4">Diseño</span>
                <h2 className="text-2xl font-bold text-on-surface mb-3 tight-tracking line-clamp-2 leading-tight group-hover:text-primary transition-colors">El futuro de la UI: Más allá de las pantallas</h2>
                <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 text-sm">¿Cómo diseñamos para interfaces que no existen físicamente? Una mirada a la computación espacial y su impacto en la experiencia del usuario.</p>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed overflow-hidden">
                      <img alt="Author" className="w-full h-full object-cover" data-alt="friendly woman with artistic style smiling, bright studio portrait with warm tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxfJ7jX1JeifoJSEDRlUgWY4EG3Oy8QYun6HYH4D2nTuvs82HNMnFI7QjaYEfGbC-TPGTNsriNT9w7CsE6SSyhT9sPeX_yYa1Gk8jXkBAdjKYncivpfdbjIC69pW2HLJgGN3jAJD4I2zq7qZqeUcieNUblltJouIHJhnF-B6ntJi6Dg4jwuTMiDBKFCjcULPynm-XlI0KETN92Y4qL0-ojDewsLIguLPGv7j_Ju_ARqT0gK0ZZOHvASKXPog-r4g3oq1zDJJp5xLeq" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Sofia Chen</p>
                      <p className="text-[10px] text-outline">Oct 10, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    <span className="text-xs font-medium">8</span>
                  </div>
                </div>
              </div>
            </article>
            {/* Article Card 3 */}
            <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                <img alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="overhead view of a high-tech server room with glowing blue led lights and neat cable management" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhhle9B4FbehWuo8DuLxlz6ZTNMXpPZLf8CNrDSZFlflduWqtIp0uFm5-fKdMtzRWaNA_zXvDVGw24WmMIaWf7gCF5DA_dpZDiM17gMMNZx2g6WItdihntWIdH9FmPsccCyzObGVBex46SzQXmzhejTGvC_oMDLGD7eL0LaGoAdMEfYRqXTfp1X8EwlR1mbaeKgH7lSPjrn7oqjCDPDRsuoF3vvUrTYTKAn3IF16JbFTOfG3D-_LddTk0DIevTVlH6_-BFnOSSKeAk" />
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4">DevOps</span>
                <h2 className="text-2xl font-bold text-on-surface mb-3 tight-tracking line-clamp-2 leading-tight group-hover:text-primary transition-colors">Kubernetes para Mortales: Guía Definitiva</h2>
                <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 text-sm">Desmitificamos la orquestación de contenedores con analogías del mundo real y ejemplos prácticos para equipos pequeños.</p>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
                      <img alt="Author" className="w-full h-full object-cover" data-alt="tech lead portrait in a modern office with glass walls, soft bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4CXX481xM5hla6sPJlDxxN2IlpSg9B09gwCEODxCDcOh6b-G4ZuZpKUXz_74BqDhHVkmk52HXZRP7Wz8U70dipJ3siUsef_DrWtpEDRbv9Xk11UgYggbRys8-rmR9yiDtzMVvL_aOWrTMMhO-gpUvNPozUaQIdOyv2uX8ui87QC-wPNBEQMH5SimUgrJzzEsfP2VEsfmqXhu7KzPUr2Bt5QYnaqhqDqpKIPfhFyLarDV8ulvnEpPN5iw4JnoV-UsQ1vHftlEBOues" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Marc Serra</p>
                      <p className="text-[10px] text-outline">Oct 05, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    <span className="text-xs font-medium">32</span>
                  </div>
                </div>
              </div>
            </article>
            {/* Article Card 4 */}
            <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                <img alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="a hand holding a smartphone showing a colorful dashboard app, vibrant lighting, urban city background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhXo74ZJzrxdp8s02anQ-RrEKoaqFDUfFrelRCteQLtk9BVIXXM5PfMsU3k0KA20G4-TPcSe4ohio_2YHs-2n3B_gSKA0A1zh0WSS7HL1M_5EMOsKjSxq5HNXdTPWzvUcHTCiwGnIOjU-fiE_-D5gcgr0PAPg1M6ElSFWpvRqDbpGSJYH5cSCgtbP2OgOpp5hqafBsYklW3i6kcbetWMjBgqtdsX8VAeSO0zM4oGUU7RvNUGkQmZRe6wDI0rXeXSdGroA0Hlkuq0M3" />
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4">Opinión</span>
                <h2 className="text-2xl font-bold text-on-surface mb-3 tight-tracking line-clamp-2 leading-tight group-hover:text-primary transition-colors">¿Estamos ante el fin del desarrollo No-Code?</h2>
                <p className="text-on-surface-variant line-clamp-3 leading-relaxed mb-6 text-sm">Analizamos el auge de la IA generativa de código y cómo está desplazando las herramientas visuales tradicionales de creación.</p>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed overflow-hidden">
                      <img alt="Author" className="w-full h-full object-cover" data-alt="young professional woman in a bright yellow sweater, smiling, minimalist background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2UCFOjf8bgqHmOVWaaPkABptF_Yg00hHQFDPJ09hfPPk4-El5UP-Rm72Vrtcm1m_6l9NOSAzmIAtzwpC1NUeuo_8a3vUE8bOaGLOweapDZbi4TGtU28iSHT6orAx6bUXfbVJPK7r-vKRZ0YIVhZfEqIhsVIsc6lBtj0RDerivdEZtgpAc3KC6ZHcZADGRpHTtFLc-aaaL6Vch2CqDZF_O_PlmsqgwAhq5q_XPfr_4mkxMn8eGYTufUM1DgxIVunuq2Bvqx1AwXxx7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Elena Ruiz</p>
                      <p className="text-[10px] text-outline">Oct 01, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    <span className="text-xs font-medium">56</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
          {/* Pagination */}
          <nav className="mt-16 flex justify-center items-center gap-2">
            <button className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">3</button>
            <span className="px-2 text-outline">...</span>
            <button className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">12</button>
            <button className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Home;