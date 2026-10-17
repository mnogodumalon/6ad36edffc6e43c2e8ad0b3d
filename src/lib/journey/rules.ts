/**
 * Field rules — GENERATED from the app metadata. Do not edit.
 *
 * The mechanical truth about every field: what kind it is, whether the
 * platform's base view marks it required, which lookup keys exist, where an
 * applookup points, what the label is. `useStepForm` validates against these
 * rules and phrases its messages with the real labels; `toWirePayload` uses
 * them to shape the create payload; `SHAPES` tells a page which input FORM
 * fits the data (a date pair wants a calendar, not two fields) — it is a
 * signal, not a gate.
 */
import { appLabel, fieldLabel, lookupLabel } from '@/i18n';
import { policyLabel } from './policy';
import { LOOKUP_OPTIONS } from '@/types/app';

export type EntityKey = 'kunden' | 'kundenanfragen' | 'abschluss_und_uebergabe' | 'informationsquellen' | 'technische_anforderungen' | 'offene_punkte' | 'aufgaben' | 'beurteilungen' | 'rueckfragen_und_kommunikation' | 'entscheidungen' | 'erfahrungen_und_erkenntnisse' | 'wiederverwendung_von_erfahrungen';

/** The text fields of each entity — what a search may run over (generated;
 *  `never` for an entity without text of its own, e.g. a link table). */
export interface StringFields {
  "kunden": "kundennummer" | "firmenname" | "ansprechpartner_vorname" | "ansprechpartner_nachname" | "e_mail" | "telefon" | "strasse" | "hausnummer" | "plz" | "ort" | "branche" | "interne_bemerkung";
  "kundenanfragen": "urspruengliche_kundenanforderungen" | "verantwortlicher" | "anfragenummer" | "kundenreferenz" | "produkt_oder_produktfamilie" | "produktvariante" | "anfragebeschreibung";
  "abschluss_und_uebergabe": "geprueft_von" | "verbleibende_abweichungen" | "uebergabeempfaenger" | "verbleibende_risiken" | "zusammenfassung";
  "informationsquellen": "titel" | "referenz_url" | "absender_oder_urheber" | "versionskennung" | "zusammenfassung" | "pruefung_durch" | "bemerkung";
  "technische_anforderungen": "bezeichnung" | "beschreibung" | "sollwert" | "einheit" | "begruendung_pruefstatus" | "verantwortlicher";
  "offene_punkte": "kurztitel" | "beschreibung" | "verantwortlicher" | "erledigungskriterium" | "loesung_oder_ergebnis" | "abschluss_durch";
  "aufgaben": "titel" | "beschreibung" | "verantwortlicher" | "mitwirkende" | "blockierungsgrund" | "ergebnis";
  "beurteilungen": "beurteilungsgegenstand" | "fachliche_begruendung" | "annahmen" | "unsicherheiten" | "alternativen" | "empfehlung" | "erstellt_von" | "geprueft_von";
  "rueckfragen_und_kommunikation": "absender" | "empfaenger" | "betreff" | "inhalt" | "notizen";
  "entscheidungen": "titel" | "entscheidungsgegenstand" | "alternativen" | "entscheidung" | "begruendung" | "entscheidungsverantwortlicher" | "auflagen" | "ergebnis";
  "erfahrungen_und_erkenntnisse": "titel" | "sachverhalt" | "produkt_oder_produktfamilie" | "anforderungstyp" | "schlagwoerter" | "urspruengliches_problem" | "vorgehen" | "beobachtetes_ergebnis" | "erkenntnis" | "gueltigkeitsbedingungen" | "bekannte_grenzen" | "bestaetigt_von" | "kommentar_zur_wiederverwendung";
  "wiederverwendung_von_erfahrungen": "negative_folgen" | "abrufgrund" | "kontextunterschiede" | "geprueft_von" | "begruendung" | "beobachteter_nutzen";
}
export type StringFieldKey<E extends EntityKey> = E extends keyof StringFields ? StringFields[E] : never;

/** The applookup fields of each entity (generated). A pick stored through
 *  `form.set` on one of these must carry its display name — at compile time
 *  (`StepForm.set`), because the review would otherwise show the id. */
export interface RecordFields {
  "kunden": never;
  "kundenanfragen": "kunde";
  "abschluss_und_uebergabe": "anfrage";
  "informationsquellen": "anfrage" | "ersetzt_quelle";
  "technische_anforderungen": "quellen" | "anfrage";
  "offene_punkte": "betroffene_anforderungen" | "anfrage" | "betroffene_quellen";
  "aufgaben": "offener_punkt" | "abhaengige_aufgaben" | "anfrage";
  "beurteilungen": "anfrage" | "betroffene_anforderungen" | "betroffene_offene_punkte" | "zugrunde_liegende_quellen" | "zugrunde_liegende_anforderungen";
  "rueckfragen_und_kommunikation": "offener_punkt" | "zugehoerige_offene_punkte" | "beantwortete_kommunikation" | "quelle" | "anfrage";
  "entscheidungen": "anfrage" | "betroffene_anforderungen" | "betroffene_offene_punkte" | "zugrunde_liegende_beurteilungen" | "ersetzt_durch_entscheidung";
  "erfahrungen_und_erkenntnisse": "belegquellen" | "belegbeurteilungen" | "belegentscheidungen" | "ursprungs_anfrage";
  "wiederverwendung_von_erfahrungen": "ziel_anfrage" | "erfahrung";
}
export type RecordFieldKey<E extends EntityKey> = E extends keyof RecordFields ? RecordFields[E] : never;

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'lookup'
  | 'multilookup'
  | 'record'
  | 'multirecord'
  | 'file'
  | 'geo';

export interface FieldRule {
  key: string;
  fulltype: string;
  kind: FieldKind;
  /** From the app's base view. A public page may override this per field. */
  required: boolean;
  /** Build-time label — `labelOf()` prefers the runtime i18n bundle. */
  label: string;
  /** Whether a journey may write it (`file` is upload-only, never via a journey). */
  writable: boolean;
  maxLength?: number;
  /** lookup / multilookup: the ONLY valid write values. */
  options?: string[];
  /** record / multirecord: the target app (always) and its entity key (when inside this appgroup). */
  targetAppId?: string;
  targetEntity?: EntityKey;
  format?: 'currency';
  /** HTML autocomplete token derived from the field name (given-name, email, tel, …). */
  autoComplete?: string;
}

export interface EntityInfo {
  key: EntityKey;
  appId: string;
  label: string;
  /** PascalCase plural — `get<pascal>()` on the service. */
  pascal: string;
  /** The single-record suffix — `create<single>()` on the service. */
  single: string;
}

/** Input-form signals per entity: which data shape each field (pair) has.
 *  `range`  — two date fields that form a stay/period → AvailabilityRangePicker
 *  `choice` — a lookup with few options → ChoiceGroup pills instead of a select
 *  `record` — an applookup → EntitySelectStep with search, never a raw id field
 *  `stock`  — a quantity that has a stock/capacity counterpart → show it, warn on overshoot */
