// The orchestrator's plan, as far as the running app needs it
// (docs/orchestrator/SPEC.md). Generated — do not edit; regenerated on every
// build and update from the stored plan. Without a plan every map is empty.
//
//   SYSTEM_ASSIGNED entity → fields a tool fills when a record is CREATED — the
//                   value does not exist before; dialogs hide these on create and
//                   the form-polish sets no default on them. A scheduled or
//                   update-triggered tool owns its field but is NOT in here.
//   PLAN_SENTENCES  slug → the plan in the owner's words (flows' field page)
//
// The runtime write guard (FLOW_WRITES/OWNERSHIP, planGuard.ts) left on
// 23.09.2026: a flow page composes against its generated hook, whose submit
// plan IS the Schreibliste — there is no way to spell a write outside it.

export const SYSTEM_ASSIGNED: Record<string, string[]> = {
  "kundenanfragen": [
    "anfragenummer"
  ],
  "informationsquellen": [
    "erneute_pruefung_erforderlich",
    "quellenstatus"
  ]
};

export const PLAN_SENTENCES: Record<string, string[]> = {
  "anfrage-aufnehmen": [
    "Legt an: informationsquellen, kundenanfragen",
    "Automatisch: eingangsdatum (heutiges Datum, automatisch), status (fester Wert „neu“), vollstaendigkeit (fester Wert „ungeprueft“), technischer_klaeraufwand (fester Wert „unbekannt“), eingangsdatum (aktueller Zeitpunkt, automatisch), extraktionsstatus (fester Wert „nicht_verarbeitet“)"
  ],
  "anforderungen-erfassen": [
    "Legt an: technische_anforderungen",
    "Ändert: kundenanfragen",
    "Automatisch: pruefstatus (fester Wert „ungeprueft“), status (fester Wert „in_pruefung“), vollstaendigkeit (fester Wert „in_klaerung“)"
  ],
  "offenen-punkt-anlegen": [
    "Legt an: aufgaben, offene_punkte",
    "Automatisch: status (fester Wert „zugewiesen“), status (fester Wert „offen“)"
  ],
  "rueckfrage-vorbereiten": [
    "Legt an: rueckfragen_und_kommunikation",
    "Ändert: kundenanfragen, offene_punkte",
    "Automatisch: versandstatus (fester Wert „entwurf“), antwortstatus (fester Wert „offen“), status (fester Wert „rueckfragen_offen“)"
  ],
  "antwort-zuordnen": [
    "Legt an: rueckfragen_und_kommunikation",
    "Ändert: offene_punkte",
    "Automatisch: kommunikationstyp (fester Wert „antwort“), antwort_erhalten_am (aktueller Zeitpunkt, automatisch), abgeschlossen_am (aktueller Zeitpunkt, automatisch)"
  ],
  "entscheidung-dokumentieren": [
    "Legt an: beurteilungen, entscheidungen",
    "Automatisch: erstellt_am (aktueller Zeitpunkt, automatisch), pruefstatus (fester Wert „entwurf“)"
  ]
};

export const PLAN_SUMMARY = "Die Anwendung begleitet die technische Auftragsklärung bei kundenspezifischen Produkten: von der erfassten Kundenanfrage über Quellen, technische Anforderungen, offene Punkte, Aufgaben, Rückfragen, Beurteilungen und Entscheidungen bis zum dokumentierten Abschluss und zur Übergabe. Erfahrungen aus Fällen werden festgehalten und bei späteren Anfragen auf Wiederverwendung geprüft. Freigaben und Entscheidungen werden nie automatisch erteilt.";

/** slug → the lists a flow writes (the plan's Schreibliste). The nav leaves a
 *  flow out for a user who may not write one of them (lib/permissions.ts). */
export const FLOW_ENTITIES: Record<string, string[]> = {
  "anfrage-aufnehmen": [
    "informationsquellen",
    "kundenanfragen"
  ],
  "anforderungen-erfassen": [
    "kundenanfragen",
    "technische_anforderungen"
  ],
  "offenen-punkt-anlegen": [
    "aufgaben",
    "offene_punkte"
  ],
  "rueckfrage-vorbereiten": [
    "kundenanfragen",
    "offene_punkte",
    "rueckfragen_und_kommunikation"
  ],
  "antwort-zuordnen": [
    "offene_punkte",
    "rueckfragen_und_kommunikation"
  ],
  "entscheidung-dokumentieren": [
    "beurteilungen",
    "entscheidungen"
  ]
};
