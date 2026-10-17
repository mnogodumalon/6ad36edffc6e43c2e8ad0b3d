/**
 * useEntscheidungDokumentierenFlow — the plumbing of the flow « Beurteilung und Entscheidung dokumentieren », generated from the plan.
 *
 * Writes `beurteilungen`: asks `anfrage`, `beurteilungsgegenstand`, `beurteilungsart`, `betroffene_anforderungen`, `betroffene_offene_punkte`, `zugrunde_liegende_quellen`, `zugrunde_liegende_anforderungen`, `einschaetzung`, `fachliche_begruendung`, `annahmen`, `unsicherheiten`, `alternativen`, `empfehlung`, `ist_ki_vorschlag`, `erstellt_von`; sets `erstellt_am`, `pruefstatus` itself.
Writes `entscheidungen` (only when the person fills it): asks `anfrage`, `titel`, `entscheidungsgegenstand`, `entscheidungstyp`, `betroffene_anforderungen`, `betroffene_offene_punkte`, `alternativen`, `entscheidung`, `begruendung`, `entscheidungsverantwortlicher`, `entscheidungskompetenz_geprueft`, `auflagen`; links `zugrunde_liegende_beurteilungen` ← the created `beurteilungen`.
 * The hook OWNS: the form(s) with exactly these fields and the plan's required
 * ingredients, one record search per picked field (columns and filter from
 * the plan), and the submit plan with its fixed and derived values. A page
 * that only calls `flow.submit.run()` cannot write a field the plan does not
 * know — there is no way to spell it.
 *
 * YOU decide what a person notices, through the options:
 *   steps     which wizard step asks which field (default: one step per pick,
 *             then one for the typed fields, then "Prüfen" = step 10)
 *   items     how a search hit is displayed per pick (title, subtitle, status …)
 *   initial   prefills for typed fields
 *   messages  the sentence for an empty required field, per field
 *
 *   const flow = useEntscheidungDokumentierenFlow({
 *     steps: { anfrage: 6, betroffene_anforderungen: 7, betroffene_offene_punkte: 8, zugrunde_liegende_quellen: 4, zugrunde_liegende_anforderungen: 5, beurteilungsgegenstand: 9, beurteilungsart: 9, einschaetzung: 9, fachliche_begruendung: 9, annahmen: 9, unsicherheiten: 9, alternativen: 9, empfehlung: 9, ist_ki_vorschlag: 9, erstellt_von: 9, titel: 9, entscheidungsgegenstand: 9, entscheidungstyp: 9, entscheidung: 9, begruendung: 9, entscheidungsverantwortlicher: 9, entscheidungskompetenz_geprueft: 9, auflagen: 9 },
 *     items: { anfrage: r => ({ id: r.id, title: fieldText(r, 'anfragenummer') }) },
 *   });
 *   <IntentWizardShell forms={flow.forms} draftKey={flow.draftKey} …>
 *     <EntitySelectStep {...flow.picks.anfrage.select} {...flow.pick('anfrage')} />
 *     <EntitySelectStep {...flow.picks.betroffene_anforderungen.select} {...flow.pickMany('betroffene_anforderungen')} />
 *     <EntitySelectStep {...flow.picks.betroffene_offene_punkte.select} {...flow.pickMany('betroffene_offene_punkte')} />
 *     <EntitySelectStep {...flow.picks.zugrunde_liegende_quellen.select} {...flow.pickMany('zugrunde_liegende_quellen')} />
 *     <EntitySelectStep {...flow.picks.zugrunde_liegende_anforderungen.select} {...flow.pickMany('zugrunde_liegende_anforderungen')} />
 *     <EntitySelectStep {...flow.picks.entscheidungen_anfrage.select} {...flow.pick('anfrage')} />
 *     <EntitySelectStep {...flow.picks.entscheidungen_betroffene_anforderungen.select} {...flow.pickMany('betroffene_anforderungen')} />
 *     <EntitySelectStep {...flow.picks.entscheidungen_betroffene_offene_punkte.select} {...flow.pickMany('betroffene_offene_punkte')} />
 *     <Bound form={flow.forms.beurteilungen} name="beurteilungsgegenstand" />
 *     <Bound form={flow.forms.beurteilungen} name="beurteilungsart" />
 *     <Bound form={flow.forms.beurteilungen} name="einschaetzung" />
 *     <Bound form={flow.forms.beurteilungen} name="fachliche_begruendung" />
 *     <Bound form={flow.forms.beurteilungen} name="annahmen" />
 *     <Bound form={flow.forms.beurteilungen} name="unsicherheiten" />
 *     <Bound form={flow.forms.beurteilungen} name="alternativen" />
 *     <Bound form={flow.forms.beurteilungen} name="empfehlung" />
 *     <Bound form={flow.forms.beurteilungen} name="ist_ki_vorschlag" />
 *     <Bound form={flow.forms.beurteilungen} name="erstellt_von" />
 *     <Bound form={flow.forms.entscheidungen} name="titel" />
 *     <Bound form={flow.forms.entscheidungen} name="entscheidungsgegenstand" />
 *     <Bound form={flow.forms.entscheidungen} name="entscheidungstyp" />
 *     <Bound form={flow.forms.entscheidungen} name="alternativen" />
 *     <Bound form={flow.forms.entscheidungen} name="entscheidung" />
 *     <Bound form={flow.forms.entscheidungen} name="begruendung" />
 *     <Bound form={flow.forms.entscheidungen} name="entscheidungsverantwortlicher" />
 *     <Bound form={flow.forms.entscheidungen} name="entscheidungskompetenz_geprueft" />
 *     <Bound form={flow.forms.entscheidungen} name="auflagen" />
 *     <StepNav onNext={() => flow.validateStep(n)} />
 *     {!flow.submit.done && <SummaryStep forms={flow.formList} submit={flow.submit} />}
 *     {flow.submit.result && <SuccessStep result={flow.submit.result} forms={flow.formList} submit={flow.submit} />}
 *   </IntentWizardShell>
 */
