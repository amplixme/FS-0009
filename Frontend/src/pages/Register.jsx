import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';


class PasswordValidator {
  static MIN_LENGTH = 8;

  static STRENGTH_LABELS = ['Débil', 'Media', 'Fuerte'];
  static STRENGTH_COLORS = ['bg-error', 'bg-amber-500', 'bg-emerald-500'];

  constructor(password) {
    this.password = password || '';
  }

  hasMinLength() {
    return this.password.length >= PasswordValidator.MIN_LENGTH;
  }

  hasUpperCase() {
    return /[A-Z]/.test(this.password);
  }

  hasNumber() {
    return /[0-9]/.test(this.password);
  }

  hasSymbol() {
    return /[^A-Za-z0-9]/.test(this.password);
  }


  getRawScore() {
    let score = 0;
    if (this.hasMinLength()) score++;
    if (this.hasUpperCase()) score++;
    if (this.hasNumber()) score++;
    if (this.hasSymbol()) score++;
    return score;
  }

  
  getStrengthLevel() {
    const score = this.getRawScore();
    if (score <= 1) return 0; // Débil
    if (score === 2) return 1; // Media
    return 2; // Fuerte (3 o 4 reglas cumplidas)
  }

  getStrengthLabel() {
    if (!this.password) return '';
    return PasswordValidator.STRENGTH_LABELS[this.getStrengthLevel()];
  }

  getStrengthColor() {
    return PasswordValidator.STRENGTH_COLORS[this.getStrengthLevel()];
  }


  isValid() {
    return this.hasMinLength();
  }

  matches(confirmPassword) {
    return this.password === confirmPassword;
  }
}

const Register = () => {
  const navigate = useNavigate();

  // form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // validacion y error 
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // loading state para el boton de submit
  const [loading, setLoading] = useState(false);

  // checkbox de terminos y condiciones
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // toggle propio
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // comparacion contraseña
  const passwordValidator = new PasswordValidator(formData.password);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // validacion client-side 
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido';
    }

    if (!passwordValidator.isValid()) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!passwordValidator.matches(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Debés aceptar los Términos y Condiciones';
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
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // registro exitoso: redirige a login con mensaje de éxito
      navigate('/login', {
        state: { successMessage: 'Cuenta creada con éxito. Ya podés iniciar sesión.' },
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Ocurrió un error al crear la cuenta. Intentá de nuevo.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 md:p-6 text-on-surface">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>


      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900">TuProyecto</h1>
      </header>

      <main className="w-full max-w-[420px] bg-white md:rounded-[16px] shadow-xl md:shadow-slate-200/50 overflow-hidden flex flex-col">
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="md:hidden text-2xl font-extrabold tracking-tighter text-slate-900 mb-6">TuProyecto</h1>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">Crear cuenta</h2>
          <p className="text-slate-500 mt-2 text-sm">Únete a la comunidad</p>
        </div>

        <form className="px-8 pb-10 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

          {/* Nombre completo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1" htmlFor="name">Nombre completo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                id="name"
                name="name"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="text-error text-xs ml-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1" htmlFor="email">Correo electrónico</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                id="email"
                name="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-error text-xs ml-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1" htmlFor="password">Contraseña</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
              <input
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && <p className="text-error text-xs ml-1">{errors.password}</p>}


            {formData.password && (
              <div className="mt-2 flex items-center gap-2 px-1">
                {[0, 1, 2].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 h-1 rounded-full ${level <= passwordValidator.getStrengthLevel() ? passwordValidator.getStrengthColor() : 'bg-slate-200'}`}
                  />
                ))}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  {passwordValidator.getStrengthLabel()}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1" htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">enhanced_encryption</span>
              <input
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && <p className="text-error text-xs ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Términos y condiciones */}
          <div>
            <label className="flex items-start gap-3 mt-1 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  className="peer h-5 w-5 appearance-none rounded-lg border-2 border-slate-200 bg-white checked:bg-primary checked:border-primary transition-all cursor-pointer"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="material-symbols-outlined absolute text-white text-sm scale-0 peer-checked:scale-100 transition-transform pointer-events-none">check</span>
              </div>
              <span className="text-xs text-slate-500 leading-tight">
                Acepto los <a className="text-primary font-semibold hover:underline" href="#">Términos y Condiciones</a> y la <a className="text-primary font-semibold hover:underline" href="#">Política de Privacidad</a> de TuProyecto.
              </span>
            </label>
            {errors.terms && <p className="text-error text-xs ml-1 mt-1">{errors.terms}</p>}
          </div>

          <button
            className="w-full py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>


        {serverError && (
          <div className="mx-8 mb-6 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl">
            {serverError}
          </div>
        )}

        <div className="bg-slate-50 py-6 px-8 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600">
            ¿Ya tenés cuenta? <Link className="text-primary font-bold hover:underline" to="/login">Inicia sesión</Link>
          </p>
        </div>
      </main>


      <footer className="mt-12 w-full max-w-[420px] text-center px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Sobre nosotros</a>
          <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Ayuda</a>
          <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Blog</a>
          <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Contacto</a>
        </div>
        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold opacity-60">© 2024 TuProyecto. Editorial Authority.</p>
      </footer>

    </div>
  );
};

export default Register;