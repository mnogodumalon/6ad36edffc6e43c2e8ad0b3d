import type { AbschlussUndUebergabe, Aufgaben, Beurteilungen, Entscheidungen, ErfahrungenUndErkenntnisse, Informationsquellen, Kundenanfragen, OffenePunkte, RueckfragenUndKommunikation, TechnischeAnforderungen, WiederverwendungVonErfahrungen } from './app';

export type EnrichedKundenanfragen = Kundenanfragen & {
  kundeName: string;
};

export type EnrichedAbschlussUndUebergabe = AbschlussUndUebergabe & {
  anfrageName: string;
};

export type EnrichedInformationsquellen = Informationsquellen & {
  anfrageName: string;
  ersetzt_quelleName: string;
};

export type EnrichedTechnischeAnforderungen = TechnischeAnforderungen & {
  quellenName: string;
  anfrageName: string;
};

export type EnrichedOffenePunkte = OffenePunkte & {
  betroffene_anforderungenName: string;
  anfrageName: string;
  betroffene_quellenName: string;
};

export type EnrichedAufgaben = Aufgaben & {
  offener_punktName: string;
  abhaengige_aufgabenName: string;
  anfrageName: string;
};

export type EnrichedBeurteilungen = Beurteilungen & {
  anfrageName: string;
  betroffene_anforderungenName: string;
  betroffene_offene_punkteName: string;
  zugrunde_liegende_quellenName: string;
  zugrunde_liegende_anforderungenName: string;
};

export type EnrichedRueckfragenUndKommunikation = RueckfragenUndKommunikation & {
  offener_punktName: string;
  zugehoerige_offene_punkteName: string;
  beantwortete_kommunikationName: string;
  quelleName: string;
  anfrageName: string;
};

export type EnrichedEntscheidungen = Entscheidungen & {
  anfrageName: string;
  betroffene_anforderungenName: string;
  betroffene_offene_punkteName: string;
  zugrunde_liegende_beurteilungenName: string;
  ersetzt_durch_entscheidungName: string;
};

export type EnrichedErfahrungenUndErkenntnisse = ErfahrungenUndErkenntnisse & {
  belegquellenName: string;
  belegbeurteilungenName: string;
  belegentscheidungenName: string;
  ursprungs_anfrageName: string;
};

export type EnrichedWiederverwendungVonErfahrungen = WiederverwendungVonErfahrungen & {
  ziel_anfrageName: string;
  erfahrungName: string;
};
