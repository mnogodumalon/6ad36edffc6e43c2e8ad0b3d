// Auto-generated. Per-entity form-enhancements config for "Abschluss und Übergabe".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: ["anfrage", {"row": ["pruefdatum", "geprueft_von"], "cols": "1fr 1fr"}, {"row": ["anforderungen_geprueft", "kritische_punkte_geklaert"], "cols": "1fr 1fr"}, {"row": ["erforderliche_entscheidungen_vorhanden", "erforderliche_freigaben_vorhanden"], "cols": "1fr 1fr"}, {"row": ["uebergabestatus", "freigabestatus"], "cols": "1fr 1fr"}, {"row": ["uebergabeempfaenger", "uebergabedatum"], "cols": "1fr 1fr"}, "verbleibende_abweichungen", "verbleibende_risiken", "zusammenfassung"],
  defaults: {
    'pruefdatum': { kind: 'today', withTime: true },
    'uebergabestatus': { kind: 'lookup', key: 'nicht_vorbereitet', label: 'Nicht vorbereitet' },
    'freigabestatus': { kind: 'lookup', key: 'nicht_freigegeben', label: 'Nicht freigegeben' },
  },
  computed: {},
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
