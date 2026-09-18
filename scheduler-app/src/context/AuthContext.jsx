import { createContext, useContext, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => authService.loadStoredUser());

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result.ok) {
      authService.persistUser(result.user, result.token);
      setCurrentUser(result.user);
    }
    return result;
  }, []);

  const signUp = useCallback(async (formData) => authService.signUp(formData), []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
