/**
 * Beurteilung und Entscheidung dokumentieren — 5-Schritt-Wizard.
 * Steps: 1) Anfrage wählen → 2) Betroffene Anforderungen und offene Punkte wählen →
 * 3) Beurteilung erfassen → 4) Entscheidung erfassen (optional) → 5) Prüfen & anlegen.
 * Reads: kundenanfragen, technische_anforderungen, offene_punkte, informationsquellen.
 * Writes: beurteilungen (Prüfstatus Entwurf), optional entscheidungen (createBeurteilungenEntry / createEntscheidungenEntry via Flow-Plan).
 * Composes: IntentWizardShell, EntitySelectStep, Bound, Field, StepNav, SummaryStep, SuccessStep.
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IntentWizardShell, WizardStep } from '@/components/blocks/IntentWizardShell';
import { EntitySelectStep } from '@/components/blocks/EntitySelectStep';
import { Bound } from '@/components/blocks/Bound';
import { Field } from '@/components/blocks/Field';
import { StepNav } from '@/components/blocks/StepNav';
import { SummaryStep } from '@/components/blocks/SummaryStep';
import { SuccessStep } from '@/components/blocks/SuccessStep';
import { fieldText, fieldLookup } from '@/lib/journey';
import { useEntscheidungDokumentierenFlow } from '@/lib/journey/flows/EntscheidungDokumentieren';
import { tx } from '@/i18n';

type Copier = {
  set: (k: string, v: unknown, label?: string) => void;
  get: (k: string) => unknown;
};

export default function EntscheidungDokumentierenPage() {
  const [step, setStep] = useState(1);
  const [wantRaw, setWantRaw] = useState<boolean | null>(null);

  const flow = useEntscheidungDokumentierenFlow({
    steps: {
      anfrage: 1,
      betroffene_anforderungen: 2, betroffene_offene_punkte: 2,
      beurteilungsgegenstand: 3, beurteilungsart: 3, einschaetzung: 3, fachliche_begruendung: 3,
      annahmen: 3, unsicherheiten: 3, alternativen: 3, empfehlung: 3, ist_ki_vorschlag: 3, erstellt_von: 3,
      zugrunde_liegende_quellen: 3, zugrunde_liegende_anforderungen: 3,
      titel: 4, entscheidungsgegenstand: 4, entscheidungstyp: 4, entscheidung: 4, begruendung: 4,
      entscheidungsverantwortlicher: 4, entscheidungskompetenz_geprueft: 4, auflagen: 4,
    },
    items: {
      anfrage: r => ({
        id: r.id,
        title: fieldText(r, 'anfragenummer') || tx('Anfrage ohne Nummer'),
        subtitle: fieldText(r, 'anfragebeschreibung'),
        status: fieldLookup(r, 'status') ?? undefined,
      }),
      betroffene_anforderungen: r => ({
        id: r.id, title: fieldText(r, 'bezeichnung'), status: fieldLookup(r, 'pruefstatus') ?? undefined,
      }),
      betroffene_offene_punkte: r => ({
        id: r.id, title: fieldText(r, 'kurztitel'),
        subtitle: fieldLookup(r, 'prioritaet')?.label,
        status: fieldLookup(r, 'status') ?? undefined,
      }),
      zugrunde_liegende_quellen: r => ({ id: r.id, title: fieldText(r, 'titel'), subtitle: fieldLookup(r, 'quellentyp')?.label }),
      zugrunde_liegende_anforderungen: r => ({
        id: r.id, title: fieldText(r, 'bezeichnung'), status: fieldLookup(r, 'pruefstatus') ?? undefined,
      }),
    },
  });

  const beurteilung = flow.forms.beurteilungen;
  const entscheidung = flow.forms.entscheidungen;
  const wantDecision = wantRaw ?? Boolean(entscheidung.get('titel'));

  // The Entscheidung shares Anfrage and the affected items with the Beurteilung —
  // copy them over only when a decision is really documented.
  const copyShared = () => {
    const from = beurteilung as unknown as Copier;
    const to = entscheidung as unknown as Copier;
    const anfrageId = from.get('anfrage');
    if (typeof anfrageId === 'string' && anfrageId) to.set('anfrage', anfrageId, flow.picks.anfrage.labelOf(anfrageId));
    for (const k of ['betroffene_anforderungen', 'betroffene_offene_punkte']) {
      const ids = from.get(k);
      to.set(k, Array.isArray(ids) ? ids : []);
    }
  };

  const nextFromDecision = () => {
    if (!wantDecision) {
      entscheidung.reset();
      return true;
    }
    copyShared();
    const ok = flow.validateStep(4);
    if (!ok) return ok;
    if (!entscheidung.get('entscheidungskompetenz_geprueft')) {
      return tx('Die Entscheidungskompetenz muss geprüft sein.');
    }
    return true;
  };

  const restart = () => { flow.reset(); setWantRaw(null); setStep(1); };

  return (
    <IntentWizardShell
      title={tx('Beurteilung und Entscheidung dokumentieren')}
      currentStep={step} onStepChange={setStep}
      forms={flow.formList} draftKey={flow.draftKey}
      intro={{
        description: tx('Fachliche Beurteilung festhalten und darauf gestützt eine Entscheidung dokumentieren.'),
        needs: [tx('Die betroffene Anfrage'), tx('Deine fachliche Begründung'), tx('Verantwortliche Person für die Entscheidung')],
      }}
    >
      <WizardStep label={tx('Anfrage')} description={tx('Zu welcher Kundenanfrage gehört die Beurteilung?')}>
        <EntitySelectStep {...flow.picks.anfrage.select} {...flow.pick('anfrage')}
          searchPlaceholder={tx('Anfragenummer suchen …')} />
      </WizardStep>

      <WizardStep label={tx('Betroffenes')}
        description={tx('Welche Anforderungen und offenen Punkte betrifft das? Mehrfachauswahl möglich.')}>
        <div className="space-y-6">
          <Field form={beurteilung} name="betroffene_anforderungen">
            <EntitySelectStep {...flow.picks.betroffene_anforderungen.select} {...flow.pickMany('betroffene_anforderungen')}
              searchPlaceholder={tx('Anforderung suchen …')} />
          </Field>
          <Field form={beurteilung} name="betroffene_offene_punkte">
            <EntitySelectStep {...flow.picks.betroffene_offene_punkte.select} {...flow.pickMany('betroffene_offene_punkte')}
              searchPlaceholder={tx('Offenen Punkt suchen …')} />
          </Field>
          <StepNav onBack={() => setStep(1)} onNext={() => flow.validateStep(2)} nextStepLabel={tx('Beurteilung')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Beurteilung')}
        description={tx('Einschätzung, Begründung und Unsicherheiten festhalten.')}>
        <div className="space-y-4">
          <Bound form={beurteilung} name="beurteilungsgegenstand" />
          <Bound form={beurteilung} name="beurteilungsart" />
          <Bound form={beurteilung} name="einschaetzung" />
          <Bound form={beurteilung} name="fachliche_begruendung" rows={4} />
          <Bound form={beurteilung} name="annahmen" rows={3} />
          <Bound form={beurteilung} name="unsicherheiten" rows={3} />
          <Bound form={beurteilung} name="alternativen" rows={3} />
          <Bound form={beurteilung} name="empfehlung" rows={3} />
          <Bound form={beurteilung} name="ist_ki_vorschlag" />
          <Bound form={beurteilung} name="erstellt_von" />
          <Field form={beurteilung} name="zugrunde_liegende_quellen">
            <EntitySelectStep {...flow.picks.zugrunde_liegende_quellen.select} {...flow.pickMany('zugrunde_liegende_quellen')}
              searchPlaceholder={tx('Quelle suchen …')} />
          </Field>
          <Field form={beurteilung} name="zugrunde_liegende_anforderungen">
            <EntitySelectStep {...flow.picks.zugrunde_liegende_anforderungen.select} {...flow.pickMany('zugrunde_liegende_anforderungen')}
              searchPlaceholder={tx('Anforderung suchen …')} />
          </Field>
          <StepNav onBack={() => setStep(2)} onNext={() => flow.validateStep(3)} nextStepLabel={tx('Entscheidung')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Entscheidung')}
        description={tx('Optional: Entscheidung auf Basis der Beurteilung dokumentieren — ohne automatische Freigabe.')}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label={tx('Entscheidung dokumentieren?')}>
            <Button type="button" variant={wantDecision ? 'default' : 'outline'} aria-pressed={wantDecision}
              onClick={() => setWantRaw(true)}>
              {tx('Entscheidung dokumentieren')}
            </Button>
            <Button type="button" variant={!wantDecision ? 'default' : 'outline'} aria-pressed={!wantDecision}
              onClick={() => setWantRaw(false)}>
              {tx('Nur Beurteilung speichern')}
            </Button>
          </div>
          {wantDecision && (
            <div className="space-y-4">
              <Bound form={entscheidung} name="titel" />
              <Bound form={entscheidung} name="entscheidungsgegenstand" rows={3} />
              <Bound form={entscheidung} name="entscheidungstyp" />
              <Bound form={entscheidung} name="alternativen" rows={3} />
              <Bound form={entscheidung} name="entscheidung" rows={3} />
              <Bound form={entscheidung} name="begruendung" rows={3} />
              <Bound form={entscheidung} name="entscheidungsverantwortlicher" />
              <Bound form={entscheidung} name="entscheidungskompetenz_geprueft" />
              <Bound form={entscheidung} name="auflagen" rows={3} />
            </div>
          )}
          <StepNav onBack={() => setStep(3)} onNext={nextFromDecision} nextStepLabel={tx('Prüfen')} />
        </div>
      </WizardStep>

      <WizardStep label={tx('Prüfen')}>
        {!flow.submit.done && (
          <SummaryStep forms={wantDecision ? flow.formList : [beurteilung]} submit={flow.submit}
            items={[{
              key: 'info:entscheidung', label: tx('Entscheidung'),
              value: wantDecision ? tx('Wird mit angelegt (Status wird vom System vergeben)') : tx('Nur Beurteilung'),
            }]}
            whatHappensNext={tx('Die Beurteilung wird als Entwurf gespeichert. Es erfolgt keine automatische Freigabe.')} />
        )}
      </WizardStep>

      {flow.submit.result && (
        <SuccessStep result={flow.submit.result} forms={wantDecision ? flow.formList : [beurteilung]} submit={flow.submit}
          next={[
            { label: tx('Weitere Beurteilung dokumentieren'), onClick: restart },
            { label: tx('Rückfrage vorbereiten'), href: '#/intents/rueckfrage-vorbereiten' },
            { label: tx('Zum Dashboard'), href: '#/' },
          ]}
          whatHappensNext={tx('Die Beurteilung muss noch fachlich geprüft werden, bevor sie als bestätigt gilt.')} />
      )}
    </IntentWizardShell>
  );
}
