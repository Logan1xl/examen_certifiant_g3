# DIGITRANS-CM — Module CRM SavoirManger

**Modernisation de la gestion de la relation client** des restaurants SavoirManger au Cameroun (Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré).  
Projet mené par **CAMTECH SOLUTIONS S.A.** pour **AGROCAM S.A.**

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Client (React 19 + Vite 8)                │
│  port:3000  →  proxy /api, /auth → localhost:8087           │
└──────────────────────┬───────────────────────────────────────┘
                       │  HTTP (JSON + JWT Bearer)
┌──────────────────────▼───────────────────────────────────────┐
│              Backend (Spring Boot 4.0.6 + Java 21)           │
│  port:8087  →  H2 (dev) / PostgreSQL (prod)                  │
│  Sécurité : Spring Security + JWT (jjwt 0.12.5)             │
│  API : RESTful + Swagger (springdoc-openapi 3.0.2)          │
│  Mapping : MapStruct 1.5.5, validation : Jakarta Validation  │
└──────────────────────────────────────────────────────────────┘
```

## Technologies

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 4.0.6, Java 21, Maven |
| Base de données | H2 (dev), PostgreSQL 16 (prod) |
| ORM | JPA / Hibernate 7.2.12 |
| Migration | Flyway (prod) |
| Sécurité | Spring Security + JWT (jjwt 0.12.5) |
| API | RESTful, Swagger UI (springdoc-openapi 3.0.2) |
| Mapping | MapStruct 1.5.5.Final |
| Frontend | React 19.2, Vite 8, React Router 6.28 |
| UI | Material UI 6.4, Recharts 2.15 |
| HTTP | Axios 1.7.9 |
| Outils | Lombok, DevTools |

## Structure du projet

```
DIGITRANS-CM-PROJET/
├── README.md
├── examen_certifiant_crm_backend/
│   ├── pom.xml
│   └── src/main/java/com/examen_certifiant_crm_backend/
│       ├── config/               # Config Spring
│       │   ├── CorsConfig.java        # CORS (localhost:3000, crm.savoirmanger.cm)
│       │   ├── DataInitializer.java   # Seed data (agents, clients, restaurants…)
│       │   ├── JacksonConfig.java     # JSON configuration
│       │   ├── OpenApiConfig.java     # Swagger/OpenAPI
│       │   └── WebMvcConfig.java      # LocaleResolver (fr_CM), i18n
│       ├── security/             # Sécurité JWT
│       │   ├── JwtUtils.java          # Génération/validation JWT
│       │   ├── JwtAuthFilter.java     # Filtre d'authentification
│       │   ├── JwtAuthEntryPoint.java # Point d'entrée 401
│       │   ├── SecurityConfig.java    # Spring Security config
│       │   ├── UserDetailsImpl.java   # UserDetails custom
│       │   └── UserDetailsServiceImpl.java
│       ├── dto/
│       │   ├── request/               # DTOs entrée + validation
│       │   │   ├── LoginRequestDTO.java
│       │   │   ├── RegisterRequestDTO.java
│       │   │   ├── ClientRequestDTO.java
│       │   │   ├── CommandeRequestDTO.java
│       │   │   └── InteractionRequestDTO.java
│       │   └── response/              # DTOs sortie
│       │       ├── LoginResponseDTO.java
│       │       ├── ClientResponseDTO.java
│       │       ├── CommandeResponseDTO.java
│       │       ├── InteractionResponseDTO.java
│       │       ├── RestaurantResponseDTO.java
│       │       └── FideliteResponseDTO.java
│       ├── entity/               # Entités JPA
│       │   ├── AgentCRM.java
│       │   ├── Client.java
│       │   ├── Commande.java
│       │   ├── Fidelite.java
│       │   ├── Interaction.java
│       │   └── Restaurant.java
│       ├── repository/           # Spring Data JPA
│       │   ├── AgentCRMRepository.java
│       │   ├── ClientRepository.java
│       │   ├── CommandeRepository.java
│       │   ├── FideliteRepository.java
│       │   ├── InteractionRepository.java
│       │   └── RestaurantRepository.java
│       ├── service/              # Logique métier
│       │   ├── ClientService.java
│       │   ├── CommandeService.java
│       │   ├── FideliteService.java
│       │   ├── InteractionService.java
│       │   └── RestaurantService.java
│       ├── controller/           # Contrôleurs REST
│       │   ├── AuthController.java
│       │   ├── ClientController.java
│       │   ├── CommandeController.java
│       │   ├── DashboardController.java
│       │   ├── FideliteController.java
│       │   ├── InteractionController.java
│       │   └── RestaurantController.java
│       ├── mapper/               # MapStruct
│       │   ├── ClientMapper.java
│       │   ├── CommandeMapper.java
│       │   └── InteractionMapper.java
│       └── exception/            # Gestion des erreurs
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           └── BusinessException.java
│
├── examen_certifiant_crm_frontend/
│   ├── package.json
│   ├── vite.config.js           # Proxy (port:3000 → backend:8087)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              # Routes principales
│       ├── context/
│       │   └── AuthContext.jsx   # Authentification (JWT, rôles RBAC)
│       ├── hooks/
│       │   ├── useApi.js        # Hook générique API avec loading/error
│       │   ├── useDebounce.js   # Hook anti-rebond
│       │   └── useLocalStorage.js
│       ├── services/            # Couche API Axios
│       │   ├── api.js           # Instance Axios (intercepteur JWT)
│       │   ├── authService.js   # /auth/login, /register
│       │   ├── clientService.js # /api/clients
│       │   ├── commandeService.js
│       │   ├── restaurantService.js
│       │   └── interactionService.js
│       ├── pages/               # Pages de l'application
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Clients.jsx
│       │   ├── Commandes.jsx
│       │   ├── Restaurants.jsx
│       │   ├── Interactions.jsx
│       │   ├── Landing.jsx
│       │   ├── auth/
│       │   ├── clients/
│       │   ├── commandes/
│       │   └── restaurants/
│       ├── components/
│       │   ├── common/
│       │   └── Layout/
│       └── assets/
```

## Prérequis

- **Java 21+** (le projet tourne sur Java 21 runtime)
- **Maven 3.8+**
- **Node.js 20+** et **npm 10+**

## Installation

### Backend

```bash
cd examen_certifiant_crm_backend
.\mvnw.cmd clean install -DskipTests
```

### Frontend

```bash
cd examen_certifiant_crm_frontend
npm install
```

## Exécution en développement

### 1. Démarrer le backend (H2, auto-ddl)

```bash
cd examen_certifiant_crm_backend
$env:SPRING_PROFILES_ACTIVE='dev'   # PowerShell
.\mvnw.cmd spring-boot:run
```

Sur Linux/Mac :
```bash
cd examen_certifiant_crm_backend
export SPRING_PROFILES_ACTIVE=dev
./mvnw spring-boot:run
```

Le backend démarre sur **http://localhost:8087** avec :
- **H2 Console** : http://localhost:8087/h2-console (JDBC URL : `jdbc:h2:mem:digitrans_crm`)
- **Swagger UI** : http://localhost:8087/swagger-ui.html
- **API Docs** : http://localhost:8087/api-docs

### 2. Démarrer le frontend

```bash
cd examen_certifiant_crm_frontend
npm run dev
```

Le frontend démarre sur **http://localhost:3000** et proxyie `/api` et `/auth` vers `http://localhost:8087`.

