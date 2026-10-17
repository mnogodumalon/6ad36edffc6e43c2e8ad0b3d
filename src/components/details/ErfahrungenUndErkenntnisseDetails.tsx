import type { ErfahrungenUndErkenntnisse, Informationsquellen, Beurteilungen, Entscheidungen, Kundenanfragen, WiederverwendungVonErfahrungen } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { SatelliteSection } from '@/components/SatelliteSection';
import { usePermissions } from '@/lib/permissions';

export interface ErfahrungenUndErkenntnisseDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: ErfahrungenUndErkenntnisse;
  /** N:1-Ziel „Informationsquellen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  informationsquellenList: Informationsquellen[];
  /** Reserviert — Informationsquellen ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenInformationsquellen?: (record: Informationsquellen) => void;
  /** N:1-Ziel „Beurteilungen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  beurteilungenList: Beurteilungen[];
  /** Reserviert — Beurteilungen ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenBeurteilungen?: (record: Beurteilungen) => void;
  /** N:1-Ziel „Entscheidungen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  entscheidungenList: Entscheidungen[];
  /** Reserviert — Entscheidungen ist hier nur über ein Mehrfach-Feld verknüpft (Text-Join, keine Einzel-Relation); Übergabe erlaubt, aber ohne Wirkung. */
  onOpenEntscheidungen?: (record: Entscheidungen) => void;
  /** N:1-Ziel „Kundenanfragen": volle Liste (Hook-Array) — der Block löst Name + Schlüsselfelder selbst auf. */
  kundenanfragenList: Kundenanfragen[];
  /** Klick auf die Kundenanfragen-Relation → overlay.push auf dessen Detail. */
  onOpenKundenanfragen?: (record: Kundenanfragen) => void;
  /** 1:N „Wiederverwendung von Erfahrungen" (erfahrung): VOLLE Liste — der Block filtert auf diesen Record. */
  wiederverwendungVonErfahrungenList: WiederverwendungVonErfahrungen[];
  /** Zeilen-Klick → overlay.push auf das WiederverwendungVonErfahrungen-Detail (nie der Edit-Dialog). */
  onOpenWiederverwendungVonErfahrungen: (record: WiederverwendungVonErfahrungen) => void;
  /** Kontextuelles „+": öffnet den WiederverwendungVonErfahrungen-Dialog mit diesem Record vorgesetzt. */
  onAddWiederverwendungVonErfahrungen?: () => void;
}

export function ErfahrungenUndErkenntnisseDetails({
  record,
  informationsquellenList,
  beurteilungenList,
  entscheidungenList,
  kundenanfragenList,
  onOpenKundenanfragen,
  wiederverwendungVonErfahrungenList,
  onOpenWiederverwendungVonErfahrungen,
  onAddWiederverwendungVonErfahrungen,
}: ErfahrungenUndErkenntnisseDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  const ursprungs_anfrageTarget = kundenanfragenList.find(r => r.record_id === extractRecordId(record.fields.ursprungs_anfrage));
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'belegquellen')} value={Array.isArray(record.fields.belegquellen) ? record.fields.belegquellen.map((u: unknown) => informationsquellenList.find(t => t.record_id === extractRecordId(u))?.fields.titel ?? '—').join(', ') : null} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'belegbeurteilungen')} value={Array.isArray(record.fields.belegbeurteilungen) ? record.fields.belegbeurteilungen.map((u: unknown) => beurteilungenList.find(t => t.record_id === extractRecordId(u))?.fields.beurteilungsgegenstand ?? '—').join(', ') : null} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'belegentscheidungen')} value={Array.isArray(record.fields.belegentscheidungen) ? record.fields.belegentscheidungen.map((u: unknown) => entscheidungenList.find(t => t.record_id === extractRecordId(u))?.fields.titel ?? '—').join(', ') : null} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'titel')} value={record.fields.titel} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'sachverhalt')} value={record.fields.sachverhalt} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'erfahrungstyp')} value={record.fields.erfahrungstyp} format="pill" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'produkt_oder_produktfamilie')} value={record.fields.produkt_oder_produktfamilie} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'anforderungstyp')} value={record.fields.anforderungstyp} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'schlagwoerter')} value={record.fields.schlagwoerter} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'urspruengliches_problem')} value={record.fields.urspruengliches_problem} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'vorgehen')} value={record.fields.vorgehen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'beobachtetes_ergebnis')} value={record.fields.beobachtetes_ergebnis} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'erkenntnis')} value={record.fields.erkenntnis} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'gueltigkeitsbedingungen')} value={record.fields.gueltigkeitsbedingungen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'bekannte_grenzen')} value={record.fields.bekannte_grenzen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'risiko_der_uebertragung')} value={record.fields.risiko_der_uebertragung} format="pill" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'bestaetigungsstatus')} value={record.fields.bestaetigungsstatus} format="pill" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'bestaetigt_von')} value={record.fields.bestaetigt_von} format="text" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'bestaetigt_am')} value={record.fields.bestaetigt_am} format="date" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'gueltig_ab')} value={record.fields.gueltig_ab} format="date" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'gueltig_bis')} value={record.fields.gueltig_bis} format="date" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'wiederverwendungsstatus')} value={record.fields.wiederverwendungsstatus} format="pill" />
        <RecordField label={fieldLabel('erfahrungen_und_erkenntnisse', 'kommentar_zur_wiederverwendung')} value={record.fields.kommentar_zur_wiederverwendung} format="longtext" className="md:col-span-2" />
      </RecordSection>

      {/* N:1 — verknüpfte Records: IMMER klickbar, nie eine Text-Sackgasse. */}
      <RecordSection title={t('relations')} cols={1}>
        <RecordRelation
          label={fieldLabel('erfahrungen_und_erkenntnisse', 'ursprungs_anfrage')}
          name={ursprungs_anfrageTarget?.fields.anfragenummer ?? '—'}
          meta={[ursprungs_anfrageTarget?.fields.verantwortlicher, ursprungs_anfrageTarget?.fields.kundenreferenz].filter(Boolean).join(' · ') || undefined}
          onClick={ursprungs_anfrageTarget && onOpenKundenanfragen ? () => onOpenKundenanfragen!(ursprungs_anfrageTarget!) : undefined}
        />
      </RecordSection>

      <SatelliteSection
        title={appLabel('wiederverwendung_von_erfahrungen')}
        items={wiederverwendungVonErfahrungenList.filter(r => extractRecordId(r.fields.erfahrung) === record.record_id)}
        map={r => ({ name: r.fields.geprueft_von ?? appLabel('wiederverwendung_von_erfahrungen'), meta: r.fields.bewertet_am })}
        onOpen={onOpenWiederverwendungVonErfahrungen}
        onAdd={onAddWiederverwendungVonErfahrungen}
        getKey={r => r.record_id}
      />

      <RecordAttachments appId={APP_IDS.ERFAHRUNGEN_UND_ERKENNTNISSE} recordId={record.record_id} readOnly={!perms.canWrite('erfahrungen_und_erkenntnisse')} />
    </>
  );
}
