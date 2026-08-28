export type PackKey = 'start' | 'grow' | 'scale';

export type DeliveryMode =
  | 'SCRATCH'
  | 'PARTIAL_REUSE'
  | 'CORE_REUSE'
  | 'SAAS_ADAPT'
  | 'STANDARD_DEPLOY';

export interface PackDefinition {
  key: PackKey;
  label: string;
  tagline: string;
  base: number;
  maint: number;
  baseDays: Record<DeliveryMode, number>;
  highlights: string[];
}

export const PACKS: Record<PackKey, PackDefinition> = {
  start: {
    key: 'start',
    label: 'START',
    tagline: 'Premier cockpit opérationnel',
    base: 3500,
    maint: 200,
    baseDays: { SCRATCH: 14, PARTIAL_REUSE: 8, CORE_REUSE: 6, SAAS_ADAPT: 4, STANDARD_DEPLOY: 3 },
    highlights: ['1 domaine pilote', 'Livraison rapide', ' socle technique ADAI'],
  },
  grow: {
    key: 'grow',
    label: 'GROW',
    tagline: 'Cockpit multi-domaines',
    base: 4500,
    maint: 350,
    baseDays: { SCRATCH: 24, PARTIAL_REUSE: 12, CORE_REUSE: 8, SAAS_ADAPT: 5, STANDARD_DEPLOY: 4 },
    highlights: ['2 à 4 domaines', 'Intégrations ciblées', 'Tableaux de bord avancés'],
  },
  scale: {
    key: 'scale',
    label: 'SCALE',
    tagline: 'Plateforme de gouvernance',
    base: 7000,
    maint: 600,
    baseDays: { SCRATCH: 40, PARTIAL_REUSE: 22, CORE_REUSE: 14, SAAS_ADAPT: 8, STANDARD_DEPLOY: 6 },
    highlights: ['Multi-entités / multi-pays', 'Gouvernance de données', 'Automatisation avancée'],
  },
};

export const PACK_ORDER: PackKey[] = ['start', 'grow', 'scale'];

export interface ModuleDefinition {
  key: string;
  name: string;
  description: string;
  buildPrice: number;
  maintPrice: number;
}

export interface DomainDefinition {
  key: string;
  name: string;
  type: 'Métier' | 'Transversal';
  description: string;
  modules: ModuleDefinition[];
}

