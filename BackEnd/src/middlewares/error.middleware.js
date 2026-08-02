import { error as errorResponse } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Control de errores de Multer (subida de archivos)
  if (err.name === 'MulterError') {
    status = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'El archivo excede el tamaño máximo permitido (5MB)';
        break;
      default:
        message = 'Error al procesar el archivo subido';
    }
  } else if (err.code) {
    // Control de errores de Prisma
    switch (err.code) {
      case 'P2002':
        status = 409;
        message = `Conflict: El valor para el campo [${err.meta?.target || 'unico'}] ya existe.`;
        break;
      case 'P2025':
        status = 404;
        message = 'Not Found: El registro solicitado no existe.';
        break;
      default:
        status = 500;
        message = 'Database Error: Error inesperado en la base de datos.';
    }
  }

  return errorResponse(res, message, status);
};

export default errorHandler;