import type { AbschlussUndUebergabe, Kundenanfragen } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { usePermissions } from '@/lib/permissions';

export interface AbschlussUndUebergabeDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: AbschlussUndUebergabe;
  /** N:1-Ziel „Kundenanfragen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  kundenanfragenList: Kundenanfragen[];
  /** Klick auf die Kundenanfragen-Relation → overlay.push auf dessen Detail. */
  onOpenKundenanfragen?: (record: Kundenanfragen) => void;
}

export function AbschlussUndUebergabeDetails({
  record,
  kundenanfragenList,
  onOpenKundenanfragen,
}: AbschlussUndUebergabeDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  const anfrageTarget = kundenanfragenList.find(r => r.record_id === extractRecordId(record.fields.anfrage));
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'pruefdatum')} value={record.fields.pruefdatum} format="datetime" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'geprueft_von')} value={record.fields.geprueft_von} format="text" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'anforderungen_geprueft')} value={record.fields.anforderungen_geprueft} format="bool" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'kritische_punkte_geklaert')} value={record.fields.kritische_punkte_geklaert} format="bool" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'erforderliche_entscheidungen_vorhanden')} value={record.fields.erforderliche_entscheidungen_vorhanden} format="bool" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'erforderliche_freigaben_vorhanden')} value={record.fields.erforderliche_freigaben_vorhanden} format="bool" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'verbleibende_abweichungen')} value={record.fields.verbleibende_abweichungen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'uebergabeempfaenger')} value={record.fields.uebergabeempfaenger} format="text" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'uebergabestatus')} value={record.fields.uebergabestatus} format="pill" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'verbleibende_risiken')} value={record.fields.verbleibende_risiken} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'uebergabedatum')} value={record.fields.uebergabedatum} format="datetime" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'zusammenfassung')} value={record.fields.zusammenfassung} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('abschluss_und_uebergabe', 'freigabestatus')} value={record.fields.freigabestatus} format="pill" />
      </RecordSection>

      {/* N:1 — verknüpfte Records: IMMER klickbar, nie eine Text-Sackgasse. */}
      <RecordSection title={t('relations')} cols={1}>
        <RecordRelation
          label={fieldLabel('abschluss_und_uebergabe', 'anfrage')}
          name={anfrageTarget?.fields.anfragenummer ?? '—'}
          meta={[anfrageTarget?.fields.verantwortlicher, anfrageTarget?.fields.kundenreferenz].filter(Boolean).join(' · ') || undefined}
          onClick={anfrageTarget && onOpenKundenanfragen ? () => onOpenKundenanfragen!(anfrageTarget!) : undefined}
        />
      </RecordSection>

      <RecordAttachments appId={APP_IDS.ABSCHLUSS_UND_UEBERGABE} recordId={record.record_id} readOnly={!perms.canWrite('abschluss_und_uebergabe')} />
    </>
  );
}