export const DOMAINS: DomainDefinition[] = [
  {
    key: 'crm',
    name: 'CRM & Ventes',
    type: 'Métier',
    description: 'Pilotage commercial, pipeline et relation client.',
    modules: [
      { key: 'crm_pipeline', name: 'Pipeline commercial', description: 'Visualisation des opportunités par étape.', buildPrice: 400, maintPrice: 40 },
      { key: 'crm_prospects', name: 'Suivi prospects', description: 'Scoring et nurturing des leads.', buildPrice: 350, maintPrice: 35 },
      { key: 'crm_accounts', name: 'Comptes clés', description: '360° grands comptes.', buildPrice: 450, maintPrice: 45 },
      { key: 'crm_orders', name: 'Devis & commandes', description: 'Documents commerciaux et validation.', buildPrice: 380, maintPrice: 38 },
      { key: 'crm_objectives', name: 'Objectifs commerciaux', description: 'Performance et prévisions.', buildPrice: 420, maintPrice: 42 },
    ],
  },
  {
    key: 'finance',
    name: 'Finance',
    type: 'Métier',
    description: 'Pilotage financier, trésorerie et reporting.',
    modules: [
      { key: 'fin_pnl', name: 'Compte de résultat', description: 'P&L par entité et période.', buildPrice: 500, maintPrice: 50 },
      { key: 'fin_cash', name: 'Trésorerie', description: 'Positions et prévisions de cash.', buildPrice: 450, maintPrice: 45 },
      { key: 'fin_invoice', name: 'Facturation', description: 'Suivi des encaissements.', buildPrice: 350, maintPrice: 35 },
      { key: 'fin_expenses', name: 'Dépenses & validations', description: 'Demandes, justificatifs, contrôles.', buildPrice: 400, maintPrice: 40 },
      { key: 'fin_budget', name: 'Budgets & reporting', description: 'Réel, budget et écarts.', buildPrice: 480, maintPrice: 48 },
    ],
  },
  {
    key: 'hr',
    name: 'Ressources Humaines',
    type: 'Métier',
    description: 'Effectifs, masse salariale et organisation.',
    modules: [
      { key: 'hr_workforce', name: 'Effectifs', description: 'Headcount et turnover.', buildPrice: 350, maintPrice: 35 },
      { key: 'hr_payroll', name: 'Masse salariale', description: 'Coût et évolution par catégorie.', buildPrice: 400, maintPrice: 40 },
      { key: 'hr_leave', name: 'Congés & absences', description: 'Demandes et validations.', buildPrice: 300, maintPrice: 30 },
      { key: 'hr_time', name: 'Temps & activités', description: 'Saisie et suivi du temps.', buildPrice: 320, maintPrice: 32 },
      { key: 'hr_recruiting', name: 'Recrutement', description: 'Candidatures et entretiens.', buildPrice: 380, maintPrice: 38 },
    ],
  },
  {
    key: 'ops',
    name: 'Opérations',
    type: 'Métier',
    description: 'Performance opérationnelle et processus.',
    modules: [
      { key: 'ops_kpi', name: 'KPI opérationnels', description: 'Tableau de bord production.', buildPrice: 400, maintPrice: 40 },
      { key: 'ops_process', name: 'Suivi processus', description: 'Cycle time et goulots.', buildPrice: 350, maintPrice: 35 },
      { key: 'ops_planning', name: 'Planning', description: 'Capacités et ressources.', buildPrice: 380, maintPrice: 38 },
      { key: 'ops_quality', name: 'Qualité', description: 'Contrôles et non-conformités.', buildPrice: 360, maintPrice: 36 },
      { key: 'ops_maintenance', name: 'Maintenance', description: 'Équipements et interventions.', buildPrice: 420, maintPrice: 42 },
    ],
  },
  {
    key: 'marketing',
    name: 'Marketing',
    type: 'Métier',
    description: 'Acquisition, campagnes et contenu.',
    modules: [
      { key: 'mkt_campaigns', name: 'Campagnes', description: 'ROI par canal.', buildPrice: 350, maintPrice: 35 },
      { key: 'mkt_content', name: 'Contenu', description: 'Calendrier et performance.', buildPrice: 300, maintPrice: 30 },
      { key: 'mkt_leads', name: 'Génération de leads', description: 'Formulaires et landing pages.', buildPrice: 320, maintPrice: 32 },
      { key: 'mkt_social', name: 'Réseaux sociaux', description: 'Publication et écoute sociale.', buildPrice: 280, maintPrice: 28 },
      { key: 'mkt_attribution', name: 'Attribution', description: 'Modèles multi-touch.', buildPrice: 400, maintPrice: 40 },
    ],
  },
  {
    key: 'supply',
    name: 'Supply Chain',
    type: 'Métier',
    description: 'Flux, stocks et fournisseurs.',
    modules: [
      { key: 'sup_stock', name: 'Stocks', description: 'Niveaux et rotation.', buildPrice: 400, maintPrice: 40 },
      { key: 'sup_suppliers', name: 'Fournisseurs', description: 'Performance et risques.', buildPrice: 350, maintPrice: 35 },
      { key: 'sup_movements', name: 'Mouvements & inventaires', description: 'Entrées, sorties, ajustements.', buildPrice: 380, maintPrice: 38 },
      { key: 'sup_deliveries', name: 'Livraisons', description: 'Préparation et suivi.', buildPrice: 360, maintPrice: 36 },
      { key: 'sup_traceability', name: 'Traçabilité', description: 'Lots, séries, emplacements.', buildPrice: 420, maintPrice: 42 },
    ],
  },
  {
    key: 'proj',
    name: 'Projets',
    type: 'Métier',
    description: 'Portefeuille projets et ressources.',
    modules: [
      { key: 'proj_portfolio', name: 'Portefeuille', description: 'Vue stratégique des projets.', buildPrice: 450, maintPrice: 45 },
      { key: 'proj_resources', name: 'Ressources', description: 'Allocation et disponibilité.', buildPrice: 350, maintPrice: 35 },
      { key: 'proj_tasks', name: 'Tâches & jalons', description: 'Planification et avancement.', buildPrice: 320, maintPrice: 32 },
      { key: 'proj_deliverables', name: 'Livrables', description: 'Documents et validations.', buildPrice: 300, maintPrice: 30 },
      { key: 'proj_collab', name: 'Collaboration', description: 'Échanges et décisions.', buildPrice: 280, maintPrice: 28 },
    ],
  },
  {
    key: 'customer',
    name: 'Customer Success',
    type: 'Métier',
    description: 'Satisfaction, support et churn.',
    modules: [
      { key: 'csat_nps', name: 'NPS & CSAT', description: 'Suivi satisfaction client.', buildPrice: 300, maintPrice: 30 },
      { key: 'csat_tickets', name: 'Tickets support', description: 'Volume et délai de résolution.', buildPrice: 350, maintPrice: 35 },
      { key: 'csat_sav', name: 'SAV', description: 'Incidents et interventions.', buildPrice: 320, maintPrice: 32 },
      { key: 'csat_contracts', name: 'Contrats & SLA', description: 'Engagements et échéances.', buildPrice: 400, maintPrice: 40 },
      { key: 'csat_churn', name: 'Churn & rétention', description: 'Alertes et plans de sauvegarde.', buildPrice: 380, maintPrice: 38 },
    ],
  },
  {
    key: 'risk',
    name: 'Risques & Conformité',
    type: 'Métier',
    description: 'Cartographie des risques et conformité.',
    modules: [
      { key: 'risk_map', name: 'Cartographie risques', description: 'Heatmap par processus.', buildPrice: 500, maintPrice: 50 },
      { key: 'risk_compliance', name: 'Conformité', description: 'Suivi des contrôles.', buildPrice: 450, maintPrice: 45 },
      { key: 'risk_audit', name: 'Audit interne', description: 'Missions et recommandations.', buildPrice: 420, maintPrice: 42 },
      { key: 'risk_incidents', name: 'Incidents & crises', description: 'Déclaration et gestion.', buildPrice: 380, maintPrice: 38 },
      { key: 'risk_policy', name: 'Politiques & RGPD', description: 'Registres et consentements.', buildPrice: 400, maintPrice: 40 },
    ],
  },
  {
    key: 'data',
    name: 'Données & Analytics',
    type: 'Transversal',
    description: 'Gouvernance, qualité et analytics transverses.',
    modules: [
      { key: 'data_catalog', name: 'Catalogue données', description: 'Référentiel et lignage.', buildPrice: 500, maintPrice: 50 },
      { key: 'data_quality', name: 'Qualité données', description: 'Règles et alertes.', buildPrice: 450, maintPrice: 45 },
      { key: 'data_advanced', name: 'Analytics avancées', description: 'Modèles prédictifs.', buildPrice: 700, maintPrice: 70 },
      { key: 'data_warehouse', name: 'Entrepôt de données', description: 'Modélisation et ETL.', buildPrice: 600, maintPrice: 60 },
      { key: 'data_governance', name: 'Gouvernance données', description: 'Politiques et stewardship.', buildPrice: 550, maintPrice: 55 },
    ],
  },
  {
    key: 'ai',
    name: 'Intelligence Artificielle',
    type: 'Transversal',
    description: 'Assistants et automatisations intelligentes.',
    modules: [
      { key: 'ai_assistant', name: 'Assistant IA', description: 'Chatbot métier contextuel.', buildPrice: 600, maintPrice: 60 },
      { key: 'ai_agent', name: 'Agent autonome', description: 'Automatisation de tâches.', buildPrice: 800, maintPrice: 80 },
      { key: 'ai_multi', name: 'Agents multi-domaines', description: 'Orchestration IA transverse.', buildPrice: 1200, maintPrice: 120 },
      { key: 'ai_nlp', name: 'NLP & documents', description: 'Extraction et classification.', buildPrice: 500, maintPrice: 50 },
      { key: 'ai_vision', name: 'Vision & OCR', description: 'Reconnaissance documentaire.', buildPrice: 550, maintPrice: 55 },
    ],
  },
  {
    key: 'integration',
    name: 'Intégrations',
    type: 'Transversal',
    description: 'Connexion aux systèmes existants.',
    modules: [
      { key: 'int_erp', name: 'Connecteur ERP', description: 'Synchronisation bi-directionnelle.', buildPrice: 600, maintPrice: 60 },
      { key: 'int_crm', name: 'Connecteur CRM', description: 'Push/pull automatique.', buildPrice: 500, maintPrice: 50 },
      { key: 'int_api', name: 'API publique', description: 'Endpoints sécurisés.', buildPrice: 700, maintPrice: 70 },
      { key: 'int_webhooks', name: 'Webhooks', description: 'Événements temps réel.', buildPrice: 350, maintPrice: 35 },
      { key: 'int_etl', name: 'ETL & pipelines', description: 'Transformation et chargement.', buildPrice: 450, maintPrice: 45 },
    ],
  },
  {
    key: 'security',
    name: 'Sécurité',
    type: 'Transversal',
    description: "Contrôle d'accès, audit et données sensibles.",
    modules: [
      { key: 'sec_sso', name: 'SSO & RBAC', description: 'Authentification fédérée.', buildPrice: 600, maintPrice: 60 },
      { key: 'sec_audit', name: "Journal d'audit", description: 'Traçabilité complète.', buildPrice: 450, maintPrice: 45 },
      { key: 'sec_sensitive', name: 'Données sensibles', description: 'Chiffrement et masquage.', buildPrice: 900, maintPrice: 90 },
      { key: 'sec_backup', name: 'Sauvegarde & PRA', description: 'Continuité et reprise.', buildPrice: 500, maintPrice: 50 },
      { key: 'sec_monitoring', name: 'Supervision sécurité', description: 'SIEM et alertes.', buildPrice: 550, maintPrice: 55 },
    ],
  },
  {
    key: 'ux',
    name: 'Expérience Utilisateur',
    type: 'Transversal',
    description: 'Design, accessibilité et adoption.',
    modules: [
      { key: 'ux_dashboard', name: 'Tableaux de bord', description: 'Visualisations sur-mesure.', buildPrice: 400, maintPrice: 40 },
      { key: 'ux_mobile', name: 'Mobile', description: 'Expérience responsive.', buildPrice: 500, maintPrice: 50 },
      { key: 'ux_accessibility', name: 'Accessibilité', description: 'RGAA et WCAG.', buildPrice: 350, maintPrice: 35 },
      { key: 'ux_onboarding', name: 'Onboarding guidé', description: 'Tutoriels et tooltips.', buildPrice: 300, maintPrice: 30 },
      { key: 'ux_themes', name: 'Thèmes & branding', description: 'Charte et personnalisation.', buildPrice: 280, maintPrice: 28 },
    ],
  },
  {
    key: 'governance',
    name: 'Gouvernance',
    type: 'Transversal',
    description: 'Multi-entités, multi-pays et organisation.',
    modules: [
      { key: 'gov_multi_entity', name: 'Multi-entités', description: 'Consolidation par entité.', buildPrice: 800, maintPrice: 80 },
      { key: 'multi_country', name: 'Multi-pays', description: 'Multi-devises et multi-langue.', buildPrice: 1000, maintPrice: 100 },
      { key: 'gov_roles', name: 'Rôles & permissions', description: 'Matrice et délégations.', buildPrice: 450, maintPrice: 45 },
      { key: 'gov_workflow', name: 'Workflow de validation', description: 'Approbations multi-niveaux.', buildPrice: 400, maintPrice: 40 },
      { key: 'gov_audit', name: 'Audit & traçabilité', description: 'Journal des décisions.', buildPrice: 380, maintPrice: 38 },
    ],
  },
  {
    key: 'automation',
    name: 'Automatisation',
    type: 'Transversal',
    description: 'Workflows et déclencheurs automatiques.',
    modules: [
      { key: 'auto_workflow', name: 'Workflows', description: 'Déclencheurs et actions.', buildPrice: 500, maintPrice: 50 },
      { key: 'auto_multi', name: 'Automatisation avancée', description: 'Orchestration multi-systèmes.', buildPrice: 900, maintPrice: 90 },
      { key: 'auto_notifications', name: 'Notifications', description: 'Email, SMS, push.', buildPrice: 300, maintPrice: 30 },
      { key: 'auto_scheduler', name: 'Planificateur', description: 'Tâches récurrentes.', buildPrice: 350, maintPrice: 35 },
      { key: 'auto_rules', name: 'Moteur de règles', description: 'Conditions et branches.', buildPrice: 400, maintPrice: 40 },
    ],
  },
  {
    key: 'site',
    name: 'Sites & Terrain',
    type: 'Transversal',
    description: 'Pilotage multi-sites et reporting terrain.',
    modules: [
      { key: 'site_client', name: 'Portail site client', description: 'Vue par site et client.', buildPrice: 600, maintPrice: 60 },
      { key: 'site_report', name: 'Reporting terrain', description: 'Saisie et consolidation.', buildPrice: 400, maintPrice: 40 },
      { key: 'site_geo', name: 'Géolocalisation', description: 'Cartes et zones.', buildPrice: 350, maintPrice: 35 },
      { key: 'site_mobile', name: 'App terrain mobile', description: 'Hors-ligne et sync.', buildPrice: 500, maintPrice: 50 },
      { key: 'site_kpi', name: 'KPI par site', description: 'Comparaison et benchmark.', buildPrice: 380, maintPrice: 38 },
    ],
  },
  {
    key: 'reporting',
    name: 'Reporting & Diffusion',
    type: 'Transversal',
    description: 'Rapports planifiés et diffusion.',
    modules: [
      { key: 'rep_scheduled', name: 'Rapports planifiés', description: 'Génération automatique.', buildPrice: 350, maintPrice: 35 },
      { key: 'rep_export', name: 'Export multi-format', description: 'PDF, Excel, API.', buildPrice: 300, maintPrice: 30 },
      { key: 'rep_custom', name: 'Rapports sur-mesure', description: 'Builder visuel.', buildPrice: 450, maintPrice: 45 },
      { key: 'rep_blast', name: 'Diffusion groupée', description: 'Emailing et partage.', buildPrice: 280, maintPrice: 28 },
      { key: 'rep_archives', name: 'Archivage', description: 'Historique et recherche.', buildPrice: 250, maintPrice: 25 },
    ],
  },
  {
    key: 'infra',
    name: 'Infrastructure',
    type: 'Transversal',
    description: 'Hébergement, performance et supervision.',
    modules: [
      { key: 'infra_hosting', name: 'Hébergement managé', description: 'Supervision et SLO.', buildPrice: 400, maintPrice: 40 },
      { key: 'infra_perf', name: 'Performance', description: 'Cache et optimisation.', buildPrice: 350, maintPrice: 35 },
      { key: 'infra_cdn', name: 'CDN & edge', description: 'Distribution mondiale.', buildPrice: 400, maintPrice: 40 },
      { key: 'infra_logging', name: 'Logs & centralisation', description: 'Collecte et recherche.', buildPrice: 300, maintPrice: 30 },
      { key: 'infra_scaling', name: 'Auto-scaling', description: 'Élasticité et quotas.', buildPrice: 450, maintPrice: 45 },
    ],
  },
  {
    key: 'support',
    name: 'Support & Adoption',
    type: 'Transversal',
    description: 'Onboarding, documentation et assistance.',
    modules: [
      { key: 'sup_onboarding', name: 'Onboarding', description: "Parcours d'adoption.", buildPrice: 300, maintPrice: 30 },
      { key: 'sup_doc', name: 'Documentation', description: 'Guides et base de connaissances.', buildPrice: 250, maintPrice: 25 },
      { key: 'sup_helpdesk', name: 'Helpdesk', description: 'Tickets et FAQ.', buildPrice: 320, maintPrice: 32 },
      { key: 'sup_training', name: 'Formation', description: 'Modules et quiz.', buildPrice: 280, maintPrice: 28 },
      { key: 'sup_chat', name: 'Chat & support live', description: 'Assistance en temps réel.', buildPrice: 300, maintPrice: 30 },
    ],
  },
  {
    key: 'strategy',
    name: 'Stratégie & Roadmap',
    type: 'Transversal',
    description: 'Alignement stratégique et feuille de route.',
    modules: [
      { key: 'strat_roadmap', name: 'Roadmap', description: 'Feuille de route produit.', buildPrice: 400, maintPrice: 40 },
      { key: 'strat_okr', name: 'OKR', description: 'Objectifs et résultats clés.', buildPrice: 350, maintPrice: 35 },
      { key: 'strat_kpi', name: 'KPI stratégiques', description: 'Indicateurs de pilotage.', buildPrice: 380, maintPrice: 38 },
      { key: 'strat_scenario', name: 'Scénarios', description: 'Simulations et hypothèses.', buildPrice: 420, maintPrice: 42 },
      { key: 'strat_review', name: 'Revue & governance', description: 'Comités et décisions.', buildPrice: 300, maintPrice: 30 },
    ],
  },
];

