/**
 * useAntwortZuordnenFlow — the plumbing of the flow « Antwort zuordnen und prüfen », generated from the plan.
 *
 * Writes `rueckfragen_und_kommunikation`: asks `beantwortete_kommunikation`, `kanal`, `absender`, `betreff`, `inhalt`, `antwortstatus`, `anfrage`; sets `kommunikationstyp`, `antwort_erhalten_am` itself.
Changes `offene_punkte` (only when the person fills it): the record to change is picked (`flow.pick('offene_punkte')`), the form is prefilled with its values; asks `antwort_geprueft`, `loesung_oder_ergebnis`, `status`, `abschluss_durch`, `erneute_pruefung_erforderlich`; sets `abgeschlossen_am` itself.
 * The hook OWNS: the form(s) with exactly these fields and the plan's required
 * ingredients, one record search per picked field (columns and filter from
 * the plan), and the submit plan with its fixed and derived values. A page
 * that only calls `flow.submit.run()` cannot write a field the plan does not
 * know — there is no way to spell it.
 *
 * YOU decide what a person notices, through the options:
 *   steps     which wizard step asks which field (default: one step per pick,
 *             then one for the typed fields, then "Prüfen" = step 5)
 *   items     how a search hit is displayed per pick (title, subtitle, status …)
 *   initial   prefills for typed fields
 *   messages  the sentence for an empty required field, per field
 *
 *   const flow = useAntwortZuordnenFlow({
 *     steps: { offene_punkte: 1, beantwortete_kommunikation: 2, anfrage: 3, kanal: 4, absender: 4, betreff: 4, inhalt: 4, antwortstatus: 4, antwort_geprueft: 4, loesung_oder_ergebnis: 4, status: 4, abschluss_durch: 4, erneute_pruefung_erforderlich: 4 },
 *     items: { beantwortete_kommunikation: r => ({ id: r.id, title: fieldText(r, 'betreff') }) },
 *   });
 *   <IntentWizardShell forms={flow.forms} draftKey={flow.draftKey} …>
 *     <EntitySelectStep {...flow.picks.beantwortete_kommunikation.select} {...flow.pick('beantwortete_kommunikation')} />
 *     <EntitySelectStep {...flow.picks.anfrage.select} {...flow.pick('anfrage')} />
 *     // the record this flow changes: <EntitySelectStep {...flow.picks.offene_punkte.select} {...flow.pick('offene_punkte')} />
 *     <Bound form={flow.forms.rueckfragen_und_kommunikation} name="kanal" />
 *     <Bound form={flow.forms.rueckfragen_und_kommunikation} name="absender" />
 *     <Bound form={flow.forms.rueckfragen_und_kommunikation} name="betreff" />
 *     <Bound form={flow.forms.rueckfragen_und_kommunikation} name="inhalt" />
 *     <Bound form={flow.forms.rueckfragen_und_kommunikation} name="antwortstatus" />
 *     <Bound form={flow.forms.offene_punkte} name="antwort_geprueft" />
 *     <Bound form={flow.forms.offene_punkte} name="loesung_oder_ergebnis" />
 *     <Bound form={flow.forms.offene_punkte} name="status" />
 *     <Bound form={flow.forms.offene_punkte} name="abschluss_durch" />
 *     <Bound form={flow.forms.offene_punkte} name="erneute_pruefung_erforderlich" />
 *     <StepNav onNext={() => flow.validateStep(n)} />
 *     {!flow.submit.done && <SummaryStep forms={flow.formList} submit={flow.submit} />}
 *     {flow.submit.result && <SuccessStep result={flow.submit.result} forms={flow.formList} submit={flow.submit} />}
 *   </IntentWizardShell>
 */
import { useState } from 'react';
import {
  useStepForm, useJourneySubmit, useRecordSearch,
  fieldText, fieldLookup, fieldLookups, fieldNumber, fieldDate, fieldRef,
  todayIso, nowIso, isEmptyValue, policyFixedValue, withPickPolicy, usePolicyVersion,
  type StepForm, type JourneyRecord, type RefContext, type SelectItemLike, type FormValues, type PlanStep, type SummaryItem,} from '@/lib/journey';
