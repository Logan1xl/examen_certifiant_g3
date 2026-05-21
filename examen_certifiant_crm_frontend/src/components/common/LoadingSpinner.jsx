import React from 'react';

export default function LoadingSpinner({ fullPage = false, message = 'Chargement...' }) {
  const spinnerContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid var(--border)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p style={{
        color: 'var(--text-muted)',
        fontWeight: 500,
        fontSize: '0.95rem',
        margin: 0,
      }}>{message}</p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.2)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '2.5rem 4rem',
          borderRadius: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
        }}>
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
}
