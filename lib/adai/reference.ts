export interface ReferenceOption {
  key: string;
  label: string;
  description: string;
  points: number;
}

export interface ReferenceDomain extends ReferenceOption {
  functions: ReferenceOption[];
}

export const REFERENCE_DOMAINS: ReferenceDomain[] = [
  {
    key: 'crm', label: 'CRM & Ventes', description: 'Pilotage commercial, pipeline et relation client.', points: 5,
    functions: [
      { key: 'crm_pipeline', label: 'Pipeline commercial', description: 'Visualisation des opportunités par étape.', points: 3 },
      { key: 'crm_prospects', label: 'Suivi prospects', description: 'Scoring et nurturing des leads.', points: 2 },
      { key: 'crm_accounts', label: 'Comptes clés', description: '360° grands comptes.', points: 3 },
    ],
  },
  {
    key: 'finance', label: 'Finance', description: 'Pilotage financier, trésorerie et reporting.', points: 5,
    functions: [
      { key: 'fin_pnl', label: 'Compte de résultat', description: 'P&L par entité et période.', points: 3 },
      { key: 'fin_cash', label: 'Trésorerie', description: 'Positions et prévisions de cash.', points: 3 },
      { key: 'fin_invoice', label: 'Facturation', description: 'Suivi des encaissements.', points: 2 },
    ],
  },
  {
    key: 'hr', label: 'Ressources Humaines', description: 'Effectifs, masse salariale et organisation.', points: 4,
    functions: [
      { key: 'hr_workforce', label: 'Effectifs', description: 'Headcount et turnover.', points: 2 },
      { key: 'hr_payroll', label: 'Masse salariale', description: 'Coût et évolution par catégorie.', points: 3 },
    ],
  },
  {
    key: 'ops', label: 'Opérations', description: 'Performance opérationnelle et processus.', points: 5,
    functions: [
      { key: 'ops_kpi', label: 'KPI opérationnels', description: 'Tableau de bord production.', points: 3 },
      { key: 'ops_process', label: 'Suivi processus', description: 'Cycle time et goulots.', points: 3 },
    ],
  },
  {
    key: 'marketing', label: 'Marketing', description: 'Acquisition, campagnes et contenu.', points: 4,
    functions: [
      { key: 'mkt_campaigns', label: 'Campagnes', description: 'ROI par canal.', points: 3 },
      { key: 'mkt_content', label: 'Contenu', description: 'Calendrier et performance.', points: 2 },
    ],
  },
  {
    key: 'supply', label: 'Supply Chain', description: 'Flux, stocks et fournisseurs.', points: 5,
    functions: [
      { key: 'sup_stock', label: 'Stocks', description: 'Niveaux et rotation.', points: 3 },
      { key: 'sup_suppliers', label: 'Fournisseurs', description: 'Performance et risques.', points: 3 },
    ],
  },
  {
    key: 'proj', label: 'Projets', description: 'Portefeuille projets et ressources.', points: 4,
    functions: [
      { key: 'proj_portfolio', label: 'Portefeuille', description: 'Vue stratégique des projets.', points: 3 },
      { key: 'proj_resources', label: 'Ressources', description: 'Allocation et disponibilité.', points: 3 },
    ],
  },
  {
    key: 'customer', label: 'Customer Success', description: 'Satisfaction, support et churn.', points: 5,
    functions: [
      { key: 'csat_nps', label: 'NPS & CSAT', description: 'Suivi satisfaction client.', points: 2 },
      { key: 'csat_tickets', label: 'Tickets support', description: 'Volume et délai de résolution.', points: 3 },
    ],
  },
  {
    key: 'risk', label: 'Risques & Conformité', description: 'Cartographie des risques et conformité.', points: 6,
    functions: [
      { key: 'risk_map', label: 'Cartographie risques', description: 'Heatmap par processus.', points: 4 },
      { key: 'risk_compliance', label: 'Conformité', description: 'Suivi des contrôles.', points: 4 },
    ],
  },
  {
    key: 'data', label: 'Données & Analytics', description: 'Gouvernance, qualité et analytics transverses.', points: 6,
    functions: [
      { key: 'data_catalog', label: 'Catalogue données', description: 'Référentiel et lignage.', points: 4 },
      { key: 'data_quality', label: 'Qualité données', description: 'Règles et alertes.', points: 3 },
      { key: 'data_advanced', label: 'Analytics avancées', description: 'Modèles prédictifs.', points: 5 },
    ],
  },
  {
    key: 'ai', label: 'Intelligence Artificielle', description: 'Assistants et automatisations intelligentes.', points: 6,
    functions: [
      { key: 'ai_assistant', label: 'Assistant IA', description: 'Chatbot métier contextuel.', points: 4 },
      { key: 'ai_agent', label: 'Agent autonome', description: 'Automatisation de tâches.', points: 5 },
      { key: 'ai_multi', label: 'Agents multi-domaines', description: 'Orchestration IA transverse.', points: 6 },
    ],
  },
  {
    key: 'integration', label: 'Intégrations', description: 'Connexion aux systèmes existants.', points: 5,
    functions: [
      { key: 'int_erp', label: 'Connecteur ERP', description: 'Synchronisation bi-directionnelle.', points: 4 },
      { key: 'int_crm', label: 'Connecteur CRM', description: 'Push/pull automatique.', points: 3 },
      { key: 'int_api', label: 'API publique', description: 'Endpoints sécurisés.', points: 4 },
    ],
  },
  {
    key: 'security', label: 'Sécurité', description: "Contrôle d'accès, audit et données sensibles.", points: 6,
    functions: [
      { key: 'sec_sso', label: 'SSO & RBAC', description: 'Authentification fédérée.', points: 4 },
      { key: 'sec_audit', label: "Journal d'audit", description: 'Traçabilité complète.', points: 3 },
      { key: 'sec_sensitive', label: 'Données sensibles', description: 'Chiffrement et masquage.', points: 5 },
    ],
  },
  {
    key: 'ux', label: 'Expérience Utilisateur', description: 'Design, accessibilité et adoption.', points: 3,
    functions: [
      { key: 'ux_dashboard', label: 'Tableaux de bord', description: 'Visualisations sur-mesure.', points: 3 },
      { key: 'ux_mobile', label: 'Mobile', description: 'Expérience responsive.', points: 3 },
    ],
  },
  {
    key: 'governance', label: 'Gouvernance', description: 'Multi-entités, multi-pays et organisation.', points: 6,
    functions: [
      { key: 'gov_multi_entity', label: 'Multi-entités', description: 'Consolidation par entité.', points: 5 },
      { key: 'multi_country', label: 'Multi-pays', description: 'Multi-devises et multi-langue.', points: 6 },
    ],
  },
  {
    key: 'automation', label: 'Automatisation', description: 'Workflows et déclencheurs automatiques.', points: 5,
    functions: [
      { key: 'auto_workflow', label: 'Workflows', description: 'Déclencheurs et actions.', points: 3 },
      { key: 'auto_multi', label: 'Automatisation avancée', description: 'Orchestration multi-systèmes.', points: 5 },
    ],
  },
  {
    key: 'site', label: 'Sites & Terrain', description: 'Pilotage multi-sites et reporting terrain.', points: 4,
    functions: [
      { key: 'site_client', label: 'Portail site client', description: 'Vue par site et client.', points: 4 },
    ],
  },
  {
    key: 'reporting', label: 'Reporting & Diffusion', description: 'Rapports planifiés et diffusion.', points: 3,
    functions: [
      { key: 'rep_scheduled', label: 'Rapports planifiés', description: 'Génération automatique.', points: 2 },
      { key: 'rep_export', label: 'Export multi-format', description: 'PDF, Excel, API.', points: 2 },
    ],
  },
  {
    key: 'infra', label: 'Infrastructure', description: 'Hébergement, performance et supervision.', points: 4,
    functions: [
      { key: 'infra_hosting', label: 'Hébergement managé', description: 'Supervision et SLO.', points: 3 },
      { key: 'infra_perf', label: 'Performance', description: 'Cache et optimisation.', points: 3 },
    ],
  },
  {
    key: 'support', label: 'Support & Adoption', description: 'Onboarding, documentation et assistance.', points: 3,
    functions: [
      { key: 'sup_onboarding', label: 'Onboarding', description: "Parcours d'adoption.", points: 2 },
      { key: 'sup_doc', label: 'Documentation', description: 'Guides et base de connaissances.', points: 2 },
    ],
  },
  {
    key: 'strategy', label: 'Stratégie & Roadmap', description: 'Alignement stratégique et feuille de route.', points: 4,
    functions: [
      { key: 'strat_roadmap', label: 'Roadmap', description: 'Feuille de route produit.', points: 3 },
      { key: 'strat_okr', label: 'OKR', description: 'Objectifs et résultats clés.', points: 3 },
    ],
  },
];

