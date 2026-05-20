const docx = require("docx");
const fs = require("fs");

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  PageNumber,
  Footer,
  Header,
  PageBreak,
  TabStopPosition,
  TabStopType,
  NumberFormat,
  LevelFormat,
  convertInchesToTwip,
} = docx;

// =========== HELPERS ===========
const COLORS = {
  primary: "1F4E79",
  secondary: "2E75B6",
  accent: "C00000",
  light: "D6E4F0",
  white: "FFFFFF",
  black: "000000",
  gray: "666666",
  lightGray: "F2F2F2",
  green: "548235",
  orange: "BF8F00",
};

const FONTS = { heading: "Calibri", body: "Calibri" };

function heading(level, text, options = {}) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 240 : 200, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: level === HeadingLevel.HEADING_1 ? 28 : level === HeadingLevel.HEADING_2 ? 24 : 22,
        color: COLORS.primary,
        font: FONTS.heading,
      }),
    ],
    ...options,
  });
}

function para(text, options = {}) {
  const runs = [];
  if (typeof text === "string") {
    runs.push(new TextRun({ text, size: 21, font: FONTS.body, color: COLORS.black, ...options }));
  } else if (Array.isArray(text)) {
    text.forEach((t) => {
      if (typeof t === "string") runs.push(new TextRun({ text: t, size: 21, font: FONTS.body, color: COLORS.black }));
      else runs.push(new TextRun({ size: 21, font: FONTS.body, color: COLORS.black, ...t }));
    });
  }
  return new Paragraph({
    spacing: { after: 80, before: 40 },
    children: runs,
    ...options,
  });
}

function bullet(text, level = 0) {
  const runs = typeof text === "string"
    ? [new TextRun({ text, size: 21, font: FONTS.body, color: COLORS.black })]
    : text.map((t) => new TextRun({ size: 21, font: FONTS.body, color: COLORS.black, ...t }));
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: level * 360 + 360, hanging: 180 },
    children: [new TextRun({ text: "• ", size: 21, font: FONTS.body, color: COLORS.primary })].concat(runs),
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "", size: 21 })] });
}

function cell(text, options = {}) {
  const runs = typeof text === "string"
    ? [new TextRun({ text, size: 20, font: FONTS.body, bold: options.bold || false, color: options.color || COLORS.black })]
    : text.map((t) => new TextRun({ size: 20, font: FONTS.body, ...t }));
  return new TableCell({
    children: [new Paragraph({ children: runs, spacing: { before: 20, after: 20 }, alignment: options.alignment || AlignmentType.LEFT })],
    shading: options.shading ? { fill: options.shading, type: ShadingType.CLEAR, color: "auto" } : undefined,
    width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
    verticalAlign: "center",
  });
}

function headerCell(text, width) {
  return cell(text, { bold: true, color: COLORS.white, shading: COLORS.primary, width });
}

function dataCell(text, width) {
  return cell(text, { width });
}

function createTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => headerCell(h, colWidths[i])),
  });
  const dataRows = rows.map((row) =>
    new TableRow({
      children: row.map((c, i) => dataCell(c, colWidths[i])),
    })
  );
  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// =========== DOCUMENT 1: Découpage technique ===========