import { servicePort } from '@/services/journeyPort';
import { pickHint, whereSentence, type PickWhere } from '@/lib/journey/policy';
import { labelOf, optionsOf, type EntityKey } from '@/lib/journey/rules';
import { entityLabel } from '@/lib/journey/rules';
export type AntwortZuordnenFieldKey = 'abschluss_durch' | 'absender' | 'anfrage' | 'antwort_geprueft' | 'antwortstatus' | 'beantwortete_kommunikation' | 'betreff' | 'erneute_pruefung_erforderlich' | 'inhalt' | 'kanal' | 'loesung_oder_ergebnis' | 'offene_punkte' | 'status';

export interface AntwortZuordnenForms {
  rueckfragen_und_kommunikation: StepForm<'rueckfragen_und_kommunikation'>;
  offene_punkte: StepForm<'offene_punkte'>;
}

// Alias so the option generics stay readable.
type Key = AntwortZuordnenFieldKey;

export interface AntwortZuordnenFlowOptions {
  /** field → wizard step that asks it; drives „Ändern“ links and answer chips. */
  steps?: Partial<Record<Key, number>>;
  initial?: Partial<Record<Key, unknown>>;
  messages?: Partial<Record<Key, string>>;
  /** How a search hit reads — the card's title/subtitle/status per pick. */
  items?: {
    beantwortete_kommunikation?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    anfrage?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
    offene_punkte?: (record: JourneyRecord, ctx: RefContext) => SelectItemLike;
  };
}

const DEFAULT_STEPS: Record<string, number> = {"abschluss_durch": 4, "absender": 4, "anfrage": 3, "antwort_geprueft": 4, "antwortstatus": 4, "beantwortete_kommunikation": 2, "betreff": 4, "erneute_pruefung_erforderlich": 4, "inhalt": 4, "kanal": 4, "loesung_oder_ergebnis": 4, "offene_punkte": 1, "status": 4};
export const ANTWORTZUORDNEN_REVIEW_STEP = 5;

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

