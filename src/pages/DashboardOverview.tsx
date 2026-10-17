import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { IconAlertTriangle, IconPlus, IconClockExclamation, IconRefresh, IconMessageQuestion } from '@tabler/icons-react';
import type { DashboardData } from '@/hooks/useDashboardData';
import { useEntityCrud } from '@/components/EntityCrud';
import { DashboardGrid } from '@/components/DashboardGrid';
import { WorkList } from '@/components/WorkList';
import { HeroBanner } from '@/components/HeroBanner';
import { StatStrip, StatStripItem } from '@/components/StatCard';
import { KanbanWidget, type KanbanCard, type KanbanColumn, type KanbanTone } from '@/components/widgets/KanbanWidget';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';
import { LOOKUP_OPTIONS, lookupOption } from '@/types/app';
import { formatDate, lookupKey } from '@/lib/formatters';
import { useClock, gruss, namen, undoToast } from '@/lib/polish';
import { tx } from '@/i18n';

type BoardFilter = 'all' | 'recheck' | 'overdue' | 'kunde';

const CLOSED_PUNKT = ['erledigt', 'entschieden_akzeptiert', 'nicht_mehr_relevant'];
const CLOSED_AUFGABE = ['erledigt', 'abgebrochen'];
const CLOSED_ANFRAGE = ['technisch_geklaert', 'freigegeben', 'abgelehnt', 'zurueckgestellt'];

// next workflow step per status (never a decision / approval — those stay manual)
const NEXT_PUNKT: Record<string, string> = { neu: 'in_bearbeitung', zugewiesen: 'in_bearbeitung' };
const NEXT_AUFGABE: Record<string, string> = { offen: 'in_bearbeitung', in_bearbeitung: 'erledigt' };

