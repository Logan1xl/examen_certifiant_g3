import React from 'react';

export default function ConfirmDialog({
  open,
  title = 'Confirmer l\'action',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ? Cette opération peut être irréversible.',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  isDanger = false
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '440px', animation: 'scaleIn 0.2s ease-out' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: isDanger ? 'var(--danger)' : 'var(--text-main)' }}>
            {title}
          </h3>
          <button 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        
        <div className="modal-footer" style={{ marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className="btn" 
            onClick={onConfirm}
            style={{
              backgroundColor: isDanger ? 'var(--danger)' : 'var(--primary)',
              color: '#ffffff',
            }}
          >
            {confirmText}
          </button>
        </div>

        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
