// Auto-generated. Per-entity form-enhancements config for "Kundenanfragen".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: [{"row": ["anfragenummer", "eingangsdatum"], "cols": "1fr 1fr"}, "kunde", {"row": ["eingangskanal", "kundenreferenz"], "cols": "1fr 1fr"}, {"row": ["status", "prioritaet"], "cols": "1fr 1fr"}, "verantwortlicher", {"row": ["produkt_oder_produktfamilie", "produktvariante"], "cols": "1fr 1fr"}, {"row": ["gewuenschte_menge", "gewuenschter_liefertermin"], "cols": "1fr 1fr"}, {"row": ["zieltermin_klaerung", "klaerung_abgeschlossen_am"], "cols": "1fr 1fr"}, "technischer_klaeraufwand", {"row": ["vollstaendigkeit", "hinweise_erneute_pruefung"], "cols": "1fr 1fr"}, {"row": ["aktive_bearbeitungszeit_min", "wartezeit_kunde_min"], "cols": "1fr 1fr"}, {"row": ["wartezeit_intern_min", "nacharbeiten_anzahl"], "cols": "1fr 1fr"}, "urspruengliche_kundenanforderungen", "anfragebeschreibung"],
  defaults: {
    'eingangsdatum': { kind: 'today' },
    'status': { kind: 'lookup', key: 'neu', label: 'Neu' },
    'zieltermin_klaerung': { kind: 'todayOffset', days: 14 },
    'gewuenschte_menge': { kind: 'literal', value: 1 },
    'vollstaendigkeit': { kind: 'lookup', key: 'ungeprueft', label: 'Ungeprüft' },
    'technischer_klaeraufwand': { kind: 'lookup', key: 'unbekannt', label: 'Noch unbekannt' },
  },
  computed: {
    '_gesamtzeit_min': { op: 'add', left: { op: 'add', left: { kind: 'field', key: 'aktive_bearbeitungszeit_min' }, right: { kind: 'field', key: 'wartezeit_kunde_min' } }, right: { kind: 'field', key: 'wartezeit_intern_min' } },
  },
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
