import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AGENT_TERRAIN'); // Default role for mock login
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Tenter la connexion avec l'API
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      console.warn('API Authentication failed or offline, using mock login for preview...', err);
      
      // Fallback Mock Login pour la validation et démonstration locale
      if (username.trim() !== '') {
        const mockUser = {
          username: username,
          nom: username.toUpperCase(),
          prenom: 'User',
          role: role
        };
        localStorage.setItem('token', 'mock-jwt-token-12345');
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/');
      } else {
        setError('Veuillez saisir un identifiant.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.75rem', color: 'var(--text-main)' }}>DIGITRANS CRM</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Connexion au module de relation client
          </p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', display: 'block' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Identifiant</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: agent_terrain_1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Choix du rôle pour la démo hors-ligne */}
        <div className="form-group">
          <label className="form-label">Rôle (Démo / Fallback)</label>
          <select 
            className="form-control" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="AGENT_TERRAIN">Agent de Terrain</option>
            <option value="ADMIN_RESTAURANT">Admin Restaurant</option>
            <option value="DG">Directeur Général (DG)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
