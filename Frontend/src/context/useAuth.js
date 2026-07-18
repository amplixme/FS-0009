import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';

// hook de conveniencia: en vez de escribir useContext(AuthContext) en cada componente, escribís useAuth() directamente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};