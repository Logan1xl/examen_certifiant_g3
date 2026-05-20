import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Commandes from './pages/Commandes';
import Interactions from './pages/Interactions';
import Restaurants from './pages/Restaurants';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérification de la présence d'une session / token
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken && location.pathname !== '/login') {
      navigate('/login');
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Si l'utilisateur est sur la page de login, on n'affiche pas la structure globale (sidebar)
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      {/* Barre de navigation latérale (Sidebar) */}
      <aside className="sidebar">
        <div className="logo-container">
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}></div>
          <span className="logo-text">SavoirManger CRM</span>
        </div>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Tableau de bord
          </Link>
          <Link to="/clients" className={`nav-link ${location.pathname === '/clients' ? 'active' : ''}`}>
            Clients
          </Link>
          <Link to="/commandes" className={`nav-link ${location.pathname === '/commandes' ? 'active' : ''}`}>
            Commandes
          </Link>
          <Link to="/interactions" className={`nav-link ${location.pathname === '/interactions' ? 'active' : ''}`}>
            Interactions
          </Link>
          <Link to="/restaurants" className={`nav-link ${location.pathname === '/restaurants' ? 'active' : ''}`}>
            Restaurants
          </Link>
        </nav>

        {user && (
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.nom} {user.prenom}</span>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginTop: '0.25rem', fontSize: '0.65rem' }}>
                {user.role}
              </span>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* Contenu principal de la page */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/interactions" element={<Interactions />} />
          <Route path="/restaurants" element={<Restaurants />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
