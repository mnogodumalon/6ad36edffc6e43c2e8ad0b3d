import type { Entscheidungen, Kundenanfragen, TechnischeAnforderungen, OffenePunkte, Beurteilungen, ErfahrungenUndErkenntnisse } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { SatelliteSection } from '@/components/SatelliteSection';
import { usePermissions } from '@/lib/permissions';

export interface EntscheidungenDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: Entscheidungen;
  /** N:1-Ziel „Kundenanfragen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  kundenanfragenList: Kundenanfragen[];
  /** Klick auf die Kundenanfragen-Relation → overlay.push auf dessen Detail. */
  onOpenKundenanfragen?: (record: Kundenanfragen) => void;
  /** N:1-Ziel „TechnischeAnforderungen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  technischeAnforderungenList: TechnischeAnforderungen[];
  /** Reserviert — TechnischeAnforderungen ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenTechnischeAnforderungen?: (record: TechnischeAnforderungen) => void;
  /** N:1-Ziel „OffenePunkte": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  offenePunkteList: OffenePunkte[];
  /** Reserviert — OffenePunkte ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenOffenePunkte?: (record: OffenePunkte) => void;
  /** N:1-Ziel „Beurteilungen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  beurteilungenList: Beurteilungen[];
  /** Reserviert — Beurteilungen ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenBeurteilungen?: (record: Beurteilungen) => void;
  /** N:1-Ziel „Entscheidungen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  entscheidungenList: Entscheidungen[];
  /** Klick auf die Entscheidungen-Relation → overlay.push auf dessen Detail. */
  onOpenEntscheidungen?: (record: Entscheidungen) => void;
  /** 1:N „Erfahrungen und Erkenntnisse" (belegentscheidungen): VOLLE Liste — der Block filtert auf diesen Record. */
  erfahrungenUndErkenntnisseList: ErfahrungenUndErkenntnisse[];
  /** Zeilen-Klick → overlay.push auf das ErfahrungenUndErkenntnisse-Detail (nie der Edit-Dialog). */
  onOpenErfahrungenUndErkenntnisse: (record: ErfahrungenUndErkenntnisse) => void;
  /** Kontextuelles „+": öffnet den ErfahrungenUndErkenntnisse-Dialog mit diesem Record vorgesetzt. */
  onAddErfahrungenUndErkenntnisse?: () => void;
  /** „Vorhandene wählen": Listenfeld-Rückbezug — hängt diesen Record an einen bestehenden ErfahrungenUndErkenntnisse-Datensatz. */
  onPickErfahrungenUndErkenntnisse?: () => void;
}