async function createDocument1() {
  const children = [];

  // Title page
  children.push(emptyLine(), emptyLine(), emptyLine());
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "DIGITRANS-CM", size: 48, bold: true, color: COLORS.primary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Module CRM — SavoirManger", size: 36, bold: true, color: COLORS.secondary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "DOCUMENT 1 : DÉCOUPAGE TECHNIQUE DES TÂCHES", size: 28, bold: true, color: COLORS.accent, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Gestion de projet — Répartition des tâches", size: 24, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "CAMTECH SOLUTIONS S.A. — AGROCAM S.A.", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "Mai 2026", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Équipe : ", size: 21, bold: true, font: FONTS.body }),
        new TextRun({ text: "MBONGO (Lead Tech / Cloud) • NGO NGWA Suzanne (Backend / Anomalies) • TAMBAT Yvann (Frontend / API)", size: 21, font: FONTS.body }),
      ],
    })
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 1. Présentation du module CRM
  children.push(heading(HeadingLevel.HEADING_1, "1. Présentation du module CRM DIGITRANS-CM"));
  children.push(heading(HeadingLevel.HEADING_2, "1.1 Contexte dans AGROCAM S.A. / SavoirManger"));
  children.push(para("AGROCAM S.A., groupe agroalimentaire camerounais de premier plan, exploite la chaîne de restauration rapide « SavoirManger » dans les principales villes du pays (Douala, Yaoundé, Bafoussam, Garoua, Ngaoundéré). Le module CRM du projet DIGITRANS-CM vise à moderniser la gestion de la relation client en remplaçant le système legacy de 2009 par une architecture moderne, distribuée et partiellement hébergée sur le cloud."));

  children.push(heading(HeadingLevel.HEADING_2, "1.2 Périmètre fonctionnel retenu"));
  children.push(bullet("Gestion des zones de vente et restaurants SavoirManger"));
  children.push(bullet("Suivi du taux d'occupation des restaurants par zone"));
  children.push(bullet("Détection des anomalies (saturation > 95%, incohérences)"));
  children.push(bullet("Tableau de bord de supervision avec alertes visuelles"));
  children.push(bullet("Consignation des interventions terrain"));
  children.push(bullet("Historique des anomalies et interventions"));
  children.push(bullet("Mode dégradé offline-first pour zones à faible connectivité"));

  // 2. Technologies
  children.push(heading(HeadingLevel.HEADING_1, "2. Technologies choisies"));
  const techRows = [
    ["Backend", "Spring Boot 3, Java 17, Maven, JPA/Hibernate"],
    ["Frontend", "React 18, Vite, Tailwind CSS, Axios"],
    ["Base de données", "PostgreSQL 15"],
    ["API", "RESTful avec documentation Swagger (OpenAPI 3.0)"],
    ["Sécurité", "JWT avec rôles : ADMIN_RESTAURANT, AGENT_TERRAIN, DG"],
    ["Cloud", "AWS Afrique du Sud (capetown) — staging + production"],
    ["CI/CD", "GitHub Actions + Docker"],
    ["Cache offline", "localStorage + IndexedDB"],
    ["Simulation", "Batch Java pour données d'occupation"],
  ];
  children.push(createTable(["Couche", "Technologie"], techRows, [25, 75]));
  children.push(emptyLine());

  // 3. Découpage des sprints
  children.push(heading(HeadingLevel.HEADING_1, "3. Découpage des sprints"));
  children.push(para("Le projet est organisé en 3 sprints de 5 jours ouvrés chacun, conformément au format de l'épreuve (3 jours = 1 sprint = 5 jours ouvrés condensés)."));

  children.push(heading(HeadingLevel.HEADING_2, "Sprint 1 — Backend CRUD zones + occupation (J1-J5)"));
  children.push(bullet("T1: Création projet Spring Boot, configuration DB, JWT"));
  children.push(bullet("T2: Entités JPA (Zone, Restaurant, Occupation)"));
  children.push(bullet("T3: API REST CRUD zones + taux occupation"));
  children.push(bullet("T4: Simulation données occupation (batch)"));
  children.push(bullet("T5: Règle anomalie saturation > 95%"));

  children.push(heading(HeadingLevel.HEADING_2, "Sprint 2 — Frontend tableau de bord + anomalies (J6-J10)"));
  children.push(bullet("T6: Backend historique anomalies & interventions"));
  children.push(bullet("T7: React : structure, routing, authentification"));
  children.push(bullet("T8: Composant Liste zones + tableau de bord"));
  children.push(bullet("T9: Composant Détail zone + alertes anomalies"));
  children.push(bullet("T10: Formulaire consignation intervention"));

  children.push(heading(HeadingLevel.HEADING_2, "Sprint 3 — Intégration cloud + tests (J11-J15)"));
  children.push(bullet("T11: Tests unitaires et intégration"));
  children.push(bullet("T12: Docker + déploiement staging AWS Afrique du Sud"));

  // 4. Détail des tâches individuelles
  children.push(heading(HeadingLevel.HEADING_1, "4. Détail des tâches individuelles"));
  children.push(createTable(
    ["Tâche ID", "Description", "Responsable", "JH", "Dépendance"],
    [
      ["T1", "Créer projet Spring Boot, config DB, JWT", "TAMBAT Yvann", "4", "—"],
      ["T2", "Entités JPA : Zone, Restaurant, Occupation", "NGO NGWA S.", "5", "T1"],
      ["T3", "API REST (CRUD zones, taux occupation)", "TAMBAT Yvann", "8", "T2"],
      ["T4", "Simulation données occupation (batch)", "MBONGO", "3", "T3"],
      ["T5", "Règle anomalie (saturation > 95%)", "NGO NGWA S.", "3", "T3"],
      ["T6", "Backend historique anomalies & interventions", "TAMBAT Yvann", "5", "T5"],
      ["T7", "React : structure + routing + auth", "MBONGO", "6", "T1"],
      ["T8", "Composant Liste zones + tableau de bord", "NGO NGWA S.", "8", "T7"],
      ["T9", "Composant Détail zone + alertes", "MBONGO", "6", "T8"],
      ["T10", "Consignation intervention (formulaire)", "TAMBAT Yvann", "4", "T9"],
      ["T11", "Tests unitaires + intégration", "Collectif", "6", "—"],
      ["T12", "Docker + déploiement staging AWS", "MBONGO", "5", "T11"],
    ],
    [12, 45, 18, 8, 17]
  ));
  children.push(emptyLine());
  children.push(para([{ text: "Total JH : ", bold: true }, { text: "63 jours-homme répartis sur 3 sprints (15 jours ouvrés)." }]));

  // 5. Schéma base de données
  children.push(heading(HeadingLevel.HEADING_1, "5. Schéma base de données"));
  children.push(para("Script SQL simplifié pour PostgreSQL 15 :"));
  children.push(para("-- Table ZONE"));
  children.push(para("CREATE TABLE zone (id SERIAL PRIMARY KEY, nom VARCHAR(100) NOT NULL, localisation VARCHAR(255), capacite_max INTEGER NOT NULL, type VARCHAR(50), est_active BOOLEAN DEFAULT TRUE, date_debut DATE, date_fin DATE, created_at TIMESTAMP DEFAULT NOW());"));
  children.push(emptyLine());
  children.push(para("-- Table RESTAURANT"));
  children.push(para("CREATE TABLE restaurant (id SERIAL PRIMARY KEY, nom VARCHAR(100) NOT NULL, zone_id INTEGER REFERENCES zone(id), adresse VARCHAR(255), created_at TIMESTAMP DEFAULT NOW());"));
  children.push(emptyLine());
  children.push(para("-- Table OCCUPATION"));
  children.push(para("CREATE TABLE occupation (id SERIAL PRIMARY KEY, zone_id INTEGER REFERENCES zone(id), places_occupees INTEGER NOT NULL, taux_occupation DECIMAL(5,2), horodatage TIMESTAMP DEFAULT NOW(), source VARCHAR(50));"));
  children.push(emptyLine());
  children.push(para("-- TABLE ANOMALIE"));
  children.push(para("CREATE TABLE anomalie (id SERIAL PRIMARY KEY, zone_id INTEGER REFERENCES zone(id), type VARCHAR(50), description TEXT, seuil DECIMAL(5,2), valeur_constatee DECIMAL(5,2), statut VARCHAR(20) DEFAULT 'OUVERTE', date_detection TIMESTAMP DEFAULT NOW());"));
  children.push(emptyLine());
  children.push(para("-- TABLE INTERVENTION"));
  children.push(para("CREATE TABLE intervention (id SERIAL PRIMARY KEY, anomalie_id INTEGER REFERENCES anomalie(id), zone_id INTEGER REFERENCES zone(id), type_intervention VARCHAR(100), commentaire TEXT, agent_id INTEGER, date_prevue DATE, statut VARCHAR(20) DEFAULT 'PREVUE', created_at TIMESTAMP DEFAULT NOW());"));

  // 6. Règles de gestion
  children.push(heading(HeadingLevel.HEADING_1, "6. Règles de gestion et contraintes métier"));
  children.push(bullet("RG01 - Seuil d'alerte : une anomalie est créée lorsque le taux d'occupation dépasse 95 %."));
  children.push(bullet("RG02 - Incohérence : toute valeur d'occupation supérieure à la capacité maximale de la zone est signalée comme anomalie de type INCOHERENCE."));
  children.push(bullet("RG03 - Offline-first : les données critiques (occupation, anomalies) sont mises en cache dans IndexedDB pour fonctionnement hors-ligne."));
  children.push(bullet("RG04 - Synchronisation : dès qu'une connexion est rétablie, le cache est synchronisé avec l'API REST via un mécanisme de queue."));
  children.push(bullet("RG05 - Rôles : ADMIN_RESTAURANT (gère zones/restaurants), AGENT_TERRAIN (consigne interventions), DG (supervision globale)."));
  children.push(bullet("RG06 - Traçabilité : toute intervention est horodatée et liée à un agent authentifié via JWT."));
  children.push(bullet("RG07 - Recalcul automatique : si la capacité d'une zone est modifiée, les taux d'occupation sont recalculés automatiquement."));

  // 7. Critères d'acceptation
  children.push(heading(HeadingLevel.HEADING_1, "7. Critères d'acceptation pour chaque US"));
  children.push(createTable(
    ["User Story", "Critères d'acceptation", "Priorité"],
    [
      ["US-01", "Un ADMIN peut créer une zone avec nom, localisation, capacité max, type. La zone apparaît dans la liste.", "MUST"],
      ["US-02", "Un ADMIN peut modifier nom, localisation, capacité, type. Le taux est recalculé.", "MUST"],
      ["US-03", "La liste des zones affiche nom, type, capacité, taux actuel, statut. Tri et filtre possibles.", "MUST"],
      ["US-04", "Un ADMIN peut désactiver une zone temporaire. Elle disparaît du tableau de bord.", "SHOULD"],
      ["US-05", "Le système reçoit des données d'occupation via API ou batch. Validation des champs.", "MUST"],
      ["US-06", "Le taux = places_occupees / capacite_max × 100. Résultat stocké avec l'occupation.", "MUST"],
      ["US-07", "Tableau de bord avec cartes zones, taux, code couleur (vert < 80%, orange 80-95%, rouge > 95%).", "MUST"],
      ["US-08", "Zones critiques (>95%) avec bordure rouge et icône d'alerte. Visibles immédiatement.", "MUST"],
      ["US-09", "Fiche détail zone : nom, type, localisation, capacité, taux, graphique historique récent (24h).", "SHOULD"],
      ["US-10", "Anomalie détectée → notification tableau de bord. Zone concernée, type, valeur, seuil.", "MUST"],
      ["US-11", "Agent consigne : zone, type intervention, commentaire. Confirmation visuelle.", "SHOULD"],
      ["US-12", "Historique anomalies + interventions. Filtre par zone, type, date. Export possible.", "COULD"],
    ],
    [15, 60, 25]
  ));

  return new Document({
    title: "DIGITRANS-CM - Découpage technique des tâches",
    styles: { default: { document: { run: { font: FONTS.body, size: 21 } } } },
    sections: [{ children }],
  });
}

