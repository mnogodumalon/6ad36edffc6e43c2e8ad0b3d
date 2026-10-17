import type { WiederverwendungVonErfahrungen, Kundenanfragen, ErfahrungenUndErkenntnisse } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { usePermissions } from '@/lib/permissions';

export interface WiederverwendungVonErfahrungenDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: WiederverwendungVonErfahrungen;
  /** N:1-Ziel „Kundenanfragen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  kundenanfragenList: Kundenanfragen[];
  /** Klick auf die Kundenanfragen-Relation → overlay.push auf dessen Detail. */
  onOpenKundenanfragen?: (record: Kundenanfragen) => void;
  /** N:1-Ziel „ErfahrungenUndErkenntnisse": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  erfahrungenUndErkenntnisseList: ErfahrungenUndErkenntnisse[];
  /** Klick auf die ErfahrungenUndErkenntnisse-Relation → overlay.push auf dessen Detail. */
  onOpenErfahrungenUndErkenntnisse?: (record: ErfahrungenUndErkenntnisse) => void;
}

export function WiederverwendungVonErfahrungenDetails({
  record,
  kundenanfragenList,
  onOpenKundenanfragen,
  erfahrungenUndErkenntnisseList,
  onOpenErfahrungenUndErkenntnisse,
}: WiederverwendungVonErfahrungenDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  const ziel_anfrageTarget = kundenanfragenList.find(r => r.record_id === extractRecordId(record.fields.ziel_anfrage));
  const erfahrungTarget = erfahrungenUndErkenntnisseList.find(r => r.record_id === extractRecordId(record.fields.erfahrung));
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'aufwandsersparnis_schaetzung_min')} value={record.fields.aufwandsersparnis_schaetzung_min} format="text" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'tatsaechliche_aufwandsersparnis_min')} value={record.fields.tatsaechliche_aufwandsersparnis_min} format="text" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'negative_folgen')} value={record.fields.negative_folgen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'bewertet_am')} value={record.fields.bewertet_am} format="date" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'abrufdatum')} value={record.fields.abrufdatum} format="datetime" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'abrufgrund')} value={record.fields.abrufgrund} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'aehnlichkeitseinschaetzung')} value={record.fields.aehnlichkeitseinschaetzung} format="pill" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'kontextunterschiede')} value={record.fields.kontextunterschiede} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'gueltigkeit_geprueft')} value={record.fields.gueltigkeit_geprueft} format="bool" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'geprueft_von')} value={record.fields.geprueft_von} format="text" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'verwendungsergebnis')} value={record.fields.verwendungsergebnis} format="pill" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'begruendung')} value={record.fields.begruendung} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('wiederverwendung_von_erfahrungen', 'beobachteter_nutzen')} value={record.fields.beobachteter_nutzen} format="longtext" className="md:col-span-2" />
      </RecordSection>

      {/* N:1 — verknüpfte Records: IMMER klickbar, nie eine Text-Sackgasse. */}
      <RecordSection title={t('relations')} cols={2}>
        <RecordRelation
          label={fieldLabel('wiederverwendung_von_erfahrungen', 'ziel_anfrage')}
          name={ziel_anfrageTarget?.fields.anfragenummer ?? '—'}
          meta={[ziel_anfrageTarget?.fields.verantwortlicher, ziel_anfrageTarget?.fields.kundenreferenz].filter(Boolean).join(' · ') || undefined}
          onClick={ziel_anfrageTarget && onOpenKundenanfragen ? () => onOpenKundenanfragen!(ziel_anfrageTarget!) : undefined}
        />
        <RecordRelation
          label={fieldLabel('wiederverwendung_von_erfahrungen', 'erfahrung')}
          name={erfahrungTarget?.fields.titel ?? '—'}
          meta={[erfahrungTarget?.fields.produkt_oder_produktfamilie, erfahrungTarget?.fields.anforderungstyp].filter(Boolean).join(' · ') || undefined}
          onClick={erfahrungTarget && onOpenErfahrungenUndErkenntnisse ? () => onOpenErfahrungenUndErkenntnisse!(erfahrungTarget!) : undefined}
        />
      </RecordSection>

      <RecordAttachments appId={APP_IDS.WIEDERVERWENDUNG_VON_ERFAHRUNGEN} recordId={record.record_id} readOnly={!perms.canWrite('wiederverwendung_von_erfahrungen')} />
    </>
  );
}
