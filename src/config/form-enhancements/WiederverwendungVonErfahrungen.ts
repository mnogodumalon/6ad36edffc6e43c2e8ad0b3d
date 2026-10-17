// Auto-generated. Per-entity form-enhancements config for "Wiederverwendung von Erfahrungen".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: ["erfahrung", "ziel_anfrage", "abrufdatum", "abrufgrund", "aehnlichkeitseinschaetzung", "verwendungsergebnis", {"row": ["aufwandsersparnis_schaetzung_min", "tatsaechliche_aufwandsersparnis_min"], "cols": "1fr 1fr"}, {"row": ["gueltigkeit_geprueft", "geprueft_von"], "cols": "1fr 1fr"}, "bewertet_am", "kontextunterschiede", "beobachteter_nutzen", "negative_folgen", "begruendung"],
  defaults: {
    'abrufdatum': { kind: 'today', withTime: true },
    'bewertet_am': { kind: 'today' },
  },
  computed: {},
  numberFields: {
    'tatsaechliche_aufwandsersparnis_min': { allowNegative: true },
  },
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