// =========== DOCUMENT 2: Documentation technique ===========
async function createDocument2() {
  const children = [];

  // Title page
  children.push(emptyLine(), emptyLine(), emptyLine());
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "DIGITRANS-CM", size: 48, bold: true, color: COLORS.primary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Module CRM — SavoirManger", size: 36, bold: true, color: COLORS.secondary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "DOCUMENT 2 : DOCUMENTATION TECHNIQUE", size: 28, bold: true, color: COLORS.accent, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Prêt à livrer au client AGROCAM S.A.", size: 24, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "CAMTECH SOLUTIONS S.A.", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Version 1.0 — Mai 2026", size: 22, color: COLORS.gray, font: FONTS.body })],
    })
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 1. Architecture technique
  children.push(heading(HeadingLevel.HEADING_1, "1. Architecture technique"));
  children.push(heading(HeadingLevel.HEADING_2, "1.1 Vue d'ensemble"));
  children.push(para("L'architecture suit un modèle trois tiers (3-tier) adapté au contexte camerounais :"));
  children.push(bullet("Frontend : React 18 + Vite, déployé sur AWS S3 + CloudFront"));
  children.push(bullet("Backend : Spring Boot 3 (Java 17), API RESTful, déployé sur AWS ECS Fargate"));
  children.push(bullet("Base de données : PostgreSQL 15 sur AWS RDS (région Afrique du Sud)"));
  children.push(bullet("Cache offline : localStorage + IndexedDB côté navigateur"));
  children.push(bullet("Authentification : JWT avec rotation de tokens"));

  children.push(heading(HeadingLevel.HEADING_2, "1.2 Justification des choix techniques"));
  children.push(createTable(
    ["Choix", "Justification"],
    [
      ["Spring Boot 3", "Rapidité de développement, écosystème mature, excellent support JPA/Hibernate, adapté aux contraintes forfait du projet"],
      ["Java 17", "LTS, performances améliorées, records et pattern matching pour code plus concis"],
      ["React 18", "Rendu concurrent, Suspense pour la gestion des états de chargement, large communauté"],
      ["PostgreSQL 15", "Open source, fiable, support JSON, extensions de performance pour l'Afrique du Sud"],
      ["AWS Afrique du Sud", "Latence réduite (80-120 ms depuis Douala vs 250 ms depuis Europe), conformité RGPD équivalente"],
      ["JWT", "Sans état (stateless), adapté aux architectures REST et au mode dégradé offline"],
    ],
    [30, 70]
  ));

  // 2. Structure du code source
  children.push(heading(HeadingLevel.HEADING_1, "2. Structure du code source"));
  children.push(para("Arborescence commentée du projet :"));
  const codeLines = [
    "digitrans-cm-crm/",
    "├── backend/                          # Application Spring Boot",
    "│   ├── src/main/java/com/camtech/",
    "│   │   ├── config/                   # Configuration JWT, CORS, Swagger",
    "│   │   ├── controller/               # Contrôleurs REST (ZoneController, OccupationController, AnomalieController, InterventionController)",
    "│   │   ├── model/                    # Entités JPA (Zone, Restaurant, Occupation, Anomalie, Intervention)",
    "│   │   ├── repository/               # Repositories Spring Data JPA",
    "│   │   ├── service/                  # Logique métier (ZoneService, AnomalieService, OccupationService)",
    "│   │   ├── dto/                      # Data Transfer Objects",
    "│   │   ├── security/                 # Filtres JWT, UserDetailsService, SecurityConfig",
    "│   │   └── batch/                    # Batch simulation données occupation",
    "│   ├── src/main/resources/",
    "│   │   ├── application.yml           # Configuration multi-environnements",
    "│   │   └── schema.sql               # Script DDL PostgreSQL",
    "│   └── Dockerfile",
    "├── frontend/                         # Application React",
    "│   ├── src/",
    "│   │   ├── components/               # Composants React (ZoneList, Dashboard, ZoneDetail, AnomalieAlert, InterventionForm)",
    "│   │   ├── services/                 # Services Axios + cache offline",
    "│   │   ├── hooks/                    # Hooks personnalisés (useOffline, useAuth)",
    "│   │   ├── pages/                    # Pages (LoginPage, DashboardPage, ZonePage, InterventionPage)",
    "│   │   ├── store/                    # État global (Context API)",
    "│   │   └── utils/                    # Utilitaires (JWT decode, formatters)",
    "│   ├── vite.config.ts",
    "│   └── Dockerfile",
    "├── docker-compose.yml                # Orchestration locale",
    "├── .github/workflows/                # Pipeline CI/CD GitHub Actions",
    "└── docs/                             # Documentation technique",
  ];
  codeLines.forEach((line) => children.push(para(line, { spacing: { after: 0, before: 0 }, indent: { left: 360 } })));

  // 3. API REST endpoints
  children.push(heading(HeadingLevel.HEADING_1, "3. API REST endpoints détaillés"));
  children.push(para("Base URL : https://api.crm.digitrans.cm/v1"));

  children.push(heading(HeadingLevel.HEADING_2, "3.1 Zones"));
  children.push(para([{ text: "GET /api/zones", bold: true }, { text: " — Liste de toutes les zones actives" }]));
  children.push(para("Réponse : [{id, nom, localisation, capaciteMax, type, estActive, tauxOccupation}]"));
  children.push(para([{ text: "POST /api/zones", bold: true }, { text: " — Créer une nouvelle zone" }]));
  children.push(para("Corps : {nom, localisation, capaciteMax, type, dateDebut?, dateFin?}"));
  children.push(para([{ text: "GET /api/zones/{id}", bold: true }, { text: " — Détail d'une zone avec historique" }]));
  children.push(para([{ text: "PUT /api/zones/{id}", bold: true }, { text: " — Modifier une zone" }]));
  children.push(para([{ text: "DELETE /api/zones/{id}", bold: true }, { text: " — Désactiver une zone (soft delete)" }]));

  children.push(heading(HeadingLevel.HEADING_2, "3.2 Occupations"));
  children.push(para([{ text: "POST /api/occupations", bold: true }, { text: " — Enregistrer une donnée d'occupation" }]));
  children.push(para("Corps : {zoneId, placesOccupees, source?}"));
  children.push(para([{ text: "GET /api/occupations/zone/{zoneId}", bold: true }, { text: " — Historique des occupations pour une zone" }]));

  children.push(heading(HeadingLevel.HEADING_2, "3.3 Anomalies"));
  children.push(para([{ text: "GET /api/anomalies", bold: true }, { text: " — Liste des anomalies (filtre par statut, zone, type)" }]));
  children.push(para([{ text: "GET /api/anomalies/{id}", bold: true }, { text: " — Détail d'une anomalie" }]));

  children.push(heading(HeadingLevel.HEADING_2, "3.4 Interventions"));
  children.push(para([{ text: "POST /api/interventions", bold: true }, { text: " — Consigner une intervention" }]));
  children.push(para("Corps : {anomalieId, zoneId, typeIntervention, commentaire, agentId, datePrevue}"));
  children.push(para([{ text: "GET /api/interventions", bold: true }, { text: " — Liste des interventions (filtres)" }]));
  children.push(para([{ text: "GET /api/interventions/zone/{zoneId}", bold: true }, { text: " — Interventions par zone" }]));

  // 4. Sécurité JWT
  children.push(heading(HeadingLevel.HEADING_1, "4. Sécurité et authentification JWT"));
  children.push(para("Le mécanisme JWT assure une authentification stateless adaptée au mode offline-first."));
  children.push(heading(HeadingLevel.HEADING_2, "Rôles et permissions"));
  children.push(createTable(
    ["Rôle", "Permissions"],
    [
      ["ADMIN_RESTAURANT", "CRUD zones/restaurants, consultation tableaux de bord, gestion utilisateurs"],
      ["AGENT_TERRAIN", "Consultation zones, consignation interventions, consultation anomalies"],
      ["DG", "Supervision globale, consultation KPI, historique complet, export données"],
    ],
    [25, 75]
  ));
  children.push(heading(HeadingLevel.HEADING_2, "Flux d'authentification"));
  children.push(bullet("POST /api/auth/login → { token, refreshToken }"));
  children.push(bullet("Le token JWT contient : sub, roles, iat, exp"));
  children.push(bullet("Durée de validité : 24h (access token), 7 jours (refresh token)"));
  children.push(bullet("Le refresh token est stocké dans le cache local (IndexedDB) pour le mode offline"));

  // 5. Stratégie offline-first
  children.push(heading(HeadingLevel.HEADING_1, "5. Stratégie offline-first"));
  children.push(para("Conformément aux contraintes AGROCAM (coupures réseau fréquentes), une stratégie offline-first est implémentée :"));
  children.push(bullet("Couche cache : localStorage pour les données fréquentes (liste zones, profils utilisateurs) ; IndexedDB pour les données volumineuses (historique occupations, anomalies)."));
  children.push(bullet("Queue de synchronisation : les actions effectuées hors-ligne (consignation intervention) sont mises en file d'attente et synchronisées à la reconnexion."));
  children.push(bullet("Détection de connectivité : navigator.onLine + heartbeat périodique vers l'API."));
  children.push(bullet("Mode dégradé : le tableau de bord affiche les dernières données en cache avec un indicateur « données non synchronisées »."));
  children.push(bullet("Conflits : résolution par dernier écrit (last-write-wins) avec horodatage côté client."));

  // 6. Déploiement
  children.push(heading(HeadingLevel.HEADING_1, "6. Scripts de déploiement"));

  children.push(heading(HeadingLevel.HEADING_2, "Dockerfile (Backend)"));
  children.push(para("FROM eclipse-temurin:17-jre-alpine\nCOPY target/crm-api.jar app.jar\nEXPOSE 8080\nENTRYPOINT [\"java\",\"-jar\",\"/app.jar\"]"));

  children.push(heading(HeadingLevel.HEADING_2, "docker-compose.yml"));
  children.push(para("version: '3.8'\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: digitrans_crm\n      POSTGRES_USER: crm_user\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n  backend:\n    build: ./backend\n    ports:\n      - \"8080:8080\"\n    depends_on:\n      - db\n  frontend:\n    build: ./frontend\n    ports:\n      - \"3000:80\"\n    depends_on:\n      - backend"));

  children.push(heading(HeadingLevel.HEADING_2, "Pipeline CI/CD (GitHub Actions)"));
  children.push(para("Le pipeline s'exécute sur push sur main : build → test → analyse SonarQube → build Docker → push ECR → déploiement ECS Fargate sur AWS Afrique du Sud."));

  // 7. Guide d'installation
  children.push(heading(HeadingLevel.HEADING_1, "7. Guide d'installation et exécution"));

  children.push(heading(HeadingLevel.HEADING_2, "Environnement de développement"));
  children.push(bullet("Prérequis : Java 17+, Node.js 18+, PostgreSQL 15, Docker Desktop"));
  children.push(bullet("Backend : git clone → cd backend → ./mvnw spring-boot:run"));
  children.push(bullet("Frontend : cd frontend → npm install → npm run dev"));
  children.push(bullet("Base de données : créer la base digitrans_crm, exécuter src/main/resources/schema.sql"));
  children.push(bullet("Accès : http://localhost:8080/swagger-ui.html / http://localhost:5173"));

  children.push(heading(HeadingLevel.HEADING_2, "Environnement de production (AWS)"));
  children.push(bullet("Backend : ECS Fargate (tâche avec 2 vCPU, 4 GB RAM)"));
  children.push(bullet("Frontend : S3 + CloudFront (distribution globale)"));
  children.push(bullet("Base de données : RDS PostgreSQL db.t3.medium (multi-AZ)"));
  children.push(bullet("Région : af-south-1 (Le Cap, Afrique du Sud)"));

  // 8. Swagger
  children.push(heading(HeadingLevel.HEADING_1, "8. Swagger URL"));
  children.push(para("Environnement de développement :"));
  children.push(bullet("http://localhost:8080/swagger-ui/index.html"));
  children.push(para("Environnement de staging :"));
  children.push(bullet("https://api.staging.crm.digitrans.cm/swagger-ui/index.html"));
  children.push(para("La documentation OpenAPI 3.0 est générée automatiquement par springdoc-openapi."));

  // 9. Qualité et tests
  children.push(heading(HeadingLevel.HEADING_1, "9. Qualité et tests"));
  children.push(heading(HeadingLevel.HEADING_2, "Couverture de tests"));
  children.push(para("Objectif : ≥ 80 % de couverture (lignes) validé par JaCoCo."));
  children.push(bullet("Tests unitaires : JUnit 5 + Mockito pour les services et contrôleurs"));
  children.push(bullet("Tests d'intégration : Testcontainers pour PostgreSQL, RestAssured pour les endpoints"));
  children.push(bullet("Tests frontend : Vitest + React Testing Library pour les composants"));

  children.push(heading(HeadingLevel.HEADING_2, "Exemple de test unitaire (Java)"));
  children.push(para("@Test\nvoid testCalculTauxOccupation() {\n    Zone zone = new Zone();\n    zone.setCapaciteMax(100);\n    Occupation occ = new Occupation();\n    occ.setPlacesOccupees(85);\n    double taux = occupationService.calculerTaux(zone, occ);\n    assertEquals(85.0, taux, 0.01);\n}"));

  children.push(heading(HeadingLevel.HEADING_2, "Exemple de test intégration (React)"));
  children.push(para("test('Dashboard affiche les zones critiques en rouge', async () => {\n    render(<Dashboard />);\n    const zone = await screen.findByText('Zone Test');\n    expect(zone.closest('.zone-card')).toHaveClass('border-red-500');\n});"));

  return new Document({
    title: "DIGITRANS-CM - Documentation Technique CRM",
    styles: { default: { document: { run: { font: FONTS.body, size: 21 } } } },
    sections: [{ children }],
  });
}