export const REFERENCE_USAGES: ReferenceOption[] = [
  { key: 'mobile_web', label: 'Utilisation sur mobile', description: 'Consulter ou agir depuis un smartphone.', points: 3 },
  { key: 'mobile_app', label: 'Application mobile dédiée', description: 'Application iOS / Android avec fonctions avancées.', points: 5 },
  { key: 'external_portal', label: 'Portail externe', description: 'Accès client, fournisseur ou collaborateur.', points: 4 },
  { key: 'automation', label: 'Automatiser les tâches répétitives', description: 'Notifications, validations, relances et synchronisations.', points: 4 },
  { key: 'ai', label: "Intégrer de l'intelligence artificielle", description: 'Assistant, analyse, génération ou agent métier.', points: 6 },
  { key: 'realtime', label: 'Données en temps réel', description: 'Mises à jour immédiates entre équipes et outils.', points: 5 },
  { key: 'existing_data', label: 'Reprendre les données existantes', description: 'Excel, ancien logiciel ou plusieurs bases.', points: 4 },
  { key: 'advanced_security', label: 'Accès et sécurité avancés', description: 'Rôles, validations, traçabilité et données sensibles.', points: 5 },
];

export const REFERENCE_TOOLS: ReferenceOption[] = [
  { key: 'crm', label: 'CRM', description: 'HubSpot, Salesforce, Zoho, Pipedrive...', points: 2 },
  { key: 'erp', label: 'ERP / Gestion', description: 'Odoo, Sage, SAP, Oracle, Dolibarr...', points: 3 },
  { key: 'accounting', label: 'Comptabilité', description: 'Facturation, paiements, écritures.', points: 2 },
  { key: 'payments', label: 'Paiement', description: 'Stripe, PayPal, mobile money, banque...', points: 3 },
  { key: 'communication', label: 'Communication', description: 'WhatsApp, email, SMS, Slack, Teams...', points: 2 },
  { key: 'microsoft', label: 'Microsoft / Google', description: '365, Workspace, Calendar, Drive.', points: 2 },
  { key: 'ecommerce', label: 'E-commerce', description: 'Shopify, WooCommerce, Prestashop...', points: 3 },
  { key: 'data', label: 'Data / BI', description: 'Power BI, Excel, bases de données...', points: 4 },
  { key: 'hr', label: 'RH / Paie', description: 'Congés, temps, paie, dossiers salariés.', points: 2 },
  { key: 'documents', label: 'Documents & signature', description: 'Nextcloud, GED, DocuSign, Yousign...', points: 2 },
];

