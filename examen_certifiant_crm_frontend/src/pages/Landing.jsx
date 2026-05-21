import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Utensils } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0a0d14'
    }}>
      {/* Background Image with overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/landing_background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
        zIndex: 1,
      }} />

      {/* Radial Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15), rgba(10, 13, 20, 0.95))',
        zIndex: 2,
      }} />

      {/* Header / Navbar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(10, 13, 20, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#fff'
          }}>SM</div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>SavoirManger CRM</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/login')}
            style={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div className="hero-badge" style={{
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <Zap size={14} /> Le premier CRM Restauration & Traiteur au Cameroun
        </div>

        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          animation: 'fadeInUp 1s ease-out',
          background: 'linear-gradient(to right, #ffffff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Gérez vos clients, commandes <br />
          et restaurants en <span style={{
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>un seul endroit</span>.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          maxWidth: '640px',
          lineHeight: 1.6,
          marginBottom: '3rem',
          animation: 'fadeInUp 1.2s ease-out'
        }}>
          Une solution CRM haut de gamme conçue pour piloter la fidélisation, suivre le flux de commandes en temps réel et optimiser l'occupation de vos restaurants.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          animation: 'fadeInUp 1.4s ease-out',
          marginBottom: '4.5rem'
        }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login')}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#6366f1',
              boxShadow: '0 10px 20px -10px rgba(99, 102, 241, 0.5)',
              cursor: 'pointer'
            }}
          >
            Accéder à l'application <ArrowRight size={18} />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          width: '100%',
          animation: 'fadeInUp 1.6s ease-out'
        }}>
          <div className="feature-card">
            <div className="feature-icon"><Utensils size={24} /></div>
            <h3>Gestion Multi-Restaurants</h3>
            <p>Pilotez vos capacités maximales d'occupation et affectez vos clients par proximité de ville en un clic.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={24} /></div>
            <h3>Workflow Commandes</h3>
            <p>Suivez l'état d'avancement de vos commandes (En préparation, Confirmée, Livrée) grâce à notre timeline intuitive.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3>Fidélité & Récompenses</h3>
            <p>Attribuez des points, gérez les profils (Bronze, Gold, Platinum) et cultivez la relation avec vos clients.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#64748b',
        fontSize: '0.9rem',
        backgroundColor: 'rgba(10, 13, 20, 0.9)'
      }}>
        &copy; {new Date().getFullYear()} SavoirManger CRM - Tous droits réservés.
      </footer>

      {/* Styled JSX for Animations and Hover States */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.25rem;
          padding: 2.25rem 2rem;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }
        
        .feature-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.7);
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          display: flex;
          alignItems: center;
          justifyContent: center;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
          color: #ffffff;
        }

        .feature-card p {
          font-size: 0.95rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          header { padding: 1rem 1.5rem !important; }
          main { padding: 2rem 1rem !important; }
          h1 { fontSize: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
}