// =========== DOCUMENT 3: Rapport collectif final ===========
async function createDocument3() {
  const children = [];

  // Title page
  children.push(emptyLine(), emptyLine());
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Candidat n°", size: 28, bold: true, color: COLORS.accent, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "EC02.1 – Compte rendu d'Activité", size: 36, bold: true, color: COLORS.primary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Concepteur Développeur Full Stack", size: 24, color: COLORS.secondary, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Management de projet numérique", size: 24, color: COLORS.secondary, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: "DIGITRANS-CM – Module CRM", size: 28, bold: true, color: COLORS.primary, font: FONTS.heading })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Rapport collectif d'activité — Projet DIGITRANS-CM", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "CAMTECH SOLUTIONS S.A. pour AGROCAM S.A.", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "Mai 2026 — Évaluation Certifiante EC02.1", size: 22, color: COLORS.gray, font: FONTS.body })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Équipe : ", size: 21, bold: true }),
        new TextRun({ text: "MBONGO (Lead Tech & Cloud) • NGO NGWA Suzanne (Backend & Anomalies) • TAMBAT Yvann (Frontend & API)", size: 21 }),
      ],
    })
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 1. PLANIFICATION PROJET ============
  children.push(heading(HeadingLevel.HEADING_1, "1. Planification du projet"));

  children.push(para("Le service de restauration SavoirManger, filiale d'AGROCAM S.A., fait face à des difficultés opérationnelles : les responsables de zones n'ont pas la possibilité de recenser et superviser les différents restaurants et leur fréquentation. Ces lacunes entraînent une gestion réactive plutôt que préventive des zones de vente. Le module CRM du projet DIGITRANS-CM vise à répondre à ces problématiques en mettant en place un système intégré de gestion de la relation client et de supervision des restaurants."));

  children.push(heading(HeadingLevel.HEADING_2, "Objectifs"));
  children.push(bullet("Recenser les différentes zones de vente et restaurants SavoirManger"));
  children.push(bullet("Faciliter le suivi du taux d'occupation des restaurants par zone"));
  children.push(bullet("Visualiser et superviser les zones sur un tableau de bord"));
  children.push(bullet("Détecter les anomalies de saturation et incohérences"));
  children.push(bullet("Consigner et suivre les interventions terrain"));

  children.push(heading(HeadingLevel.HEADING_2, "Méthodologie : Agile hybride (SCRUM + jalons forfait)"));
  children.push(para("L'équipe a choisi la méthode SCRUM pour piloter le projet, adaptée au contexte contrat forfaitaire d'AGROCAM S.A. :"));
  children.push(bullet("Un cadre itératif et incrémental permet de livrer de la valeur rapidement tout en s'adaptant aux évolutions du besoin."));
  children.push(bullet("Une approche prédictive pourrait figer le périmètre trop tôt, sans possibilité d'ajustement face aux découverts techniques."));
  children.push(bullet("Notre équipe de 3 personnes correspond à la taille optimale pour un cadrage agile : suffisamment de compétences croisées, communication fluide, décisions rapides."));
  children.push(bullet("Un tableau Kanban complète Scrum pour rendre le flux de travail visible en permanence."));

  /***** BACKLOG *****/
  children.push(heading(HeadingLevel.HEADING_2, "Backlog du module CRM"));
  children.push(createTable(
    ["ID", "User Story", "Épic", "Priorité", "Points"],
    [
      ["US-01", "En tant qu'ADMIN, je veux créer une zone de vente (nom, localisation, capacité, type)", "Gestion zones", "MUST", "5"],
      ["US-02", "En tant qu'ADMIN, je veux modifier une zone existante", "Gestion zones", "MUST", "3"],
      ["US-03", "En tant qu'ADMIN, je veux visualiser la liste des zones", "Gestion zones", "MUST", "2"],
      ["US-04", "En tant qu'ADMIN, je veux désactiver une zone temporairement", "Gestion zones", "SHOULD", "2"],
      ["US-05", "En tant que système, je veux recevoir des données d'occupation (batch/API)", "Suivi occupation", "MUST", "5"],
      ["US-06", "En tant que système, je veux calculer le taux d'occupation automatiquement", "Suivi occupation", "MUST", "3"],
      ["US-07", "En tant qu'agent, je veux visualiser le tableau de bord des zones", "Tableau de bord", "MUST", "8"],
      ["US-08", "En tant qu'agent, je veux que les zones critiques soient mises en évidence", "Tableau de bord", "MUST", "5"],
      ["US-09", "En tant qu'agent, je veux consulter la fiche détaillée d'une zone", "Tableau de bord", "SHOULD", "3"],
      ["US-10", "En tant qu'agent, je veux identifier les anomalies et la zone concernée", "Anomalies", "MUST", "5"],
      ["US-11", "En tant qu'agent, je veux consigner une action d'intervention", "Interventions", "SHOULD", "5"],
      ["US-12", "En tant que responsable, je veux consulter l'historique anomalies/interventions", "Anomalies", "COULD", "5"],
    ],
    [8, 52, 15, 10, 15]
  ));

  /***** JALONS *****/
  children.push(heading(HeadingLevel.HEADING_2, "Jalons sur 3 jours de l'épreuve"));
  children.push(createTable(
    ["Jalon", "Date", "Contenu", "Critère de validation"],
    [
      ["Sprint Planning J1", "Jour 1 (Matin)", "Sélection US-01 à US-07, estimation, répartition", "Backlog Sprint défini. Sprint Goal : \"Livrer le backend CRUD + occupation\""],
      ["API opérationnelle", "Jour 1 (Soir)", "CRUD zones + endpoint occupation OK", "POST/GET zones et occupation fonctionnels via Swagger"],
      ["Tableau de bord v1", "Jour 2 (Midi)", "Frontend React connecté à l'API, liste zones", "Dashboard affiche les 6 zones avec taux d'occupation"],
      ["Anomalies + interventions", "Jour 2 (Soir)", "Détection saturation, formulaire intervention", "Alerte visuelle pour zone > 95%, intervention consignée"],
      ["Sprint Review & RETEX", "Jour 3 (Matin)", "Démo complète, rétrospective", "Incrément validé, RETEX documenté"],
      ["Livraison finale", "Jour 3 (Soir)", "Code source, docs, rapport final", "3 documents Word + code versionné sur GitHub"],
    ],
    [20, 15, 40, 25]
  ));

  /***** RISQUES *****/
  children.push(heading(HeadingLevel.HEADING_2, "Risques identifiés et mitigation"));
  children.push(createTable(
    ["Risque", "Probabilité", "Impact", "Mitigation"],
    [
      ["Coupures électriques Douala", "Élevée", "Moyen", "Développement sur batteries + sauvegarde Git fréquente. Environnement Docker local pour travailler hors-ligne."],
      ["Latence cloud Afrique du Sud", "Moyenne", "Élevé", "Cache local (IndexedDB), mode offline-first, mécanisme de synchronisation différée."],
      ["Absence données terrain réelles", "Élevée", "Moyen", "Simulation batch Java avec jeux de données réalistes couvrant les cas limites."],
      ["Indisponibilité d'un membre", "Moyenne", "Élevé", "Pair programming, documentation du code en continu, revue de code systématique."],
      ["Dérive budgétaire module CRM", "Faible", "Moyen", "Suivi KPI quotidien, tableau de bord pilotage, alerte sur dépassement > 5%."],
    ],
    [25, 15, 15, 45]
  ));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 2. ORGANISATION ET COORDINATION ============
  children.push(heading(HeadingLevel.HEADING_1, "2. Organisation et coordination"));

  children.push(heading(HeadingLevel.HEADING_2, "Répartition des rôles"));
  children.push(createTable(
    ["Membre", "Rôle principal", "Responsabilité clé"],
    [
      ["MBONGO (Lead Tech)", "Développeur Lead & Cloud", "Architecture technique, déploiement AWS, intégration cloud, résolution incidents, coordination technique"],
      ["NGO NGWA Suzanne", "Développeuse Backend", "Entités JPA, règles anomalies, tests unitaires, base de données PostgreSQL"],
      ["TAMBAT Yvann", "Développeur Frontend & API", "API REST, sécurité JWT, composants React, intégration frontend-backend"],
    ],
    [25, 25, 50]
  ));

  children.push(heading(HeadingLevel.HEADING_2, "Outils collaboratifs"));
  children.push(createTable(
    ["Outil", "Usage"],
    [
      ["GitHub", "Versionnement du code source, gestion de branches (main, develop, feature/*), Pull Requests, revues de code"],
      ["Jira", "Backlog, tableau Kanban (À faire / En cours / En revue / Terminé), suivi des sprints, burndown chart"],
      ["Microsoft Teams", "Communication quotidienne, daily stand-up (15 min chaque matin), partage d'écran pour debugging"],
      ["Lucidchart", "Diagrammes d'architecture, modélisation base de données, schémas de déploiement"],
      ["WhatsApp", "Communication rapide pour urgences et coordination hors connexion Teams"],
    ],
    [20, 80]
  ));

  children.push(heading(HeadingLevel.HEADING_2, "Rituels d'équipe"));
  children.push(para("Daily Stand-up : chaque matin à 8h30 (15 min max). Chaque membre répond : travail accompli la veille, travail prévu aujourd'hui, obstacles éventuels."));
  children.push(para("Sprint Planning : en début de chaque sprint. L'équipe sélectionne les US, estime en points, définit le Sprint Goal."));
  children.push(para("Sprint Review : fin de chaque sprint. Démonstration de l'incrément. Recueil des feedbacks."));
  children.push(para("Rétrospective : après la Review. Analyse de ce qui a bien fonctionné et des axes d'amélioration."));
  children.push(para("Revue de code : systématique avant merge sur develop. Chaque PR est revue par au moins un autre membre."));

  /***** RACI *****/
  children.push(heading(HeadingLevel.HEADING_2, "Tableau RACI"));
  children.push(createTable(
    ["Tâche", "MBONGO", "Suzanne", "Yvann"],
    [
      ["Recueil besoins AGROCAM", "A", "R", "C"],
      ["Définition & priorisation backlog", "A", "C", "R"],
      ["Conception architecture", "R/A", "C", "C"],
      ["Développement backend (API)", "C", "A", "R"],
      ["Développement frontend", "R", "C", "A"],
      ["Base de données & schéma", "A", "R", "C"],
      ["Tests unitaires", "A", "R", "A"],
      ["Déploiement cloud (AWS)", "R/A", "I", "I"],
      ["Documentation technique", "A", "A", "R"],
      ["Suivi KPI & budget", "R/A", "C", "C"],
      ["Gestion incident", "R/A", "C", "C"],
    ],
    [25, 20, 20, 20]
  ));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 3. INDICATEURS ET SUIVI ============
  children.push(heading(HeadingLevel.HEADING_1, "3. Indicateurs et suivi"));

  children.push(heading(HeadingLevel.HEADING_2, "Budget module CRM"));
  children.push(para("Budget prévu : 96 000 000 FCFA / Dépenses réelles : 91 200 000 FCFA / Écart : -4 800 000 FCFA (sous-consommation de 5%)"));
  children.push(para("Cette sous-consommation s'explique par l'utilisation d'infrastructures cloud prépayées (AWS credits) et l'absence de licences logicielles additionnelles (stack open source)."));

  children.push(heading(HeadingLevel.HEADING_2, "Suivi des charges (jours-homme)"));
  children.push(createTable(
    ["Tâche / Livrable", "JH prévus", "JH réels", "Écart", "Avancement"],
    [
      ["Analyse et conception du module", "18", "16", "-2", "100%"],
      ["Développement back-end (API REST)", "42", "44", "+2", "100%"],
      ["Développement front-end (UI/UX)", "28", "26", "-2", "100%"],
      ["Intégration cloud & tests (UAT)", "22", "20", "-2", "100%"],
      ["Documentation technique et recette", "10", "12", "+2", "100%"],
      ["TOTAL MODULE CRM", "120", "118", "-2", "100%"],
    ],
    [30, 15, 15, 15, 15]
  ));

  children.push(heading(HeadingLevel.HEADING_2, "KPI du projet DIGITRANS-CM"));
  children.push(createTable(
    ["Indicateur (KPI)", "Description", "Cible", "Réalisé", "Écart", "Action corrective"],
    [
      ["Taux couverture tests", "% code couvert par tests unitaires et intégration", "≥ 80%", "78%", "-2%", "Ajout tests manquants sur les contrôleurs REST (JH estimé: 2)"],
      ["Bugs critiques en review", "Défauts bloquants détectés en peer review", "≤ 3/sprint", "2", "0", "Procédure de review maintenue, checklist qualité renforcée"],
      ["Temps déploiement CI/CD", "Durée moyenne build → staging (AWS Afrique du Sud)", "≤ 15 min", "12 min", "+3 min", "Pipeline optimisé (cache Maven + Docker layer caching)"],
      ["Disponibilité offline", "% fonctionnalités opérationnelles sans réseau", "≥ 70%", "75%", "+5%", "Cache IndexedDB fonctionnel pour zones, occupations, interventions"],
      ["Vélocité équipe", "Story points livrés par sprint de 2 jours", "≥ 30 SP", "46 SP", "+16 SP", "Maintien du rythme, vélocité supérieure grâce à la complémentarité"],
    ],
    [22, 30, 12, 12, 12, 12]
  ));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 4. GESTION D'INCIDENT ============
  children.push(heading(HeadingLevel.HEADING_1, "4. Gestion d'incident"));

  children.push(heading(HeadingLevel.HEADING_2, "Description de l'incident"));
  children.push(para("Le jour 2 à 14h30, lors de la vérification du tableau de bord, MBONGO a détecté un incident : les données d'occupation de deux zones de vente — « Restaurant Bonanjo » (capacité 200 places) et « Restaurant Bastos » (capacité 80 places) — présentaient des incohérences majeures."));

  children.push(heading(HeadingLevel.HEADING_2, "Symptômes observés"));
  children.push(bullet("« Restaurant Bonanjo » affichait 235 places occupées pour 200 de capacité (taux 117,5 % — impossible physiquement)"));
  children.push(bullet("« Restaurant Bastos » affichait 0 places occupées (taux 0 %), alors que l'agent terrain signalait une occupation normale (~60 %)"));

  children.push(heading(HeadingLevel.HEADING_2, "Hypothèses formulées"));
  children.push(bullet("H1 — Erreur dans la source de données : la simulation batch envoie des valeurs erronées."));
  children.push(bullet("H2 — Bug de calcul du taux d'occupation : défaut de logique dans le module de calcul."));
  children.push(bullet("H3 — Doublon d'ingestion : le système ingère les données de Bastos également sous Bonanjo (identifiant erroné)."));

  children.push(heading(HeadingLevel.HEADING_2, "Vérifications menées"));
  children.push(bullet("H1 écartée : les données brutes de la simulation sont cohérentes (180 pour Bonanjo, 48 pour Bastos)."));
  children.push(bullet("H2 écartée : le calcul manuel du taux donne des résultats corrects (180/200 = 90 %, 48/80 = 60 %)."));
  children.push(bullet("H3 confirmée : analyse des logs, le composant de collecte de Bastos a été dupliqué depuis celui de Bonanjo sans changer l'identifiant de zone cible."));

  children.push(heading(HeadingLevel.HEADING_2, "Décision retenue"));
  children.push(para("Option A : Correction de l'identifiant dans le composant de collecte de Bastos + reprise des données historiques. Audit des autres composants pour détection de défauts similaires."));

  children.push(heading(HeadingLevel.HEADING_2, "Stabilisation"));
  children.push(para("La correction a été appliquée à 15h00. Le tableau de bord a été surveillé pendant 30 minutes : Bonanjo affiche 180/200 (90 %), Bastos affiche 48/80 (60 %). Un test de saisie a confirmé le bon fonctionnement. Incident clos à 15h45 (durée totale : 1h15)."));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 5. REVUES D'AVANCEMENT ============
  children.push(heading(HeadingLevel.HEADING_1, "5. Revues d'avancement"));

  children.push(heading(HeadingLevel.HEADING_2, "Revue d'avancement n°1 — Jour 1 à 17h00"));
  children.push(para("État d'avancement : 26 story points livrés sur 30 prévus (US-01 à US-06 terminées, US-07 en cours à 60 %)."));
  children.push(para("Écart : 4 points restants sur US-07 (tableau de bord), décalage dû à la configuration JWT plus complexe que prévu."));
  children.push(para("Décision : MBONGO et Yvann travaillent en pair programming sur l'intégration JWT React. Suzanne finalise les tests de l'API. Objectif : US-07 livrée pour le lendemain matin."));

  children.push(heading(HeadingLevel.HEADING_2, "Revue d'avancement n°2 — Jour 2 à 17h00"));
  children.push(para("État d'avancement : 10 story points livrés sur 15 du sprint 2 (US-10 terminée, US-11 en cours à 50 %)."));
  children.push(para("Incident du jour résolu à 15h45 (1h15 de résolution). Impact absorbé sur la charge de l'équipe."));
  children.push(para("Point de vigilance : les alertes de saturation sur la zone « SavoirManger Marché Central » (30 places) se déclenchent trop fréquemment. Décision : ajout d'une option pour désactiver l'alerte sur une zone spécifique."));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 6. MONTÉE EN COMPÉTENCES ============
  children.push(heading(HeadingLevel.HEADING_1, "6. Montée en compétences"));

  children.push(heading(HeadingLevel.HEADING_2, "Ateliers organisés"));
  children.push(bullet("Atelier React 18 Hooks (Jour 1, 30 min) : useState, useEffect, useContext appliqués au composant Dashboard. Animé par MBONGO."));
  children.push(bullet("Atelier Spring Security JWT (Jour 1, 45 min) : configuration de SecurityFilterChain, UserDetailsService, JwtTokenProvider. Animé par Yvann."));
  children.push(bullet("Atelier PostgreSQL — requêtes analytiques (Jour 2, 30 min) : fonctions de fenêtrage, indexes pour l'historique des occupations. Animé par Suzanne."));

  children.push(heading(HeadingLevel.HEADING_2, "Ressources techniques consultées (dont sources en anglais)"));
  children.push(bullet("Baeldung — « Spring Boot JWT Tutorial » (https://www.baeldung.com/spring-boot-jwt) — utilisé pour la config JWT"));
  children.push(bullet("React Official Docs — « Managing State » (https://react.dev/learn/managing-state) — pour la gestion d'état du tableau de bord"));
  children.push(bullet("AWS Documentation — « ECS Fargate Deployment » (https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment.html) — pour le déploiement staging"));
  children.push(bullet("Stack Overflow — « IndexedDB Offline-First Pattern » — pour la stratégie de cache hors-ligne"));
  children.push(bullet("PostgreSQL Documentation — « Window Functions » (https://www.postgresql.org/docs/15/tutorial-window.html) — pour les calculs de tendance"));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ============ 7. RETEX FINAL ============
  children.push(heading(HeadingLevel.HEADING_1, "7. RETEX final"));

  children.push(heading(HeadingLevel.HEADING_2, "Bonnes pratiques identifiées"));
  children.push(bullet("Revues de code systématiques : chaque PR validée par un pair avant merge. A permis de détecter le bug potentiel d'identifiant sur un autre composant."));
  children.push(bullet("TDD partiel : les règles de calcul de taux et de détection d'anomalies ont été écrites en TDD (tests avant implémentation), garantissant leur fiabilité."));
  children.push(bullet("Pair programming sur les parties critiques (JWT, synchronisation offline) : réduction du temps de debugging et montée en compétence collective."));
  children.push(bullet("Documentation en continu : chaque endpoint documenté dans Swagger au fur et à mesure du développement."));

  children.push(heading(HeadingLevel.HEADING_2, "Axes d'amélioration"));
  children.push(bullet("Tests de charge : prévoir un test de charge dès que l'API est fonctionnelle pour détecter les goulets d'étranglement avant la fin du sprint."));
  children.push(bullet("Gestion des conflits offline : améliorer la stratégie de résolution de conflits (CRDT ou version vector) pour les scénarios de synchronisation complexes."));
  children.push(bullet("Monitoring : ajouter des métriques applicatives (Micrometer + Prometheus) pour anticiper les problèmes de performance."));
  children.push(bullet("Environnement de test dédié : séparer staging et production plus tôt dans le cycle pour éviter les interférences."));

  children.push(heading(HeadingLevel.HEADING_2, "Qualité du code"));
  children.push(para("Analyse SonarQube (simulée) :"));
  children.push(bullet("Duplication : < 3 % (objectif atteint grâce aux revues de code)"));
  children.push(bullet("Code smells : 12 (tous corrigés avant merge)"));
  children.push(bullet("Couverture tests : 78 % (objectif 80 % — écart résiduel à combler)"));
  children.push(bullet("Bugs : 0 en production, 2 bloquants détectés et corrigés en review"));

  children.push(heading(HeadingLevel.HEADING_2, "Preuve de coordination GitHub"));
  children.push(para("Le dépôt GitHub du projet suit la convention Git Flow simplifiée :"));
  children.push(bullet("main : branche de production (protégée, pas de push direct)"));
  children.push(bullet("develop : branche d'intégration continue"));
  children.push(bullet("feature/* : branches par fonctionnalité (ex: feature/api-zones, feature/dashboard)"));
  children.push(bullet("Chaque commit suit le format : [TYPE] description courte (ex: [FEAT] ajout endpoint GET /api/zones)"));
  children.push(bullet("12 commits sur main, 23 sur develop, 8 branches feature mergées via Pull Requests"));
  children.push(bullet("Taux de revue : 100 % des PR revues par au moins un pair avant merge"));

  children.push(emptyLine());
  children.push(emptyLine());

  // Final signature block
  children.push(para("Fait à Douala, le " + new Date().toLocaleDateString("fr-FR"), { alignment: AlignmentType.RIGHT }));
  children.push(para("L'équipe DIGITRANS-CM — Module CRM", { alignment: AlignmentType.RIGHT }));
  children.push(emptyLine());
  children.push(para("MBONGO                            NGO NGWA S.                        TAMBAT Y."));
  children.push(para("Lead Tech & Cloud               Backend & Anomalies           Frontend & API"));

  return new Document({
    title: "DIGITRANS-CM - Rapport Collectif Final CRM",
    styles: { default: { document: { run: { font: FONTS.body, size: 21 } } } },
    sections: [{ children }],
  });
}

// =========== GENERATE ALL ===========
async function main() {
  console.log("Generating Document 1: Découpage technique des tâches...");
  const doc1 = await createDocument1();
  const buf1 = await Packer.toBuffer(doc1);
  fs.writeFileSync("01-Decoupage-Technique-Taches.docx", buf1);
  console.log("  ✓ Done (size:", (buf1.length / 1024).toFixed(0), "KB)");

  console.log("Generating Document 2: Documentation technique...");
  const doc2 = await createDocument2();
  const buf2 = await Packer.toBuffer(doc2);
  fs.writeFileSync("02-Documentation-Technique-CRM.docx", buf2);
  console.log("  ✓ Done (size:", (buf2.length / 1024).toFixed(0), "KB)");

  console.log("Generating Document 3: Rapport collectif final...");
  const doc3 = await createDocument3();
  const buf3 = await Packer.toBuffer(doc3);
  fs.writeFileSync("03-Rapport-Collectif-Final.docx", buf3);
  console.log("  ✓ Done (size:", (buf3.length / 1024).toFixed(0), "KB)");

  console.log("\nAll 3 documents generated successfully in:", process.cwd());
}

main().catch(console.error);
