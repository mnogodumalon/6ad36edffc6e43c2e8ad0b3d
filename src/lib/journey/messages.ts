/**
 * Required-field messages — WRITTEN BY THE BUILD AGENT, never by a heuristic.
 *
 * The layer knows two things about an empty required field: that it is
 * required and what its label is. Out of that it can only say „„Anreise" ist
 * ein Pflichtfeld". What the person should do instead („Bitte einen Gast
 * auswählen.") is meaning, and meaning is the agent's: the Phase-2 orchestrator
 * writes one short instruction per required field — what is needed, not why — to
 * `.intents-staging/messages.json`, the integration step validates it against
 * the app metadata and renders it into the block below. Scaffold updates keep
 * the block. Do not edit outside the markers.
 *
 * Every door reads this and nothing else: `useStepForm` (flows and public
 * pages), the generated {Entity}Dialog and the public form's server-error line.
 * A field without a sentence falls back to the label sentence — never to a
 * bare „Dieses Feld ist erforderlich".
 *
 * Required fields per entity (from the base view):
 *   - kunden: firmenname (Firmenname)
 *   - kundenanfragen: urspruengliche_kundenanforderungen (Ursprüngliche Kundenanforderungen), kunde (Kunde), eingangsdatum (Eingangsdatum), anfragebeschreibung (Anfragebeschreibung)
 *   - abschluss_und_uebergabe: anfrage (Anfrage)
 *   - informationsquellen: titel (Titel), anfrage (Anfrage)
 *   - technische_anforderungen: anfrage (Anfrage), bezeichnung (Bezeichnung), beschreibung (Beschreibung)
 *   - offene_punkte: anfrage (Anfrage), kurztitel (Kurztitel), beschreibung (Beschreibung und Grund)
 *   - aufgaben: anfrage (Anfrage), titel (Titel), verantwortlicher (Verantwortlicher)
 *   - beurteilungen: anfrage (Anfrage), beurteilungsgegenstand (Beurteilungsgegenstand), fachliche_begruendung (Fachliche Begründung)
 *   - rueckfragen_und_kommunikation: anfrage (Anfrage), betreff (Betreff), inhalt (Inhalt (Entwurf oder Wortlaut))
 *   - entscheidungen: anfrage (Anfrage), titel (Titel), entscheidungsgegenstand (Entscheidungsgegenstand), entscheidung (Entscheidung), begruendung (Begründung), entscheidungsverantwortlicher (Entscheidungsverantwortlicher)
 *   - erfahrungen_und_erkenntnisse: titel (Titel), sachverhalt (Sachverhalt), ursprungs_anfrage (Ursprungsanfrage)
 *   - wiederverwendung_von_erfahrungen: ziel_anfrage (Spätere Anfrage), erfahrung (Erfahrung)
 */
import { t, tx } from '@/i18n';
import { labelOf, type EntityKey } from './rules';

