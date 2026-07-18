import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const successMessage = location.state?.successMessage;

  // form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // errores de validacion
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // loading state para evitar multiples envios
  const [loading, setLoading] = useState(false);


  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validación client-side 
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Login exitoso, guarda el token y los datos del usuario
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirige a la home page
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Credenciales inválidas. Intentá de nuevo.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-0 md:p-6">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Login Container */}
      <main className="w-full max-w-[420px] mx-auto">

        {/* Main Card */}
        <div className="bg-surface-container-lowest w-full min-h-screen md:min-h-fit md:rounded-[16px] shadow-xl overflow-hidden transition-all duration-300">

          {/* Franja decorativa superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary-container" />

          <div className="px-8 pt-12 pb-10 md:px-10">

            {/* Brand Anchor */}
            <div className="mb-10 text-center md:text-left">
              <span className="text-2xl font-extrabold tracking-tighter text-primary">TuProyecto</span>
            </div>

            {/* Header Content */}
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-[28px] font-bold text-on-surface leading-tight tracking-tight mb-2">
                Iniciar sesión
              </h1>
              <p className="text-on-surface-variant">
                Ingresa a tu cuenta para continuar
              </p>
            </header>

            {/* Mensaje de éxito, si viene desde Register */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                {successMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-surface-container-lowest transition-all"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="text-error text-xs ml-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                    Contraseña
                  </label>
                 
                  <a className="text-sm font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-surface-container-lowest transition-all"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs ml-1">{errors.password}</p>}
              </div>

              {/* CTA Button */}
              <button
                className="w-full bg-primary text-on-primary font-bold py-4 px-6 rounded-full hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Error del servidor, debajo del formulario */}
            {serverError && (
              <div className="mt-6 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            {/* Separator */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-surface-variant" />
              <span className="text-sm font-medium text-outline-variant">o</span>
              <div className="flex-1 h-px bg-surface-variant" />
            </div>

            {/* (solo visual, sin funcionalidad real todavía) */}
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-surface-container-low border border-outline-variant/10 rounded-full hover:bg-surface-container-high transition-colors text-on-surface font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                Continuar con Google
              </button>
            </div>

            {/* Registration Footer */}
            <footer className="mt-10 text-center">
              <p className="text-on-surface-variant font-medium">
                ¿No tienes cuenta?{' '}
                <Link className="text-primary font-bold hover:underline underline-offset-4 decoration-2 ml-1" to="/register">
                  Regístrate
                </Link>
              </p>
            </footer>
          </div>
        </div>

        {/* System Credits/Language */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 px-4 md:px-0 opacity-60">
          <p className="text-xs font-medium text-outline uppercase tracking-widest">© 2024 TuProyecto</p>
          <div className="flex gap-4">
            <a className="text-xs font-semibold text-outline hover:text-primary transition-colors" href="#">Privacidad</a>
            <a className="text-xs font-semibold text-outline hover:text-primary transition-colors" href="#">Términos</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;