export const ALL_MODULES: ModuleDefinition[] = DOMAINS.flatMap((d) => d.modules);

export function findModule(key: string): ModuleDefinition | undefined {
  return ALL_MODULES.find((m) => m.key === key);
}

export const DELIVERY_MODES: { key: DeliveryMode; label: string; description: string }[] = [
  { key: 'SCRATCH', label: 'Sur-mesure', description: 'Construit de zéro selon votre cahier des charges.' },
  { key: 'PARTIAL_REUSE', label: 'Réutilisation partielle', description: 'Socle ADAI adapté à vos processus.' },
  { key: 'CORE_REUSE', label: 'Réutilisation du cœur', description: 'Cœur métier ADAI, habillage personnalisé.' },
  { key: 'SAAS_ADAPT', label: 'Adaptation SaaS', description: "Configuration d'un socle SaaS existant." },
  { key: 'STANDARD_DEPLOY', label: 'Déploiement standard', description: "Déploiement rapide d'un socle standardisé." },
];

export const ORGANIZATION_TYPES = [
  'Entité unique',
  'Multi-sites',
  'Multi-entités',
  'Groupe / réseau',
  'Multi-pays',
] as const;

export const MIGRATION_LEVELS = ['Aucune', 'Simple', 'Multi-sources', 'Complexe'] as const;

