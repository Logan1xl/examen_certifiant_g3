import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import clientService from '../../services/clientService';
import restaurantService from '../../services/restaurantService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

const CAMEROON_PHONE_REGEX = /^\+237[2368][0-9]{8}$/;

// Validation Schema with Yup
const validationSchema = Yup.object().shape({
  nom: Yup.string()
    .required('Le nom est obligatoire')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
  prenom: Yup.string()
    .required('Le prénom est obligatoire')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),
  email: Yup.string()
    .required('L\'email est obligatoire')
    .email('Format email invalide')
    .max(150, 'L\'email ne doit pas dépasser 150 caractères'),
  telephone: Yup.string()
    .required('Le téléphone est obligatoire')
    .matches(
      CAMEROON_PHONE_REGEX,
      'Format invalide. Doit commencer par +237 suivi de 9 chiffres (ex: +237699999999)'
    ),
  ville: Yup.string()
    .required('La ville est obligatoire'),
  type: Yup.string()
    .required('Le type de client est obligatoire')
    .oneOf(['INDIVIDUEL', 'ENTREPRISE'], 'Type invalide'),
  restaurantId: Yup.string()
    .nullable()
    .notRequired()
});

const VILLES_CAMEROUN = [
  'Douala',
  'Yaoundé',
  'Garoua',
  'Bamenda',
  'Bafoussam',
  'Maroua',
  'Ngaoundéré'
];

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '+237',
      ville: '',
      type: 'INDIVIDUEL',
      restaurantId: ''
    }
  });

  // Fetch initial restaurants list for the dropdown
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

  // Fetch client details if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchClientDetails = async () => {
        setFetching(true);
        try {
          const response = await clientService.getById(id);
          const client = response.data;
          
          setValue('nom', client.nom || '');
          setValue('prenom', client.prenom || '');
          setValue('email', client.email || '');
          setValue('telephone', client.telephone || '+237');
          setValue('ville', client.ville || '');
          setValue('type', client.type || 'INDIVIDUEL');
          
          // Match restaurant name back to ID if it exists
          if (client.nomRestaurant) {
            // Find restaurant by name
            const matchingResto = restaurants.find(r => r.nom === client.nomRestaurant);
            if (matchingResto) {
              setValue('restaurantId', matchingResto.id.toString());
            }
          }
        } catch (err) {
          console.error("Error loading client", err);
          setApiError("Impossible de charger les détails du client.");
        } finally {
          setFetching(false);
        }
      };

      if (restaurants.length > 0) {
        fetchClientDetails();
      }
    }
  }, [id, isEditMode, setValue, restaurants]);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    // Format DTO: convert restaurantId back to Long or null
    const payload = {
      ...data,
      restaurantId: data.restaurantId ? parseInt(data.restaurantId, 10) : null
    };

    try {
      if (isEditMode) {
        await clientService.update(id, payload);
      } else {
        await clientService.create(payload);
      }
      navigate('/clients');
    } catch (err) {
      console.error("Error saving client", err);
      setApiError(
        err.response?.data?.message || 
        "Une erreur s'est produite lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingSpinner message="Chargement des données du client..." />;
  }

  return (
    <div>
      <PageHeader 
        title={isEditMode ? "Modifier le Client" : "Créer un Client"} 
        subtitle={isEditMode ? `Édition des informations du client #${id}` : "Enregistrer un nouveau client dans le système"}
        action={
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/clients')}
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
        maxWidth: '720px'
      }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="nom">Nom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="nom"
                className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                placeholder="Ex: Kamdem"
                {...register('nom')}
              />
              {errors.nom && <span className="invalid-feedback">{errors.nom.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prenom">Prénom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="prenom"
                className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                placeholder="Ex: Jean"
                {...register('prenom')}
              />
              {errors.prenom && <span className="invalid-feedback">{errors.prenom.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Adresse Email <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Ex: jean.kamdem@gmail.com"
              {...register('email')}
            />
            {errors.email && <span className="invalid-feedback">{errors.email.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="telephone">Téléphone (Format Cameroun) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="telephone"
                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                placeholder="Ex: +237699887766"
                {...register('telephone')}
              />
              {errors.telephone && <span className="invalid-feedback">{errors.telephone.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ville">Ville <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select
                id="ville"
                className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                {...register('ville')}
              >
                <option value="">Sélectionnez une ville</option>
                {VILLES_CAMEROUN.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
              {errors.ville && <span className="invalid-feedback">{errors.ville.message}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="type">Type de Client <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select
                id="type"
                className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                {...register('type')}
              >
                <option value="INDIVIDUEL">Particulier (INDIVIDUEL)</option>
                <option value="ENTREPRISE">Entreprise (ENTREPRISE)</option>
              </select>
              {errors.type && <span className="invalid-feedback">{errors.type.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="restaurantId">Rattachement Restaurant</label>
              <select
                id="restaurantId"
                className={`form-control ${errors.restaurantId ? 'is-invalid' : ''}`}
                {...register('restaurantId')}
              >
                <option value="">Aucun restaurant</option>
                {restaurants.map(resto => (
                  <option key={resto.id} value={resto.id.toString()}>
                    {resto.nom} ({resto.ville})
                  </option>
                ))}
              </select>
              {errors.restaurantId && <span className="invalid-feedback">{errors.restaurantId.message}</span>}
            </div>
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
              onClick={() => navigate('/clients')}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
