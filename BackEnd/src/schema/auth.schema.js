import { z } from 'zod';
// zod : librerias de validacion
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre no puede estar vacio'),
  
  email: z
    .string({ required_error: 'El email es requerido' })
    .trim()
    .email('El formato del email no es valido'),
  
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});