export type RecommendationPack = 'START' | 'GROW' | 'SCALE';

export interface ReferenceRecommendation {
  points: number;
  pack: RecommendationPack;
  price: string;
  subtitle: string;
  reason: string;
  domains: string[];
  domainCount: number;
  functionCount: number;
  advancedUsageCount: number;
  toolCount: number;
}

export function calculateReferenceRecommendation(
  selectedDomains: string[],
  selectedFunctions: string[],
  selectedUsages: string[],
  selectedTools: string[],
  organization: string,
  people: string,
): ReferenceRecommendation {
  const domainPoints = REFERENCE_DOMAINS.filter((d) => selectedDomains.includes(d.key)).reduce((sum, d) => sum + d.points, 0);
  const functionPoints = REFERENCE_DOMAINS.flatMap((d) => d.functions)
    .filter((f) => selectedFunctions.includes(f.key))
    .reduce((sum, f) => sum + f.points, 0);
  const usagePoints = REFERENCE_USAGES.filter((u) => selectedUsages.includes(u.key)).reduce((sum, u) => sum + u.points, 0);
  const toolPoints = REFERENCE_TOOLS.filter((t) => selectedTools.includes(t.key)).reduce((sum, t) => sum + t.points, 0);
  const orgPoints = organization === 'Groupe multi-sites et multi-entités' ? 12 : organization === 'Multi-sites' ? 7 : organization === 'Multi-entités' ? 9 : 0;
  const peoplePoints = people === '151+' ? 7 : people === '51-150' ? 4 : people === '11-50' ? 2 : 0;
  const points = domainPoints + functionPoints + usagePoints + toolPoints + orgPoints + peoplePoints;

  const pack: RecommendationPack = points >= 55 ? 'SCALE' : points >= 32 ? 'GROW' : 'START';
  const price = pack === 'SCALE' ? 'À partir de 15 000 €' : pack === 'GROW' ? 'À partir de 9 000 €' : 'À partir de 5 000 €';
  const subtitle = pack === 'SCALE' ? 'Pilotez une entreprise entièrement connectée' : pack === 'GROW' ? 'Structurez vos opérations et vos équipes' : 'Commencez par un périmètre prioritaire';
  const reason = pack === 'SCALE'
    ? 'Votre besoin implique une transformation plus large, plusieurs équipes ou entités et une architecture évolutive. ADAI intervient comme DSI externalisée et partenaire de transformation.'
    : pack === 'GROW'
      ? 'Votre besoin couvre plusieurs domaines et nécessite une architecture intégrée, progressive et adaptée à vos priorités.'
      : 'Votre besoin peut démarrer par un périmètre ciblé, avec un socle simple à faire évoluer au fil de vos résultats.';

  return {
    points,
    pack,
    price,
    subtitle,
    reason,
    domains: REFERENCE_DOMAINS.filter((d) => selectedDomains.includes(d.key)).map((d) => d.label),
    domainCount: selectedDomains.length,
    functionCount: selectedFunctions.length,
    advancedUsageCount: selectedUsages.filter((key) => ['mobile_app', 'external_portal', 'automation', 'ai', 'realtime', 'advanced_security'].includes(key)).length,
    toolCount: selectedTools.length,
  };
}
