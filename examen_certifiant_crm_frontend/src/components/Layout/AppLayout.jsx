import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  UtensilsCrossed, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  User
} from 'lucide-react';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState({ nom: '', prenom: '', role: '', email: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const hasAccess = (itemRoles) => {
    if (!itemRoles) return true;
    return itemRoles.includes(user.role);
  };

  const menuItems = [
    { 
      label: 'Tableau de bord', 
      path: '/', 
      icon: <LayoutDashboard size={20} />, 
      roles: ['ADMIN', 'MANAGER', 'AGENT'] 
    },
    { 
      label: 'Clients', 
      path: '/clients', 
      icon: <Users size={20} />, 
      roles: ['ADMIN', 'MANAGER', 'AGENT'] 
    },
    { 
      label: 'Commandes', 
      path: '/commandes', 
      icon: <ShoppingBag size={20} />, 
      roles: ['ADMIN', 'MANAGER', 'AGENT', 'AGENT_RESTAURANT'] 
    },
    { 
      label: 'Interactions', 
      path: '/interactions', 
      icon: <MessageSquare size={20} />, 
      roles: ['ADMIN', 'MANAGER', 'AGENT'] 
    },
    { 
      label: 'Restaurants', 
      path: '/restaurants', 
      icon: <UtensilsCrossed size={20} />, 
      roles: ['ADMIN', 'MANAGER'] 
    },
  ];

  return (
    <div className="app-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-show' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease-in-out',
        width: 'var(--sidebar-width)',
      }}>
        <div className="logo-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>SM</div>
            <span className="logo-text">SavoirManger CRM</span>
          </div>
          
          <button 
            className="mobile-close-btn" 
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links" style={{ gap: '0.4rem' }}>
          {menuItems.map((item) => {
            if (!hasAccess(item.roles)) return null;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'var(--transition)'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user.email && (
          <div style={{ 
            marginTop: 'auto', 
            borderTop: '1px solid var(--border)', 
            paddingTop: '1.25rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ 
                  fontWeight: 600, 
                  fontSize: '0.85rem', 
                  color: 'var(--text-main)',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}>
                  {user.nom} {user.prenom}
                </span>
                <span className="badge badge-primary" style={{ 
                  alignSelf: 'flex-start', 
                  marginTop: '0.2rem', 
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.5rem'
                }}>
                  {user.role}
                </span>
              </div>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
              style={{ 
                width: '100%', 
                justifyContent: 'center',
                fontSize: '0.8rem',
                padding: '0.5rem 1rem' 
              }}
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 99,
          }}
        />
      )}

      {/* MAIN CONTAINER */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - var(--sidebar-width))',
        transition: 'all 0.3s ease-in-out'
      }} className="main-wrapper">
        
        {/* HEADER / APPBAR */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <button 
            className="mobile-hamburger" 
            onClick={() => setMobileOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                transition: 'var(--transition)'
              }}
              title="Changer de thème"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="main-content" style={{ flexGrow: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%) !important;
          }
          .sidebar.mobile-show {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          .main-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
