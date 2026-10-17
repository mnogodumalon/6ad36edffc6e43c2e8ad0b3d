/**
 * Antwort zuordnen und prüfen — 4-Schritt-Wizard.
 * Steps: 1) Beantwortete Rückfrage wählen → 2) Antwort erfassen und bewerten → 3) Antwort fachlich prüfen
 *        → 4) Offenen Punkt abschließen oder erneut prüfen lassen → Prüfen & anlegen.
 * Reads: rueckfragen_und_kommunikation (versendet), kundenanfragen, offene_punkte.
 * Writes: rueckfragen_und_kommunikation (Antwort), offene_punkte (nur wenn gewählt) — via useAntwortZuordnenFlow.
 * Composes: IntentWizardShell, EntitySelectStep, Bound, StepNav, SummaryStep, SuccessStep.
 */
import { useState } from 'react';
import { IntentWizardShell, WizardStep } from '@/components/blocks/IntentWizardShell';
import { EntitySelectStep } from '@/components/blocks/EntitySelectStep';
import { Bound } from '@/components/blocks/Bound';
import { StepNav } from '@/components/blocks/StepNav';
import { SummaryStep } from '@/components/blocks/SummaryStep';
import { SuccessStep } from '@/components/blocks/SuccessStep';
import { fieldText, fieldDate, fieldRef } from '@/lib/journey';
import { useAntwortZuordnenFlow } from '@/lib/journey/flows/AntwortZuordnen';
import { tx } from '@/i18n';

