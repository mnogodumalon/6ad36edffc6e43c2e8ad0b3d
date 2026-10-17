// Auto-generated. Per-entity form-enhancements config for "Entscheidungen".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: ["titel", "anfrage", {"row": ["entscheidungstyp", "entscheidungsstatus"], "cols": "1fr 1fr"}, "entscheidungsverantwortlicher", {"row": ["entscheidungsdatum", "gueltig_bis"], "cols": "1fr 1fr"}, "entscheidungskompetenz_geprueft", "betroffene_anforderungen", "betroffene_offene_punkte", "zugrunde_liegende_beurteilungen", "ersetzt_durch_entscheidung", "entscheidungsgegenstand", "entscheidung", "begruendung", "alternativen", "auflagen", "ergebnis"],
  defaults: {
    'entscheidungsdatum': { kind: 'today', withTime: true },
    'entscheidungsstatus': { kind: 'lookup', key: 'vorbereitung', label: 'Vorbereitung' },
  },
  computed: {},
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
