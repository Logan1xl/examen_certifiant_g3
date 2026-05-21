import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import commandeService from '../../services/commandeService';
import clientService from '../../services/clientService';
import restaurantService from '../../services/restaurantService';
import PageHeader from '../../components/common/PageHeader';
import { ArrowLeft, Save, Search, User } from 'lucide-react';

const validationSchema = Yup.object().shape({
  clientId: Yup.number()
    .required('Le client est obligatoire')
    .typeError('Le client est obligatoire'),
  restaurantId: Yup.number()
    .required('Le restaurant est obligatoire')
    .typeError('Le restaurant est obligatoire'),
  montant: Yup.number()
    .required('Le montant est obligatoire')
    .typeError('Le montant doit être un nombre valide')
    .positive('Le montant doit être supérieur à zéro')
});

export default function CommandeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  
  // Client Autocomplete states
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchingClients, setSearchingClients] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      clientId: '',
      restaurantId: '',
      montant: ''
    }
  });

  // Load restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.list(0, 50);
        setRestaurants(response.data.content || []);
      } catch (err) {
        console.error("Error loading restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  // Handle client search (Autocomplete)
  useEffect(() => {
    if (!clientSearch.trim() || selectedClient?.fullName === clientSearch) {
      setClientResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchingClients(true);
      try {
        const response = await clientService.search(clientSearch, 0, 5);
        setClientResults(response.data.content || []);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setSearchingClients(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [clientSearch, selectedClient]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectClient = (client) => {
    const fullName = `${client.nom} ${client.prenom}`;
    setSelectedClient({ id: client.id, fullName });
    setClientSearch(fullName);
    setValue('clientId', client.id);
    
    // Automatically match/pre-fill restaurant if client has one assigned
    if (client.nomRestaurant) {
      const match = restaurants.find(r => r.nom === client.nomRestaurant);
      if (match) {
        setValue('restaurantId', match.id);
      }
    }

    setShowDropdown(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      await commandeService.create(data);
      navigate('/commandes');
    } catch (err) {
      console.error(err);
      setApiError(
        err.response?.data?.message || 
        "Impossible d'enregistrer la commande. Vérifiez la capacité du restaurant ou les données saisies."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Créer une Commande" 
        subtitle="Enregistrer une nouvelle vente dans le carnet de commandes"
        action={
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/commandes')}
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>
        }
      />

      {apiError && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          {apiError}
        </div>
      )}

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '600px'
      }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* CLIENT AUTOCOMPLETE */}
          <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
            <label className="form-label">Client <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                className={`form-control ${errors.clientId ? 'is-invalid' : ''}`}
                placeholder="Rechercher un client par nom ou email..."
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  if (selectedClient && e.target.value !== selectedClient.fullName) {
                    setSelectedClient(null);
                    setValue('clientId', '');
                  }
                }}
                onFocus={() => setShowDropdown(clientResults.length > 0)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            
            {errors.clientId && <span className="invalid-feedback">{errors.clientId.message}</span>}

            {/* Dropdown Options */}
            {showDropdown && clientResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                marginTop: '0.25rem',
                boxShadow: 'var(--shadow-md)',
                zIndex: 100,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {clientResults.map(client => (
                  <div
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      transition: 'var(--transition)'
                    }}
                    className="autocomplete-option"
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <User size={14} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {client.nom} {client.prenom}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {client.email} | {client.ville}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RESTAURANT SELECTION */}
          <div className="form-group">
            <label className="form-label" htmlFor="restaurantId">Restaurant Partenaire <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              id="restaurantId"
              className={`form-control ${errors.restaurantId ? 'is-invalid' : ''}`}
              {...register('restaurantId')}
            >
              <option value="">Sélectionnez le restaurant de préparation</option>
              {restaurants.map(resto => (
                <option key={resto.id} value={resto.id}>
                  {resto.nom} ({resto.ville})
                </option>
              ))}
            </select>
            {errors.restaurantId && <span className="invalid-feedback">{errors.restaurantId.message}</span>}
          </div>

          {/* MONTANT INPUT */}
          <div className="form-group">
            <label className="form-label" htmlFor="montant">Montant (FCFA) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              id="montant"
              type="number"
              className={`form-control ${errors.montant ? 'is-invalid' : ''}`}
              placeholder="Ex: 25000"
              {...register('montant')}
            />
            {errors.montant && <span className="invalid-feedback">{errors.montant.message}</span>}
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/commandes')}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              <span>{loading ? 'Enregistrement...' : 'Créer la Commande'}</span>
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .autocomplete-option:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }
      `}</style>
    </div>
  );
}
