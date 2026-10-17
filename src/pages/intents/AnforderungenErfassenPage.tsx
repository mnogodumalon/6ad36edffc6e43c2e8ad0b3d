/**
 * Anforderungen erfassen — 4-Schritt-Wizard.
 * Steps: 1) Anfrage wählen → 2) Anforderung mit Typ, Ursprung und Sollwert erfassen → 3) Quellen verknüpfen & Pflichtanforderung kennzeichnen → 4) Prüfen & Anfrage in Prüfung setzen.
 * Reads: kundenanfragen, informationsquellen. Writes: technische_anforderungen (create), kundenanfragen (update status/vollstaendigkeit).
 * Composes: IntentWizardShell, EntitySelectStep, Bound, Field, StepNav, SummaryStep, SuccessStep.
 */
import { useState } from 'react';
import { IntentWizardShell, WizardStep } from '@/components/blocks/IntentWizardShell';
import { EntitySelectStep } from '@/components/blocks/EntitySelectStep';
import { Bound } from '@/components/blocks/Bound';
import { Field } from '@/components/blocks/Field';
import { StepNav } from '@/components/blocks/StepNav';
import { SummaryStep } from '@/components/blocks/SummaryStep';
import { SuccessStep } from '@/components/blocks/SuccessStep';
import { fieldText, fieldLookup } from '@/lib/journey';
import { useAnforderungenErfassenFlow } from '@/lib/journey/flows/AnforderungenErfassen';
import { tx } from '@/i18n';

export default function AnforderungenErfassenPage() {
  const [step, setStep] = useState(1);
  const flow = useAnforderungenErfassenFlow({
    steps: {
      kundenanfragen: 1, anfrage: 1,
      bezeichnung: 2, beschreibung: 2, anforderungstyp: 2, ursprung: 2, sollwert: 2, einheit: 2,
      vergleichsoperator: 2, min_wert: 2, max_wert: 2,
      quellen: 3, ist_pflichtanforderung: 3, verantwortlicher: 3,
    },
    items: {
      anfrage: (r, ctx) => ({ id: r.id, title: fieldText(r, 'anfragenummer'), subtitle: ctx.ref('kunde') ?? undefined }),
      kundenanfragen: (r, ctx) => ({ id: r.id, title: fieldText(r, 'anfragenummer'), subtitle: ctx.ref('kunde') ?? undefined }),
      quellen: r => ({
        id: r.id,
        title: fieldText(r, 'titel'),
        subtitle: fieldLookup(r, 'quellentyp')?.label,
      }),
    },
  });
  const f = flow.forms.technische_anforderungen;

  // One pick of the inquiry feeds both: the requirement's link and the record whose status changes.
  const pickAnfrage = (id: string) => {
    flow.pick('anfrage').onSelect(id);
    flow.pick('kundenanfragen').onSelect(id);
  };

  return (
    <IntentWizardShell
      title={tx('Anforderungen erfassen')}
      currentStep={step}
      onStepChange={setStep}
      forms={flow.formList}
      draftKey={flow.draftKey}
      intro={{
        description: tx('Eine technische Anforderung anlegen, Quellen verknüpfen und die Anfrage in Prüfung setzen.'),
        needs: [tx('Anfragenummer'), tx('Bezeichnung und Beschreibung der Anforderung')],
      }}
    >
      <WizardStep label={tx('Anfrage')} description={tx('Zu welcher Anfrage gehört die Anforderung?')}>
        <EntitySelectStep
          {...flow.picks.anfrage.select}
          selectedId={flow.pick('anfrage').selectedId}
          onSelect={pickAnfrage}
          searchPlaceholder={tx('Anfragenummer, Kundenreferenz oder Produkt …')}
        />
      </WizardStep>

      <WizardStep label={tx('Anforderung')} description={tx('Was wird gefordert, woher stammt es und welcher Sollwert gilt?')} needs={['anfrage']}>
        <div className="space-y-4">
          <Bound form={f} name="bezeichnung" />
          <Bound form={f} name="beschreibung" rows={3} />
          <Bound form={f} name="anforderungstyp" />
          <Bound form={f} name="ursprung" />
          <Bound form={f} name="vergleichsoperator" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Bound form={f} name="sollwert" />
            <Bound form={f} name="einheit" />
            <Bound form={f} name="min_wert" />
            <Bound form={f} name="max_wert" />
          </div>
          <StepNav
            onBack={() => setStep(1)}
            onNext={() => flow.validateStep(2)}
            nextStepLabel={tx('Quellen')}
          />
        </div>
      </WizardStep>

      <WizardStep label={tx('Quellen & Pflicht')} description={tx('Belege verknüpfen und festlegen, ob die Anforderung verbindlich ist.')} needs={['anfrage']}>
        <div className="space-y-4">
          <Field form={f} name="quellen">
            <EntitySelectStep {...flow.picks.quellen.select} {...flow.pickMany('quellen')} searchPlaceholder={tx('Quelle suchen …')} />
          </Field>
          <Bound form={f} name="ist_pflichtanforderung" />
          <Bound form={f} name="verantwortlicher" />
          <StepNav
            onBack={() => setStep(2)}
            onNext={() => flow.validateStep(3)}
            nextStepLabel={tx('Prüfen')}
          />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfen')} description={tx('Alles richtig? Die Anfrage wird danach in Prüfung gesetzt.')}>
        {!flow.submit.done && (
          <SummaryStep
            forms={flow.formList}
            submit={flow.submit}
            whatHappensNext={tx('Die Anforderung wird als ungeprüft angelegt, die Anfrage wechselt in „In Prüfung“ mit Vollständigkeit „In Klärung“.')}
          />
        )}
      </WizardStep>

      {flow.submit.result && (
        <SuccessStep
          result={flow.submit.result}
          forms={flow.formList}
          submit={flow.submit}
          next={[
            { label: tx('Offenen Punkt anlegen'), href: '#/intents/offenen-punkt-anlegen' },
            { label: tx('Zum Dashboard'), href: '#/' },
          ]}
          whatHappensNext={tx('Offene Fragen zu dieser Anforderung erfasst du als offenen Punkt.')}
        />
      )}
    </IntentWizardShell>
  );
}