export function EntscheidungenDetails({
  record,
  kundenanfragenList,
  onOpenKundenanfragen,
  technischeAnforderungenList,
  offenePunkteList,
  beurteilungenList,
  entscheidungenList,
  onOpenEntscheidungen,
  erfahrungenUndErkenntnisseList,
  onOpenErfahrungenUndErkenntnisse,
  onAddErfahrungenUndErkenntnisse,
  onPickErfahrungenUndErkenntnisse,
}: EntscheidungenDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  const anfrageTarget = kundenanfragenList.find(r => r.record_id === extractRecordId(record.fields.anfrage));
  const ersetzt_durch_entscheidungTarget = entscheidungenList.find(r => r.record_id === extractRecordId(record.fields.ersetzt_durch_entscheidung));
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('entscheidungen', 'titel')} value={record.fields.titel} format="text" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungsgegenstand')} value={record.fields.entscheidungsgegenstand} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungstyp')} value={record.fields.entscheidungstyp} format="pill" />
        <RecordField label={fieldLabel('entscheidungen', 'alternativen')} value={record.fields.alternativen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidung')} value={record.fields.entscheidung} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'begruendung')} value={record.fields.begruendung} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungsverantwortlicher')} value={record.fields.entscheidungsverantwortlicher} format="text" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungskompetenz_geprueft')} value={record.fields.entscheidungskompetenz_geprueft} format="bool" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungsstatus')} value={record.fields.entscheidungsstatus} format="pill" />
        <RecordField label={fieldLabel('entscheidungen', 'entscheidungsdatum')} value={record.fields.entscheidungsdatum} format="datetime" />
        <RecordField label={fieldLabel('entscheidungen', 'auflagen')} value={record.fields.auflagen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'gueltig_bis')} value={record.fields.gueltig_bis} format="date" />
        <RecordField label={fieldLabel('entscheidungen', 'ergebnis')} value={record.fields.ergebnis} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('entscheidungen', 'betroffene_anforderungen')} value={Array.isArray(record.fields.betroffene_anforderungen) ? record.fields.betroffene_anforderungen.map((u: unknown) => technischeAnforderungenList.find(t => t.record_id === extractRecordId(u))?.fields.bezeichnung ?? '—').join(', ') : null} format="text" />
        <RecordField label={fieldLabel('entscheidungen', 'betroffene_offene_punkte')} value={Array.isArray(record.fields.betroffene_offene_punkte) ? record.fields.betroffene_offene_punkte.map((u: unknown) => offenePunkteList.find(t => t.record_id === extractRecordId(u))?.fields.kurztitel ?? '—').join(', ') : null} format="text" />
        <RecordField label={fieldLabel('entscheidungen', 'zugrunde_liegende_beurteilungen')} value={Array.isArray(record.fields.zugrunde_liegende_beurteilungen) ? record.fields.zugrunde_liegende_beurteilungen.map((u: unknown) => beurteilungenList.find(t => t.record_id === extractRecordId(u))?.fields.beurteilungsgegenstand ?? '—').join(', ') : null} format="text" />
      </RecordSection>

      {/* N:1 — verknüpfte Records: IMMER klickbar, nie eine Text-Sackgasse. */}
      <RecordSection title={t('relations')} cols={2}>
        <RecordRelation
          label={fieldLabel('entscheidungen', 'anfrage')}
          name={anfrageTarget?.fields.anfragenummer ?? '—'}
          meta={[anfrageTarget?.fields.verantwortlicher, anfrageTarget?.fields.kundenreferenz].filter(Boolean).join(' · ') || undefined}
          onClick={anfrageTarget && onOpenKundenanfragen ? () => onOpenKundenanfragen!(anfrageTarget!) : undefined}
        />
        <RecordRelation
          label={fieldLabel('entscheidungen', 'ersetzt_durch_entscheidung')}
          name={ersetzt_durch_entscheidungTarget?.fields.titel ?? '—'}
          meta={[ersetzt_durch_entscheidungTarget?.fields.entscheidungsverantwortlicher].filter(Boolean).join(' · ') || undefined}
          onClick={ersetzt_durch_entscheidungTarget && onOpenEntscheidungen ? () => onOpenEntscheidungen!(ersetzt_durch_entscheidungTarget!) : undefined}
        />
      </RecordSection>

      <SatelliteSection
        title={appLabel('erfahrungen_und_erkenntnisse')}
        items={erfahrungenUndErkenntnisseList.filter(r => Array.isArray(r.fields.belegentscheidungen) && r.fields.belegentscheidungen.some((u: unknown) => extractRecordId(u) === record.record_id))}
        map={r => ({ name: r.fields.titel ?? appLabel('erfahrungen_und_erkenntnisse'), meta: r.fields.bestaetigt_am })}
        onOpen={onOpenErfahrungenUndErkenntnisse}
        onAdd={onAddErfahrungenUndErkenntnisse}
        onPick={onPickErfahrungenUndErkenntnisse}
        getKey={r => r.record_id}
      />

      <RecordAttachments appId={APP_IDS.ENTSCHEIDUNGEN} recordId={record.record_id} readOnly={!perms.canWrite('entscheidungen')} />
    </>
  );
}