export default function AntwortZuordnenPage() {
  const [step, setStep] = useState(1);
  const flow = useAntwortZuordnenFlow({
    steps: {
      beantwortete_kommunikation: 1, anfrage: 1,
      kanal: 2, absender: 2, betreff: 2, inhalt: 2, antwortstatus: 2,
      offene_punkte: 3, antwort_geprueft: 3,
      loesung_oder_ergebnis: 4, status: 4, abschluss_durch: 4, erneute_pruefung_erforderlich: 4,
    },
    items: {
      beantwortete_kommunikation: r => ({
        id: r.id,
        title: fieldText(r, 'betreff'),
        subtitle: fieldText(r, 'empfaenger'),
        stats: [{ label: tx('Antwort erwartet bis'), value: fieldDate(r, 'antwort_erwartet_bis') ?? '—' }],
      }),
      offene_punkte: r => ({ id: r.id, title: fieldText(r, 'kurztitel'), subtitle: fieldText(r, 'verantwortlicher') }),
    },
  });

  const komm = flow.forms.rueckfragen_und_kommunikation;
  const punkt = flow.forms.offene_punkte;
  const rueckfrage = flow.picks.beantwortete_kommunikation;
  const kommPick = flow.pick('beantwortete_kommunikation');

  const onPickRueckfrage = (id: string) => {
    kommPick.onSelect(id);
    const rec = rueckfrage.recordOf(id);
    const anfrageId = rec ? fieldRef(rec, 'anfrage') : null;
    if (rec && anfrageId) {
      komm.set('anfrage', anfrageId, rueckfrage.refLabel(rec, 'anfrage') ?? anfrageId);
      if (!komm.get('betreff')) komm.set('betreff', tx`Re: ${fieldText(rec, 'betreff')}`);
    }
  };

  const keyOf = (v: unknown) => (v && typeof v === 'object' ? (v as { key?: string }).key : (v as string | undefined));

  const checkAbschluss = (): boolean | string => {
    if (!flow.validateStep(4)) return false;
    const status = keyOf(punkt.get('status'));
    const abgeschlossen = status === 'erledigt' || status === 'entschieden_akzeptiert';
    const ergebnis = String(punkt.get('loesung_oder_ergebnis') ?? '').trim();
    if (abgeschlossen && (!punkt.get('antwort_geprueft') || !ergebnis)) {
      return tx('Zum Abschluss eines offenen Punkts muss die Antwort geprüft und das Ergebnis eingetragen sein.');
    }
    return true;
  };

  return (
    <IntentWizardShell
      title={tx('Antwort zuordnen und prüfen')}
      currentStep={step} onStepChange={setStep}
      forms={flow.formList} draftKey={flow.draftKey}
      intro={{
        description: tx('Antwort auf eine Rückfrage erfassen, prüfen und den offenen Punkt gezielt abschließen.'),
        needs: [tx('Die beantwortete Rückfrage'), tx('Inhalt der Antwort'), tx('Optional: den betroffenen offenen Punkt')],
      }}
    >
      <WizardStep label={tx('Rückfrage')} description={tx('Auf welche versendete Rückfrage ist die Antwort eingegangen?')}>
        <EntitySelectStep {...rueckfrage.select} {...kommPick} onSelect={onPickRueckfrage}
          searchPlaceholder={tx('Betreff oder Empfänger …')} />
        <p data-key="rueckfrage-fehlt" className="mt-4 text-sm text-muted-foreground">
          {tx('Deine Rückfrage fehlt in der Liste?')}{' '}
          <a href="#/intents/rueckfrage-vorbereiten" className="font-medium text-primary underline underline-offset-2">
            {tx('Rückfrage vorbereiten')}
          </a>
        </p>
      </WizardStep>

      <WizardStep label={tx('Antwort')} description={tx('Halte fest, was geantwortet wurde und wie vollständig die Antwort ist.')} needs={['beantwortete_kommunikation']}>
        <div className="space-y-4">
          <Bound form={komm} name="kanal" />
          <Bound form={komm} name="absender" />
          <Bound form={komm} name="betreff" />
          <Bound form={komm} name="inhalt" rows={5} />
          <Bound form={komm} name="antwortstatus" />
          <StepNav onBack={() => setStep(1)} onNext={() => flow.validateStep(2)} nextStepLabel={tx('Prüfung')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfung')} description={tx('Wähle den offenen Punkt, den die Antwort betrifft, und bestätige die fachliche Prüfung.')} needs={['betreff', 'inhalt']}>
        <div className="space-y-4">
          <EntitySelectStep {...flow.picks.offene_punkte.select} {...flow.pick('offene_punkte')}
            searchPlaceholder={tx('Kurztitel …')}
            emptyText={tx('Kein offener Punkt vorhanden. Du kannst ohne Auswahl fortfahren.')} />
          <Bound form={punkt} name="antwort_geprueft" />
          <StepNav onBack={() => setStep(2)} onNext={() => true} nextStepLabel={tx('Abschluss')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Abschluss')} description={tx('Schließe den Punkt mit Ergebnis ab oder lass die Antwort erneut prüfen.')}>
        <div className="space-y-4">
          <Bound form={punkt} name="status" />
          <Bound form={punkt} name="loesung_oder_ergebnis" rows={4} />
          <Bound form={punkt} name="abschluss_durch" />
          <Bound form={punkt} name="erneute_pruefung_erforderlich" />
          <StepNav onBack={() => setStep(3)} onNext={checkAbschluss} nextStepLabel={tx('Prüfen')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfen')}>
        {!flow.submit.done && (
          <SummaryStep forms={flow.formList} submit={flow.submit}
            items={[{ key: 'kommunikationstyp', label: tx('Kommunikationstyp'), value: tx('Antwort') }]}
            whatHappensNext={tx('Die Antwort wird der Rückfrage zugeordnet. Ein offener Punkt wird nur geändert, wenn du ihn gewählt hast — er schließt sich nie automatisch.')} />
        )}
      </WizardStep>

      {flow.submit.result && (
        <SuccessStep result={flow.submit.result} forms={flow.formList} submit={flow.submit}
          next={[
            { label: tx('Beurteilung und Entscheidung dokumentieren'), href: '#/intents/entscheidung-dokumentieren' },
            { label: tx('Zum Dashboard'), href: '#/' },
          ]}
          whatHappensNext={tx('Dokumentiere als Nächstes Beurteilung und Entscheidung zu dieser Antwort.')} />
      )}
    </IntentWizardShell>
  );
}
