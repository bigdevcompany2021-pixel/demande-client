'use client';

import { useMemo, useState, useEffect } from 'react';
import { Check, ChevronDown, Send, Loader2, ArrowRight, RotateCcw, FileText, Download, Calculator, BarChart3, PackageCheck, Building2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  PACKS,
  PACK_ORDER,
  DOMAINS,
  DELIVERY_MODES,
  computePricing,
  computeRoiClient,
  computeComplexity,
  resolvePack,
  estimateDays,
  formatEuro,
  DEFAULT_ROI_INPUTS,
  type PackKey,
  type DeliveryMode,
  type RoiClientInputs,
  type QualificationAnswers,
  type ModuleDefinition,
} from '@/lib/adai/engine';

/* ---------- Types & constants ---------- */

interface Draft {
  companyName: string;
  project: string;
  industry: string;
  subIndustry: string;
  annualRevenue: string;
  people: string;
  impactedPeople: string;
  directUsers: string;
  organization: string;
  siteCount: string;
  entityCount: string;
  countries: string;
  digitalMaturity: string;
  itTeam: string;
  priorityLevel: string;
  budget: string;
  currentTools: string;
  painPoint: string;
  selectedPack: PackKey;
  selectedModules: string[];
  needDescription: string;
  currentProcess: string;
  migrationLevel: string;
  customizationLevel: string;
  sensitiveData: string;
  rolesCount: string;
  deliveryMode: string;
  integrationCount: string;
  volumeLevel: string;
  roiValidated: boolean;
  roiInputs: RoiClientInputs;
}

const INITIAL_DRAFT: Draft = {
  companyName: '', project: '', industry: '', subIndustry: '', annualRevenue: '100–500 k€', people: '1-10', impactedPeople: '4-10', directUsers: '1-10', organization: 'Mono-site / 1 entité',
  siteCount: '1', entityCount: '1', countries: '1 pays', digitalMaturity: 'Intermédiaire', itTeam: 'Aucune', priorityLevel: 'Moyenne', budget: '3 500–7 000 €', currentTools: '', painPoint: '',
  selectedPack: 'start', selectedModules: [],
  needDescription: '', currentProcess: '', migrationLevel: 'Aucune', customizationLevel: 'Standard', sensitiveData: 'Non', rolesCount: '', deliveryMode: 'Adaptation SaaS', integrationCount: '0', volumeLevel: 'Normale',
  roiValidated: false, roiInputs: DEFAULT_ROI_INPUTS,
};

const PEOPLE_OPTIONS = ['1-10', '11-50', '51-150', '151+'];
const IMPACTED_PEOPLE_OPTIONS = ['1-3', '4-10', '11-50', '51-150', '151+'];
const DIRECT_USERS_OPTIONS = ['1-10', '11-50', '51-150', '151+'];
const REVENUE_OPTIONS = ['Moins de 100 k€', '100–500 k€', '500 k€–1 M€', '1–5 M€', 'Plus de 5 M€'];
const ORGANIZATION_OPTIONS = ['Mono-site / 1 entité', 'Multi-sites', 'Multi-entités', 'Groupe multi-sites et multi-entités'];
const COUNTRY_OPTIONS = ['1 pays', '2–3 pays', '4–10 pays', 'Plus de 10 pays'];
const MATURITY_OPTIONS = ['Débutant', 'Intermédiaire', 'Avancé'];
const IT_TEAM_OPTIONS = ['Aucune', '1–2 personnes', '3–10 personnes', 'Plus de 10 personnes'];
const PRIORITY_LEVEL_OPTIONS = ['Faible', 'Moyenne', 'Élevée', 'Critique'];
const BUDGET_OPTIONS = ['Pas encore défini', 'Moins de 3 500 €', '3 500–7 000 €', '7 000–15 000 €', 'Plus de 15 000 €'];
const MIGRATION_OPTIONS = ['Aucune', 'Simple', 'Multi-sources', 'Complexe'];
const CUSTOMIZATION_OPTIONS = ['Standard', 'Adaptation significative', 'Spécifique'];
const SENSITIVE_DATA_OPTIONS = ['Non', 'Oui'];
const ROLES_OPTIONS = ['1–3', '4–10', '11–20', 'Plus de 20'];
const DELIVERY_MODE_OPTIONS = DELIVERY_MODES.map((m) => m.label);
const INTEGRATION_COUNT_OPTIONS = ['0', '1–2', '3–5', 'Plus de 5'];
const VOLUME_OPTIONS = ['Normale', 'Élevée', 'Très élevée'];

