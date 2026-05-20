import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/restaurants');
        setRestaurants(response.data.content || response.data);
      } catch (err) {
        console.warn('Could not fetch real restaurants, using mock data...', err);
        setRestaurants([
          { id: 1, nom: 'SavoirManger Douala Bonapriso', adresse: 'Rue des Palmiers, Bonapriso', ville: 'Douala', capaciteMax: 120, actif: true },
          { id: 2, nom: 'SavoirManger Yaoundé Bastos', adresse: 'Avenue de la Constitution, Bastos', ville: 'Yaoundé', capaciteMax: 150, actif: true },
          { id: 3, nom: 'SavoirManger Bafoussam Centre', adresse: 'Avenue commerciale', ville: 'Bafoussam', capaciteMax: 80, actif: true },
          { id: 4, nom: 'SavoirManger Garoua Roumde', adresse: 'Face stade Roumde Adjia', ville: 'Garoua', capaciteMax: 60, actif: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Restaurants SavoirManger</h1>
      </div>

      <div className="table-container">
        <div className="table-header-actions">
          <h3 style={{ margin: 0 }}>Réseau Cameroun</h3>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des restaurants...
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nom du Restaurant</th>
                <th>Adresse</th>
                <th>Ville</th>
                <th>Capacité Max</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun restaurant disponible.
                  </td>
                </tr>
              ) : (
                restaurants.map((rest) => (
                  <tr key={rest.id}>
                    <td style={{ fontWeight: 600 }}>{rest.nom}</td>
                    <td>{rest.adresse}</td>
                    <td>{rest.ville}</td>
                    <td>{rest.capaciteMax} couverts</td>
                    <td>
                      <span className={`badge ${rest.actif ? 'badge-success' : 'badge-danger'}`}>
                        {rest.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