export const CUSTOMIZATION_LEVELS = ['Standard', 'Adaptation significative', 'Spécifique'] as const;

export const VOLUME_LEVELS = ['Normale', 'Élevée', 'Très élevée'] as const;

export interface QualificationAnswers {
  companyName: string;
  projectName: string;
  industry: string;
  subIndustry: string;
  revenueRange: string;
  companySize: string;
  impactedPeople: string;
  solutionUsers: string;
  organizationType: string;
  siteCount: number;
  entityCount: number;
  countryScope: string;
  digitalMaturity: string;
  itCapacity: string;
  priority: string;
  targetTimeline: string;
  budgetRange: string;
  currentTools: string;
  painPoints: string;
  needDescription: string;
  currentProcess: string;
  migrationLevel: string;
  customizationLevel: string;
  sensitiveData: string;
  rolesCount: string;
  deliveryMode: DeliveryMode;
  integrationCount: number;
  volumeLevel: string;
}

export const EMPTY_ANSWERS: QualificationAnswers = {
  companyName: '',
  projectName: '',
  industry: '',
  subIndustry: '',
  revenueRange: '',
  companySize: '',
  impactedPeople: '',
  solutionUsers: '',
  organizationType: 'Entité unique',
  siteCount: 1,
  entityCount: 1,
  countryScope: 'France',
  digitalMaturity: '',
  itCapacity: '',
  priority: '',
  targetTimeline: '',
  budgetRange: '',
  currentTools: '',
  painPoints: '',
  needDescription: '',
  currentProcess: '',
  migrationLevel: 'Aucune',
  customizationLevel: 'Standard',
  sensitiveData: 'Non',
  rolesCount: '',
  deliveryMode: 'SAAS_ADAPT',
  integrationCount: 0,
  volumeLevel: 'Normale',
};