import {
  useStepForm, useJourneySubmit, useRecordSearch,
  fieldText, fieldLookup, fieldLookups, fieldNumber, fieldDate, fieldRef,
  todayIso, nowIso, isEmptyValue, policyFixedValue, withPickPolicy, usePolicyVersion,
  type StepForm, type JourneyRecord, type RefContext, type SelectItemLike, type FormValues, type PlanStep, type SummaryItem,} from '@/lib/journey';
import { servicePort } from '@/services/journeyPort';
import { pickHint, whereSentence, type PickWhere } from '@/lib/journey/policy';
import { labelOf, optionsOf, type EntityKey } from '@/lib/journey/rules';
export type EntscheidungDokumentierenFieldKey = 'alternativen' | 'anfrage' | 'annahmen' | 'auflagen' | 'begruendung' | 'betroffene_anforderungen' | 'betroffene_offene_punkte' | 'beurteilungsart' | 'beurteilungsgegenstand' | 'einschaetzung' | 'empfehlung' | 'entscheidung' | 'entscheidungsgegenstand' | 'entscheidungskompetenz_geprueft' | 'entscheidungstyp' | 'entscheidungsverantwortlicher' | 'erstellt_von' | 'fachliche_begruendung' | 'ist_ki_vorschlag' | 'titel' | 'unsicherheiten' | 'zugrunde_liegende_anforderungen' | 'zugrunde_liegende_quellen';

export interface EntscheidungDokumentierenForms {
  beurteilungen: StepForm<'beurteilungen'>;
  entscheidungen: StepForm<'entscheidungen'>;
}

// Alias so the option generics stay readable.
type Key = EntscheidungDokumentierenFieldKey;