export function useAntwortZuordnenFlow(options: AntwortZuordnenFlowOptions = {}) {
  const steps = { ...DEFAULT_STEPS, ...(options.steps ?? {}) } as Record<string, number>;
  const [offene_punkteTargetId, setOffenePunkteTargetId] = useState<string | null>(null);
  const rueckfragen_und_kommunikation = useStepForm('rueckfragen_und_kommunikation', {
    fields: ["beantwortete_kommunikation", "kanal", "absender", "betreff", "inhalt", "antwortstatus", "anfrage"],
    steps: only(steps, ["beantwortete_kommunikation", "kanal", "absender", "betreff", "inhalt", "antwortstatus", "anfrage"]) as Record<string, number>,
    initial: only(options.initial as FormValues | undefined, ["beantwortete_kommunikation", "kanal", "absender", "betreff", "inhalt", "antwortstatus", "anfrage"]),
    messages: only(options.messages as Record<string, string> | undefined, ["beantwortete_kommunikation", "kanal", "absender", "betreff", "inhalt", "antwortstatus", "anfrage"]),
  });
  const offene_punkte = useStepForm('offene_punkte', {
    fields: ["antwort_geprueft", "loesung_oder_ergebnis", "status", "abschluss_durch", "erneute_pruefung_erforderlich"],
    steps: only(steps, ["antwort_geprueft", "loesung_oder_ergebnis", "status", "abschluss_durch", "erneute_pruefung_erforderlich"]) as Record<string, number>,
    initial: only(options.initial as FormValues | undefined, ["antwort_geprueft", "loesung_oder_ergebnis", "status", "abschluss_durch", "erneute_pruefung_erforderlich"]),
    messages: only(options.messages as Record<string, string> | undefined, ["antwort_geprueft", "loesung_oder_ergebnis", "status", "abschluss_durch", "erneute_pruefung_erforderlich"]),
  });
  const forms: AntwortZuordnenForms = { rueckfragen_und_kommunikation, offene_punkte };
  const formList: StepForm[] = [rueckfragen_und_kommunikation, offene_punkte];

  // The owner's rules after the build (intent-policies.json): a fixed value
  // for a field this flow sets itself, a narrower or wider pick — read at
  // render time, so a change works on the running application.
  usePolicyVersion();
  const searches = {
    beantwortete_kommunikation: useRecordSearch(servicePort, 'rueckfragen_und_kommunikation', withPickPolicy('beantwortete_kommunikation', {
      searchFields: ["betreff", "empfaenger"] as never,
      filter: "r.v_versandstatus == 'versendet' and r.v_antwortstatus in ['offen', 'teilweise', 'unklar']",
      where: (r: JourneyRecord) => (fieldLookup(r, "versandstatus")?.key ?? null) === "versendet" && ["offen", "teilweise", "unklar"].includes(fieldLookup(r, "antwortstatus")?.key ?? ''),
      toItem: options.items?.beantwortete_kommunikation as never,
    })),
    anfrage: useRecordSearch(servicePort, 'kundenanfragen', withPickPolicy('anfrage', {
      searchFields: ["anfragenummer"] as never,
      toItem: options.items?.anfrage as never,
    })),
    offene_punkte: useRecordSearch(servicePort, 'offene_punkte', withPickPolicy('offene_punkte', {
      searchFields: ["kurztitel"] as never,
      toItem: options.items?.offene_punkte as never,
    })),
  };
  // Whether a pick offers „Neu anlegen“ is the plan's call: off for the record
  // this flow changes, for multi picks, for a catalogue entity and for an
  // entity with its own flow. The page spreads `.select` and writes no `create=`.
  // what the person sees under the search field: the rule that narrows the
  // pick (the owner's, else the plan's) — and the link that changes it
  const hintFor = (key: string, entity: EntityKey, planned: PickWhere | null) => pickHint(key, planned,
    w => whereSentence(w, f => labelOf(entity, f), (f, v) => optionsOf(entity, f).find(o => o.key === String(v))?.label ?? String(v)),
    `#/verwaltung/anwendung?line=intent:antwort-zuordnen:read:${entity}`);
  // a fixed value the flow sets itself, as a review row with the link that changes it
  const setting = (entity: EntityKey, field: string, value: unknown): SummaryItem => ({
    key: `setting:${entity}.${field}`, label: labelOf(entity, field),
    value: optionsOf(entity, field).find(o => o.key === String(value))?.label ?? String(value ?? ''),
    href: `#/verwaltung/anwendung?line=intent:antwort-zuordnen:write:${entity}.${field}`,
  });
  const picks = {
    beantwortete_kommunikation: { ...searches.beantwortete_kommunikation, select: { ...searches.beantwortete_kommunikation.select, create: false as boolean, hint: hintFor('beantwortete_kommunikation', 'rueckfragen_und_kommunikation', {"conditions": [{"field": "versandstatus", "op": "eq", "value": "versendet"}, {"field": "antwortstatus", "op": "in", "value": ["offen", "teilweise", "unklar"]}], "mode": "all"} as PickWhere | null) } },
    anfrage: { ...searches.anfrage, select: { ...searches.anfrage.select, create: false as boolean, hint: hintFor('anfrage', 'kundenanfragen', null as PickWhere | null) } },
    offene_punkte: { ...searches.offene_punkte, select: { ...searches.offene_punkte.select, create: false as boolean, hint: hintFor('offene_punkte', 'offene_punkte', null as PickWhere | null) } },
  };

  const offene_punkteFilled = hasValues(offene_punkte);
  const plan: PlanStep[] = [
    {
      key: 'rueckfragen_und_kommunikation', entity: 'rueckfragen_und_kommunikation', form: rueckfragen_und_kommunikation, primary: true,
      values: (): FormValues => ({
        kommunikationstyp: policyFixedValue('rueckfragen_und_kommunikation', 'kommunikationstyp') ?? "antwort",
        antwort_erhalten_am: policyFixedValue('rueckfragen_und_kommunikation', 'antwort_erhalten_am') ?? nowIso(),
      }),

      // the review shows what this step sets itself — changeable on „Deine Anwendung“, not here
      settings: () => [setting('rueckfragen_und_kommunikation', 'kommunikationstyp', policyFixedValue('rueckfragen_und_kommunikation', 'kommunikationstyp') ?? "antwort")],
    },
    ...(offene_punkteFilled ? [{
      key: 'offene_punkte', entity: 'offene_punkte', form: offene_punkte,
      updates: () => offene_punkteTargetId ?? undefined,
      // the review names the record this step changes; "Ändern" leads back to its pick
      target: () => offene_punkteTargetId
        ? { key: 'target:offene_punkte', label: entityLabel('offene_punkte'), value: picks.offene_punkte.labelOf(offene_punkteTargetId) ?? offene_punkteTargetId, step: steps.offene_punkte }
        : undefined,
      values: (): FormValues => ({
        abgeschlossen_am: policyFixedValue('offene_punkte', 'abgeschlossen_am') ?? nowIso(),
      }),
    } as PlanStep] : []),
  ];

  const submit = useJourneySubmit(servicePort, plan, { draftKey: 'antwort-zuordnen' });

  /** The record(s) this flow CHANGES: picked through {...flow.picks.<entity>.select} {...flow.pick('<entity>')};
   *  picking prefills the form with the record's current values, and the plan step updates that record. */
  const targets = {
    offene_punkte: {
      selectedId: offene_punkteTargetId,
      onSelect: (id: string) => {
        setOffenePunkteTargetId(id);
        const rec = picks.offene_punkte.recordOf(id);
        if (rec) offene_punkte.reset({ antwort_geprueft: rec.fields["antwort_geprueft"] === true, loesung_oder_ergebnis: fieldText(rec, "loesung_oder_ergebnis"), status: fieldLookup(rec, "status")?.key, abschluss_durch: fieldText(rec, "abschluss_durch"), erneute_pruefung_erforderlich: rec.fields["erneute_pruefung_erforderlich"] === true, });
      },
      get record(): JourneyRecord | undefined { return offene_punkteTargetId ? picks.offene_punkte.recordOf(offene_punkteTargetId) : undefined; },
    },
  };
  /** Props for a single-record pick step: {...flow.picks.x.select} {...flow.pick('x')} */
  const pick = (field: AntwortZuordnenFieldKey) => {
    if (field in targets) {
      const t = targets[field as keyof typeof targets];
      return { selectedId: t.selectedId, onSelect: t.onSelect };
    }
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
  const pickMany = (field: AntwortZuordnenFieldKey) => {
    const owner = formList.find(f => f.keys.includes(field)) ?? formList[0];
    const search = (picks as Record<string, { labelOf(id: string): string | undefined }>)[field];
    return owner.records(field, id => search?.labelOf(id));
  };
  /** Validate every field the wizard asks in step `n` — for StepNav.onNext. */
  const validateStep = (n: number): boolean =>
    formList.every(f => f.validate(f.keys.filter(k => steps[k] === n)))    && Object.entries(targets).every(([k, t]) => steps[k] !== n || !!t.selectedId);
  const reset = () => { submit.reset(); formList.forEach(f => f.reset()); setOffenePunkteTargetId(null); };

  return {
    slug: 'antwort-zuordnen' as const,
    draftKey: 'antwort-zuordnen' as const,
    entity: 'rueckfragen_und_kommunikation' as const,
    form: rueckfragen_und_kommunikation,
    forms, formList, picks, submit, steps, targets,    reviewStep: ANTWORTZUORDNEN_REVIEW_STEP,
    pick, pickMany, validateStep, reset,
    // the door the hook reads through — for what it does not own: availability
    // (useOccupancy(flow.port, …)), a count (useRecordCount(flow.port, …)). A page
    // importing servicePort next to the hook fails gate 3 (fewo 05.10.2026: the
    // gate taught useOccupancy(servicePort, …) and forbade servicePort at once)
    port: servicePort,
  };
}

export type AntwortZuordnenFlow = ReturnType<typeof useAntwortZuordnenFlow>;
