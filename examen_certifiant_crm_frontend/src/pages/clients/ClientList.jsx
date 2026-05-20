import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
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
  Avatar, 
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { Edit2, Trash2, Search, Plus, UserCheck, Shield } from 'lucide-react';

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [fidelities, setFidelities] = useState({}); // clientId -> fidelityData

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch fidelity details for a client
  const fetchFidelity = async (clientId) => {
    try {
      const response = await api.get(`/fidelites/client/${clientId}`);
      setFidelities(prev => ({
        ...prev,
        [clientId]: response.data
      }));
    } catch (e) {
      // Mock defaults if not found
      setFidelities(prev => ({
        ...prev,
        [clientId]: { niveau: 'NOUVEAU', points: 0 }
      }));
    }
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearch.trim()) {
        response = await clientService.search(debouncedSearch, page, rowsPerPage);
      } else {
        response = await clientService.getAll(page, rowsPerPage);
      }

      const clientList = response.data.content || [];
      setClients(clientList);
      setTotalElements(response.data.totalElements || 0);

      // Fetch fidelity details for each client
      clientList.forEach(client => {
        if (!fidelities[client.id]) {
          fetchFidelity(client.id);
        }
      });
    } catch (err) {
      console.error("Error fetching clients", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      try {
        await clientService.delete(clientToDelete.id);
        setDeleteOpen(false);
        setClientToDelete(null);
        fetchClients();
      } catch (e) {
        console.error("Error deleting client", e);
        alert("Erreur lors de la suppression du client.");
      }
    }
  };

  const getFidelityColor = (niveau) => {
    switch (niveau) {
      case 'PLATINUM': return '#3a86ff'; // Blue
      case 'GOLD': return '#ffbe0b'; // Gold
      case 'SILVER': return '#83c5be'; // Silver
      case 'BRONZE': return '#fb5607'; // Bronze/Orange
      default: return '#94a3b8'; // Grey
    }
  };

  const getInitials = (client) => {
    const first = client.prenom?.charAt(0) || '';
    const last = client.nom?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <div>
      <PageHeader 
        title="Gestion des Clients" 
        subtitle="Visualisez, recherchez et gérez les fiches clients de votre réseau"
        action={
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/clients/nouveau')}
          >
            <Plus size={18} />
            <span>Nouveau Client</span>
          </button>
        }
      />

      {/* SEARCH INPUT */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <TextField
          placeholder="Rechercher par nom, prénom ou email..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              color: 'var(--text-main)',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--primary)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Récupération des dossiers clients..." />
      ) : (
        <TableContainer component={Paper} sx={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(99, 102, 241, 0.03)' }}>
              <TableRow>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Client</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Ville</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Téléphone</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Type</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Restaurant</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Fidélité</TableCell>
                <TableCell style={{ fontWeight: 600, color: 'var(--text-muted)' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" style={{ color: 'var(--text-muted)', padding: '3rem' }}>
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => {
                  const fid = fidelities[client.id] || { niveau: 'NOUVEAU', points: 0 };
                  return (
                    <TableRow key={client.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.01) !important' } }}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Avatar sx={{ 
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}>
                            {getInitials(client)}
                          </Avatar>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {client.nom} {client.prenom}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {client.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell style={{ color: 'var(--text-main)' }}>{client.ville || 'Non spécifiée'}</TableCell>
                      <TableCell style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{client.telephone || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={client.type === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'} 
                          size="small"
                          sx={{ 
                            backgroundColor: client.type === 'ENTREPRISE' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: client.type === 'ENTREPRISE' ? 'var(--primary)' : 'var(--secondary)',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </TableCell>
                      <TableCell style={{ color: 'var(--text-main)' }}>{client.nomRestaurant || 'Aucun'}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Shield size={14} color={getFidelityColor(fid.niveau)} />
                          <span style={{ 
                            fontWeight: 700, 
                            fontSize: '0.8rem', 
                            color: getFidelityColor(fid.niveau) 
                          }}>
                            {fid.niveau}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ({fid.points} pts)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                          <IconButton 
                            onClick={() => navigate(`/clients/modifier/${client.id}`)}
                            sx={{ color: 'var(--primary)', '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' } }}
                          >
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteClick(client)}
                            sx={{ color: 'var(--danger)', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
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

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog 
        open={deleteOpen}
        title="Supprimer la fiche client ?"
        message={`Êtes-vous sûr de vouloir supprimer définitivement le dossier de ${clientToDelete?.nom} ${clientToDelete?.prenom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Conserver"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