/** The writable fields of each entity — the keys a message may address (generated). */
export interface MessageFields {
  "kunden": "kundennummer" | "firmenname" | "ansprechpartner_vorname" | "ansprechpartner_nachname" | "e_mail" | "telefon" | "strasse" | "hausnummer" | "plz" | "ort" | "branche" | "interne_bemerkung" | "aktiv";
  "kundenanfragen": "urspruengliche_kundenanforderungen" | "prioritaet" | "verantwortlicher" | "status" | "technischer_klaeraufwand" | "zieltermin_klaerung" | "vollstaendigkeit" | "hinweise_erneute_pruefung" | "aktive_bearbeitungszeit_min" | "wartezeit_kunde_min" | "wartezeit_intern_min" | "nacharbeiten_anzahl" | "klaerung_abgeschlossen_am" | "anfragenummer" | "kunde" | "eingangsdatum" | "eingangskanal" | "kundenreferenz" | "produkt_oder_produktfamilie" | "produktvariante" | "gewuenschte_menge" | "gewuenschter_liefertermin" | "anfragebeschreibung";
  "abschluss_und_uebergabe": "anfrage" | "pruefdatum" | "geprueft_von" | "anforderungen_geprueft" | "kritische_punkte_geklaert" | "erforderliche_entscheidungen_vorhanden" | "erforderliche_freigaben_vorhanden" | "verbleibende_abweichungen" | "uebergabeempfaenger" | "uebergabestatus" | "verbleibende_risiken" | "uebergabedatum" | "zusammenfassung" | "freigabestatus";
  "informationsquellen": "quellentyp" | "titel" | "referenz_url" | "absender_oder_urheber" | "quellendatum" | "eingangsdatum" | "versionskennung" | "anfrage" | "quellenstatus" | "zusammenfassung" | "extraktionsstatus" | "pruefung_durch" | "pruefung_am" | "erneute_pruefung_erforderlich" | "bemerkung" | "ersetzt_quelle";
  "technische_anforderungen": "quellen" | "anfrage" | "bezeichnung" | "beschreibung" | "anforderungstyp" | "ursprung" | "sollwert" | "einheit" | "vergleichsoperator" | "min_wert" | "max_wert" | "ist_pflichtanforderung" | "pruefstatus" | "begruendung_pruefstatus" | "verantwortlicher" | "gueltig_ab" | "gueltig_bis" | "erneute_pruefung_erforderlich" | "letzte_aenderung";
  "offene_punkte": "betroffene_anforderungen" | "anfrage" | "kurztitel" | "beschreibung" | "punktetyp" | "prioritaet" | "auswirkung" | "zustaendige_rolle" | "verantwortlicher" | "faellig_am" | "status" | "erledigungskriterium" | "antwort_geprueft" | "erneute_pruefung_erforderlich" | "loesung_oder_ergebnis" | "abgeschlossen_am" | "abschluss_durch" | "betroffene_quellen";
  "aufgaben": "offener_punkt" | "abhaengige_aufgaben" | "anfrage" | "titel" | "beschreibung" | "aufgabentyp" | "verantwortlicher" | "mitwirkende" | "prioritaet" | "status" | "faellig_am" | "blockierungsgrund" | "ergebnis" | "aktive_zeit_min" | "wartezeit_min" | "abgeschlossen_am";
  "beurteilungen": "anfrage" | "beurteilungsgegenstand" | "beurteilungsart" | "fachliche_begruendung" | "annahmen" | "einschaetzung" | "unsicherheiten" | "alternativen" | "empfehlung" | "ist_ki_vorschlag" | "erstellt_von" | "erstellt_am" | "pruefstatus" | "geprueft_von" | "geprueft_am" | "erneute_pruefung_erforderlich" | "betroffene_anforderungen" | "betroffene_offene_punkte" | "zugrunde_liegende_quellen" | "zugrunde_liegende_anforderungen";
  "rueckfragen_und_kommunikation": "offener_punkt" | "zugehoerige_offene_punkte" | "beantwortete_kommunikation" | "quelle" | "anfrage" | "kommunikationstyp" | "kanal" | "absender" | "empfaenger" | "betreff" | "inhalt" | "versandstatus" | "versanddatum" | "antwort_erwartet_bis" | "antwort_erhalten_am" | "antwortstatus" | "notizen";
  "entscheidungen": "anfrage" | "titel" | "entscheidungsgegenstand" | "entscheidungstyp" | "alternativen" | "entscheidung" | "begruendung" | "entscheidungsverantwortlicher" | "entscheidungskompetenz_geprueft" | "entscheidungsstatus" | "entscheidungsdatum" | "auflagen" | "gueltig_bis" | "ergebnis" | "betroffene_anforderungen" | "betroffene_offene_punkte" | "zugrunde_liegende_beurteilungen" | "ersetzt_durch_entscheidung";
  "erfahrungen_und_erkenntnisse": "belegquellen" | "belegbeurteilungen" | "belegentscheidungen" | "titel" | "sachverhalt" | "erfahrungstyp" | "produkt_oder_produktfamilie" | "anforderungstyp" | "schlagwoerter" | "ursprungs_anfrage" | "urspruengliches_problem" | "vorgehen" | "beobachtetes_ergebnis" | "erkenntnis" | "gueltigkeitsbedingungen" | "bekannte_grenzen" | "risiko_der_uebertragung" | "bestaetigungsstatus" | "bestaetigt_von" | "bestaetigt_am" | "gueltig_ab" | "gueltig_bis" | "wiederverwendungsstatus" | "kommentar_zur_wiederverwendung";
  "wiederverwendung_von_erfahrungen": "aufwandsersparnis_schaetzung_min" | "tatsaechliche_aufwandsersparnis_min" | "negative_folgen" | "bewertet_am" | "ziel_anfrage" | "abrufdatum" | "abrufgrund" | "aehnlichkeitseinschaetzung" | "kontextunterschiede" | "gueltigkeit_geprueft" | "geprueft_von" | "verwendungsergebnis" | "begruendung" | "beobachteter_nutzen" | "erfahrung";
}
export type MessageFieldKey<E extends EntityKey> = E extends keyof MessageFields ? MessageFields[E] : never;

