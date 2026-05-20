import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State for adding client
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: 'Douala',
    corporate: false
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients', {
        params: { search: search || undefined }
      });
      // L'API Spring Boot renvoie un objet Page, le tableau est dans `content`
      setClients(response.data.content || response.data);
    } catch (err) {
      console.warn('Could not fetch real clients list, using mock data...', err);
      // Fallback avec des clients types de l'étude (Douala, Yaoundé, Bafoussam...)
      const mockClients = [
        { id: 1, nom: 'Kamdem', prenom: 'Jean', email: 'jean.kamdem@email.com', telephone: '699887766', ville: 'Douala', corporate: false, pointsFidelite: 150 },
        { id: 2, nom: 'Ngo Ngwa', prenom: 'Suzanne', email: 'suzanne.ngo@email.com', telephone: '677665544', ville: 'Yaoundé', corporate: false, pointsFidelite: 320 },
        { id: 3, nom: 'SavoirManger Corporate', prenom: 'S.A.', email: 'contact@savoirmanger.corp', telephone: '233445566', ville: 'Douala', corporate: true, pointsFidelite: 1250 },
        { id: 4, nom: 'Fouda', prenom: 'Pierre', email: 'pierre.fouda@email.com', telephone: '655443322', ville: 'Bafoussam', corporate: false, pointsFidelite: 80 }
      ];
      
      const filtered = mockClients.filter(c => 
        `${c.nom} ${c.prenom} ${c.ville}`.toLowerCase().includes(search.toLowerCase())
      );
      setClients(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clients', newClient);
      fetchClients();
      setIsModalOpen(false);
      setNewClient({ nom: '', prenom: '', email: '', telephone: '', ville: 'Douala', corporate: false });
    } catch (err) {
      console.warn('Adding client via API failed, updating local state for preview...', err);
      // Mode démo
      const clientWithId = {
        ...newClient,
        id: clients.length + 1,
        pointsFidelite: 0
      };
      setClients([...clients, clientWithId]);
      setIsModalOpen(false);
      setNewClient({ nom: '', prenom: '', email: '', telephone: '', ville: 'Douala', corporate: false });
    }
  };

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Gestion des Clients</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nouveau Client
        </button>
      </div>

      <div className="table-container">
        <div className="table-header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par nom, prénom ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des clients...
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Type</th>
                <th>Points Fidélité</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun client trouvé.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 600 }}>{client.nom} {client.prenom}</td>
                    <td>{client.email}</td>
                    <td>{client.telephone}</td>
                    <td>{client.ville}</td>
                    <td>
                      <span className={`badge ${client.corporate ? 'badge-primary' : 'badge-success'}`}>
                        {client.corporate ? 'Entreprise' : 'Particulier'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {client.pointsFidelite || 0} pts
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Créer un Nouveau Client</h2>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} 
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddClient}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newClient.nom}
                    onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newClient.prenom}
                    onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newClient.telephone}
                    onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <select
                    className="form-control"
                    value={newClient.ville}
                    onChange={(e) => setNewClient({ ...newClient, ville: e.target.value })}
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Ngaoundéré">Ngaoundéré</option>
                  </select>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="isCorporate"
                    checked={newClient.corporate}
                    onChange={(e) => setNewClient({ ...newClient, corporate: e.target.checked })}
                  />
                  <label htmlFor="isCorporate" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                    Client Entreprise (Corporate)
                  </label>
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
