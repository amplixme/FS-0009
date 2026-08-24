// puente entre api.js (que no puede usar hooks) y AuthContext (que sí tiene la lógica real de logout)
// AuthProvider registra acá su función logout() apenas se monta;
// api.js la llama cuando recibe un 401, sin necesitar saber cómo funciona por dentro.

let logoutHandler = null;

export const registerLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
