/**
 * Occupancy semantics — DECIDED BY THE BUILD AGENT, never by a heuristic.
 *
 * The Phase-2 orchestrator writes its decision to `.intents-staging/occupancy.json`
 * (stay pair, booked resource, statuses that do not occupy); the integration
 * step validates it against the app metadata and renders it into the block
 * below. Scaffold updates keep the block. Do not edit outside the markers.
 *
 * Both doors read this and nothing else: `occupancyFor` (internal flows AND
 * public pages) and the owner service (the public grant's occupancy read).
 * No rule for an entity = no availability calendar, no occupancy claim —
 * a plain date field pair is shown instead.
 *
 * Facts from the metadata — candidates, NOT decisions:
 *   - kunden: no date pair, no references
 *   - kundenanfragen: applookups kunde→kunden · lookups prioritaet[niedrig|normal|hoch|kritisch], status[neu|in_pruefung|rueckfragen_offen|fachliche_pruefung|entscheidungsbedarf|technisch_geklaert|freigegeben|abgelehnt|zurueckgestellt], technischer_klaeraufwand[klein|mittel|hoch|unbekannt], vollstaendigkeit[ungeprueft|unvollstaendig|in_klaerung|vollstaendig_geprueft], eingangskanal[webformular|telefon|persoenlich|bestandskunde|sonstiger|email]
 *   - abschluss_und_uebergabe: applookups anfrage→kundenanfragen · lookups uebergabestatus[nicht_vorbereitet|bereit|uebergeben|zurueckgewiesen], freigabestatus[nicht_freigegeben|freigegeben|verweigert|zurueckgestellt]
 *   - informationsquellen: applookups anfrage→kundenanfragen, ersetzt_quelle→informationsquellen · lookups quellentyp[email|pdf|office|bild|zeichnung|cad|webadresse|gespraechsnotiz|erp|manuell|sonstige], quellenstatus[aktuell|ersetzt|ungeprueft|strittig|ungueltig], extraktionsstatus[nicht_verarbeitet|in_bearbeitung|extrahiert|manuell_geprueft|fehler]
 *   - technische_anforderungen: applookups quellen→informationsquellen, anfrage→kundenanfragen · lookups anforderungstyp[abmessung|material|leistung|funktion|schnittstelle|norm|sicherheit|umweltbedingung|qualitaet|liefertermin|dokumentation|sonstiges], ursprung[kundenangabe|kundenunterlage|interne_vorgabe|ableitung|erfahrungswissen|ki_vorschlag], vergleichsoperator[gleich|groesser|groesser_gleich|kleiner|kleiner_gleich|zwischen], pruefstatus[ungeprueft|zu_pruefen|bestaetigt|unklar|widerspruechlich|nicht_erfuellt|nicht_anwendbar]
 *   - offene_punkte: applookups betroffene_anforderungen→technische_anforderungen, anfrage→kundenanfragen, betroffene_quellen→informationsquellen · lookups punktetyp[fehlende_information|widerspruch|technische_pruefung|normenpruefung|machbarkeit|risiko|rueckfrage|freigabe|sonstiges], prioritaet[niedrig|normal|hoch|kritisch], auswirkung[qualitaet|sicherheit|funktion|kosten|termin|herstellbarkeit|normenkonformitaet|sonstiges], zustaendige_rolle[vertrieb|konstruktion|arbeitsvorbereitung|qualitaetssicherung|fertigung|einkauf|technische_leitung|sonstige], status[erledigt|entschieden_akzeptiert|nicht_mehr_relevant|neu|zugewiesen|in_bearbeitung|wartet_kunde|wartet_intern|zur_entscheidung]
 *   - aufgaben: applookups offener_punkt→offene_punkte, abhaengige_aufgaben→aufgaben, anfrage→kundenanfragen · lookups aufgabentyp[technische_bewertung|kundenrueckfrage|interne_rueckfrage|normenpruefung|machbarkeitspruefung|dokumentation|entscheidung_vorbereiten|freigabepruefung|sonstiges|informationspruefung], prioritaet[niedrig|normal|hoch|kritisch], status[offen|in_bearbeitung|blockiert|wartet_antwort|erledigt|abgebrochen]
 *   - beurteilungen: applookups anfrage→kundenanfragen, betroffene_anforderungen→technische_anforderungen, betroffene_offene_punkte→offene_punkte, zugrunde_liegende_quellen→informationsquellen, zugrunde_liegende_anforderungen→technische_anforderungen · lookups beurteilungsart[machbarkeit|vollstaendigkeit|risiko|qualitaet|normenkonformitaet|termin|kostenwirkung|herstellbarkeit|sonstiges], einschaetzung[positiv|bedingt_positiv|negativ|unklar|nicht_anwendbar], pruefstatus[entwurf|fachlich_geprueft|bestaetigt|ueberholt]
 *   - rueckfragen_und_kommunikation: applookups offener_punkt→offene_punkte, zugehoerige_offene_punkte→offene_punkte, beantwortete_kommunikation→rueckfragen_und_kommunikation, quelle→informationsquellen, anfrage→kundenanfragen · lookups kommunikationstyp[interne_anfrage|antwort|information|eskalation|gespraechsprotokoll|kundenrueckfrage], kanal[email|telefon|besprechung|chat|persoenlich|sonstiges], versandstatus[entwurf|zur_pruefung|freigegeben|versendet|fehlgeschlagen|nicht_erforderlich], antwortstatus[offen|teilweise|beantwortet|unklar|widerspruechlich]
 *   - entscheidungen: applookups anfrage→kundenanfragen, betroffene_anforderungen→technische_anforderungen, betroffene_offene_punkte→offene_punkte, zugrunde_liegende_beurteilungen→beurteilungen, ersetzt_durch_entscheidung→entscheidungen · lookups entscheidungstyp[technische_freigabe|abweichung_akzeptieren|alternative|anforderung_aendern|risiko_akzeptieren|rueckfrage_abschliessen|ablehnung|eskalation|sonstiges], entscheidungsstatus[vorbereitung|zur_entscheidung|entschieden|zurueckgestellt|ersetzt]
 *   - erfahrungen_und_erkenntnisse: applookups belegquellen→informationsquellen, belegbeurteilungen→beurteilungen, belegentscheidungen→entscheidungen, ursprungs_anfrage→kundenanfragen · lookups erfahrungstyp[erfahrung|annahme|experiment|wirkung|bewaehrt|beobachtung], risiko_der_uebertragung[niedrig|mittel|hoch|unbekannt], bestaetigungsstatus[ungeprueft|vorlaeufig|fachlich_bestaetigt|wiederholt_bestaetigt|widerlegt|ueberholt], wiederverwendungsstatus[nicht_geprueft|verfuegbar|nur_hinweis|nicht_mehr]
 *   - wiederverwendung_von_erfahrungen: applookups ziel_anfrage→kundenanfragen, erfahrung→erfahrungen_und_erkenntnisse · lookups aehnlichkeitseinschaetzung[hoch|mittel|niedrig|unklar], verwendungsergebnis[verwendet|teilweise|nicht_verwendet|ungeeignet]
 */
import type { EntityKey } from '@/lib/journey/rules';

export interface OccupancyRule {
  /** Arrival / departure fields (the departure day is exclusive). */
  from: string;
  to: string;
  /** applookup field naming the booked RESOURCE (room, vehicle, court).
   *  Omit when the entity itself is the one resource (a single holiday flat). */
  resource?: string;
  /** lookup field + the keys that mean "does NOT occupy" (cancelled, no-show). */
  statusField?: string;
  freeKeys?: string[];
}

export const OCCUPANCY: Partial<Record<EntityKey, OccupancyRule>> = {
  // <custom:occupancy>
  // </custom:occupancy>
};

/**
 * A record of the KEY entity is TAKEN while a record of `entity` points at it
 * through `field` — a slot with a booking, a seat with a ticket. Generated
 * from the plan's blocking `unique` check on that reference (05.10.2026:
 * the salon's public page offered booked slots again). Pickers on both
 * doors leave taken records out (useRecordSearch); a public page reads only
 * `field` of `entity` — never who booked. Generator-owned: no markers.
 */
export interface TakenRule {
  entity: EntityKey;
  field: string;
}

export const TAKEN_BY: Partial<Record<EntityKey, TakenRule>> = {
};
