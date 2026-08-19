// quién está logueado y con qué token

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContextInstance';
import { registerLogoutHandler } from '../utils/session';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error al restaurar la sesión:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => getStoredUser());

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  // actualiza solo los datos del usuario (ej: después de editar perfil), sin tocar el token
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  // cierra la sesión
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  // true solo si tenemos token Y los datos del usuario
  const isAuthenticated = Boolean(token && user);

  const value = useMemo(
    () => ({ user, token, login, logout, updateUser, isAuthenticated }),
    [user, token, login, logout, updateUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};