const FORCE_SCALE_MODULES = new Set(['ai_multi', 'multi_country', 'sec_sensitive']);
const FORCE_GROW_MODULES = new Set(['data_advanced', 'ai_agent', 'site_client', 'auto_multi']);

export interface ComplexityBreakdownItem {
  label: string;
  amount: number;
}

export interface PricingResult {
  packKey: PackKey;
  packForced: boolean;
  packReason: string;
  functionalValue: number;
  complexityAdjustment: number;
  complexityBreakdown: ComplexityBreakdownItem[];
  catalogValue: number;
  discountRate: number;
  commercialPrice: number;
  maintenanceMonthly: number;
  estimatedDays: number;
  selectedModules: ModuleDefinition[];
}

export function computeComplexity(
  answers: QualificationAnswers,
  selectedModuleKeys: string[],
): { total: number; breakdown: ComplexityBreakdownItem[] } {
  const breakdown: ComplexityBreakdownItem[] = [];
  const add = (label: string, amount: number) => {
    if (amount > 0) breakdown.push({ label, amount });
  };

  switch (answers.organizationType) {
    case 'Multi-sites':
      add('Multi-sites', 250);
      break;
    case 'Multi-entités':
      add('Multi-entités', 500);
      break;
    case 'Groupe / réseau':
      add('Groupe / réseau', 650);
      break;
    case 'Multi-pays':
      add('Multi-pays', 1000);
      break;
  }

  const countryCount = answers.countryScope
    ? answers.countryScope.split(',').map((s) => s.trim()).filter(Boolean).length
    : 1;
  if (countryCount === 1) {
    // single country, no adjustment
  } else if (countryCount >= 4) {
    add('4 pays ou plus', 1000);
  } else {
    add('2 à 3 pays', 500);
  }

  switch (answers.migrationLevel) {
    case 'Simple':
      add('Migration simple', 200);
      break;
    case 'Multi-sources':
      add('Migration multi-sources', 500);
      break;
    case 'Complexe':
      add('Migration complexe', 900);
      break;
  }

  switch (answers.customizationLevel) {
    case 'Adaptation significative':
      add('Adaptation significative', 350);
      break;
    case 'Spécifique':
      add('Personnalisation spécifique', 900);
      break;
  }

  switch (answers.volumeLevel) {
    case 'Élevée':
      add('Volume élevée', 250);
      break;
    case 'Très élevée':
      add('Volume très élevée', 600);
      break;
  }

  if (answers.sensitiveData === 'Oui') add('Données sensibles', 600);

  if (answers.integrationCount >= 6) add('Plus de 5 intégrations', 700);
  else if (answers.integrationCount >= 3) add('3 à 5 intégrations', 300);

  return { total: breakdown.reduce((sum, b) => sum + b.amount, 0), breakdown };
}

