import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="top-bar" style={{ 
      borderBottom: '1px solid var(--border)', 
      paddingBottom: '1.5rem', 
      marginBottom: '2rem',
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%' 
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', letterSpacing: '-0.02em' }}>{title}</h1>
          {subtitle && (
            <p style={{ 
              margin: '0.25rem 0 0 0', 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem',
              fontWeight: 500 
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
