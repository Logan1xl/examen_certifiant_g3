import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token) {
    // Redirection vers le login avec préservation de l'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Rôle stocké dans user.role (ex: "ADMIN", "MANAGER", "AGENT", "AGENT_RESTAURANT")
      if (!allowedRoles.includes(user.role)) {
        // Rôle non autorisé -> redirection vers le dashboard ou accueil par défaut
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