export function resolvePack(
  answers: QualificationAnswers,
  selectedModuleKeys: string[],
  userChoice: PackKey,
): { pack: PackKey; forced: boolean; reason: string } {
  const hasModule = (keys: Set<string>) => selectedModuleKeys.some((k) => keys.has(k));

  if (
    answers.organizationType === 'Multi-entités' ||
    answers.organizationType === 'Groupe / réseau' ||
    answers.organizationType === 'Multi-pays' ||
    hasModule(FORCE_SCALE_MODULES) ||
    answers.integrationCount > 5 ||
    answers.sensitiveData === 'Oui'
  ) {
    if (userChoice !== 'scale') {
      return { pack: 'scale', forced: true, reason: 'Périmètre complexe : pack SCALE obligatoire.' };
    }
    return { pack: 'scale', forced: false, reason: '' };
  }

  if (
    answers.organizationType === 'Multi-sites' ||
    answers.integrationCount >= 3 ||
    hasModule(FORCE_GROW_MODULES)
  ) {
    if (userChoice === 'start') {
      return { pack: 'grow', forced: true, reason: 'Périmètre élargi : pack GROW recommandé.' };
    }
  }

  return { pack: userChoice, forced: false, reason: '' };
}

export function estimateDays(
  pack: PackKey,
  deliveryMode: DeliveryMode,
  catalogValue: number,
  answers: QualificationAnswers,
): number {
  const base = PACKS[pack].baseDays[deliveryMode] ?? PACKS[pack].baseDays.SCRATCH;
  let days = base + Math.ceil(Math.max(0, catalogValue - PACKS[pack].base) / 1200);
  if (answers.migrationLevel === 'Multi-sources') days += 2;
  if (answers.migrationLevel === 'Complexe') days += 4;
  if (answers.customizationLevel === 'Spécifique') days += 3;
  if (answers.integrationCount > 3) days += 2;
  return Math.max(2, days);
}

