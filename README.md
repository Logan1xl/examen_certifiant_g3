# DIGITRANS-CM — Module CRM

## Contexte

Projet **DIGITRANS-CM** mené par **CAMTECH SOLUTIONS S.A.** pour **AGROCAM S.A.** (enseigne SavoirManger).  
Le module CRM modernise la gestion de la relation client des restaurants SavoirManger au Cameroun (Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré).

## Technologies

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 4.0.6, Java 17, Maven |
| Persistance | JPA / Hibernate, Flyway, PostgreSQL (prod), H2 (dev) |
| Sécurité | JWT (jjwt 0.12.5) avec rôles ADMIN_RESTAURANT, AGENT_TERRAIN, DG |
| API | RESTful, documentation Swagger (springdoc-openapi 3.0.2) |
| Mapping | MapStruct 1.5.5.Final, Lombok |
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Cloud | AWS Afrique du Sud (af-south-1) |

## Structure du projet

```
examen_certifiant_crm_backend/
├── src/main/java/com/examen_certifiant_crm_backend/
│   ├── config/           # Config Spring (Security, CORS, Swagger)
│   ├── security/         # JWT (provider, filter, UserDetailsService)
│   ├── model/            # Entités JPA (Client, Restaurant, Commande, Interaction, Fidelite, AgentCRM)
│   ├── dto/
│   │   ├── request/      # DTOs entrée avec validation (ClientRequest, CommandeRequest, InteractionRequest)
│   │   └── response/     # DTOs sortie (ClientResponse, CommandeResponse, InteractionResponse, RestaurantResponse)
│   ├── repository/       # Spring Data JPA (Client, Restaurant, Commande, Interaction, Fidelite, AgentCRM)
│   ├── service/          # Logique métier (Client, Commande, Restaurant, Interaction, Fidelite)
│   ├── controller/       # Contrôleurs REST
│   ├── mapper/           # MapStruct (ClientMapper, CommandeMapper, InteractionMapper)
│   └── exception/        # GlobalExceptionHandler, ResourceNotFoundException, BusinessException
├── src/main/resources/
│   ├── application.yml           # Configuration multi-profile (dev/prod)
│   └── db/migration/             # Flyway (V1__init_schema.sql)
└── pom.xml
```

## Prérequis

- Java 17+
- Maven 3.8+
- Docker (optionnel, pour PostgreSQL)

## Exécution en développement

```bash
# Backend (H2, auto-ddl)
cd examen_certifiant_crm_backend
mvn spring-boot:run -Dspring.profiles.active=dev

# Swagger : http://localhost:8080/swagger-ui.html
# H2 console : http://localhost:8080/h2-console
```

## Exécution en production

```bash
# Avec PostgreSQL
export DB_HOST=localhost DB_PORT=5432 DB_NAME=digitrans_crm DB_USER=crm_user DB_PASSWORD=*** 
mvn spring-boot:run -Dspring.profiles.active=prod
```

## Build

```bash
mvn clean package -DskipTests
java -jar target/examen_certifiant_crm_backend-0.0.1-SNAPSHOT.jar
```

## Équipe

| Rôle | Membre |
|---|---|
| Lead Tech & Cloud | MBONGO |
| Backend & Anomalies | NGO NGWA Suzanne |
| Frontend & API | TAMBAT Yvann |

## Tâches

| Tâche | Description | Responsable | Statut |
|---|---|---|---|
| T1 | Créer projet Spring Boot, config DB, JWT | TAMBAT Yvann | ✅ |
| T2 | Entités JPA | NGO NGWA S. | ✅ |
| **T3** | **Repository, Services, DTOs, Mappers** | **TAMBAT Yvann** | **✅** |
| T4 | API REST (CRUD zones, taux occupation) | TAMBAT Yvann | ⏳ |
| T5 | Règle anomalie (saturation > 95%) | NGO NGWA S. | ⏳ |
| T6 | Backend historique anomalies & interventions | TAMBAT Yvann | ⏳ |
| T7 | React : structure + routing + auth | MBONGO | ⏳ |
| T8 | Composant Liste zones + tableau de bord | NGO NGWA S. | ⏳ |
| T9 | Composant Détail zone + alertes | MBONGO | ⏳ |
| T10 | Consignation intervention (formulaire) | TAMBAT Yvann | ⏳ |
| T11 | Tests unitaires + intégration | Collectif | ⏳ |
| T12 | Docker + déploiement staging AWS | MBONGO | ⏳ |