export const REQUIRED_MESSAGES: { [E in EntityKey]?: Partial<Record<MessageFieldKey<E>, string>> } = {
  // <custom:messages>
  kunden: { firmenname: "Bitte den Firmennamen eingeben." },
  kundenanfragen: { urspruengliche_kundenanforderungen: "Bitte die ursprünglichen Kundenanforderungen eintragen.", kunde: "Bitte einen Kunden auswählen.", eingangsdatum: "Bitte das Eingangsdatum wählen.", anfragebeschreibung: "Bitte die Anfrage kurz beschreiben." },
  abschluss_und_uebergabe: { anfrage: "Bitte eine Anfrage auswählen." },
  informationsquellen: { titel: "Bitte einen Titel für die Quelle eingeben.", anfrage: "Bitte eine Anfrage auswählen." },
  technische_anforderungen: { anfrage: "Bitte eine Anfrage auswählen.", bezeichnung: "Bitte die Anforderung benennen.", beschreibung: "Bitte die Anforderung beschreiben." },
  offene_punkte: { anfrage: "Bitte eine Anfrage auswählen.", kurztitel: "Bitte einen Kurztitel eingeben.", beschreibung: "Bitte den Grund des Punkts beschreiben." },
  aufgaben: { anfrage: "Bitte eine Anfrage auswählen.", titel: "Bitte einen Titel für die Aufgabe eingeben.", verantwortlicher: "Bitte einen Verantwortlichen angeben." },
  beurteilungen: { anfrage: "Bitte eine Anfrage auswählen.", beurteilungsgegenstand: "Bitte den Beurteilungsgegenstand eingeben.", fachliche_begruendung: "Bitte die fachliche Begründung eintragen." },
  rueckfragen_und_kommunikation: { anfrage: "Bitte eine Anfrage auswählen.", betreff: "Bitte einen Betreff eingeben.", inhalt: "Bitte den Wortlaut eintragen." },
  entscheidungen: { anfrage: "Bitte eine Anfrage auswählen.", titel: "Bitte einen Titel eingeben.", entscheidungsgegenstand: "Bitte den Entscheidungsgegenstand beschreiben.", entscheidung: "Bitte die Entscheidung formulieren.", begruendung: "Bitte die Begründung eintragen.", entscheidungsverantwortlicher: "Bitte den Entscheidungsverantwortlichen angeben." },
  erfahrungen_und_erkenntnisse: { titel: "Bitte einen Titel eingeben.", sachverhalt: "Bitte den Sachverhalt beschreiben.", ursprungs_anfrage: "Bitte die Ursprungsanfrage auswählen." },
  wiederverwendung_von_erfahrungen: { ziel_anfrage: "Bitte die spätere Anfrage auswählen.", erfahrung: "Bitte eine Erfahrung auswählen." },
  // </custom:messages>
};

/** The sentence shown when `key` of `entity` is required and empty — the
 *  agent's own text (translated at runtime like every page string), else the
 *  label sentence. Call it while rendering, not at module scope. */
export function requiredMessage(entity: EntityKey, key: string): string {
  const own = (REQUIRED_MESSAGES as Record<string, Record<string, string | undefined> | undefined>)[entity]?.[key];
  if (own && own.trim()) return tx(own);
  return t('v_required', { label: labelOf(entity, key) });
}

/** True when the agent wrote a sentence for the field. */
export function hasOwnMessage(entity: EntityKey, key: string): boolean {
  const own = (REQUIRED_MESSAGES as Record<string, Record<string, string | undefined> | undefined>)[entity]?.[key];
  return Boolean(own && own.trim());
}
