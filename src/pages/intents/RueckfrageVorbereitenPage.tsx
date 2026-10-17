/**
 * Rückfrage vorbereiten — 6-Schritt-Wizard.
 * Steps: 1) Offenen Punkt wählen → 2) Weitere Punkte → 3) Quelle → 4) Anfrage → 5) Rückfrage formulieren & Wartestatus → 6) Prüfen & als Entwurf speichern.
 * Reads: offene_punkte, informationsquellen, kundenanfragen. Writes: rueckfragen_und_kommunikation (Entwurf, nie versendet), offene_punkte (status).
 * Composes: IntentWizardShell, EntitySelectStep, Bound, Field, ChoiceGroup, StepNav, SummaryStep, SuccessStep.
 */
import { useState } from 'react';
import { IntentWizardShell, WizardStep } from '@/components/blocks/IntentWizardShell';
import { EntitySelectStep } from '@/components/blocks/EntitySelectStep';
import { Bound } from '@/components/blocks/Bound';
import { Field } from '@/components/blocks/Field';
import { ChoiceGroup } from '@/components/blocks/ChoiceGroup';
import { StepNav } from '@/components/blocks/StepNav';
import { SummaryStep } from '@/components/blocks/SummaryStep';
import { SuccessStep } from '@/components/blocks/SuccessStep';
import { fieldText, fieldLookup, fieldRef } from '@/lib/journey';
import { useRueckfrageVorbereitenFlow } from '@/lib/journey/flows/RueckfrageVorbereiten';
import { tx } from '@/i18n';

const WAIT_STATUS = ['wartet_kunde', 'wartet_intern'];