export interface EntscheidungDokumentierenFlowOptions {
  /** field → wizard step that asks it; drives „Ändern“ links and answer chips. */
  steps?: Partial<Record<Key, number>>;
  initial?: Partial<Record<Key, unknown>>;
  messages?: Partial<Record<Key, string>>;
  /** How a search hit reads — the card's title/subtitle/status per pick. */
  items?: {
    anfrage?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    betroffene_anforderungen?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    betroffene_offene_punkte?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    zugrunde_liegende_quellen?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    zugrunde_liegende_anforderungen?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    entscheidungen_anfrage?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    entscheidungen_betroffene_anforderungen?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    entscheidungen_betroffene_offene_punkte?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
  };
}

const DEFAULT_STEPS: Record<string, number> = {"alternativen": 9, "anfrage": 6, "annahmen": 9, "auflagen": 9, "begruendung": 9, "betroffene_anforderungen": 7, "betroffene_offene_punkte": 8, "beurteilungsart": 9, "beurteilungsgegenstand": 9, "einschaetzung": 9, "empfehlung": 9, "entscheidung": 9, "entscheidungsgegenstand": 9, "entscheidungskompetenz_geprueft": 9, "entscheidungstyp": 9, "entscheidungsverantwortlicher": 9, "erstellt_von": 9, "fachliche_begruendung": 9, "ist_ki_vorschlag": 9, "titel": 9, "unsicherheiten": 9, "zugrunde_liegende_anforderungen": 5, "zugrunde_liegende_quellen": 4};
export const ENTSCHEIDUNGDOKUMENTIEREN_REVIEW_STEP = 10;

function fromPick<T>(pick: { recordOf(id: string): JourneyRecord | undefined }, form: StepForm, field: string, read: (r: JourneyRecord) => T): T | undefined {
  const id = form.get(field);
  const rec = typeof id === 'string' && id ? pick.recordOf(id) : undefined;
  return rec ? read(rec) : undefined;
}
function isoDaysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Returns T, not Partial<T>: a Record's index signature is already "maybe
// absent", and Partial<Record<string, string>> does not assign to the
// Record<string, string> useStepForm wants (tsc, live 23.09.2026 — eight
// errors, one per hook, caught only in the sandbox build).
function only<T extends Record<string, unknown>>(obj: T | undefined, keys: string[]): T | undefined {
  if (!obj) return undefined;
  const out: Record<string, unknown> = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out as T;
}

function hasValues(form: StepForm): boolean {
  return form.keys.some(k => !isEmptyValue(form.values[k]));
}