const PACK_ACCENT: Record<PackKey, { bg: string; label: string }> = {
  start: { bg: 'from-emerald-600 to-teal-700', label: 'Démarrage' },
  grow: { bg: 'from-amber-600 to-orange-700', label: 'Croissance' },
  scale: { bg: 'from-[#8b5a2b] to-[#c47a3a]', label: 'Transformation' },
};

/* ---------- Page ---------- */

export default function Home() {
  const [draft, setDraft] = useLocalStorage<Draft>('adai-cockpit-v6', INITIAL_DRAFT);
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const update = (patch: Partial<Draft>) => setDraft((p) => ({ ...p, ...patch }));

  const answers = useMemo<QualificationAnswers>(() => ({
    companyName: draft.companyName,
    projectName: draft.project,
    industry: draft.industry,
    subIndustry: draft.subIndustry,
    revenueRange: draft.annualRevenue,
    companySize: draft.people,
    impactedPeople: draft.impactedPeople,
    solutionUsers: draft.directUsers,
    organizationType: draft.organization === 'Mono-site / 1 entité' ? 'Entité unique' : draft.organization,
    siteCount: Number(draft.siteCount) || 1,
    entityCount: Number(draft.entityCount) || 1,
    countryScope: draft.countries,
    digitalMaturity: draft.digitalMaturity,
    itCapacity: draft.itTeam,
    priority: draft.priorityLevel,
    targetTimeline: '',
    budgetRange: draft.budget,
    currentTools: draft.currentTools,
    painPoints: draft.painPoint,
    needDescription: draft.needDescription,
    currentProcess: draft.currentProcess,
    migrationLevel: draft.migrationLevel,
    customizationLevel: draft.customizationLevel,
    sensitiveData: draft.sensitiveData,
    rolesCount: draft.rolesCount,
    deliveryMode: DELIVERY_MODES.find((m) => m.label === draft.deliveryMode)?.key ?? 'SAAS_ADAPT',
    integrationCount: parseInt(draft.integrationCount, 10) || 0,
    volumeLevel: draft.volumeLevel,
  }), [draft]);

  const pricing = useMemo(
    () => computePricing(answers, draft.selectedModules, draft.selectedPack, 0.1),
    [answers, draft.selectedModules, draft.selectedPack],
  );

  const roi = useMemo(
    () => computeRoiClient(draft.roiInputs, pricing.commercialPrice, pricing.maintenanceMonthly),
    [draft.roiInputs, pricing.commercialPrice, pricing.maintenanceMonthly],
  );

  const toggleModule = (key: string) => {
    update({
      selectedModules: draft.selectedModules.includes(key)
        ? draft.selectedModules.filter((k) => k !== key)
        : [...draft.selectedModules, key],
    });
  };

  const submit = async () => {
    if (!draft.companyName.trim()) {
      toast.error("Indiquez le nom de l'entreprise avant d'envoyer.");
      document.getElementById('entreprise')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc('submit_qualification_request', {
        p_company_name: draft.companyName.trim(),
        p_answers: { ...draft, pricing, roi },
        p_recommended_pack: pricing.packKey,
        p_complexity_score: pricing.catalogValue,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Votre qualification a bien été envoyée à l'équipe ADAI.");
    } catch (err) {
      console.error('Soumission échouée:', err);
      toast.error("L'envoi n'a pas abouti. Vérifiez votre connexion puis réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDraft(INITIAL_DRAFT);
    setSubmitted(false);
    setOpenDomain(null);
    toast.info('Parcours réinitialisé.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ answers: draft, pricing, roi }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adai-cockpit-${draft.companyName || 'qualification'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const accent = PACK_ACCENT[pricing.packKey] ?? PACK_ACCENT.start;

  return (
    <main className="min-h-screen bg-cream-gradient">
      {/* Header */}
      <header className={cn('sticky top-0 z-40 transition-all duration-300 no-print', scrolled ? 'glass border-b border-border shadow-soft' : 'bg-transparent')}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/80 shadow-copper ring-1 ring-primary/15">
              <img src="/image.png" alt="Logo de l'entreprise" className="h-full w-full object-contain p-1" />
            </span>
            <div>
              <p className="font-display text-base font-bold leading-tight text-foreground">ADAI</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Cockpit Builder</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Recommencer
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Parcours de qualification
          </div>
          <h1 className="font-display text-4xl font-black leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
            De quoi votre entreprise<br className="hidden sm:block" /> a-t-elle besoin ?
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Choisissez votre pack, vos modules et vos besoins. ADAI calcule automatiquement le prix, la complexité et le retour sur investissement.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Form column */}
          <div className="space-y-5">

            {/* 01 — Connaître le client */}
            <section className="animate-fade-in-up">
              <div className="mb-5 px-1">
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">01 <span className="text-primary">—</span> Connaître le client</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Décrivez votre organisation pour établir un cadrage précis.</p>
              </div>
              <div id="entreprise" className="grid gap-4 rounded-3xl border border-primary/20 bg-card/80 p-5 shadow-card sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                <TextInput label="Nom de l'entreprise" value={draft.companyName} placeholder="Nom du client" onChange={(v) => update({ companyName: v })} />
                <TextInput label="Projet" value={draft.project} placeholder="Nom du projet" onChange={(v) => update({ project: v })} />
                <TextInput label="Secteur d'activité" value={draft.industry} placeholder="Secteur" onChange={(v) => update({ industry: v })} />
                <TextInput label="Sous-secteur / métier" value={draft.subIndustry} placeholder="Sous-secteur" onChange={(v) => update({ subIndustry: v })} />
                <SelectInput label="CA annuel" value={draft.annualRevenue} options={REVENUE_OPTIONS} onChange={(v) => update({ annualRevenue: v })} />
                <SelectInput label="Effectif total" value={draft.people} options={PEOPLE_OPTIONS} onChange={(v) => update({ people: v })} />
                <SelectInput label="Personnes concernées" value={draft.impactedPeople} options={IMPACTED_PEOPLE_OPTIONS} onChange={(v) => update({ impactedPeople: v })} />
                <SelectInput label="Utilisateurs directs" value={draft.directUsers} options={DIRECT_USERS_OPTIONS} onChange={(v) => update({ directUsers: v })} />
                <SelectInput label="Organisation" value={draft.organization} options={ORGANIZATION_OPTIONS} onChange={(v) => update({ organization: v })} />
                <TextInput label="Nombre de sites" value={draft.siteCount} placeholder="1" onChange={(v) => update({ siteCount: v })} />
                <TextInput label="Nombre d'entités" value={draft.entityCount} placeholder="1" onChange={(v) => update({ entityCount: v })} />
                <SelectInput label="Pays concernés" value={draft.countries} options={COUNTRY_OPTIONS} onChange={(v) => update({ countries: v })} />
                <SelectInput label="Maturité digitale" value={draft.digitalMaturity} options={MATURITY_OPTIONS} onChange={(v) => update({ digitalMaturity: v })} />
                <SelectInput label="Équipe IT" value={draft.itTeam} options={IT_TEAM_OPTIONS} onChange={(v) => update({ itTeam: v })} />
                <SelectInput label="Priorité" value={draft.priorityLevel} options={PRIORITY_LEVEL_OPTIONS} onChange={(v) => update({ priorityLevel: v })} />
                <SelectInput label="Budget envisagé" value={draft.budget} options={BUDGET_OPTIONS} onChange={(v) => update({ budget: v })} />
                <TextInput label="Outils actuels" value={draft.currentTools} placeholder="Outils utilisés" onChange={(v) => update({ currentTools: v })} />
                <label className="sm:col-span-2 lg:col-span-3">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">Qu'est-ce qui coûte aujourd'hui le plus de temps ou d'argent ?</span>
                  <textarea value={draft.painPoint} onChange={(e) => update({ painPoint: e.target.value })} rows={3} placeholder="Décrire les principaux irritants / coûts" className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
              </div>
            </section>

            {/* 02 — Socle d'offre */}
            <FormCard step="02" icon={<PackageCheck className="h-4 w-4" />} title="Socle d'offre" subtitle="Choisissez le pack de départ. ADAI ajuste automatiquement si votre périmètre l'exige.">
              <div className="grid gap-3 sm:grid-cols-3">
                {PACK_ORDER.map((pk) => {
                  const pack = PACKS[pk];
                  return (
                    <button
                      key={pk}
                      type="button"
                      onClick={() => update({ selectedPack: pk })}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-all duration-200',
                        draft.selectedPack === pk ? 'border-primary bg-primary/5 shadow-soft' : 'border-border bg-card hover:border-primary/30',
                      )}
                    >
                      <p className="font-display text-lg font-black text-foreground">{pack.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{pack.tagline}</p>
                      <p className="mt-2 font-display text-sm font-bold text-primary">{formatEuro(pack.base)}</p>
                      <p className="text-[10px] text-muted-foreground">+ {formatEuro(pack.maint)}/mois</p>
                      <ul className="mt-2 space-y-0.5">
                        {pack.highlights.map((h) => (
                          <li key={h} className="text-[10px] leading-4 text-muted-foreground">• {h}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              {pricing.packForced && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                  {pricing.packReason}
                </p>
              )}
            </FormCard>

            {/* 03 — Domaines & Modules */}
            <FormCard step="03" icon={<Layers className="h-4 w-4" />} title="Domaines & modules" subtitle="Sélectionnez les modules souhaités. Les prix sont calculés en temps réel.">
              <div className="space-y-3">
                {DOMAINS.map((domain) => (
                  <div key={domain.key} className="overflow-hidden rounded-2xl border border-border bg-card/50">
                    <button
                      type="button"
                      onClick={() => setOpenDomain(openDomain === domain.key ? null : domain.key)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{domain.name}</p>
                          <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold uppercase', domain.type === 'Métier' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>{domain.type}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{domain.description}</p>
                      </div>
                      <ChevronDown className={cn('h-4 w-4 text-primary transition-transform duration-300', openDomain === domain.key && 'rotate-180')} />
                    </button>
                    {openDomain === domain.key && (
                      <div className="animate-slide-down grid gap-2 border-t border-border p-3 sm:grid-cols-2">
                        {domain.modules.map((mod) => (
                          <ModuleChip
                            key={mod.key}
                            module={mod}
                            selected={draft.selectedModules.includes(mod.key)}
                            onClick={() => toggleModule(mod.key)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FormCard>

            {/* 04 — Besoin & existant */}
            <FormCard step="04" icon={<FileText className="h-4 w-4" />} title="Besoin, existant & complexité" subtitle="Précisez votre besoin et les facteurs de complexité.">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">Décrivez votre besoin</span>
                  <textarea value={draft.needDescription} onChange={(e) => update({ needDescription: e.target.value })} rows={3} placeholder="Ex. Centraliser les ventes, le stock et la trésorerie." className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">Comment faites-vous aujourd'hui ?</span>
                  <textarea value={draft.currentProcess} onChange={(e) => update({ currentProcess: e.target.value })} rows={3} placeholder="Ex. Excel, ERP, WhatsApp..." className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
                <SelectInput label="Migration des données" value={draft.migrationLevel} options={MIGRATION_OPTIONS} onChange={(v) => update({ migrationLevel: v })} />
                <SelectInput label="Personnalisation" value={draft.customizationLevel} options={CUSTOMIZATION_OPTIONS} onChange={(v) => update({ customizationLevel: v })} />
                <SelectInput label="Données sensibles" value={draft.sensitiveData} options={SENSITIVE_DATA_OPTIONS} onChange={(v) => update({ sensitiveData: v })} />
                <SelectInput label="Nombre de rôles" value={draft.rolesCount} options={ROLES_OPTIONS} onChange={(v) => update({ rolesCount: v })} />
                <SelectInput label="Mode de livraison" value={draft.deliveryMode} options={DELIVERY_MODE_OPTIONS} onChange={(v) => update({ deliveryMode: v })} />
                <SelectInput label="Intégrations" value={draft.integrationCount} options={INTEGRATION_COUNT_OPTIONS} onChange={(v) => update({ integrationCount: v })} />
                <SelectInput label="Volume de données" value={draft.volumeLevel} options={VOLUME_OPTIONS} onChange={(v) => update({ volumeLevel: v })} />
              </div>
            </FormCard>

            {/* 05 — Prix & delivery */}
            <FormCard step="05" icon={<Calculator className="h-4 w-4" />} title="Prix & delivery" subtitle="Valeur catalogue, ajustements de complexité et prix commercial estimé.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <MiniMetric label="Valeur fonctionnelle" value={formatEuro(pricing.functionalValue)} raw />
                <MiniMetric label="Ajustement complexité" value={formatEuro(pricing.complexityAdjustment)} raw />
                <MiniMetric label="Valeur catalogue" value={formatEuro(pricing.catalogValue)} raw />
                <MiniMetric label="Prix commercial" value={formatEuro(pricing.commercialPrice)} raw />
                <MiniMetric label="Maintenance / mois" value={formatEuro(pricing.maintenanceMonthly)} raw />
                <MiniMetric label="Jours estimés" value={String(pricing.estimatedDays)} raw />
              </div>
              {pricing.complexityBreakdown.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-foreground">Détail de la complexité</p>
                  <div className="space-y-1.5">
                    {pricing.complexityBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="font-display text-xs font-bold text-foreground">+{formatEuro(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold text-foreground">Mode de livraison</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DELIVERY_MODES.map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => update({ deliveryMode: mode.label })}
                      className={cn(
                        'rounded-xl border px-3.5 py-3 text-left transition-all duration-200',
                        draft.deliveryMode === mode.label ? 'border-primary bg-primary/5 shadow-soft' : 'border-border bg-card hover:border-primary/25',
                      )}
                    >
                      <span className="block text-xs font-bold text-foreground">{mode.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </FormCard>

            {/* 06 — ROI Client */}
            <FormCard step="06" icon={<BarChart3 className="h-4 w-4" />} title="Retour sur investissement" subtitle="Simulez le gain annuel et le temps d'amortissement.">
              <label className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3">
                <input
                  type="checkbox"
                  checked={draft.roiValidated}
                  onChange={(e) => update({ roiValidated: e.target.checked })}
                  className="h-4 w-4 rounded border-muted-foreground/30 accent-[#B87333]"
                />
                <span className="text-xs font-bold text-foreground">Hypothèses validées ADAI</span>
                <span className="text-[11px] text-muted-foreground">— déverrouille les résultats détaillés</span>
              </label>
              <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity', !draft.roiValidated && 'pointer-events-none opacity-40')}>
                <NumberInput label="Heures / semaine" value={draft.roiInputs.weeklyHours} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, weeklyHours: v } })} />
                <NumberInput label="Personnes concernées" value={draft.roiInputs.roiPeople} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, roiPeople: v } })} />
                <NumberInput label="Coût horaire (€)" value={draft.roiInputs.hourlyCost} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, hourlyCost: v } })} />
                <NumberInput label="Taux d'automatisation (%)" value={draft.roiInputs.automationRate} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, automationRate: v } })} />
                <NumberInput label="Taux de réalisation (%)" value={draft.roiInputs.realizationRate} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, realizationRate: v } })} />
                <NumberInput label="Erreurs évitées / an" value={draft.roiInputs.errorsAvoided} onChange={(v) => update({ roiInputs: { ...draft.roiInputs, errorsAvoided: v } })} />
              </div>
              {draft.roiValidated && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <MiniMetric label="Heures économisées" value={String(Math.round(roi.hoursSaved))} raw />
                  <MiniMetric label="Valeur annuelle" value={formatEuro(roi.annualValue)} raw />
                  <MiniMetric label="ROI" value={`${Math.round(roi.roiPercent)}%`} raw />
                  <MiniMetric label="Amortissement" value={`${Math.round(roi.paybackMonths)} mois`} raw />
                </div>
              )}
            </FormCard>

            {/* 07 — Cockpit & export */}
            <FormCard step="07" icon={<Download className="h-4 w-4" />} title="Cockpit récapitulatif" subtitle="Exportez votre qualification complète pour la revue ADAI.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <MiniMetric label="Pack retenu" value={PACKS[pricing.packKey].label} raw />
                <MiniMetric label="Prix commercial" value={formatEuro(pricing.commercialPrice)} raw />
                <MiniMetric label="Maintenance" value={`${formatEuro(pricing.maintenanceMonthly)}/mois`} raw />
                <MiniMetric label="Jours estimés" value={String(pricing.estimatedDays)} raw />
                <MiniMetric label="Modules sélectionnés" value={String(draft.selectedModules.length)} raw />
                <MiniMetric label="Valeur catalogue" value={formatEuro(pricing.catalogValue)} raw />
              </div>
              {draft.selectedModules.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-foreground">Modules retenus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pricing.selectedModules.map((m) => (
                      <span key={m.key} className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-foreground/70">{m.name}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={exportJson} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-all hover:border-primary/30 hover:shadow-soft">
                  <Download className="h-4 w-4 text-primary" />
                  Exporter (JSON)
                </button>
                <SubmitButton submitting={submitting} submitted={submitted} onClick={submit} />
              </div>
            </FormCard>

            {/* Mobile submit */}
            <div className="lg:hidden">
              <SubmitButton submitting={submitting} submitted={submitted} onClick={submit} />
            </div>
          </div>

          {/* Sticky sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <StickyPanel pricing={pricing} accent={accent} moduleCount={draft.selectedModules.length} />
              <SubmitButton submitting={submitting} submitted={submitted} onClick={submit} full />
              <p className="text-center text-[11px] leading-4 text-muted-foreground">
                Cette estimation prépare la revue ADAI. Elle ne constitue ni un devis, ni un engagement contractuel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:hidden">
        <StickyPanel pricing={pricing} accent={accent} moduleCount={draft.selectedModules.length} />
        <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
          Cette estimation prépare la revue ADAI. Elle ne constitue ni un devis, ni un engagement contractuel.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 no-print">
        <div className="mx-auto max-w-7xl px-5 text-center text-xs text-muted-foreground sm:px-8">
          ADAI — Cockpit Builder
        </div>
      </footer>
    </main>
  );
}

/* ---------- Components ---------- */

function FormCard({ step, icon, title, subtitle, children }: { step: string; icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="animate-fade-in-up rounded-3xl border border-border bg-card/80 p-5 shadow-card sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">{step}</span>
          <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ModuleChip({ module, selected, onClick }: { module: ModuleDefinition; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all duration-200',
        selected ? 'border-primary bg-primary/5 shadow-soft' : 'border-border bg-card hover:border-primary/25',
      )}
    >
      <span className={cn('mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30')}>
        {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
      </span>
      <span className="flex-1">
        <span className="block text-xs font-bold text-foreground">{module.name}</span>
        <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{module.description}</span>
        <span className="mt-1 block text-[10px] font-bold text-primary">{formatEuro(module.buildPrice)} · +{formatEuro(module.maintPrice)}/mois</span>
      </span>
    </button>
  );
}

function TextInput({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-foreground">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">Sélectionner...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
      </div>
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function StickyPanel({ pricing, accent, moduleCount }: { pricing: ReturnType<typeof computePricing>; accent: { bg: string; label: string }; moduleCount: number }) {
  const progress = Math.min(100, Math.max(6, (pricing.catalogValue / 20000) * 100));
  return (
    <div className="overflow-hidden rounded-3xl border border-border shadow-card">
      <div className="bg-dark-brown-gradient p-6 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Parcours recommandé</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h3 className="font-display text-3xl font-black tracking-tight">{PACKS[pricing.packKey].label}</h3>
            <p className="mt-1 text-xs text-white/60">{PACKS[pricing.packKey].tagline}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-black">{formatEuro(pricing.commercialPrice)}</p>
            <p className="text-[10px] text-white/50">prix commercial</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-copper-light transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-white/40">
            <span>START</span><span>GROW</span><span>SCALE</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 bg-card p-5">
        <div className={cn('rounded-2xl bg-gradient-to-br p-4 text-white', accent.bg)}>
          <p className="text-[10px] uppercase tracking-wider text-white/60">{accent.label}</p>
          <p className="mt-1 font-display text-xl font-bold">{formatEuro(pricing.commercialPrice)}</p>
          <p className="text-[10px] text-white/50">+ {formatEuro(pricing.maintenanceMonthly)}/mois</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MiniMetric label="Modules" value={String(moduleCount)} raw />
          <MiniMetric label="Jours" value={String(pricing.estimatedDays)} raw />
          <MiniMetric label="Valeur catalogue" value={formatEuro(pricing.catalogValue)} raw />
          <MiniMetric label="Complexité" value={formatEuro(pricing.complexityAdjustment)} raw />
        </div>
        {pricing.packForced && (
          <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            {pricing.packReason}
          </p>
        )}
      </div>
    </div>
  );
}

function MiniMetric({ label, value, raw }: { label: string; value: string; raw?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 font-display font-bold text-foreground', raw ? 'text-sm' : 'text-lg')}>{value}</p>
    </div>
  );
}

function SubmitButton({ submitting, submitted, onClick, full }: { submitting: boolean; submitted: boolean; onClick: () => void; full?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitting || submitted}
      className={cn(
        'flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-copper transition-all duration-300 hover:scale-[1.01] hover:bg-copper-dark active:scale-100 disabled:cursor-not-allowed disabled:opacity-60',
        full && 'w-full',
      )}
    >
      {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : submitted ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
      {submitted ? 'Demande envoyée' : submitting ? 'Envoi en cours...' : 'Envoyer ma qualification'}
      {!submitting && !submitted && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