export type Shape =
  | { kind: 'range'; from: string; to: string }
  | { kind: 'choice'; field: string; count: number }
  | { kind: 'record'; field: string; targetEntity?: EntityKey }
  | { kind: 'stock'; field: string };

export const ENTITIES: Record<EntityKey, EntityInfo> = {
  "kunden": {
    "key": "kunden",
    "appId": "6ad36e9eac6687d3c66ee837",
    "label": "Kunden",
    "pascal": "Kunden",
    "single": "KundenEntry"
  },
  "kundenanfragen": {
    "key": "kundenanfragen",
    "appId": "6ad36ea588ea187cc38149b6",
    "label": "Kundenanfragen",
    "pascal": "Kundenanfragen",
    "single": "KundenanfragenEntry"
  },
  "abschluss_und_uebergabe": {
    "key": "abschluss_und_uebergabe",
    "appId": "6ad36ea63a6dad34d4a48433",
    "label": "Abschluss und Übergabe",
    "pascal": "AbschlussUndUebergabe",
    "single": "AbschlussUndUebergabeEntry"
  },
  "informationsquellen": {
    "key": "informationsquellen",
    "appId": "6ad36ea795457907d694b846",
    "label": "Informationsquellen",
    "pascal": "Informationsquellen",
    "single": "InformationsquellenEntry"
  },
  "technische_anforderungen": {
    "key": "technische_anforderungen",
    "appId": "6ad36ea764e9df6407f448a0",
    "label": "Technische Anforderungen",
    "pascal": "TechnischeAnforderungen",
    "single": "TechnischeAnforderungenEntry"
  },
  "offene_punkte": {
    "key": "offene_punkte",
    "appId": "6ad36ea8867261833e338f1b",
    "label": "Offene Punkte",
    "pascal": "OffenePunkte",
    "single": "OffenePunkteEntry"
  },
  "aufgaben": {
    "key": "aufgaben",
    "appId": "6ad36ea9809c835435cef8c1",
    "label": "Aufgaben",
    "pascal": "Aufgaben",
    "single": "AufgabenEntry"
  },
  "beurteilungen": {
    "key": "beurteilungen",
    "appId": "6ad36ea9526e7f9d341bc8ff",
    "label": "Beurteilungen",
    "pascal": "Beurteilungen",
    "single": "BeurteilungenEntry"
  },
  "rueckfragen_und_kommunikation": {
    "key": "rueckfragen_und_kommunikation",
    "appId": "6ad36eaae7395e6b718022a5",
    "label": "Rückfragen und Kommunikation",
    "pascal": "RueckfragenUndKommunikation",
    "single": "RueckfragenUndKommunikationEntry"
  },
  "entscheidungen": {
    "key": "entscheidungen",
    "appId": "6ad36eaa7a6c94e718236860",
    "label": "Entscheidungen",
    "pascal": "Entscheidungen",
    "single": "EntscheidungenEntry"
  },
  "erfahrungen_und_erkenntnisse": {
    "key": "erfahrungen_und_erkenntnisse",
    "appId": "6ad36eab3feb7a28c86eba9d",
    "label": "Erfahrungen und Erkenntnisse",
    "pascal": "ErfahrungenUndErkenntnisse",
    "single": "ErfahrungenUndErkenntnisseEntry"
  },
  "wiederverwendung_von_erfahrungen": {
    "key": "wiederverwendung_von_erfahrungen",
    "appId": "6ad36eac5608cadd0ec823bc",
    "label": "Wiederverwendung von Erfahrungen",
    "pascal": "WiederverwendungVonErfahrungen",
    "single": "WiederverwendungVonErfahrungenEntry"
  }
};

