/**
 * Formatea una fecha a tiempo relativo amigable para el usuario.
 * @param {string | Date} dateInput
 * @returns {string}
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Si la fecha es invalida o futura
  if (isNaN(date.getTime()) || diffInSeconds < 0) {
    return 'hace un momento';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  // Rangos especificados en los criterios de aceptación:
  if (diffInSeconds < 60) {
    return 'hace un momento';
  }
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} min`;
  }
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
  if (diffInWeeks < 4) {
    return `hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
  }

  // Luego de 4 semanas, muestra la fecha completa (ej: 15/05/2026)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