## Comptes de démonstration (seed data)

Tous les comptes utilisent le mot de passe **`password`** :

| Email | Rôle | Accès |
|---|---|---|
| `admin@test.com` | ADMIN | Accès total (CRUD, création d'agents) |
| `manager@test.com` | MANAGER | Gestion opérationnelle |
| `agent@test.com` | AGENT | Utilisation courante |
| `resto@test.com` | AGENT_RESTAURANT | Restreint aux fonctionnalités restaurant |

## API REST — Endpoints

### Authentification

| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| POST | `/auth/login` | Connexion → retourne JWT | Public |
| POST | `/auth/register` | Création compte AGENT | Public |
| POST | `/auth/admin/creer-agent` | Création compte avec rôle choisi | ADMIN |

### Clients

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/clients` | Liste tous les clients |
| GET | `/api/clients/{id}` | Détail d'un client |
| POST | `/api/clients` | Créer un client |
| PUT | `/api/clients/{id}` | Modifier un client |
| DELETE | `/api/clients/{id}` | Supprimer un client |
| GET | `/api/clients/search?nom=...` | Recherche par nom |
| GET | `/api/clients/ville/{ville}` | Clients par ville |

### Commandes

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/commandes` | Liste toutes les commandes |
| GET | `/api/commandes/{id}` | Détail d'une commande |
| POST | `/api/commandes` | Créer une commande |
| PUT | `/api/commandes/{id}` | Modifier une commande |
| DELETE | `/api/commandes/{id}` | Supprimer une commande |
| PATCH | `/api/commandes/{id}/statut` | Mettre à jour le statut |
| GET | `/api/commandes/restaurant/{id}` | Commandes par restaurant |
| GET | `/api/commandes/stats` | Statistiques des commandes |

### Restaurants

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | Liste tous les restaurants |
| GET | `/api/restaurants/{id}` | Détail d'un restaurant |
| GET | `/api/restaurants/stats` | Statistiques par restaurant |

### Interactions

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/interactions` | Liste toutes les interactions |
| POST | `/api/interactions` | Créer une interaction |
| PATCH | `/api/interactions/{id}/close` | Clore une interaction |
| GET | `/api/interactions/client/{id}` | Interactions d'un client |

### Fidélité

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/fidelites` | Liste tous les profils fidélité |
| GET | `/api/fidelites/{id}` | Détail d'un profil |

### Dashboard

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Statistiques globales (KPIs) |

## Pages Frontend

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Authentification JWT |
| `/` | Dashboard | KPIs, graphiques (Recharts) |
| `/clients` | Clients | Liste, recherche, CRUD |
| `/commandes` | Commandes | Liste, CRUD, filtres |
| `/restaurants` | Restaurants | Liste des partenaires |
| `/interactions` | Interactions | Suivi des échanges clients |

## Profils Spring Boot

### Dev (profil actif par défaut)
```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:digitrans_crm;DB_CLOSE_DELAY=-1
  jpa:
    hibernate:
      ddl-auto: update
  flyway:
    enabled: false   # Désactivé en dev (auto-ddl + seed data)
```

### Prod
```yaml
# application-prod.yml (variables d'env : DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
    locations: classpath:db/migration
```

## Build & Déploiement

### Backend

```bash
cd examen_certifiant_crm_backend
.\mvnw.cmd clean package -DskipTests
java -jar target/examen_certifiant_crm_backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd examen_certifiant_crm_frontend
npm run build     # Produit dist/
npm run preview   # Prévisualisation du build
```

## Variables d'environnement (prod)

| Variable | Défaut | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `dev` | Profil actif |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_NAME` | `digitrans_crm` | Nom de la base |
| `DB_USER` | `crm_user` | Utilisateur |
| `DB_PASSWORD` | — | Mot de passe |

## Équipe

| Rôle | Membre |
|---|---|
| Lead Tech & Cloud | MBONGO |
| Backend & Anomalies | NGO NGWA Suzanne |
| Frontend & API | TAMBAT Yvann |

## Licence

Projet interne **CAMTECH SOLUTIONS S.A.** — Tous droits réservés.
