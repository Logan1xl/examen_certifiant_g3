import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    clientId: '',
    clientNom: '', // Used in mock
    type: 'APPEL',
    description: '',
    statut: 'OUVERTE'
  });

  // Clients helper list for dropdown selection
  const [clients, setClients] = useState([]);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interactions');
      setInteractions(response.data.content || response.data);
    } catch (err) {
      console.warn('Could not fetch real interactions, using mock data...', err);
      setInteractions([
        { id: 1, nomClient: 'Kamdem Jean', nomAgent: 'Agent Terrain 1', type: 'APPEL', description: 'Appel de suivi après sa première commande', dateInteraction: '2026-05-20T10:30:00', statut: 'RESOLUE' },
        { id: 2, nomClient: 'Ngo Ngwa Suzanne', nomAgent: 'Agent Terrain 2', type: 'VISITE', description: 'Visite terrain pour présenter le programme de fidélité corporate', dateInteraction: '2026-05-19T15:00:00', statut: 'OUVERTE' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.content || response.data);
    } catch (err) {
      console.warn('Could not fetch clients for interaction selection, using default mock list...');
      setClients([
        { id: 1, nom: 'Kamdem', prenom: 'Jean' },
        { id: 2, nom: 'Ngo Ngwa', prenom: 'Suzanne' },
        { id: 3, nom: 'SavoirManger Corporate', prenom: 'S.A.' }
      ]);
    }
  };

  useEffect(() => {
    fetchInteractions();
    fetchClients();
  }, []);

  const handleCreateInteraction = async (e) => {
    e.preventDefault();
    
    // Trouver le nom du client sélectionné pour l'état local / mock
    const selectedClient = clients.find(c => c.id === parseInt(newInteraction.clientId));
    const clientNom = selectedClient ? `${selectedClient.nom} ${selectedClient.prenom}` : 'Client Inconnu';

    try {
      await api.post('/interactions', {
        clientId: parseInt(newInteraction.clientId),
        type: newInteraction.type,
        description: newInteraction.description,
        statut: newInteraction.statut
      });
      fetchInteractions();
      setIsModalOpen(false);
      setNewInteraction({ clientId: '', clientNom: '', type: 'APPEL', description: '', statut: 'OUVERTE' });
    } catch (err) {
      console.warn('Adding interaction via API failed, updating local state for preview...', err);
      // Mode démo
      const interactionWithId = {
        id: interactions.length + 1,
        nomClient: clientNom,
        nomAgent: 'Agent Connecté',
        type: newInteraction.type,
        description: newInteraction.description,
        dateInteraction: new Date().toISOString(),
        statut: newInteraction.statut
      };
      setInteractions([interactionWithId, ...interactions]);
      setIsModalOpen(false);
      setNewInteraction({ clientId: '', clientNom: '', type: 'APPEL', description: '', statut: 'OUVERTE' });
    }
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'OUVERTE':
        return <span className="badge badge-primary">Ouverte</span>;
      case 'EN_COURS':
        return <span className="badge badge-warning">En Cours</span>;
      case 'RESOLUE':
        return <span className="badge badge-success">Résolue</span>;
      case 'CLOTUREE':
        return <span className="badge badge-danger">Clôturée</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Interactions Clients</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nouvelle Interaction
        </button>
      </div>

      <div className="table-container">
        <div className="table-header-actions">
          <h3 style={{ margin: 0 }}>Historique des Échanges</h3>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des interactions...
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Agent</th>
                <th>Canal / Type</th>
                <th>Description</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {interactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun échange enregistré.
                  </td>
                </tr>
              ) : (
                interactions.map((int) => (
                  <tr key={int.id}>
                    <td>{new Date(int.dateInteraction).toLocaleString('fr-FR')}</td>
                    <td style={{ fontWeight: 600 }}>{int.nomClient}</td>
                    <td>{int.nomAgent}</td>
                    <td>
                      <span className="badge badge-primary" style={{ filter: 'hue-rotate(180deg)' }}>
                        {int.type}
                      </span>
                    </td>
                    <td>{int.description}</td>
                    <td>{getStatutBadge(int.statut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nouvelle Interaction */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Loguer une Interaction</h2>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} 
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateInteraction}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client concerné</label>
                  <select
                    className="form-control"
                    value={newInteraction.clientId}
                    onChange={(e) => setNewInteraction({ ...newInteraction, clientId: e.target.value })}
                    required
                  >
                    <option value="">-- Sélectionner un client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Canal d'échange</label>
                  <select
                    className="form-control"
                    value={newInteraction.type}
                    onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                  >
                    <option value="APPEL">Appel téléphonique</option>
                    <option value="EMAIL">Email</option>
                    <option value="VISITE">Visite terrain</option>
                    <option value="CHAT">Chat / Messagerie</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select
                    className="form-control"
                    value={newInteraction.statut}
                    onChange={(e) => setNewInteraction({ ...newInteraction, statut: e.target.value })}
                  >
                    <option value="OUVERTE">Ouverte (En attente d'action)</option>
                    <option value="EN_COURS">En Cours de traitement</option>
                    <option value="RESOLUE">Résolue</option>
                    <option value="CLOTUREE">Clôturée</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Résumé / Description de l'interaction</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={newInteraction.description}
                    onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