export function computePricing(
  answers: QualificationAnswers,
  selectedModuleKeys: string[],
  userPackChoice: PackKey,
  discountRate: number,
): PricingResult {
  const selectedModules = selectedModuleKeys
    .map(findModule)
    .filter((m): m is ModuleDefinition => Boolean(m));

  const functionalValue = selectedModules.reduce((sum, m) => sum + m.buildPrice, 0);
  const maintRaw = selectedModules.reduce((sum, m) => sum + m.maintPrice, 0);

  const { total: complexityAdjustment, breakdown } = computeComplexity(answers, selectedModuleKeys);
  const catalogValue = functionalValue + complexityAdjustment;

  const { pack: packKey, forced: packForced, reason: packReason } = resolvePack(
    answers,
    selectedModuleKeys,
    userPackChoice,
  );

  const safeDiscount = Math.min(Math.max(0, discountRate), 0.4);
  const commercialPrice = Math.max(0, Math.round(catalogValue * (1 - safeDiscount)));
  const maintenanceMonthly = Math.max(0, Math.round(maintRaw * (1 - safeDiscount)));
  const estimatedDays = estimateDays(packKey, answers.deliveryMode, catalogValue, answers);

  return {
    packKey,
    packForced,
    packReason,
    functionalValue,
    complexityAdjustment,
    complexityBreakdown: breakdown,
    catalogValue,
    discountRate,
    commercialPrice,
    maintenanceMonthly,
    estimatedDays,
    selectedModules,
  };
}

