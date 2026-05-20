import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import commandeService from '../../services/commandeService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination, 
  Chip,
  IconButton
} from '@mui/material';
import { 
  Plus, 
  Eye, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Truck, 
  XCircle 
} from 'lucide-react';

const STATUTS = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'EN_ATTENTE', label: 'En Attente' },
  { value: 'CONFIRMEE', label: 'Confirmée' },
  { value: 'EN_PREPARATION', label: 'En Préparation' },
  { value: 'LIVREE', label: 'Livrée' },
  { value: 'ANNULEE', label: 'Annulée' }
];

export default function CommandeList() {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserRole(u.role);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await commandeService.getAll(page, rowsPerPage);
      const content = response.data.content || [];
      
      // Filter clientside to support static quick chips filter smoothly
      let filtered = content;
      if (activeFilter !== 'ALL') {
        filtered = content.filter(c => c.statut === activeFilter);
      }

      setCommandes(filtered);
      setTotalElements(response.data.totalElements || 0);

      // Default select the first order if none is selected
      if (filtered.length > 0 && !selectedCommande) {
        setSelectedCommande(filtered[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, activeFilter, selectedCommande]);

  useEffect(() => {
    fetchCommandes();
  }, [fetchCommandes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    setUpdating(true);
    try {
      const response = await commandeService.updateStatut(id, nextStatus);
      const updated = response.data;
      setSelectedCommande(updated);
      
      // Refresh list
      setCommandes(prev => prev.map(cmd => cmd.id === id ? updated : cmd));
    } catch (e) {
      console.error("Error updating status", e);
      alert("Transition de statut impossible ou non autorisée par le workflow.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusChip = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <Chip label="En attente" size="small" icon={<Clock size={12} />} sx={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', fontWeight: 600 }} />;
      case 'CONFIRMEE':
        return <Chip label="Confirmée" size="small" icon={<CheckCircle2 size={12} />} sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontWeight: 600 }} />;
      case 'EN_PREPARATION':
        return <Chip label="En préparation" size="small" icon={<Flame size={12} />} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontWeight: 600 }} />;
      case 'LIVREE':
        return <Chip label="Livrée" size="small" icon={<Truck size={12} />} sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', fontWeight: 600 }} />;
      case 'ANNULEE':
        return <Chip label="Annulée" size="small" icon={<XCircle size={12} />} sx={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-muted)', fontWeight: 600 }} />;
      default:
        return <Chip label={statut} size="small" />;
    }
  };

  // Timeline workflow items setup
  const timelineSteps = [
    { key: 'EN_ATTENTE', label: 'Saisie', desc: 'Commande enregistrée en attente de confirmation', icon: <Clock size={16} /> },
    { key: 'CONFIRMEE', label: 'Confirmation', desc: 'Commande validée par l\'administrateur/agent', icon: <CheckCircle2 size={16} /> },
    { key: 'EN_PREPARATION', label: 'Préparation', desc: 'Le restaurant prépare les plats de la commande', icon: <Flame size={16} /> },
    { key: 'LIVREE', label: 'Livraison', desc: 'Plats livrés et encaissés avec succès', icon: <Truck size={16} /> }
  ];

  const getStepIndex = (statut) => {
    if (statut === 'ANNULEE') return -1;
    return timelineSteps.findIndex(step => step.key === statut);
  };

  const currentStepIdx = selectedCommande ? getStepIndex(selectedCommande.statut) : 0;

  return (
    <div>
      <PageHeader 
        title="Suivi des Commandes" 
        subtitle="Visualisez le flux logistique et faites progresser les statuts de préparation"
        action={
          // AGENT_RESTAURANT can only update order statuses, not create them
          userRole !== 'AGENT_RESTAURANT' && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/commandes/nouveau')}
            >
              <Plus size={18} />
              <span>Créer Commande</span>
            </button>
          )
        }
      />

      {/* FILTER CHIPS */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {STATUTS.map(st => (
          <button
            key={st.value}
            onClick={() => {
              setActiveFilter(st.value);
              setSelectedCommande(null);
            }}
            className={`btn ${activeFilter === st.value ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '9999px',
              padding: '0.4rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: activeFilter === st.value ? '0 4px 12px -4px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }} className="commandes-grid">
        
        {/* LEFT COLUMN: LIST */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <LoadingSpinner message="Récupération du carnet de commandes..." />
          ) : (
            <TableContainer component={Paper} sx={{ 
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden'
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(99, 102, 241, 0.03)' }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>ID</TableCell>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Client</TableCell>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Restaurant</TableCell>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Montant</TableCell>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Statut</TableCell>
                    <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }} align="right">Détails</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commandes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" style={{ color: 'var(--text-muted)', padding: '3.5rem' }}>
                        Aucune commande enregistrée pour ce statut.
                      </TableCell>
                    </TableRow>
                  ) : (
                    commandes.map((cmd) => {
                      const isSelected = selectedCommande?.id === cmd.id;
                      return (
                        <TableRow 
                          key={cmd.id} 
                          hover 
                          onClick={() => setSelectedCommande(cmd)}
                          sx={{ 
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.04) !important' : 'inherit',
                            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.01) !important' } 
                          }}
                        >
                          <TableCell style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>#{cmd.id}</TableCell>
                          <TableCell style={{ color: 'var(--text-main)', fontWeight: 500 }}>{cmd.nomClient}</TableCell>
                          <TableCell style={{ color: 'var(--text-main)' }}>{cmd.nomRestaurant}</TableCell>
                          <TableCell style={{ color: 'var(--text-main)', fontWeight: 600, fontFamily: 'monospace' }}>
                            {cmd.montant?.toLocaleString('fr-FR')} FCFA
                          </TableCell>
                          <TableCell>{getStatusChip(cmd.statut)}</TableCell>
                          <TableCell align="right">
                            <IconButton sx={{ color: 'var(--text-muted)' }}>
                              <ChevronRight size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  '.MuiTablePagination-selectIcon': { color: 'var(--text-main)' }
                }}
              />
            </TableContainer>
          )}
        </div>

        {/* RIGHT COLUMN: WORKFLOW TIMELINE */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedCommande ? (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '90px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Fiche Commande
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Commande #{selectedCommande.id}
                </h3>
              </div>

              {/* COMMANDE DETAIL CARD */}
              <div style={{ 
                backgroundColor: 'rgba(0,0,0,0.02)', 
                borderRadius: '0.75rem', 
                padding: '1.25rem', 
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Client :</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedCommande.nomClient}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Restaurant :</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedCommande.nomRestaurant}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Montant :</span>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {selectedCommande.montant?.toLocaleString('fr-FR')} FCFA
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date :</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {selectedCommande.dateCommande ? new Date(selectedCommande.dateCommande).toLocaleDateString('fr-FR', {
                      hour: '2-digit', minute: '2-digit'
                    }) : '-'}
                  </strong>
                </div>
              </div>

              {/* TIMELINE WORKFLOW */}
              <div>
                <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Workflow de Préparation
                </h4>
                
                {selectedCommande.statut === 'ANNULEE' ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem 1rem', 
                    backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                    border: '1px solid rgba(239, 68, 68, 0.1)', 
                    borderRadius: '0.75rem',
                    color: 'var(--danger)'
                  }}>
                    <XCircle size={32} style={{ margin: '0 auto 0.75rem auto' }} />
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Commande Annulée</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cette commande a été marquée comme annulée et retirée du flux logistique.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                    {/* Vertical connecting line */}
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      bottom: '12px',
                      width: '2px',
                      backgroundColor: 'var(--border)',
                      zIndex: 1
                    }} />

                    {timelineSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      
                      return (
                        <div key={step.key} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? (isCurrent ? 'var(--primary)' : 'var(--secondary)') : 'var(--bg-card)',
                            border: `2px solid ${isCompleted ? 'transparent' : 'var(--border)'}`,
                            color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {step.icon}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <strong style={{ 
                              fontSize: '0.9rem', 
                              color: isCurrent ? 'var(--primary)' : (isCompleted ? 'var(--text-main)' : 'var(--text-muted)') 
                            }}>
                              {step.label}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* TRANSITIONS BUTTONS */}
              {selectedCommande.statut !== 'LIVREE' && selectedCommande.statut !== 'ANNULEE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                  {selectedCommande.statut === 'EN_ATTENTE' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedCommande.id, 'ANNULEE')}
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      >
                        Annuler
                      </button>
                      <button 
                        className="btn btn-primary" 
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedCommande.id, 'CONFIRMEE')}
                      >
                        Confirmer
                      </button>
                    </div>
                  )}

                  {selectedCommande.statut === 'CONFIRMEE' && (
                    <button 
                      className="btn btn-primary" 
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selectedCommande.id, 'EN_PREPARATION')}
                      style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}
                    >
                      Démarrer Préparation
                    </button>
                  )}

                  {selectedCommande.statut === 'EN_PREPARATION' && (
                    <button 
                      className="btn btn-primary" 
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selectedCommande.id, 'LIVREE')}
                      style={{ backgroundColor: '#10b981', color: '#fff' }}
                    >
                      Marquer comme Livrée
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px dashed var(--border)',
              borderRadius: '1rem',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Eye size={36} />
              <span>Sélectionnez une commande dans le tableau pour afficher son workflow logistique et effectuer des transitions d'états.</span>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(15px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .commandes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