export function useEntscheidungDokumentierenFlow(options: EntscheidungDokumentierenFlowOptions = {}) {
  const steps = { ...DEFAULT_STEPS, ...(options.steps ?? {}) } as Record<string, number>;
  const beurteilungen = useStepForm('beurteilungen', {
    fields: ["anfrage", "beurteilungsgegenstand", "beurteilungsart", "betroffene_anforderungen", "betroffene_offene_punkte", "zugrunde_liegende_quellen", "zugrunde_liegende_anforderungen", "einschaetzung", "fachliche_begruendung", "annahmen", "unsicherheiten", "alternativen", "empfehlung", "ist_ki_vorschlag", "erstellt_von"],
    steps: only(steps, ["anfrage", "beurteilungsgegenstand", "beurteilungsart", "betroffene_anforderungen", "betroffene_offene_punkte", "zugrunde_liegende_quellen", "zugrunde_liegende_anforderungen", "einschaetzung", "fachliche_begruendung", "annahmen", "unsicherheiten", "alternativen", "empfehlung", "ist_ki_vorschlag", "erstellt_von"]) as Record<string, number>,
    initial: only(options.initial as FormValues | undefined, ["anfrage", "beurteilungsgegenstand", "beurteilungsart", "betroffene_anforderungen", "betroffene_offene_punkte", "zugrunde_liegende_quellen", "zugrunde_liegende_anforderungen", "einschaetzung", "fachliche_begruendung", "annahmen", "unsicherheiten", "alternativen", "empfehlung", "ist_ki_vorschlag", "erstellt_von"]),
    messages: only(options.messages as Record<string, string> | undefined, ["anfrage", "beurteilungsgegenstand", "beurteilungsart", "betroffene_anforderungen", "betroffene_offene_punkte", "zugrunde_liegende_quellen", "zugrunde_liegende_anforderungen", "einschaetzung", "fachliche_begruendung", "annahmen", "unsicherheiten", "alternativen", "empfehlung", "ist_ki_vorschlag", "erstellt_von"]),
  });
  const entscheidungen = useStepForm('entscheidungen', {
    fields: ["anfrage", "titel", "entscheidungsgegenstand", "entscheidungstyp", "betroffene_anforderungen", "betroffene_offene_punkte", "alternativen", "entscheidung", "begruendung", "entscheidungsverantwortlicher", "entscheidungskompetenz_geprueft", "auflagen"],
    steps: only(steps, ["anfrage", "titel", "entscheidungsgegenstand", "entscheidungstyp", "betroffene_anforderungen", "betroffene_offene_punkte", "alternativen", "entscheidung", "begruendung", "entscheidungsverantwortlicher", "entscheidungskompetenz_geprueft", "auflagen"]) as Record<string, number>,
    initial: only(options.initial as FormValues | undefined, ["anfrage", "titel", "entscheidungsgegenstand", "entscheidungstyp", "betroffene_anforderungen", "betroffene_offene_punkte", "alternativen", "entscheidung", "begruendung", "entscheidungsverantwortlicher", "entscheidungskompetenz_geprueft", "auflagen"]),
    messages: only(options.messages as Record<string, string> | undefined, ["anfrage", "titel", "entscheidungsgegenstand", "entscheidungstyp", "betroffene_anforderungen", "betroffene_offene_punkte", "alternativen", "entscheidung", "begruendung", "entscheidungsverantwortlicher", "entscheidungskompetenz_geprueft", "auflagen"]),
  });
  const forms: EntscheidungDokumentierenForms = { beurteilungen, entscheidungen };
  const formList: StepForm[] = [beurteilungen, entscheidungen];

  // The owner's rules after the build (intent-policies.json): a fixed value
  // for a field this flow sets itself, a narrower or wider pick — read at
  // render time, so a change works on the running application.
  usePolicyVersion();
  const searches = {
    anfrage: useRecordSearch(servicePort, 'kundenanfragen', withPickPolicy('anfrage', {
      searchFields: ["anfragenummer"] as never,
      toItem: options.items?.anfrage as never,
    })),
    betroffene_anforderungen: useRecordSearch(servicePort, 'technische_anforderungen', withPickPolicy('betroffene_anforderungen', {
      searchFields: ["bezeichnung"] as never,
      toItem: options.items?.betroffene_anforderungen as never,
    })),
    betroffene_offene_punkte: useRecordSearch(servicePort, 'offene_punkte', withPickPolicy('betroffene_offene_punkte', {
      searchFields: ["kurztitel"] as never,
      filter: "r.v_status in ['zur_entscheidung', 'in_bearbeitung']",
      where: (r: JourneyRecord) => ["zur_entscheidung", "in_bearbeitung"].includes(fieldLookup(r, "status")?.key ?? ''),
      toItem: options.items?.betroffene_offene_punkte as never,
    })),
    zugrunde_liegende_quellen: useRecordSearch(servicePort, 'informationsquellen', withPickPolicy('zugrunde_liegende_quellen', {
      searchFields: ["titel"] as never,
      toItem: options.items?.zugrunde_liegende_quellen as never,
    })),
    zugrunde_liegende_anforderungen: useRecordSearch(servicePort, 'technische_anforderungen', withPickPolicy('zugrunde_liegende_anforderungen', {
      searchFields: ["bezeichnung"] as never,
      toItem: options.items?.zugrunde_liegende_anforderungen as never,
    })),
    entscheidungen_anfrage: useRecordSearch(servicePort, 'kundenanfragen', withPickPolicy('entscheidungen_anfrage', {
      searchFields: ["anfragenummer"] as never,
      toItem: options.items?.entscheidungen_anfrage as never,
    })),
    entscheidungen_betroffene_anforderungen: useRecordSearch(servicePort, 'technische_anforderungen', withPickPolicy('entscheidungen_betroffene_anforderungen', {
      searchFields: ["bezeichnung"] as never,
      toItem: options.items?.entscheidungen_betroffene_anforderungen as never,
    })),
    entscheidungen_betroffene_offene_punkte: useRecordSearch(servicePort, 'offene_punkte', withPickPolicy('entscheidungen_betroffene_offene_punkte', {
      searchFields: ["kurztitel"] as never,
      filter: "r.v_status in ['zur_entscheidung', 'in_bearbeitung']",
      where: (r: JourneyRecord) => ["zur_entscheidung", "in_bearbeitung"].includes(fieldLookup(r, "status")?.key ?? ''),
      toItem: options.items?.entscheidungen_betroffene_offene_punkte as never,
    })),
  };
  // Whether a pick offers „Neu anlegen“ is the plan's call: off for the record
  // this flow changes, for multi picks, for a catalogue entity and for an
  // entity with its own flow. The page spreads `.select` and writes no `create=`.
  // what the person sees under the search field: the rule that narrows the
  // pick (the owner's, else the plan's) — and the link that changes it
  const hintFor = (key: string, entity: EntityKey, planned: PickWhere | null) => pickHint(key, planned,
    w => whereSentence(w, f => labelOf(entity, f), (f, v) => optionsOf(entity, f).find(o => o.key === String(v))?.label ?? String(v)),
    `#/verwaltung/anwendung?line=intent:entscheidung-dokumentieren:read:${entity}`);
  // a fixed value the flow sets itself, as a review row with the link that changes it
  const setting = (entity: EntityKey, field: string, value: unknown): SummaryItem => ({
    key: `setting:${entity}.${field}`, label: labelOf(entity, field),
    value: optionsOf(entity, field).find(o => o.key === String(value))?.label ?? String(value ?? ''),
    href: `#/verwaltung/anwendung?line=intent:entscheidung-dokumentieren:write:${entity}.${field}`,
  });
  const picks = {
    anfrage: { ...searches.anfrage, select: { ...searches.anfrage.select, create: false as boolean, hint: hintFor('anfrage', 'kundenanfragen', null as PickWhere | null) } },
    betroffene_anforderungen: { ...searches.betroffene_anforderungen, select: { ...searches.betroffene_anforderungen.select, create: false as boolean, hint: hintFor('betroffene_anforderungen', 'technische_anforderungen', null as PickWhere | null) } },
    betroffene_offene_punkte: { ...searches.betroffene_offene_punkte, select: { ...searches.betroffene_offene_punkte.select, create: false as boolean, hint: hintFor('betroffene_offene_punkte', 'offene_punkte', {"conditions": [{"field": "status", "op": "in", "value": ["zur_entscheidung", "in_bearbeitung"]}], "mode": "all"} as PickWhere | null) } },
    zugrunde_liegende_quellen: { ...searches.zugrunde_liegende_quellen, select: { ...searches.zugrunde_liegende_quellen.select, create: false as boolean, hint: hintFor('zugrunde_liegende_quellen', 'informationsquellen', null as PickWhere | null) } },
    zugrunde_liegende_anforderungen: { ...searches.zugrunde_liegende_anforderungen, select: { ...searches.zugrunde_liegende_anforderungen.select, create: false as boolean, hint: hintFor('zugrunde_liegende_anforderungen', 'technische_anforderungen', null as PickWhere | null) } },
    entscheidungen_anfrage: { ...searches.entscheidungen_anfrage, select: { ...searches.entscheidungen_anfrage.select, create: false as boolean, hint: hintFor('entscheidungen_anfrage', 'kundenanfragen', null as PickWhere | null) } },
    entscheidungen_betroffene_anforderungen: { ...searches.entscheidungen_betroffene_anforderungen, select: { ...searches.entscheidungen_betroffene_anforderungen.select, create: false as boolean, hint: hintFor('entscheidungen_betroffene_anforderungen', 'technische_anforderungen', null as PickWhere | null) } },
    entscheidungen_betroffene_offene_punkte: { ...searches.entscheidungen_betroffene_offene_punkte, select: { ...searches.entscheidungen_betroffene_offene_punkte.select, create: false as boolean, hint: hintFor('entscheidungen_betroffene_offene_punkte', 'offene_punkte', {"conditions": [{"field": "status", "op": "in", "value": ["zur_entscheidung", "in_bearbeitung"]}], "mode": "all"} as PickWhere | null) } },
  };

  const entscheidungenFilled = hasValues(entscheidungen);
  const plan: PlanStep[] = [
    {
      key: 'beurteilungen', entity: 'beurteilungen', form: beurteilungen, primary: true,
      values: (): FormValues => ({
        erstellt_am: policyFixedValue('beurteilungen', 'erstellt_am') ?? nowIso(),
        pruefstatus: policyFixedValue('beurteilungen', 'pruefstatus') ?? "entwurf",
      }),

      // the review shows what this step sets itself — changeable on „Deine Anwendung“, not here
      settings: () => [setting('beurteilungen', 'pruefstatus', policyFixedValue('beurteilungen', 'pruefstatus') ?? "entwurf")],
    },
    ...(entscheidungenFilled ? [{
      key: 'entscheidungen', entity: 'entscheidungen', form: entscheidungen,      needs: ['beurteilungen'],
      link: { zugrunde_liegende_beurteilungen: 'beurteilungen' },
    } as PlanStep] : []),
  ];

  const submit = useJourneySubmit(servicePort, plan, { draftKey: 'entscheidung-dokumentieren' });

  /** Props for a single-record pick step: {...flow.picks.x.select} {...flow.pick('x')} */
  const pick = (field: EntscheidungDokumentierenFieldKey) => {
    const owner = formList.find(f => f.keys.includes(field)) ?? formList[0];
    const search = (picks as Record<string, { labelOf(id: string): string | undefined }>)[field];
    return {
      selectedId: (typeof owner.get(field) === 'string' ? (owner.get(field) as string) : null) || null,
      // `field as never` collapsed the conditional SetArgs<E, never> to never and
      // no argument was assignable any more (tsc, live 23.09.2026); widen `set`
      // itself instead — the label stays a required third argument.
      onSelect: (id: string) => (owner.set as (k: string, v: unknown, l?: string) => void)(field, id, search?.labelOf(id)),
    };
  };
  /** Props for a multi-record pick step: {...flow.picks.x.select} {...flow.pickMany('x')} */
  const pickMany = (field: EntscheidungDokumentierenFieldKey) => {
    const owner = formList.find(f => f.keys.includes(field)) ?? formList[0];
    const search = (picks as Record<string, { labelOf(id: string): string | undefined }>)[field];
    return owner.records(field, id => search?.labelOf(id));
  };
  /** Validate every field the wizard asks in step `n` — for StepNav.onNext. */
  const validateStep = (n: number): boolean =>
    formList.every(f => f.validate(f.keys.filter(k => steps[k] === n)));
  const reset = () => { submit.reset(); formList.forEach(f => f.reset()); };

  return {
    slug: 'entscheidung-dokumentieren' as const,
    draftKey: 'entscheidung-dokumentieren' as const,
    entity: 'beurteilungen' as const,
    form: beurteilungen,
    forms, formList, picks, submit, steps,    reviewStep: ENTSCHEIDUNGDOKUMENTIEREN_REVIEW_STEP,
    pick, pickMany, validateStep, reset,
    // the door the hook reads through — for what it does not own: availability
    // (useOccupancy(flow.port, …)), a count (useRecordCount(flow.port, …)). A page
    // importing servicePort next to the hook fails gate 3 (fewo 05.10.2026: the
    // gate taught useOccupancy(servicePort, …) and forbade servicePort at once)
    port: servicePort,
  };
}

export type EntscheidungDokumentierenFlow = ReturnType<typeof useEntscheidungDokumentierenFlow>;
