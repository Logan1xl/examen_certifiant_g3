CREATE TABLE agent_crm (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'AGENT_TERRAIN',
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurant (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    adresse VARCHAR(255),
    ville VARCHAR(100),
    capacite_max INTEGER,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(30),
    ville VARCHAR(100),
    type VARCHAR(30) NOT NULL,
    restaurant_id BIGINT REFERENCES restaurant(id),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE commande (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES client(id),
    restaurant_id BIGINT NOT NULL REFERENCES restaurant(id),
    montant DECIMAL(12,2) NOT NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE',
    date_commande TIMESTAMP DEFAULT NOW(),
    date_livraison TIMESTAMP
);

CREATE TABLE interaction (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES client(id),
    agent_id BIGINT REFERENCES agent_crm(id),
    type VARCHAR(20) NOT NULL,
    description TEXT,
    date_interaction TIMESTAMP DEFAULT NOW(),
    statut VARCHAR(20) NOT NULL DEFAULT 'OUVERTE'
);

CREATE TABLE fidelite (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL UNIQUE REFERENCES client(id),
    points INTEGER NOT NULL DEFAULT 0,
    niveau VARCHAR(20) NOT NULL DEFAULT 'NOUVEAU',
    date_debut TIMESTAMP DEFAULT NOW(),
    date_fin TIMESTAMP
);

CREATE INDEX idx_client_email ON client(email);
CREATE INDEX idx_client_ville ON client(ville);
CREATE INDEX idx_commande_client ON commande(client_id);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_interaction_agent ON interaction(agent_id);
CREATE INDEX idx_interaction_statut ON interaction(statut);
