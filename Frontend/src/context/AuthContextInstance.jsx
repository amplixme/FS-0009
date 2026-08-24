import { createContext } from 'react';

//  existe únicamente para que Fast Refresh no se confunda: no puede mezclar el objeto Context con componentes en el mismo archivo.
export const AuthContext = createContext(null);
