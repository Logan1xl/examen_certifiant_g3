import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext(null);

const ROLES = {
  DG: 'DG',
  ADMIN_RESTAURANT: 'ADMIN_RESTAURANT',
  AGENT_TERRAIN: 'AGENT_TERRAIN',
};

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function decodeUser(token) {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id || decoded.sub,
      username: decoded.sub,
      nom: decoded.nom || decoded.sub,
      prenom: decoded.prenom || '',
      role: decoded.role || decoded.roles?.[0] || 'AGENT_TERRAIN',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      return decodeUser(token);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token, id, email: userEmail, nom, prenom, role } = response.data;
      const userData = { id, email: userEmail, nom, prenom, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch {
      return { success: false, error: 'Identifiants invalides' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      if (!user) return false;
      return roles.some((r) => user.role === r);
    },
    [user]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      logout();
    }
    const interval = setInterval(() => {
      const t = localStorage.getItem('token');
      if (t && isTokenExpired(t)) logout();
    }, 60000);
    return () => clearInterval(interval);
  }, [logout]);

  const value = useMemo(
    () => ({ user, loading, login, logout, hasRole, ROLES, isAuthenticated: !!user }),
    [user, loading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ROLES };
export default AuthContext;
