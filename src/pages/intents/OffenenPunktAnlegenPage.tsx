/**
 * Offenen Punkt anlegen — 5-Schritt-Wizard.
 * Steps: 1) Anfrage wählen → 2) Betroffene Anforderungen und Quellen → 3) Punkt beschreiben und zuweisen
 *        → 4) Aufgabe ableiten (optional) → 5) Prüfen & anlegen.
 * Reads: kundenanfragen, technische_anforderungen, informationsquellen (über den Flow-Hook).
 * Writes: offene_punkte, aufgaben (nur wenn ausgefüllt) — über useOffenenPunktAnlegenFlow.
 * Composes: IntentWizardShell, EntitySelectStep, Bound, StepNav, SummaryStep, SuccessStep.
 */
import { useEffect, useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { IntentWizardShell, WizardStep } from '@/components/blocks/IntentWizardShell';
import { EntitySelectStep } from '@/components/blocks/EntitySelectStep';
import { Bound } from '@/components/blocks/Bound';
import { Field } from '@/components/blocks/Field';
import { StepNav } from '@/components/blocks/StepNav';
import { SummaryStep } from '@/components/blocks/SummaryStep';
import { SuccessStep } from '@/components/blocks/SuccessStep';
import { fieldText, fieldLookup } from '@/lib/journey';
import { useOffenenPunktAnlegenFlow } from '@/lib/journey/flows/OffenenPunktAnlegen';
import { tx } from '@/i18n';

export default function OffenenPunktAnlegenPage() {
  const flow = useOffenenPunktAnlegenFlow({
    steps: {
      anfrage: 1,
      betroffene_anforderungen: 2, betroffene_quellen: 2,
      kurztitel: 3, beschreibung: 3, punktetyp: 3, prioritaet: 3, auswirkung: 3,
      zustaendige_rolle: 3, verantwortlicher: 3, faellig_am: 3, erledigungskriterium: 3,
      titel: 4, aufgabentyp: 4,
    },
    items: {
      anfrage: r => ({
        id: r.id,
        title: fieldText(r, 'anfragenummer') || tx('Anfrage ohne Nummer'),
        subtitle: fieldText(r, 'verantwortlicher') || tx('Kein Verantwortlicher'),
        status: fieldLookup(r, 'status') ?? undefined,
      }),
      betroffene_anforderungen: r => ({
        id: r.id,
        title: fieldText(r, 'bezeichnung'),
        subtitle: fieldLookup(r, 'anforderungstyp')?.label,
        status: fieldLookup(r, 'pruefstatus') ?? undefined,
      }),
      betroffene_quellen: r => ({
        id: r.id,
        title: fieldText(r, 'titel'),
        subtitle: fieldLookup(r, 'quellentyp')?.label,
        status: fieldLookup(r, 'quellenstatus') ?? undefined,
      }),
    },
  });
  const { offene_punkte: op, aufgaben: au } = flow.forms;
  const [step, setStep] = useState(1);

  const anfrageId = String(op.get('anfrage') ?? '');
  const anfrageRec = anfrageId ? flow.picks.anfrage.recordOf(anfrageId) : undefined;
  const verantwortlicher = anfrageRec ? fieldText(anfrageRec, 'verantwortlicher').trim() : '';
  const aufgabeTitel = String(au.get('titel') ?? '').trim();
  const aufgabeAnfrage = String(au.get('anfrage') ?? '');

  // The task belongs to the same inquiry as the point — carried over once a task is started.
  useEffect(() => {
    const setter = au.set as (k: string, v: unknown, l?: string) => void;
    if (aufgabeTitel && anfrageId && aufgabeAnfrage !== anfrageId) {
      setter('anfrage', anfrageId, flow.picks.anfrage.labelOf(anfrageId));
    } else if (!aufgabeTitel && aufgabeAnfrage) {
      setter('anfrage', '', '');
    }
  }, [aufgabeTitel, anfrageId, aufgabeAnfrage]);

  const aufgabeStarted = ['titel', 'beschreibung', 'aufgabentyp', 'verantwortlicher', 'faellig_am']
    .some(k => String(au.get(k) ?? '').trim() !== '');

  return (
    <IntentWizardShell
      title={tx('Offenen Punkt anlegen')}
      currentStep={step} onStepChange={setStep}
      forms={flow.formList} draftKey={flow.draftKey}
      intro={{
        description: tx('Offene Punkte dokumentieren und bei Bedarf direkt eine Aufgabe daraus ableiten.'),
        needs: [tx('Die betroffene Anfrage'), tx('Grund und Auswirkung des Punkts'), tx('Eine verantwortliche Person')],
      }}
    >
      <WizardStep label={tx('Anfrage')} heading={tx('Anfrage wählen')} description={tx('Zu welcher Kundenanfrage gehört der offene Punkt?')}>
        <div className="space-y-4">
          <EntitySelectStep {...flow.picks.anfrage.select} {...flow.pick('anfrage')} searchPlaceholder={tx('Anfragenummer suchen …')} />
          {anfrageRec && !verantwortlicher && (
            <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <IconAlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{tx('Bitte einen Verantwortlichen angeben.')}</span>
            </p>
          )}
          <StepNav
            hideBack
            onNext={() => {
              if (!anfrageId) return flow.validateStep(1);
              if (!verantwortlicher) return tx('Bitte einen Verantwortlichen angeben.');
              return flow.validateStep(1);
            }}
            nextStepLabel={tx('Betroffene Anforderungen')}
          />
        </div>
      </WizardStep>

      <WizardStep label={tx('Betroffenes')} heading={tx('Anforderungen und Quellen')} description={tx('Welche Anforderungen und Quellen sind betroffen? Beides ist optional.')} needs={['anfrage']}>
        <div className="space-y-6">
          <Field form={op} name="betroffene_anforderungen">
            <EntitySelectStep {...flow.picks.betroffene_anforderungen.select} {...flow.pickMany('betroffene_anforderungen')} searchPlaceholder={tx('Anforderung suchen …')} />
          </Field>
          <Field form={op} name="betroffene_quellen">
            <EntitySelectStep {...flow.picks.betroffene_quellen.select} {...flow.pickMany('betroffene_quellen')} searchPlaceholder={tx('Quelle suchen …')} />
          </Field>
          <StepNav onBack={() => setStep(1)} onNext={() => flow.validateStep(2)} nextStepLabel={tx('Punkt beschreiben')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Punkt')} heading={tx('Punkt beschreiben')} description={tx('Grund, Typ, Priorität, Auswirkung und Zuständigkeit festlegen.')} needs={['anfrage']}>
        <div className="space-y-4">
          <Bound form={op} name="kurztitel" />
          <Bound form={op} name="beschreibung" rows={4} />
          <Bound form={op} name="punktetyp" />
          <Bound form={op} name="prioritaet" />
          <Bound form={op} name="auswirkung" />
          <Bound form={op} name="zustaendige_rolle" />
          <Bound form={op} name="verantwortlicher" />
          <Bound form={op} name="faellig_am" />
          <Bound form={op} name="erledigungskriterium" rows={3} />
          <StepNav onBack={() => setStep(2)} onNext={() => flow.validateStep(3)} nextStepLabel={tx('Aufgabe ableiten')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Aufgabe')} heading={tx('Aufgabe ableiten')} description={tx('Optional: Aus dem Punkt eine verantwortete Aufgabe machen. Ohne Titel wird keine Aufgabe angelegt.')} needs={['anfrage']}>
        <div className="space-y-4">
          <Bound form={au} name="titel" />
          <Bound form={au} name="beschreibung" rows={3} />
          <Bound form={au} name="aufgabentyp" />
          <Bound form={au} name="verantwortlicher" />
          <Bound form={au} name="faellig_am" />
          <StepNav
            onBack={() => setStep(3)}
            onNext={() => (aufgabeStarted ? au.validate(['titel', 'verantwortlicher']) : true)}
            nextStepLabel={tx('Prüfen')}
          />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfen')}>
        {!flow.submit.done && (
          <SummaryStep
            forms={flow.formList} submit={flow.submit}
            whatHappensNext={tx('Der Punkt wird mit Status „zugewiesen“ angelegt; eine Aufgabe entsteht nur, wenn du einen Titel eingetragen hast.')}
          />
        )}
      </WizardStep>

      {flow.submit.result && (
        <SuccessStep
          result={flow.submit.result} forms={flow.formList} submit={flow.submit}
          whatHappensNext={tx('Als Nächstes kannst du zum offenen Punkt eine Rückfrage vorbereiten.')}
          next={[
            { label: tx('Rückfrage vorbereiten'), href: '#/intents/rueckfrage-vorbereiten' },
            { label: tx('Zum Dashboard'), href: '#/' },
          ]}
        />
      )}
    </IntentWizardShell>
  );
}
