import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRestaurants: 0,
    totalCommandes: 0,
    caMois: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.warn('Could not fetch real dashboard stats, using mock data...', err);
        // Données fictives réalistes si le backend est hors ligne
        setStats({
          totalClients: 45,
          totalRestaurants: 8,
          totalCommandes: 312,
          caMois: 1250000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Tableau de Bord</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Clients Enregistrés</span>
          <span className="stat-value">{loading ? '...' : stats.totalClients}</span>
        </div>
        <div className="stat-card secondary">
          <span className="stat-title">Restaurants Partenaires</span>
          <span className="stat-value">{loading ? '...' : stats.totalRestaurants}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-title">Total Commandes</span>
          <span className="stat-value">{loading ? '...' : stats.totalCommandes}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Chiffre d'Affaire (Mensuel)</span>
          <span className="stat-value">
            {loading ? '...' : `${stats.caMois.toLocaleString('fr-FR')} FCFA`}
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="table-container">
          <div className="table-header-actions">
            <h3 style={{ margin: 0 }}>Dernières Activités</h3>
          </div>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Type d'action</th>
                <th>Cible</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Création de Client</td>
                <td>Nouveau client corporate (Camtech S.A.)</td>
                <td>Aujourd'hui, 11:24</td>
                <td><span className="badge badge-success">Terminé</span></td>
              </tr>
              <tr>
                <td>Mise à jour statut commande</td>
                <td>Commande #1432 {'->'} CONFIRMEE</td>
                <td>Aujourd'hui, 10:15</td>
                <td><span className="badge badge-primary">Succès</span></td>
              </tr>
              <tr>
                <td>Nouvelle Interaction</td>
                <td>Appel téléphonique avec Kamdem Jean</td>
                <td>Hier, 16:45</td>
                <td><span className="badge badge-warning">En attente</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="stat-card" style={{ gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Objectifs Mensuels</h3>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <span>Objectif acquisition clients</span>
              <strong>75%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <span>Chiffre d'affaire visé</span>
              <strong>60%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--secondary)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
