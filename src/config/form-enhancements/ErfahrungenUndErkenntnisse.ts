// Auto-generated. Per-entity form-enhancements config for "Erfahrungen und Erkenntnisse".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: ["titel", "ursprungs_anfrage", {"row": ["erfahrungstyp", "bestaetigungsstatus"], "cols": "1fr 1fr"}, {"row": ["produkt_oder_produktfamilie", "anforderungstyp"], "cols": "1fr 1fr"}, "schlagwoerter", "sachverhalt", {"row": ["gueltig_ab", "gueltig_bis"], "cols": "1fr 1fr"}, {"row": ["bestaetigt_von", "bestaetigt_am"], "cols": "1fr 1fr"}, {"row": ["risiko_der_uebertragung", "wiederverwendungsstatus"], "cols": "1fr 1fr"}, "belegquellen", "belegbeurteilungen", "belegentscheidungen", "urspruengliches_problem", "vorgehen", "beobachtetes_ergebnis", "erkenntnis", "gueltigkeitsbedingungen", "bekannte_grenzen", "kommentar_zur_wiederverwendung"],
  defaults: {
    'gueltig_ab': { kind: 'today' },
    'bestaetigungsstatus': { kind: 'lookup', key: 'ungeprueft', label: 'Ungeprüft' },
    'wiederverwendungsstatus': { kind: 'lookup', key: 'nicht_geprueft', label: 'Nicht geprüft' },
  },
  computed: {},
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