export default function RueckfrageVorbereitenPage() {
  const [step, setStep] = useState(1);
  const flow = useRueckfrageVorbereitenFlow({
    steps: {
      offene_punkte: 1,
      zugehoerige_offene_punkte: 2,
      quelle: 3,
      anfrage: 4,
      kommunikationstyp: 5,
      kanal: 5,
      absender: 5,
      empfaenger: 5,
      betreff: 5,
      inhalt: 5,
      antwort_erwartet_bis: 5,
      status: 5,
    },
    items: {
      offene_punkte: r => ({
        id: r.id,
        title: fieldText(r, 'kurztitel'),
        subtitle: [fieldLookup(r, 'prioritaet')?.label, fieldText(r, 'verantwortlicher')].filter(Boolean).join(' · '),
        status: fieldLookup(r, 'status') ?? undefined,
      }),
      zugehoerige_offene_punkte: r => ({
        id: r.id,
        title: fieldText(r, 'kurztitel'),
        subtitle: [fieldLookup(r, 'prioritaet')?.label, fieldText(r, 'verantwortlicher')].filter(Boolean).join(' · '),
        status: fieldLookup(r, 'status') ?? undefined,
      }),
    },
  });

  const punkte = flow.picks.offene_punkte;
  const kommu = flow.forms.rueckfragen_und_kommunikation;
  const punktForm = flow.forms.offene_punkte;
  const mainPick = flow.pick('offene_punkte');
  const hauptPick = flow.pick('offener_punkt');
  const anfragePick = flow.pick('anfrage');
  const statusChoice = punktForm.choice('status');

  const onPickPunkt = (id: string) => {
    mainPick.onSelect(id);
    hauptPick.onSelect(id);
    const rec = punkte.recordOf(id);
    const anfrageId = rec ? fieldRef(rec, 'anfrage') : null;
    if (anfrageId) anfragePick.onSelect(anfrageId);
  };

  return (
    <IntentWizardShell
      title={tx('Rückfrage vorbereiten')}
      currentStep={step}
      onStepChange={setStep}
      forms={flow.formList}
      draftKey={flow.draftKey}
      intro={{
        description: tx('Aus einem offenen Punkt einen Rückfrageentwurf erstellen — ohne Versand.'),
        needs: [tx('Den offenen Punkt'), tx('Empfänger und Wortlaut')],
      }}
    >
      <WizardStep label={tx('Offener Punkt')} description={tx('Für welchen offenen Punkt brauchst du eine Rückfrage?')}>
        <EntitySelectStep
          {...punkte.select}
          selectedId={mainPick.selectedId}
          onSelect={onPickPunkt}
          searchPlaceholder={tx('Kurztitel suchen …')}
        />
        <StepNav onNext={() => flow.validateStep(1)} nextStepLabel={tx('Weitere Punkte')} />
      </WizardStep>

      <WizardStep
        label={tx('Weitere Punkte')}
        description={tx('Optional: weitere offene Punkte, die in dieselbe Rückfrage gehören.')}
        needs={['offene_punkte']}
      >
        <Field form={flow.forms.rueckfragen_und_kommunikation} name="zugehoerige_offene_punkte">
          <EntitySelectStep
            {...flow.picks.zugehoerige_offene_punkte.select}
            {...flow.pickMany('zugehoerige_offene_punkte')}
            searchPlaceholder={tx('Kurztitel suchen …')}
          />
        </Field>
        <StepNav onBack={() => setStep(1)} onNext={() => flow.validateStep(2)} nextStepLabel={tx('Quelle')} />
      </WizardStep>

      <WizardStep
        label={tx('Quelle')}
        description={tx('Optional: Auf welche Informationsquelle bezieht sich die Rückfrage?')}
        needs={['offene_punkte']}
      >
        <EntitySelectStep
          {...flow.picks.quelle.select}
          {...flow.pick('quelle')}
          searchPlaceholder={tx('Titel suchen …')}
        />
        <StepNav onBack={() => setStep(2)} onNext={() => flow.validateStep(3)} nextStepLabel={tx('Anfrage')} />
      </WizardStep>

      <WizardStep
        label={tx('Anfrage')}
        description={tx('Zu welcher Kundenanfrage gehört die Rückfrage?')}
        needs={['offene_punkte']}
      >
        <EntitySelectStep {...flow.picks.anfrage.select} {...anfragePick} />
        <StepNav onBack={() => setStep(3)} onNext={() => flow.validateStep(4)} nextStepLabel={tx('Formulieren')} />
      </WizardStep>

      <WizardStep
        label={tx('Formulieren')}
        description={tx('Empfänger, Betreff und Wortlaut festlegen und den Wartestatus wählen.')}
        needs={['offene_punkte']}
      >
        <div className="space-y-4">
          <Bound form={kommu} name="kommunikationstyp" />
          <Bound form={kommu} name="kanal" />
          <Bound form={kommu} name="absender" />
          <Bound form={kommu} name="empfaenger" />
          <Bound form={kommu} name="betreff" />
          <Bound form={kommu} name="inhalt" rows={6} />
          <Bound form={kommu} name="antwort_erwartet_bis" />
          <Field form={punktForm} name="status" hint={tx('Worauf wartet der Punkt, bis die Antwort da ist?')}>
            <ChoiceGroup {...statusChoice} options={statusChoice.options.filter(o => WAIT_STATUS.includes(o.key))} />
          </Field>
          <StepNav onBack={() => setStep(4)} onNext={() => flow.validateStep(5)} nextStepLabel={tx('Prüfen')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfen')}>
        {!flow.submit.done && (
          <SummaryStep
            forms={flow.formList}
            submit={flow.submit}
            items={[{ key: 'versandstatus', label: tx('Versandstatus'), value: tx('Entwurf — nicht versendet') }]}
            whatHappensNext={tx('Die Rückfrage wird nur als Entwurf gespeichert und nicht versendet. Der offene Punkt wechselt auf den gewählten Wartestatus.')}
          />
        )}
      </WizardStep>

      {flow.submit.result && (
        <SuccessStep
          result={flow.submit.result}
          forms={flow.formList}
          submit={flow.submit}
          title={tx('Rückfrageentwurf gespeichert')}
          whatHappensNext={tx('Entwurf, nicht versendet: Die Rückfrage geht erst raus, wenn du sie selbst verschickst. Der Punkt wartet jetzt auf Kunde oder intern.')}
          next={[
            { label: tx('Antwort zuordnen'), href: '#/intents/antwort-zuordnen' },
            { label: tx('Weitere Rückfrage vorbereiten') /* i18n-exempt */, onClick: () => { flow.reset(); setStep(1); } },
            { label: tx('Zum Dashboard'), href: '#/' },
          ]}
        />
      )}
    </IntentWizardShell>
  );
}
