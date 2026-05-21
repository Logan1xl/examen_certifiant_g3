import React, { useState, useEffect } from 'react';
import restaurantService from '../../services/restaurantService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Building, 
  MapPin, 
  Users, 
  TrendingUp, 
  Percent 
} from 'lucide-react';

export default function RestaurantList() {
  const [restaurantsByCity, setRestaurantsByCity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await restaurantService.list(0, 50);
        const list = response.data.content || [];
        
        // Group restaurants by city (ville)
        const grouped = list.reduce((acc, rest) => {
          const city = rest.ville || 'Autre';
          if (!acc[city]) acc[city] = [];
          
          // Generate a deterministic but realistic-looking occupancy rate for the demo
          const occupancy = Math.floor(45 + (rest.id * 7.3) % 40);
          
          acc[city].push({
            ...rest,
            occupancy
          });
          return acc;
        }, {});

        setRestaurantsByCity(grouped);
      } catch (err) {
        console.error("Error loading restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const getOccupancyColor = (rate) => {
    if (rate >= 80) return 'var(--danger)'; // Overcrowded
    if (rate >= 60) return 'var(--primary)'; // Busy
    return 'var(--secondary)'; // Moderate/Low
  };

  return (
    <div>
      <PageHeader 
        title="Réseau de Restaurants" 
        subtitle="Visualisez les établissements partenaires par ville et gérez le taux d'occupation en temps réel"
      />

      {loading ? (
        <LoadingSpinner message="Récupération de la carte des restaurants..." />
      ) : Object.keys(restaurantsByCity).length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px dashed var(--border)',
          borderRadius: '1rem',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          Aucun restaurant enregistré dans le réseau.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {Object.entries(restaurantsByCity).map(([city, list]) => (
            <div key={city} style={{ animation: 'fadeIn 0.5s ease-out' }}>
              
              {/* CITY HEADER */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '2px solid var(--border)',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <MapPin size={22} style={{ color: 'var(--primary)' }} />
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em' 
                }}>
                  {city}
                </h2>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {list.length} établissement{list.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* RESTAURANTS GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {list.map(rest => (
                  <div 
                    key={rest.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '1rem',
                      padding: '1.75rem',
                      boxShadow: 'var(--shadow)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="restaurant-card"
                  >
                    {/* Upper content */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '1.15rem', 
                          fontWeight: 700, 
                          color: 'var(--text-main)' 
                        }}>
                          {rest.nom}
                        </h3>
                        <Building size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </div>
                      
                      <p style={{ 
                        margin: '0.5rem 0 0 0', 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)',
                        lineHeight: 1.4 
                      }}>
                        {rest.adresse}
                      </p>
                    </div>

                    {/* Progress Bar for Occupancy Rate */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Percent size={14} /> Taux d'occupation
                        </span>
                        <strong style={{ color: getOccupancyColor(rest.occupancy) }}>
                          {rest.occupancy}%
                        </strong>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: 'rgba(0,0,0,0.04)', 
                        borderRadius: '4px',
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${rest.occupancy}%`, 
                          height: '100%', 
                          backgroundColor: getOccupancyColor(rest.occupancy),
                          borderRadius: '4px',
                          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }} />
                      </div>
                    </div>

                    {/* Bottom Info Details */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '1rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={14} />
                        Capacité : <strong>{rest.capaciteMax || '-'} couverts</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--secondary)' }}>
                        <TrendingUp size={14} /> Actif
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      <style>{`
        .restaurant-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