export default function DashboardOverview({ data }: { data: DashboardData }) {
  const {
    kundenanfragen, offenePunkte, aufgaben, rueckfragenUndKommunikation,
    setKundenanfragen, setOffenePunkte, setAufgaben, fetchAll,
  } = data;
  const clock = useClock();
  const todayKey = format(clock, 'yyyy-MM-dd');
  const [filter, setFilter] = useState<BoardFilter>('all');

  // ---- shared advance helpers (hero, work lists, overlay footer) ----
  const advancePunkt = (id: string, key: string) => {
    const before = offenePunkte.find(r => r.record_id === id);
    if (!before) return;
    const prev = before.fields.status;
    setOffenePunkte(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: lookupOption('offene_punkte', 'status', key) } } : r));
    LivingAppsService.updateOffenePunkteEntry(id, { status: key }).catch(() => fetchAll());
    undoToast(tx`${before.fields.kurztitel ?? ''} — Status geändert`, () => {
      setOffenePunkte(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: prev } } : r));
      LivingAppsService.updateOffenePunkteEntry(id, { status: prev?.key }).catch(() => fetchAll());
    });
  };
  const advanceAufgabe = (id: string, key: string) => {
    const before = aufgaben.find(r => r.record_id === id);
    if (!before) return;
    const prev = before.fields.status;
    setAufgaben(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: lookupOption('aufgaben', 'status', key) } } : r));
    LivingAppsService.updateAufgabenEntry(id, { status: key }).catch(() => fetchAll());
    undoToast(tx`${before.fields.titel ?? ''} — Status geändert`, () => {
      setAufgaben(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: prev } } : r));
      LivingAppsService.updateAufgabenEntry(id, { status: prev?.key }).catch(() => fetchAll());
    });
  };
  const advanceAnfrage = (id: string, key: string) => {
    const before = kundenanfragen.find(r => r.record_id === id);
    if (!before) return;
    const prev = before.fields.status;
    setKundenanfragen(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: lookupOption('kundenanfragen', 'status', key) } } : r));
    LivingAppsService.updateKundenanfragenEntry(id, { status: key }).catch(() => fetchAll());
    undoToast(tx`${before.fields.anfragenummer ?? ''} — Status geändert`, () => {
      setKundenanfragen(list => list.map(r => r.record_id === id ? { ...r, fields: { ...r.fields, status: prev } } : r));
      LivingAppsService.updateKundenanfragenEntry(id, { status: prev?.key }).catch(() => fetchAll());
    });
  };

  const crud = useEntityCrud(data, {
    footer: (top) => {
      if (top.type === 'offenePunkte') {
        const next = NEXT_PUNKT[lookupKey(top.record.fields.status) ?? ''];
        return next ? { label: tx('In Bearbeitung nehmen'), onClick: () => advancePunkt(top.record.record_id, next) } : undefined;
      }
      if (top.type === 'aufgaben') {
        const next = NEXT_AUFGABE[lookupKey(top.record.fields.status) ?? ''];
        if (!next) return undefined;
        return { label: next === 'erledigt' ? tx('Als erledigt melden') : tx('Bearbeitung starten'), onClick: () => advanceAufgabe(top.record.record_id, next) };
      }
      if (top.type === 'kundenanfragen' && lookupKey(top.record.fields.status) === 'neu') {
        return { label: tx('In Prüfung nehmen'), onClick: () => advanceAnfrage(top.record.record_id, 'in_pruefung') };
      }
      return undefined;
    },
  });
  const enrichedPunkte = crud.enriched.offenePunkte;
  const enrichedAufgaben = crud.enriched.aufgaben;
  const enrichedAnfragen = crud.enriched.kundenanfragen;
  const enrichedAnforderungen = crud.enriched.technischeAnforderungen;
  const enrichedEntscheidungen = crud.enriched.entscheidungen;

  // ---- derived sets ----
  const dayOf = (s?: string) => (s ? s.slice(0, 10) : '');
  const openPunkte = enrichedPunkte.filter(p => !CLOSED_PUNKT.includes(lookupKey(p.fields.status) ?? ''));
  const criticalPunkte = openPunkte.filter(p => lookupKey(p.fields.prioritaet) === 'kritisch');
  const recheckPunkte = openPunkte.filter(p => p.fields.erneute_pruefung_erforderlich);
  const overduePunkte = openPunkte.filter(p => p.fields.faellig_am && dayOf(p.fields.faellig_am) < todayKey);

  const waitingPunktIds = useMemo(() => {
    const ids = new Set<string>();
    for (const k of rueckfragenUndKommunikation) {
      const sent = lookupKey(k.fields.versandstatus) === 'versendet';
      const ans = lookupKey(k.fields.antwortstatus);
      if (!sent || k.fields.antwort_erhalten_am || ans === 'beantwortet') continue;
      const a = extractRecordId(k.fields.offener_punkt);
      if (a) ids.add(a);
      (k.fields.zugehoerige_offene_punkte ?? []).forEach(u => { const i = extractRecordId(u); if (i) ids.add(i); });
    }
    return ids;
  }, [rueckfragenUndKommunikation]);
  const kundePunkte = openPunkte.filter(p => waitingPunktIds.has(p.record_id));

  const overdueAufgaben = enrichedAufgaben
    .filter(a => !CLOSED_AUFGABE.includes(lookupKey(a.fields.status) ?? '') && a.fields.faellig_am && dayOf(a.fields.faellig_am) < todayKey)
    .sort((a, b) => dayOf(a.fields.faellig_am).localeCompare(dayOf(b.fields.faellig_am)));
  const neueAnfragen = enrichedAnfragen.filter(a => lookupKey(a.fields.status) === 'neu');
  const problemAnforderungen = enrichedAnforderungen.filter(a => ['unklar', 'widerspruechlich', 'nicht_erfuellt'].includes(lookupKey(a.fields.pruefstatus) ?? ''));
  const offeneEntscheidungen = enrichedEntscheidungen.filter(e => ['vorbereitung', 'zur_entscheidung'].includes(lookupKey(e.fields.entscheidungsstatus) ?? ''));
  const geklaert = enrichedAnfragen.filter(a => ['technisch_geklaert', 'freigegeben'].includes(lookupKey(a.fields.status) ?? '')).length;
  const aktiveAnfragen = enrichedAnfragen.filter(a => !CLOSED_ANFRAGE.includes(lookupKey(a.fields.status) ?? '')).length;

  // ---- board ----
  const columns = useMemo<KanbanColumn[]>(
    () => (LOOKUP_OPTIONS['offene_punkte']?.['status'] ?? []).map(o => ({ key: o.key, label: o.label })),
    [],
  );
  const boardPunkte = enrichedPunkte.filter(p => {
    if (filter === 'recheck') return !!p.fields.erneute_pruefung_erforderlich;
    if (filter === 'overdue') return overduePunkte.some(o => o.record_id === p.record_id);
    if (filter === 'kunde') return waitingPunktIds.has(p.record_id);
    return true;
  });
  const prioRank: Record<string, number> = { kritisch: 0, hoch: 1, normal: 2, niedrig: 3 };
  const cards: KanbanCard[] = [...boardPunkte]
    .sort((a, b) => (prioRank[lookupKey(a.fields.prioritaet) ?? 'normal'] ?? 2) - (prioRank[lookupKey(b.fields.prioritaet) ?? 'normal'] ?? 2))
    .map(p => {
      const prio = lookupKey(p.fields.prioritaet);
      const overdue = p.fields.faellig_am && dayOf(p.fields.faellig_am) < todayKey && !CLOSED_PUNKT.includes(lookupKey(p.fields.status) ?? '');
      const tone: KanbanTone = prio === 'kritisch' ? 'warning' : 'default';
      const parts = [
        p.anfrageName,
        p.fields.verantwortlicher,
        p.fields.faellig_am ? formatDate(p.fields.faellig_am) : undefined,
      ].filter(Boolean).join(' · ');
      return {
        id: `punkt:${p.record_id}`,
        column: lookupKey(p.fields.status) ?? columns[0]?.key ?? '',
        title: p.fields.kurztitel ?? tx('Ohne Titel'),
        subtitle: (
          <span className="block min-w-0">
            <span className="block truncate">{parts}</span>
            <span className="block truncate text-[11px]">
              {prio && <span className={prio === 'kritisch' ? 'font-semibold text-destructive' : 'text-muted-foreground'}>{p.fields.prioritaet?.label}</span>}
              {overdue && <span className="font-medium text-destructive"> · {tx('überfällig')}</span>}
              {p.fields.erneute_pruefung_erforderlich && <span className="font-medium text-amber-600"> · {tx('Erneute Prüfung')}</span>}
              {p.betroffene_anforderungenName && <span className="text-muted-foreground"> · {p.betroffene_anforderungenName}</span>}
            </span>
          </span>
        ),
        tone,
      };
    });

  const moveCard = (cardId: string, newColumn: string) => {
    const id = cardId.split(':')[1];
    const rec = offenePunkte.find(r => r.record_id === id);
    if (!id || !rec) return;
    const from = lookupKey(rec.fields.status);
    if (from === newColumn) return;
    if (['erledigt', 'entschieden_akzeptiert'].includes(newColumn) && !rec.fields.loesung_oder_ergebnis?.trim()) {
      return tx('Zum Abschluss muss zuerst das Ergebnis dokumentiert werden — bitte im Detail eintragen.');
    }
    if (newColumn === 'erledigt' && from === 'wartet_kunde' && !rec.fields.antwort_geprueft) {
      return tx('Die Kundenantwort wurde noch nicht geprüft — erst prüfen, dann erledigen.');
    }
    if (newColumn === 'entschieden_akzeptiert' && !crud.entscheidungen.canWrite) {
      return tx('Eine akzeptierte Abweichung braucht eine dokumentierte Entscheidung.');
    }
    advancePunkt(id, newColumn);
  };

  // ---- hero ----
  const heroPunkt = criticalPunkte[0];
  const heroNext = heroPunkt ? NEXT_PUNKT[lookupKey(heroPunkt.fields.status) ?? ''] : undefined;

  // ---- header context line ----
  const namesOf = (xs: (string | undefined)[]) => namen(xs.filter((x): x is string => !!x));
  let context: string;
  if (criticalPunkte.length > 0) {
    context = tx`${namesOf(criticalPunkte.map(p => p.fields.kurztitel))} ist kritisch und blockiert den Abschluss.`;
  } else if (overdueAufgaben.length > 0) {
    context = tx`${namesOf(overdueAufgaben.map(a => a.fields.titel))} ist überfällig.`;
  } else if (neueAnfragen.length > 0) {
    context = tx`Neu eingegangen: ${namesOf(neueAnfragen.map(a => a.kundeName))}.`;
  } else if (offeneEntscheidungen.length > 0) {
    context = tx`Entscheidung offen: ${namesOf(offeneEntscheidungen.map(e => e.fields.titel))}.`;
  } else {
    context = tx`Nichts Dringendes — die Klärung läuft planmäßig.`;
  }

  const toggle = (f: BoardFilter) => setFilter(cur => (cur === f ? 'all' : f));
  const empty = kundenanfragen.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{gruss(clock)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{empty ? tx('Nimm die erste Kundenanfrage auf, um die technische Klärung zu starten.') : context}</p>
        </div>
        {crud.kundenanfragen.canWrite && (
          <button
            type="button"
            onClick={() => crud.kundenanfragen.openCreate({ status: 'neu' })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <IconPlus size={16} className="shrink-0" />
            {tx('Neue Anfrage')}
          </button>
        )}
      </div>

      <DashboardGrid
        variant="wide"
        hero={heroPunkt && (
          <HeroBanner
            icon={<IconAlertTriangle size={18} />}
            action={heroNext
              ? { label: tx('In Bearbeitung nehmen'), onClick: () => advancePunkt(heroPunkt.record_id, heroNext) }
              : { label: tx('Öffnen'), onClick: () => crud.offenePunkte.openDetail(offenePunkte.find(r => r.record_id === heroPunkt.record_id)!) }}
          >
            {criticalPunkte.length === 1
              ? <><b>{heroPunkt.fields.kurztitel}</b> {tx('ist kritisch')}</>
              : <><b>{namesOf(criticalPunkte.map(p => p.fields.kurztitel))}</b> {tx('sind kritisch')}</>}
            {heroPunkt.anfrageName ? <> — {heroPunkt.anfrageName}</> : null}
            {heroPunkt.fields.faellig_am ? <>, {tx('fällig')} {formatDate(heroPunkt.fields.faellig_am)}</> : null}.
          </HeroBanner>
        )}
        kpis={empty ? undefined : (
          <StatStrip>
            <StatStripItem
              title={tx('Erneute Prüfung')}
              value={recheckPunkte.length}
              icon={<IconRefresh size={16} />}
              tone={recheckPunkte.length > 0 ? 'warning' : 'default'}
              onClick={() => toggle('recheck')}
              active={filter === 'recheck'}
            />
            <StatStripItem
              title={tx('Frist überschritten')}
              value={overduePunkte.length}
              icon={<IconClockExclamation size={16} />}
              onClick={() => toggle('overdue')}
              active={filter === 'overdue'}
            />
            <StatStripItem
              title={tx('Kundenantwort offen')}
              value={kundePunkte.length}
              icon={<IconMessageQuestion size={16} />}
              onClick={() => toggle('kunde')}
              active={filter === 'kunde'}
            />
            <StatStripItem
              title={tx('Geklärt')}
              value={`${geklaert}/${geklaert + aktiveAnfragen}`}
              tone={geklaert > 0 ? 'success' : 'default'}
            />
          </StatStrip>
        )}
        aside={
          <>
            <WorkList
              title={tx('Überfällige Aufgaben')}
              items={overdueAufgaben.map(a => {
                const next = NEXT_AUFGABE[lookupKey(a.fields.status) ?? ''];
                return {
                  id: a.record_id,
                  title: a.fields.titel ?? tx('Ohne Titel'),
                  secondLine: (
                    <>
                      <span className="font-medium text-destructive">{tx('Überfällig')}</span>
                      <span className="text-muted-foreground"> · {formatDate(a.fields.faellig_am)} · {a.fields.verantwortlicher ?? a.anfrageName}</span>
                    </>
                  ),
                  action: next ? { label: next === 'erledigt' ? tx('✓ Erledigt') : tx('Starten'), onClick: () => advanceAufgabe(a.record_id, next) } : undefined,
                };
              })}
              onItemClick={id => { const r = aufgaben.find(x => x.record_id === id); if (r) crud.aufgaben.openDetail(r); }}
              empty={{ text: tx('Keine überfälligen Aufgaben.') }}
              max={4}
            />
            <WorkList
              title={tx('Neue Anfragen')}
              items={neueAnfragen.map(a => ({
                id: a.record_id,
                title: a.kundeName || a.fields.anfragenummer || tx('Anfrage'),
                secondLine: (
                  <span className="text-muted-foreground">
                    {[a.fields.produkt_oder_produktfamilie, a.fields.eingangsdatum ? formatDate(a.fields.eingangsdatum) : undefined].filter(Boolean).join(' · ')}
                  </span>
                ),
                action: { label: tx('Prüfen'), onClick: () => advanceAnfrage(a.record_id, 'in_pruefung') },
              }))}
              onItemClick={id => { const r = kundenanfragen.find(x => x.record_id === id); if (r) crud.kundenanfragen.openDetail(r); }}
              empty={{ text: tx('Keine neuen Anfragen.'), action: crud.kundenanfragen.canWrite ? { label: tx('Anfrage aufnehmen'), onClick: () => crud.kundenanfragen.openCreate({ status: 'neu' }) } : undefined }}
              max={4}
            />
            <WorkList
              title={tx('Anforderungen mit Klärungsbedarf')}
              items={problemAnforderungen.map(a => ({
                id: a.record_id,
                title: a.fields.bezeichnung ?? tx('Anforderung'),
                secondLine: (
                  <>
                    <span className="font-medium text-destructive">{a.fields.pruefstatus?.label}</span>
                    <span className="text-muted-foreground"> · {a.anfrageName}</span>
                  </>
                ),
              }))}
              onItemClick={id => { const r = data.technischeAnforderungen.find(x => x.record_id === id); if (r) crud.technischeAnforderungen.openDetail(r); }}
              empty={{ text: tx('Alle Anforderungen sind ohne Befund.') }}
              max={4}
            />
            <WorkList
              title={tx('Offene Entscheidungen')}
              items={offeneEntscheidungen.map(e => ({
                id: e.record_id,
                title: e.fields.titel ?? tx('Entscheidung'),
                secondLine: (
                  <>
                    <span className="font-medium">{e.fields.entscheidungsstatus?.label}</span>
                    <span className="text-muted-foreground"> · {e.fields.entscheidungsverantwortlicher ?? e.anfrageName}</span>
                  </>
                ),
              }))}
              onItemClick={id => { const r = data.entscheidungen.find(x => x.record_id === id); if (r) crud.entscheidungen.openDetail(r); }}
              empty={{ text: tx('Keine Entscheidung ausstehend.') }}
              max={4}
            />
          </>
        }
        primary={
          <KanbanWidget
            cards={cards}
            columns={columns}
            defaultCollapsed={['erledigt', 'entschieden_akzeptiert', 'nicht_mehr_relevant']}
            onCardClick={card => {
              const r = offenePunkte.find(x => x.record_id === card.id.split(':')[1]);
              if (r) crud.offenePunkte.openDetail(r);
            }}
            onCardMove={moveCard}
            onAddCard={crud.offenePunkte.canWrite ? (column => crud.offenePunkte.openCreate({ status: column })) : undefined}
          />
        }
      />
      {crud.surfaces}
    </div>
  );
}