export const FIELD_RULES: Record<EntityKey, Record<string, FieldRule>> = {
  "kunden": {
    "kundennummer": {
      "key": "kundennummer",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Kundennummer",
      "writable": true,
      "maxLength": 4000
    },
    "firmenname": {
      "key": "firmenname",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Firmenname",
      "writable": true,
      "maxLength": 4000
    },
    "ansprechpartner_vorname": {
      "key": "ansprechpartner_vorname",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Ansprechpartner Vorname",
      "writable": true,
      "maxLength": 4000,
      "autoComplete": "given-name"
    },
    "ansprechpartner_nachname": {
      "key": "ansprechpartner_nachname",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Ansprechpartner Nachname",
      "writable": true,
      "maxLength": 4000,
      "autoComplete": "family-name"
    },
    "e_mail": {
      "key": "e_mail",
      "fulltype": "string/email",
      "kind": "email",
      "required": false,
      "label": "E-Mail",
      "writable": true,
      "autoComplete": "email"
    },
    "telefon": {
      "key": "telefon",
      "fulltype": "string/tel",
      "kind": "tel",
      "required": false,
      "label": "Telefon",
      "writable": true,
      "autoComplete": "tel"
    },
    "strasse": {
      "key": "strasse",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Straße",
      "writable": true,
      "maxLength": 4000,
      "autoComplete": "address-line1"
    },
    "hausnummer": {
      "key": "hausnummer",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Hausnummer",
      "writable": true,
      "maxLength": 4000
    },
    "plz": {
      "key": "plz",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Postleitzahl",
      "writable": true,
      "maxLength": 4000,
      "autoComplete": "postal-code"
    },
    "ort": {
      "key": "ort",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Ort",
      "writable": true,
      "maxLength": 4000,
      "autoComplete": "address-level2"
    },
    "branche": {
      "key": "branche",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Branche",
      "writable": true,
      "maxLength": 4000
    },
    "interne_bemerkung": {
      "key": "interne_bemerkung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Interne Bemerkung",
      "writable": true
    },
    "aktiv": {
      "key": "aktiv",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Aktiv",
      "writable": true
    }
  },
  "kundenanfragen": {
    "urspruengliche_kundenanforderungen": {
      "key": "urspruengliche_kundenanforderungen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Ursprüngliche Kundenanforderungen",
      "writable": true
    },
    "prioritaet": {
      "key": "prioritaet",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Priorität",
      "writable": true,
      "options": [
        "niedrig",
        "normal",
        "hoch",
        "kritisch"
      ]
    },
    "verantwortlicher": {
      "key": "verantwortlicher",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Verantwortlicher (Pflicht nach Übernahme)",
      "writable": true,
      "maxLength": 4000
    },
    "status": {
      "key": "status",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Status",
      "writable": true,
      "options": [
        "neu",
        "in_pruefung",
        "rueckfragen_offen",
        "fachliche_pruefung",
        "entscheidungsbedarf",
        "technisch_geklaert",
        "freigegeben",
        "abgelehnt",
        "zurueckgestellt"
      ]
    },
    "technischer_klaeraufwand": {
      "key": "technischer_klaeraufwand",
      "fulltype": "lookup/radio",
      "kind": "lookup",
      "required": false,
      "label": "Technischer Kläraufwand",
      "writable": true,
      "options": [
        "klein",
        "mittel",
        "hoch",
        "unbekannt"
      ]
    },
    "zieltermin_klaerung": {
      "key": "zieltermin_klaerung",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Zieltermin Klärung",
      "writable": true
    },
    "vollstaendigkeit": {
      "key": "vollstaendigkeit",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Vollständigkeit",
      "writable": true,
      "options": [
        "ungeprueft",
        "unvollstaendig",
        "in_klaerung",
        "vollstaendig_geprueft"
      ]
    },
    "hinweise_erneute_pruefung": {
      "key": "hinweise_erneute_pruefung",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erneute Prüfung erforderlich",
      "writable": true
    },
    "aktive_bearbeitungszeit_min": {
      "key": "aktive_bearbeitungszeit_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Aktive Bearbeitungszeit gemessen (Minuten)",
      "writable": true
    },
    "wartezeit_kunde_min": {
      "key": "wartezeit_kunde_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Wartezeit auf Kunde gemessen (Minuten)",
      "writable": true
    },
    "wartezeit_intern_min": {
      "key": "wartezeit_intern_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Interne Wartezeit gemessen (Minuten)",
      "writable": true
    },
    "nacharbeiten_anzahl": {
      "key": "nacharbeiten_anzahl",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Anzahl erforderlicher Nacharbeiten",
      "writable": true
    },
    "klaerung_abgeschlossen_am": {
      "key": "klaerung_abgeschlossen_am",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Technisch geklärt am",
      "writable": true
    },
    "anfragenummer": {
      "key": "anfragenummer",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Anfragenummer",
      "writable": true,
      "maxLength": 4000
    },
    "kunde": {
      "key": "kunde",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Kunde",
      "writable": true,
      "targetAppId": "6ad36e9eac6687d3c66ee837",
      "targetEntity": "kunden"
    },
    "eingangsdatum": {
      "key": "eingangsdatum",
      "fulltype": "date/date",
      "kind": "date",
      "required": true,
      "label": "Eingangsdatum",
      "writable": true
    },
    "eingangskanal": {
      "key": "eingangskanal",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Eingangskanal",
      "writable": true,
      "options": [
        "webformular",
        "telefon",
        "persoenlich",
        "bestandskunde",
        "sonstiger",
        "email"
      ]
    },
    "kundenreferenz": {
      "key": "kundenreferenz",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Kundenreferenz",
      "writable": true,
      "maxLength": 4000
    },
    "produkt_oder_produktfamilie": {
      "key": "produkt_oder_produktfamilie",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Produkt oder Produktfamilie",
      "writable": true,
      "maxLength": 4000
    },
    "produktvariante": {
      "key": "produktvariante",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Produktvariante",
      "writable": true,
      "maxLength": 4000
    },
    "gewuenschte_menge": {
      "key": "gewuenschte_menge",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Gewünschte Menge (größer als null)",
      "writable": true
    },
    "gewuenschter_liefertermin": {
      "key": "gewuenschter_liefertermin",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gewünschter Liefertermin",
      "writable": true
    },
    "anfragebeschreibung": {
      "key": "anfragebeschreibung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Anfragebeschreibung",
      "writable": true
    }
  },
  "abschluss_und_uebergabe": {
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "pruefdatum": {
      "key": "pruefdatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Prüfdatum",
      "writable": true
    },
    "geprueft_von": {
      "key": "geprueft_von",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Geprüft von",
      "writable": true,
      "maxLength": 4000
    },
    "anforderungen_geprueft": {
      "key": "anforderungen_geprueft",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Anforderungen geprüft",
      "writable": true
    },
    "kritische_punkte_geklaert": {
      "key": "kritische_punkte_geklaert",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Kritische Punkte geklärt",
      "writable": true
    },
    "erforderliche_entscheidungen_vorhanden": {
      "key": "erforderliche_entscheidungen_vorhanden",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erforderliche Entscheidungen vorhanden",
      "writable": true
    },
    "erforderliche_freigaben_vorhanden": {
      "key": "erforderliche_freigaben_vorhanden",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erforderliche Freigaben vorhanden",
      "writable": true
    },
    "verbleibende_abweichungen": {
      "key": "verbleibende_abweichungen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Verbleibende Abweichungen",
      "writable": true
    },
    "uebergabeempfaenger": {
      "key": "uebergabeempfaenger",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Übergabeempfänger",
      "writable": true,
      "maxLength": 4000
    },
    "uebergabestatus": {
      "key": "uebergabestatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Übergabestatus",
      "writable": true,
      "options": [
        "nicht_vorbereitet",
        "bereit",
        "uebergeben",
        "zurueckgewiesen"
      ]
    },
    "verbleibende_risiken": {
      "key": "verbleibende_risiken",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Verbleibende Risiken",
      "writable": true
    },
    "uebergabedatum": {
      "key": "uebergabedatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Übergabedatum",
      "writable": true
    },
    "zusammenfassung": {
      "key": "zusammenfassung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Zusammenfassung des technischen Auftragsentwurfs",
      "writable": true
    },
    "freigabestatus": {
      "key": "freigabestatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Technischer Freigabestatus (keine kaufmännische Freigabe)",
      "writable": true,
      "options": [
        "nicht_freigegeben",
        "freigegeben",
        "verweigert",
        "zurueckgestellt"
      ]
    }
  },
  "informationsquellen": {
    "quellentyp": {
      "key": "quellentyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Quellentyp",
      "writable": true,
      "options": [
        "email",
        "pdf",
        "office",
        "bild",
        "zeichnung",
        "cad",
        "webadresse",
        "gespraechsnotiz",
        "erp",
        "manuell",
        "sonstige"
      ]
    },
    "titel": {
      "key": "titel",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Titel",
      "writable": true,
      "maxLength": 4000
    },
    "datei": {
      "key": "datei",
      "fulltype": "file",
      "kind": "file",
      "required": false,
      "label": "Datei",
      "writable": false
    },
    "referenz_url": {
      "key": "referenz_url",
      "fulltype": "string/url",
      "kind": "url",
      "required": false,
      "label": "Webadresse oder Referenz",
      "writable": true,
      "autoComplete": "url"
    },
    "absender_oder_urheber": {
      "key": "absender_oder_urheber",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Absender oder Urheber",
      "writable": true,
      "maxLength": 4000
    },
    "quellendatum": {
      "key": "quellendatum",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Quellendatum",
      "writable": true
    },
    "eingangsdatum": {
      "key": "eingangsdatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Eingang",
      "writable": true
    },
    "versionskennung": {
      "key": "versionskennung",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Versionskennung",
      "writable": true,
      "maxLength": 4000
    },
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "quellenstatus": {
      "key": "quellenstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Quellenstatus",
      "writable": true,
      "options": [
        "aktuell",
        "ersetzt",
        "ungeprueft",
        "strittig",
        "ungueltig"
      ]
    },
    "zusammenfassung": {
      "key": "zusammenfassung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Inhaltliche Zusammenfassung",
      "writable": true
    },
    "extraktionsstatus": {
      "key": "extraktionsstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Extraktionsstatus",
      "writable": true,
      "options": [
        "nicht_verarbeitet",
        "in_bearbeitung",
        "extrahiert",
        "manuell_geprueft",
        "fehler"
      ]
    },
    "pruefung_durch": {
      "key": "pruefung_durch",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Prüfung durch",
      "writable": true,
      "maxLength": 4000
    },
    "pruefung_am": {
      "key": "pruefung_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Prüfung am",
      "writable": true
    },
    "erneute_pruefung_erforderlich": {
      "key": "erneute_pruefung_erforderlich",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erneute Prüfung abhängiger Punkte erforderlich",
      "writable": true
    },
    "bemerkung": {
      "key": "bemerkung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Bemerkung",
      "writable": true
    },
    "ersetzt_quelle": {
      "key": "ersetzt_quelle",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Ersetzt Quelle (Vorgängerversion)",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    }
  },
  "technische_anforderungen": {
    "quellen": {
      "key": "quellen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Quellen",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    },
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "bezeichnung": {
      "key": "bezeichnung",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Bezeichnung",
      "writable": true,
      "maxLength": 4000
    },
    "beschreibung": {
      "key": "beschreibung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Beschreibung",
      "writable": true
    },
    "anforderungstyp": {
      "key": "anforderungstyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Anforderungstyp",
      "writable": true,
      "options": [
        "abmessung",
        "material",
        "leistung",
        "funktion",
        "schnittstelle",
        "norm",
        "sicherheit",
        "umweltbedingung",
        "qualitaet",
        "liefertermin",
        "dokumentation",
        "sonstiges"
      ]
    },
    "ursprung": {
      "key": "ursprung",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Ursprung",
      "writable": true,
      "options": [
        "kundenangabe",
        "kundenunterlage",
        "interne_vorgabe",
        "ableitung",
        "erfahrungswissen",
        "ki_vorschlag"
      ]
    },
    "sollwert": {
      "key": "sollwert",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Sollwert",
      "writable": true,
      "maxLength": 4000
    },
    "einheit": {
      "key": "einheit",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Einheit",
      "writable": true,
      "maxLength": 4000
    },
    "vergleichsoperator": {
      "key": "vergleichsoperator",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Vergleichsoperator",
      "writable": true,
      "options": [
        "gleich",
        "groesser",
        "groesser_gleich",
        "kleiner",
        "kleiner_gleich",
        "zwischen"
      ]
    },
    "min_wert": {
      "key": "min_wert",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Mindestwert",
      "writable": true
    },
    "max_wert": {
      "key": "max_wert",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Höchstwert",
      "writable": true
    },
    "ist_pflichtanforderung": {
      "key": "ist_pflichtanforderung",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Pflichtanforderung",
      "writable": true
    },
    "pruefstatus": {
      "key": "pruefstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Prüfstatus",
      "writable": true,
      "options": [
        "ungeprueft",
        "zu_pruefen",
        "bestaetigt",
        "unklar",
        "widerspruechlich",
        "nicht_erfuellt",
        "nicht_anwendbar"
      ]
    },
    "begruendung_pruefstatus": {
      "key": "begruendung_pruefstatus",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Begründung Prüfstatus",
      "writable": true
    },
    "verantwortlicher": {
      "key": "verantwortlicher",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Verantwortlicher",
      "writable": true,
      "maxLength": 4000
    },
    "gueltig_ab": {
      "key": "gueltig_ab",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gültig ab",
      "writable": true
    },
    "gueltig_bis": {
      "key": "gueltig_bis",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gültig bis",
      "writable": true
    },
    "erneute_pruefung_erforderlich": {
      "key": "erneute_pruefung_erforderlich",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erneute Prüfung erforderlich",
      "writable": true
    },
    "letzte_aenderung": {
      "key": "letzte_aenderung",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Letzte Änderung",
      "writable": true
    }
  },
  "offene_punkte": {
    "betroffene_anforderungen": {
      "key": "betroffene_anforderungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene Anforderungen",
      "writable": true,
      "targetAppId": "6ad36ea764e9df6407f448a0",
      "targetEntity": "technische_anforderungen"
    },
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "kurztitel": {
      "key": "kurztitel",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Kurztitel",
      "writable": true,
      "maxLength": 4000
    },
    "beschreibung": {
      "key": "beschreibung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Beschreibung und Grund",
      "writable": true
    },
    "punktetyp": {
      "key": "punktetyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Punktetyp",
      "writable": true,
      "options": [
        "fehlende_information",
        "widerspruch",
        "technische_pruefung",
        "normenpruefung",
        "machbarkeit",
        "risiko",
        "rueckfrage",
        "freigabe",
        "sonstiges"
      ]
    },
    "prioritaet": {
      "key": "prioritaet",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Priorität",
      "writable": true,
      "options": [
        "niedrig",
        "normal",
        "hoch",
        "kritisch"
      ]
    },
    "auswirkung": {
      "key": "auswirkung",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Auswirkung",
      "writable": true,
      "options": [
        "qualitaet",
        "sicherheit",
        "funktion",
        "kosten",
        "termin",
        "herstellbarkeit",
        "normenkonformitaet",
        "sonstiges"
      ]
    },
    "zustaendige_rolle": {
      "key": "zustaendige_rolle",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Zuständige Rolle",
      "writable": true,
      "options": [
        "vertrieb",
        "konstruktion",
        "arbeitsvorbereitung",
        "qualitaetssicherung",
        "fertigung",
        "einkauf",
        "technische_leitung",
        "sonstige"
      ]
    },
    "verantwortlicher": {
      "key": "verantwortlicher",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Verantwortlicher",
      "writable": true,
      "maxLength": 4000
    },
    "faellig_am": {
      "key": "faellig_am",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Fällig am",
      "writable": true
    },
    "status": {
      "key": "status",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Status",
      "writable": true,
      "options": [
        "erledigt",
        "entschieden_akzeptiert",
        "nicht_mehr_relevant",
        "neu",
        "zugewiesen",
        "in_bearbeitung",
        "wartet_kunde",
        "wartet_intern",
        "zur_entscheidung"
      ]
    },
    "erledigungskriterium": {
      "key": "erledigungskriterium",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Erledigungskriterium",
      "writable": true
    },
    "antwort_geprueft": {
      "key": "antwort_geprueft",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Antwort geprüft",
      "writable": true
    },
    "erneute_pruefung_erforderlich": {
      "key": "erneute_pruefung_erforderlich",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erneute Prüfung erforderlich",
      "writable": true
    },
    "loesung_oder_ergebnis": {
      "key": "loesung_oder_ergebnis",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Lösung oder Ergebnis (Pflicht beim Abschluss)",
      "writable": true
    },
    "abgeschlossen_am": {
      "key": "abgeschlossen_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Abgeschlossen am",
      "writable": true
    },
    "abschluss_durch": {
      "key": "abschluss_durch",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Abschluss durch",
      "writable": true,
      "maxLength": 4000
    },
    "betroffene_quellen": {
      "key": "betroffene_quellen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene Quellen",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    }
  },
  "aufgaben": {
    "offener_punkt": {
      "key": "offener_punkt",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Offener Punkt",
      "writable": true,
      "targetAppId": "6ad36ea8867261833e338f1b",
      "targetEntity": "offene_punkte"
    },
    "abhaengige_aufgaben": {
      "key": "abhaengige_aufgaben",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Abhängig von Aufgaben",
      "writable": true,
      "targetAppId": "6ad36ea9809c835435cef8c1",
      "targetEntity": "aufgaben"
    },
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "titel": {
      "key": "titel",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Titel",
      "writable": true,
      "maxLength": 4000
    },
    "beschreibung": {
      "key": "beschreibung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Beschreibung und erwartetes Ergebnis",
      "writable": true
    },
    "aufgabentyp": {
      "key": "aufgabentyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Aufgabentyp",
      "writable": true,
      "options": [
        "technische_bewertung",
        "kundenrueckfrage",
        "interne_rueckfrage",
        "normenpruefung",
        "machbarkeitspruefung",
        "dokumentation",
        "entscheidung_vorbereiten",
        "freigabepruefung",
        "sonstiges",
        "informationspruefung"
      ]
    },
    "verantwortlicher": {
      "key": "verantwortlicher",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Verantwortlicher",
      "writable": true,
      "maxLength": 4000
    },
    "mitwirkende": {
      "key": "mitwirkende",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Mitwirkende",
      "writable": true,
      "maxLength": 4000
    },
    "prioritaet": {
      "key": "prioritaet",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Priorität",
      "writable": true,
      "options": [
        "niedrig",
        "normal",
        "hoch",
        "kritisch"
      ]
    },
    "status": {
      "key": "status",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Status",
      "writable": true,
      "options": [
        "offen",
        "in_bearbeitung",
        "blockiert",
        "wartet_antwort",
        "erledigt",
        "abgebrochen"
      ]
    },
    "faellig_am": {
      "key": "faellig_am",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Fällig am",
      "writable": true
    },
    "blockierungsgrund": {
      "key": "blockierungsgrund",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Blockierungsgrund und nächster Schritt",
      "writable": true
    },
    "ergebnis": {
      "key": "ergebnis",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Ergebnis",
      "writable": true
    },
    "aktive_zeit_min": {
      "key": "aktive_zeit_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Aktive Bearbeitungszeit gemessen (Minuten)",
      "writable": true
    },
    "wartezeit_min": {
      "key": "wartezeit_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Wartezeit gemessen (Minuten)",
      "writable": true
    },
    "abgeschlossen_am": {
      "key": "abgeschlossen_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Abgeschlossen am",
      "writable": true
    }
  },
  "beurteilungen": {
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "beurteilungsgegenstand": {
      "key": "beurteilungsgegenstand",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Beurteilungsgegenstand",
      "writable": true,
      "maxLength": 4000
    },
    "beurteilungsart": {
      "key": "beurteilungsart",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Beurteilungsart",
      "writable": true,
      "options": [
        "machbarkeit",
        "vollstaendigkeit",
        "risiko",
        "qualitaet",
        "normenkonformitaet",
        "termin",
        "kostenwirkung",
        "herstellbarkeit",
        "sonstiges"
      ]
    },
    "fachliche_begruendung": {
      "key": "fachliche_begruendung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Fachliche Begründung",
      "writable": true
    },
    "annahmen": {
      "key": "annahmen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Annahmen",
      "writable": true
    },
    "einschaetzung": {
      "key": "einschaetzung",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Einschätzung",
      "writable": true,
      "options": [
        "positiv",
        "bedingt_positiv",
        "negativ",
        "unklar",
        "nicht_anwendbar"
      ]
    },
    "unsicherheiten": {
      "key": "unsicherheiten",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Unsicherheiten",
      "writable": true
    },
    "alternativen": {
      "key": "alternativen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Alternativen",
      "writable": true
    },
    "empfehlung": {
      "key": "empfehlung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Empfehlung",
      "writable": true
    },
    "ist_ki_vorschlag": {
      "key": "ist_ki_vorschlag",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "KI-Vorschlag",
      "writable": true
    },
    "erstellt_von": {
      "key": "erstellt_von",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Erstellt von",
      "writable": true,
      "maxLength": 4000
    },
    "erstellt_am": {
      "key": "erstellt_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Erstellt am",
      "writable": true
    },
    "pruefstatus": {
      "key": "pruefstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Prüfstatus",
      "writable": true,
      "options": [
        "entwurf",
        "fachlich_geprueft",
        "bestaetigt",
        "ueberholt"
      ]
    },
    "geprueft_von": {
      "key": "geprueft_von",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Geprüft von",
      "writable": true,
      "maxLength": 4000
    },
    "geprueft_am": {
      "key": "geprueft_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Geprüft am",
      "writable": true
    },
    "erneute_pruefung_erforderlich": {
      "key": "erneute_pruefung_erforderlich",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Erneute Prüfung erforderlich",
      "writable": true
    },
    "betroffene_anforderungen": {
      "key": "betroffene_anforderungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene Anforderungen",
      "writable": true,
      "targetAppId": "6ad36ea764e9df6407f448a0",
      "targetEntity": "technische_anforderungen"
    },
    "betroffene_offene_punkte": {
      "key": "betroffene_offene_punkte",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene offene Punkte",
      "writable": true,
      "targetAppId": "6ad36ea8867261833e338f1b",
      "targetEntity": "offene_punkte"
    },
    "zugrunde_liegende_quellen": {
      "key": "zugrunde_liegende_quellen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Zugrunde liegende Quellen",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    },
    "zugrunde_liegende_anforderungen": {
      "key": "zugrunde_liegende_anforderungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Zugrunde liegende Anforderungen",
      "writable": true,
      "targetAppId": "6ad36ea764e9df6407f448a0",
      "targetEntity": "technische_anforderungen"
    }
  },
  "rueckfragen_und_kommunikation": {
    "offener_punkt": {
      "key": "offener_punkt",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Hauptsächlicher offener Punkt",
      "writable": true,
      "targetAppId": "6ad36ea8867261833e338f1b",
      "targetEntity": "offene_punkte"
    },
    "zugehoerige_offene_punkte": {
      "key": "zugehoerige_offene_punkte",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Weitere zugehörige offene Punkte",
      "writable": true,
      "targetAppId": "6ad36ea8867261833e338f1b",
      "targetEntity": "offene_punkte"
    },
    "beantwortete_kommunikation": {
      "key": "beantwortete_kommunikation",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Antwort auf Rückfrage",
      "writable": true,
      "targetAppId": "6ad36eaae7395e6b718022a5",
      "targetEntity": "rueckfragen_und_kommunikation"
    },
    "quelle": {
      "key": "quelle",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Zugehörige Quelle",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    },
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "kommunikationstyp": {
      "key": "kommunikationstyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Kommunikationstyp",
      "writable": true,
      "options": [
        "interne_anfrage",
        "antwort",
        "information",
        "eskalation",
        "gespraechsprotokoll",
        "kundenrueckfrage"
      ]
    },
    "kanal": {
      "key": "kanal",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Kanal",
      "writable": true,
      "options": [
        "email",
        "telefon",
        "besprechung",
        "chat",
        "persoenlich",
        "sonstiges"
      ]
    },
    "absender": {
      "key": "absender",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Absender",
      "writable": true,
      "maxLength": 4000
    },
    "empfaenger": {
      "key": "empfaenger",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Empfänger",
      "writable": true,
      "maxLength": 4000
    },
    "betreff": {
      "key": "betreff",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Betreff",
      "writable": true,
      "maxLength": 4000
    },
    "inhalt": {
      "key": "inhalt",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Inhalt (Entwurf oder Wortlaut)",
      "writable": true
    },
    "versandstatus": {
      "key": "versandstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Versandstatus (Entwurf ist kein Versand)",
      "writable": true,
      "options": [
        "entwurf",
        "zur_pruefung",
        "freigegeben",
        "versendet",
        "fehlgeschlagen",
        "nicht_erforderlich"
      ]
    },
    "versanddatum": {
      "key": "versanddatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Tatsächlich versendet am",
      "writable": true
    },
    "antwort_erwartet_bis": {
      "key": "antwort_erwartet_bis",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Antwort erwartet bis",
      "writable": true
    },
    "antwort_erhalten_am": {
      "key": "antwort_erhalten_am",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Antwort erhalten am",
      "writable": true
    },
    "antwortstatus": {
      "key": "antwortstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Antwortstatus",
      "writable": true,
      "options": [
        "offen",
        "teilweise",
        "beantwortet",
        "unklar",
        "widerspruechlich"
      ]
    },
    "notizen": {
      "key": "notizen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Notizen",
      "writable": true
    }
  },
  "entscheidungen": {
    "anfrage": {
      "key": "anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "titel": {
      "key": "titel",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Titel",
      "writable": true,
      "maxLength": 4000
    },
    "entscheidungsgegenstand": {
      "key": "entscheidungsgegenstand",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Entscheidungsgegenstand",
      "writable": true
    },
    "entscheidungstyp": {
      "key": "entscheidungstyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Entscheidungstyp",
      "writable": true,
      "options": [
        "technische_freigabe",
        "abweichung_akzeptieren",
        "alternative",
        "anforderung_aendern",
        "risiko_akzeptieren",
        "rueckfrage_abschliessen",
        "ablehnung",
        "eskalation",
        "sonstiges"
      ]
    },
    "alternativen": {
      "key": "alternativen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Alternativen",
      "writable": true
    },
    "entscheidung": {
      "key": "entscheidung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Entscheidung",
      "writable": true
    },
    "begruendung": {
      "key": "begruendung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Begründung",
      "writable": true
    },
    "entscheidungsverantwortlicher": {
      "key": "entscheidungsverantwortlicher",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Entscheidungsverantwortlicher",
      "writable": true,
      "maxLength": 4000
    },
    "entscheidungskompetenz_geprueft": {
      "key": "entscheidungskompetenz_geprueft",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Entscheidungskompetenz geprüft",
      "writable": true
    },
    "entscheidungsstatus": {
      "key": "entscheidungsstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Entscheidungsstatus",
      "writable": true,
      "options": [
        "vorbereitung",
        "zur_entscheidung",
        "entschieden",
        "zurueckgestellt",
        "ersetzt"
      ]
    },
    "entscheidungsdatum": {
      "key": "entscheidungsdatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Entscheidungsdatum",
      "writable": true
    },
    "auflagen": {
      "key": "auflagen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Auflagen",
      "writable": true
    },
    "gueltig_bis": {
      "key": "gueltig_bis",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gültig bis",
      "writable": true
    },
    "ergebnis": {
      "key": "ergebnis",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Ergebnis",
      "writable": true
    },
    "betroffene_anforderungen": {
      "key": "betroffene_anforderungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene Anforderungen",
      "writable": true,
      "targetAppId": "6ad36ea764e9df6407f448a0",
      "targetEntity": "technische_anforderungen"
    },
    "betroffene_offene_punkte": {
      "key": "betroffene_offene_punkte",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Betroffene offene Punkte",
      "writable": true,
      "targetAppId": "6ad36ea8867261833e338f1b",
      "targetEntity": "offene_punkte"
    },
    "zugrunde_liegende_beurteilungen": {
      "key": "zugrunde_liegende_beurteilungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Zugrunde liegende Beurteilungen",
      "writable": true,
      "targetAppId": "6ad36ea9526e7f9d341bc8ff",
      "targetEntity": "beurteilungen"
    },
    "ersetzt_durch_entscheidung": {
      "key": "ersetzt_durch_entscheidung",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": false,
      "label": "Ersetzt durch Entscheidung",
      "writable": true,
      "targetAppId": "6ad36eaa7a6c94e718236860",
      "targetEntity": "entscheidungen"
    }
  },
  "erfahrungen_und_erkenntnisse": {
    "belegquellen": {
      "key": "belegquellen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Belegquellen",
      "writable": true,
      "targetAppId": "6ad36ea795457907d694b846",
      "targetEntity": "informationsquellen"
    },
    "belegbeurteilungen": {
      "key": "belegbeurteilungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Belegbeurteilungen",
      "writable": true,
      "targetAppId": "6ad36ea9526e7f9d341bc8ff",
      "targetEntity": "beurteilungen"
    },
    "belegentscheidungen": {
      "key": "belegentscheidungen",
      "fulltype": "multipleapplookup/select",
      "kind": "multirecord",
      "required": false,
      "label": "Belegentscheidungen",
      "writable": true,
      "targetAppId": "6ad36eaa7a6c94e718236860",
      "targetEntity": "entscheidungen"
    },
    "titel": {
      "key": "titel",
      "fulltype": "string/text",
      "kind": "text",
      "required": true,
      "label": "Titel",
      "writable": true,
      "maxLength": 4000
    },
    "sachverhalt": {
      "key": "sachverhalt",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": true,
      "label": "Sachverhalt",
      "writable": true
    },
    "erfahrungstyp": {
      "key": "erfahrungstyp",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Erfahrungstyp",
      "writable": true,
      "options": [
        "erfahrung",
        "annahme",
        "experiment",
        "wirkung",
        "bewaehrt",
        "beobachtung"
      ]
    },
    "produkt_oder_produktfamilie": {
      "key": "produkt_oder_produktfamilie",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Produkt oder Produktfamilie",
      "writable": true,
      "maxLength": 4000
    },
    "anforderungstyp": {
      "key": "anforderungstyp",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Anforderungstyp oder technisches Merkmal",
      "writable": true,
      "maxLength": 4000
    },
    "schlagwoerter": {
      "key": "schlagwoerter",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Schlagwörter",
      "writable": true,
      "maxLength": 4000
    },
    "ursprungs_anfrage": {
      "key": "ursprungs_anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Ursprungsanfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "urspruengliches_problem": {
      "key": "urspruengliches_problem",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Ursprüngliches Problem",
      "writable": true
    },
    "vorgehen": {
      "key": "vorgehen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Vorgehen",
      "writable": true
    },
    "beobachtetes_ergebnis": {
      "key": "beobachtetes_ergebnis",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Beobachtetes Ergebnis",
      "writable": true
    },
    "erkenntnis": {
      "key": "erkenntnis",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Erkenntnis",
      "writable": true
    },
    "gueltigkeitsbedingungen": {
      "key": "gueltigkeitsbedingungen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Gültigkeitsbedingungen",
      "writable": true
    },
    "bekannte_grenzen": {
      "key": "bekannte_grenzen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Bekannte Grenzen",
      "writable": true
    },
    "risiko_der_uebertragung": {
      "key": "risiko_der_uebertragung",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Risiko der Übertragung",
      "writable": true,
      "options": [
        "niedrig",
        "mittel",
        "hoch",
        "unbekannt"
      ]
    },
    "bestaetigungsstatus": {
      "key": "bestaetigungsstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Bestätigungsstatus",
      "writable": true,
      "options": [
        "ungeprueft",
        "vorlaeufig",
        "fachlich_bestaetigt",
        "wiederholt_bestaetigt",
        "widerlegt",
        "ueberholt"
      ]
    },
    "bestaetigt_von": {
      "key": "bestaetigt_von",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Bestätigt von",
      "writable": true,
      "maxLength": 4000
    },
    "bestaetigt_am": {
      "key": "bestaetigt_am",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Bestätigt am",
      "writable": true
    },
    "gueltig_ab": {
      "key": "gueltig_ab",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gültig ab",
      "writable": true
    },
    "gueltig_bis": {
      "key": "gueltig_bis",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Gültig bis",
      "writable": true
    },
    "wiederverwendungsstatus": {
      "key": "wiederverwendungsstatus",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Wiederverwendungsstatus",
      "writable": true,
      "options": [
        "nicht_geprueft",
        "verfuegbar",
        "nur_hinweis",
        "nicht_mehr"
      ]
    },
    "kommentar_zur_wiederverwendung": {
      "key": "kommentar_zur_wiederverwendung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Kommentar zur Wiederverwendung",
      "writable": true
    }
  },
  "wiederverwendung_von_erfahrungen": {
    "aufwandsersparnis_schaetzung_min": {
      "key": "aufwandsersparnis_schaetzung_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Geschätzte Aufwandsersparnis (Minuten)",
      "writable": true
    },
    "tatsaechliche_aufwandsersparnis_min": {
      "key": "tatsaechliche_aufwandsersparnis_min",
      "fulltype": "number",
      "kind": "number",
      "required": false,
      "label": "Tatsächlich beobachtete Aufwandsersparnis (Minuten)",
      "writable": true
    },
    "negative_folgen": {
      "key": "negative_folgen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Negative Folgen oder Fehlübertragung",
      "writable": true
    },
    "bewertet_am": {
      "key": "bewertet_am",
      "fulltype": "date/date",
      "kind": "date",
      "required": false,
      "label": "Bewertet am",
      "writable": true
    },
    "ziel_anfrage": {
      "key": "ziel_anfrage",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Spätere Anfrage",
      "writable": true,
      "targetAppId": "6ad36ea588ea187cc38149b6",
      "targetEntity": "kundenanfragen"
    },
    "abrufdatum": {
      "key": "abrufdatum",
      "fulltype": "date/datetimeminute",
      "kind": "datetime",
      "required": false,
      "label": "Abrufdatum",
      "writable": true
    },
    "abrufgrund": {
      "key": "abrufgrund",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Abrufgrund",
      "writable": true
    },
    "aehnlichkeitseinschaetzung": {
      "key": "aehnlichkeitseinschaetzung",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Ähnlichkeitseinschätzung",
      "writable": true,
      "options": [
        "hoch",
        "mittel",
        "niedrig",
        "unklar"
      ]
    },
    "kontextunterschiede": {
      "key": "kontextunterschiede",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Kontextunterschiede",
      "writable": true
    },
    "gueltigkeit_geprueft": {
      "key": "gueltigkeit_geprueft",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Gültigkeit geprüft",
      "writable": true
    },
    "geprueft_von": {
      "key": "geprueft_von",
      "fulltype": "string/text",
      "kind": "text",
      "required": false,
      "label": "Geprüft von",
      "writable": true,
      "maxLength": 4000
    },
    "verwendungsergebnis": {
      "key": "verwendungsergebnis",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Verwendungsergebnis",
      "writable": true,
      "options": [
        "verwendet",
        "teilweise",
        "nicht_verwendet",
        "ungeeignet"
      ]
    },
    "begruendung": {
      "key": "begruendung",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Begründung",
      "writable": true
    },
    "beobachteter_nutzen": {
      "key": "beobachteter_nutzen",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Beobachteter Nutzen",
      "writable": true
    },
    "erfahrung": {
      "key": "erfahrung",
      "fulltype": "applookup/select",
      "kind": "record",
      "required": true,
      "label": "Erfahrung",
      "writable": true,
      "targetAppId": "6ad36eab3feb7a28c86eba9d",
      "targetEntity": "erfahrungen_und_erkenntnisse"
    }
  }
};

export const SHAPES: Record<EntityKey, Shape[]> = {
  "kunden": [],
  "kundenanfragen": [
    {
      "kind": "choice",
      "field": "prioritaet",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "technischer_klaeraufwand",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "vollstaendigkeit",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "eingangskanal",
      "count": 6
    },
    {
      "kind": "record",
      "field": "kunde",
      "targetEntity": "kunden"
    }
  ],
  "abschluss_und_uebergabe": [
    {
      "kind": "choice",
      "field": "uebergabestatus",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "freigabestatus",
      "count": 4
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    }
  ],
  "informationsquellen": [
    {
      "kind": "choice",
      "field": "quellenstatus",
      "count": 5
    },
    {
      "kind": "choice",
      "field": "extraktionsstatus",
      "count": 5
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    },
    {
      "kind": "record",
      "field": "ersetzt_quelle",
      "targetEntity": "informationsquellen"
    }
  ],
  "technische_anforderungen": [
    {
      "kind": "choice",
      "field": "ursprung",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "vergleichsoperator",
      "count": 6
    },
    {
      "kind": "record",
      "field": "quellen",
      "targetEntity": "informationsquellen"
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    }
  ],
  "offene_punkte": [
    {
      "kind": "choice",
      "field": "prioritaet",
      "count": 4
    },
    {
      "kind": "record",
      "field": "betroffene_anforderungen",
      "targetEntity": "technische_anforderungen"
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    },
    {
      "kind": "record",
      "field": "betroffene_quellen",
      "targetEntity": "informationsquellen"
    }
  ],
  "aufgaben": [
    {
      "kind": "choice",
      "field": "prioritaet",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "status",
      "count": 6
    },
    {
      "kind": "record",
      "field": "offener_punkt",
      "targetEntity": "offene_punkte"
    },
    {
      "kind": "record",
      "field": "abhaengige_aufgaben",
      "targetEntity": "aufgaben"
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    }
  ],
  "beurteilungen": [
    {
      "kind": "choice",
      "field": "einschaetzung",
      "count": 5
    },
    {
      "kind": "choice",
      "field": "pruefstatus",
      "count": 4
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    },
    {
      "kind": "record",
      "field": "betroffene_anforderungen",
      "targetEntity": "technische_anforderungen"
    },
    {
      "kind": "record",
      "field": "betroffene_offene_punkte",
      "targetEntity": "offene_punkte"
    },
    {
      "kind": "record",
      "field": "zugrunde_liegende_quellen",
      "targetEntity": "informationsquellen"
    },
    {
      "kind": "record",
      "field": "zugrunde_liegende_anforderungen",
      "targetEntity": "technische_anforderungen"
    }
  ],
  "rueckfragen_und_kommunikation": [
    {
      "kind": "choice",
      "field": "kommunikationstyp",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "kanal",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "versandstatus",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "antwortstatus",
      "count": 5
    },
    {
      "kind": "record",
      "field": "offener_punkt",
      "targetEntity": "offene_punkte"
    },
    {
      "kind": "record",
      "field": "zugehoerige_offene_punkte",
      "targetEntity": "offene_punkte"
    },
    {
      "kind": "record",
      "field": "beantwortete_kommunikation",
      "targetEntity": "rueckfragen_und_kommunikation"
    },
    {
      "kind": "record",
      "field": "quelle",
      "targetEntity": "informationsquellen"
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    }
  ],
  "entscheidungen": [
    {
      "kind": "choice",
      "field": "entscheidungsstatus",
      "count": 5
    },
    {
      "kind": "record",
      "field": "anfrage",
      "targetEntity": "kundenanfragen"
    },
    {
      "kind": "record",
      "field": "betroffene_anforderungen",
      "targetEntity": "technische_anforderungen"
    },
    {
      "kind": "record",
      "field": "betroffene_offene_punkte",
      "targetEntity": "offene_punkte"
    },
    {
      "kind": "record",
      "field": "zugrunde_liegende_beurteilungen",
      "targetEntity": "beurteilungen"
    },
    {
      "kind": "record",
      "field": "ersetzt_durch_entscheidung",
      "targetEntity": "entscheidungen"
    }
  ],
  "erfahrungen_und_erkenntnisse": [
    {
      "kind": "choice",
      "field": "erfahrungstyp",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "risiko_der_uebertragung",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "bestaetigungsstatus",
      "count": 6
    },
    {
      "kind": "choice",
      "field": "wiederverwendungsstatus",
      "count": 4
    },
    {
      "kind": "record",
      "field": "belegquellen",
      "targetEntity": "informationsquellen"
    },
    {
      "kind": "record",
      "field": "belegbeurteilungen",
      "targetEntity": "beurteilungen"
    },
    {
      "kind": "record",
      "field": "belegentscheidungen",
      "targetEntity": "entscheidungen"
    },
    {
      "kind": "record",
      "field": "ursprungs_anfrage",
      "targetEntity": "kundenanfragen"
    }
  ],
  "wiederverwendung_von_erfahrungen": [
    {
      "kind": "choice",
      "field": "aehnlichkeitseinschaetzung",
      "count": 4
    },
    {
      "kind": "choice",
      "field": "verwendungsergebnis",
      "count": 4
    },
    {
      "kind": "record",
      "field": "ziel_anfrage",
      "targetEntity": "kundenanfragen"
    },
    {
      "kind": "record",
      "field": "erfahrung",
      "targetEntity": "erfahrungen_und_erkenntnisse"
    }
  ]
};

/** The fields a record of this entity is recognised by (a person: first and
 *  last name; else its title-like text field) — the same choice the dashboard's
 *  enrichment makes for `<key>Name`. `useRecordSearch` resolves an applookup to
 *  this name (`ctx.ref('gast')` in `toItem`). */
export const DISPLAY_FIELDS: Record<EntityKey, string[]> = {
  "kunden": [
    "kundennummer"
  ],
  "kundenanfragen": [
    "anfragenummer"
  ],
  "abschluss_und_uebergabe": [
    "geprueft_von"
  ],
  "informationsquellen": [
    "titel"
  ],
  "technische_anforderungen": [
    "bezeichnung"
  ],
  "offene_punkte": [
    "kurztitel"
  ],
  "aufgaben": [
    "titel"
  ],
  "beurteilungen": [
    "beurteilungsgegenstand"
  ],
  "rueckfragen_und_kommunikation": [
    "absender"
  ],
  "entscheidungen": [
    "titel"
  ],
  "erfahrungen_und_erkenntnisse": [
    "titel"
  ],
  "wiederverwendung_von_erfahrungen": [
    "negative_folgen"
  ]
};

/** The display name of a record: its display fields joined, else the first
 *  non-empty text value, else ''. */
/** A display-field value as text: strings as they are, a lookup `{ key, label }`
 *  (either door hydrates lookups to objects) by its label — an entity whose
 *  only title-like field is a lookup/select otherwise had no name at all. */
function displayPart(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object' && 'label' in v) {
    const l = (v as { label?: unknown }).label;
    return l === null || l === undefined ? '' : String(l).trim();
  }
  return '';
}

export function displayNameOf(entity: EntityKey, fields: Record<string, unknown>): string {
  const parts = (DISPLAY_FIELDS[entity] ?? [])
    .map(k => displayPart(fields[k]))
    .filter(v => v !== '');
  if (parts.length > 0) return parts.join(' ');
  for (const [k, rule] of Object.entries(FIELD_RULES[entity] ?? {})) {
    if (rule.kind !== 'text' && rule.kind !== 'email') continue;
    const v = fields[k];
    if (typeof v === 'string' && v.trim() !== '') return v.trim();
  }
  return '';
}

export function ruleOf(entity: EntityKey, key: string): FieldRule | undefined {
  return FIELD_RULES[entity]?.[key];
}

/** The field label as the user sees it — the owner's policy label first (a
 *  public page's "Felder anpassen"), runtime bundle second, generated label last. */
export function labelOf(entity: EntityKey, key: string): string {
  const own = policyLabel(entity, key);
  if (own) return own;
  const fromBundle = fieldLabel(entity, key);
  if (fromBundle !== key) return fromBundle;
  return ruleOf(entity, key)?.label ?? key;
}

export function entityLabel(entity: EntityKey): string {
  const fromBundle = appLabel(entity);
  if (fromBundle !== entity) return fromBundle;
  return ENTITIES[entity]?.label ?? entity;
}

/** Lookup options with runtime labels — the only legitimate source of `{key,label}` pairs. */
export function optionsOf(entity: EntityKey, key: string): Array<{ key: string; label: string }> {
  const generated = (LOOKUP_OPTIONS as Record<string, Record<string, Array<{ key: string; label: string }>>>)[entity]?.[key];
  if (generated && generated.length) return generated.map(o => ({ key: o.key, label: o.label }));
  const keys = ruleOf(entity, key)?.options ?? [];
  return keys.map(k => ({ key: k, label: lookupLabel(entity, key, k) ?? k }));
}

export function isEmptyValue(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object' && 'from' in (v as object) && 'to' in (v as object)) {
    const r = v as { from: unknown; to: unknown };
    return isEmptyValue(r.from) && isEmptyValue(r.to);
  }
  return false;
}