export interface RoiClientInputs {
  weeklyHours: number;
  roiPeople: number;
  hourlyCost: number;
  automationRate: number;
  realizationRate: number;
  errorsAvoided: number;
  errorCost: number;
  toolSavings: number;
  additionalRevenue: number;
  contributionMargin: number;
  fteHours: number;
  activeWeeks: number;
}

export const DEFAULT_ROI_INPUTS: RoiClientInputs = {
  weeklyHours: 10,
  roiPeople: 5,
  hourlyCost: 50,
  automationRate: 70,
  realizationRate: 60,
  errorsAvoided: 2,
  errorCost: 1000,
  toolSavings: 0,
  additionalRevenue: 0,
  contributionMargin: 40,
  fteHours: 1820,
  activeWeeks: 52,
};

export interface RoiClientResult {
  hoursSaved: number;
  grossTimeValue: number;
  realizedTimeValue: number;
  errorGain: number;
  annualValue: number;
  investment: number;
  netGain: number;
  roiPercent: number;
  paybackMonths: number;
  fteEquivalent: number;
}

export function computeRoiClient(
  inputs: RoiClientInputs,
  commercialPrice: number,
  maintenanceMonthly: number,
): RoiClientResult {
  const hoursSaved = inputs.weeklyHours * inputs.roiPeople * inputs.activeWeeks * (inputs.automationRate / 100);
  const grossTimeValue = hoursSaved * inputs.hourlyCost;
  const realizedTimeValue = grossTimeValue * (inputs.realizationRate / 100);
  const errorGain = inputs.errorsAvoided * inputs.errorCost;
  const annualValue =
    realizedTimeValue + errorGain + inputs.toolSavings + (inputs.additionalRevenue * inputs.contributionMargin) / 100;
  const investment = commercialPrice + maintenanceMonthly * 12;
  const netGain = annualValue - investment;
  const roiPercent = investment > 0 ? (netGain / investment) * 100 : 0;
  const paybackMonths = annualValue > 0 ? Math.min(investment / (annualValue / 12), 999) : 0;
  const fteEquivalent = inputs.fteHours > 0 ? hoursSaved / inputs.fteHours : 0;
  return {
    hoursSaved,
    grossTimeValue,
    realizedTimeValue,
    errorGain,
    annualValue,
    investment,
    netGain,
    roiPercent,
    paybackMonths,
    fteEquivalent,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits }).format(value);
}
