"use client";

import * as React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wedding, type AttendanceType } from "@/config/wedding";
import {
  attendingFormSchema,
  decliningFormSchema,
  type AttendingFormValues,
  type DecliningFormValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/client-hooks";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { PersonFields } from "@/components/rsvp/PersonFields";
import { LocationReveal } from "@/components/rsvp/LocationReveal";

type Mode = "choose" | "attending" | "declining" | "successAttend" | "successDecline";
type Step = "primary" | "companions" | "type" | "review";
const STEPS: Step[] = ["primary", "companions", "type", "review"];

const LAST_KEY = "bes:rsvp:last:v1";

const emptyPerson = { fullName: "", age: "", phone: "" };

const TYPE_LABEL: Record<AttendanceType, string> = {
  CEREMONY_AND_RESTAURANT: "Cerimônia e Restaurante",
  CEREMONY_ONLY: "Somente cerimônia",
};

interface LastResult {
  willAttend: boolean;
  attendanceType: AttendanceType | null;
}

function readLastResult(): LastResult | null {
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as LastResult) : null;
  } catch {
    return null;
  }
}

export function RsvpWizard() {
  const [mode, setMode] = React.useState<Mode>("choose");
  const [step, setStep] = React.useState<Step>("primary");
  const [result, setResult] = React.useState<LastResult | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [returningDismissed, setReturningDismissed] = React.useState(false);

  const isClient = useIsClient();
  const returning = React.useMemo(
    () => (isClient ? readLastResult() : null),
    [isClient],
  );

  const attendForm = useForm<AttendingFormValues>({
    resolver: zodResolver(attendingFormSchema),
    mode: "onTouched",
    defaultValues: {
      attendanceType: undefined as unknown as AttendanceType,
      primary: { ...emptyPerson },
      companions: [],
    },
  });
  const companions = useFieldArray({
    control: attendForm.control,
    name: "companions",
  });

  const declineForm = useForm<DecliningFormValues>({
    resolver: zodResolver(decliningFormSchema),
    mode: "onTouched",
    defaultValues: { contactName: "", note: "" },
  });

  const persist = (r: LastResult) => {
    setResult(r);
    try {
      window.localStorage.setItem(LAST_KEY, JSON.stringify(r));
    } catch {
      /* ignore */
    }
  };

  const resetAll = () => {
    attendForm.reset();
    declineForm.reset();
    setStep("primary");
    setServerError(null);
    setMode("choose");
  };

  /* ---- navegação entre passos ------------------------------------- */
  const goNext = async () => {
    setServerError(null);
    if (step === "primary") {
      if (await attendForm.trigger("primary")) setStep("companions");
    } else if (step === "companions") {
      if (await attendForm.trigger("companions")) setStep("type");
    } else if (step === "type") {
      if (await attendForm.trigger("attendanceType")) setStep("review");
    }
  };
  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
    else setMode("choose");
  };

  /* ---- submissões ------------------------------------------------- */
  const submitAttending = attendForm.handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          willAttend: true,
          attendanceType: values.attendanceType,
          primary: {
            fullName: values.primary.fullName,
            age: Number(values.primary.age),
            phone: values.primary.phone,
          },
          companions: values.companions.map((c) => ({
            fullName: c.fullName,
            age: Number(c.age),
            phone: c.phone,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      persist({ willAttend: true, attendanceType: values.attendanceType });
      setMode("successAttend");
    } catch {
      setServerError(
        "Não foi possível enviar sua confirmação. Confira os dados e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  const submitDeclining = declineForm.handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          willAttend: false,
          contactName: values.contactName,
          note: values.note || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      persist({ willAttend: false, attendanceType: null });
      setMode("successDecline");
    } catch {
      setServerError("Não foi possível registrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  });

  const watched = useWatch({ control: attendForm.control });
  const values = {
    attendanceType: watched.attendanceType,
    primary: watched.primary ?? emptyPerson,
    companions: watched.companions ?? [],
  } as AttendingFormValues;
  const totalPeople = 1 + (values.companions?.length ?? 0);

  return (
    <div className="rounded-[calc(var(--radius-base)+8px)] border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-10">
      {returning && !returningDismissed && mode === "choose" && !result && (
        <ReturningNotice
          last={returning}
          onViewAddresses={() => {
            setResult(returning);
            setMode(
              returning.willAttend ? "successAttend" : "successDecline",
            );
          }}
          onDismiss={() => setReturningDismissed(true)}
        />
      )}

      <div>
        {/* ---------- Passo 1: comparecer? ---------- */}
        {mode === "choose" && (
          <div key="choose" className="animate-fade-in flex flex-col gap-6">
            <Header
              step={1}
              total={2}
              title="Você vai poder vir?"
              subtitle="Escolha uma opção para começar."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                title="Comparecerei"
                description="Vou celebrar com vocês."
                onClick={() => {
                  setMode("attending");
                  setStep("primary");
                }}
              />
              <ChoiceCard
                title="Não comparecerei"
                description="Não vou conseguir ir desta vez."
                variant="muted"
                onClick={() => setMode("declining")}
              />
            </div>
          </div>
        )}

        {/* ---------- Fluxo: não comparecerei ---------- */}
        {mode === "declining" && (
          <form
            key="declining"
            onSubmit={submitDeclining}
            noValidate
            className="animate-fade-in flex flex-col gap-6"
          >
            <Header
              step={2}
              total={2}
              title="Tudo bem, obrigado por avisar"
              subtitle="Deixe seu nome para os noivos saberem. Um recado é opcional."
            />
            <Field
              label="Seu nome"
              error={declineForm.formState.errors.contactName?.message}
            >
              <TextInput
                {...declineForm.register("contactName")}
                autoComplete="name"
                placeholder="Nome e sobrenome"
              />
            </Field>
            <Field
              label="Recado (opcional)"
              error={declineForm.formState.errors.note?.message}
            >
              <TextArea
                {...declineForm.register("note")}
                rows={3}
                placeholder="Uma mensagem para o casal…"
              />
            </Field>
            {serverError && <ErrorText>{serverError}</ErrorText>}
            <Footer
              onBack={() => setMode("choose")}
              submitLabel="Registrar ausência"
              submitting={submitting}
            />
          </form>
        )}

        {/* ---------- Fluxo: comparecerei ---------- */}
        {mode === "attending" && (
          <div
            key={`attending-${step}`}
            className="animate-fade-in flex flex-col gap-6"
          >
            <Stepper current={STEPS.indexOf(step)} />

            {step === "primary" && (
              <>
                <Header
                  title="Seus dados"
                  subtitle="Comece pelo convidado principal — quem está confirmando."
                />
                <PersonFields
                  prefix="primary"
                  register={attendForm.register}
                  errors={attendForm.formState.errors}
                />
                <Footer onBack={goBack} onNext={goNext} nextLabel="Continuar" />
              </>
            )}

            {step === "companions" && (
              <>
                <Header
                  title="Levará alguém consigo?"
                  subtitle="Adicione cônjuge, filhos ou acompanhantes — quantos forem necessários. Cada pessoa é registrada individualmente."
                />

                {companions.fields.length === 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ChoiceCard
                      title="Não, irei sozinho(a)"
                      description="Apenas eu."
                      onClick={goNext}
                    />
                    <ChoiceCard
                      title="Sim, levarei acompanhante(s)"
                      description="Vou adicionar as pessoas."
                      onClick={() => companions.append({ ...emptyPerson })}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {companions.fields.map((f, i) => (
                      <fieldset
                        key={f.id}
                        className="rounded-[calc(var(--radius-base)+2px)] border border-secondary/25 bg-[#ffffff0d] p-5"
                      >
                        <legend className="flex w-full items-center justify-between px-1 text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
                          Acompanhante {i + 1}
                          <button
                            type="button"
                            onClick={() => companions.remove(i)}
                            className="rounded px-2 py-1 text-[0.7rem] normal-case tracking-normal text-[color:var(--wc-error)] hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-secondary"
                          >
                            Remover
                          </button>
                        </legend>
                        <div className="mt-3">
                          <PersonFields
                            prefix={`companions.${i}`}
                            register={attendForm.register}
                            errors={attendForm.formState.errors}
                          />
                        </div>
                      </fieldset>
                    ))}

                    {typeof attendForm.formState.errors.companions?.message ===
                      "string" && (
                      <ErrorText>
                        {attendForm.formState.errors.companions.message}
                      </ErrorText>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => companions.append({ ...emptyPerson })}
                      >
                        + Adicionar acompanhante
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => companions.replace([])}
                      >
                        Irei sozinho(a)
                      </Button>
                    </div>
                  </div>
                )}

                <Footer
                  onBack={goBack}
                  onNext={goNext}
                  nextLabel="Continuar"
                  hideNext={companions.fields.length === 0}
                />
              </>
            )}

            {step === "type" && (
              <>
                <Header
                  title="Comparecerá em:"
                  subtitle="A escolha vale para todo o grupo desta confirmação e define quais endereços você verá."
                />
                {wedding.rsvp.restaurantNote && (
                  <p className="flex gap-3 rounded-[var(--radius-base)] border border-secondary/40 bg-secondary/[0.1] p-4 text-[0.85rem] text-ink">
                    <span aria-hidden="true" className="text-secondary">
                      ⚠
                    </span>
                    <span>{wedding.rsvp.restaurantNote}</span>
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    Object.keys(TYPE_LABEL) as AttendanceType[]
                  ).map((t) => (
                    <ChoiceCard
                      key={t}
                      title={TYPE_LABEL[t]}
                      description={
                        t === "CEREMONY_AND_RESTAURANT"
                          ? "Cerimônia na igreja e depois o restaurante (conta individual)."
                          : "Apenas a cerimônia na igreja."
                      }
                      selected={values.attendanceType === t}
                      onClick={() => {
                        attendForm.setValue("attendanceType", t, {
                          shouldValidate: true,
                        });
                        setStep("review");
                      }}
                    />
                  ))}
                </div>
                {attendForm.formState.errors.attendanceType && (
                  <ErrorText>Escolha uma opção para continuar.</ErrorText>
                )}
                <Footer onBack={goBack} />
              </>
            )}

            {step === "review" && (
              <>
                <Header
                  title="Confira antes de enviar"
                  subtitle="Revise os dados. Você pode voltar e ajustar qualquer parte."
                />
                <Summary
                  values={values}
                  onEdit={(s) => setStep(s)}
                />
                {serverError && <ErrorText>{serverError}</ErrorText>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="ghost" onClick={goBack} type="button">
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={submitAttending}
                    loading={submitting}
                  >
                    Finalizar confirmação · {peopleWord(totalPeople)}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------- Sucesso: comparecerei ---------- */}
        {mode === "successAttend" && result?.attendanceType && (
          <div key="ok-attend" className="animate-fade-in flex flex-col gap-6">
            <SuccessHeader
              title={wedding.rsvp.successTitle}
              text={wedding.rsvp.successText}
            />
            <div className="flex flex-col gap-3">
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-ink-soft">
                Localização
              </p>
              <LocationReveal type={result.attendanceType} />
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="self-start text-[0.8rem] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Fazer outra confirmação
            </button>
          </div>
        )}

        {/* ---------- Sucesso: não comparecerei ---------- */}
        {mode === "successDecline" && (
          <div key="ok-decline" className="animate-fade-in flex flex-col gap-5">
            <SuccessHeader
              title={wedding.rsvp.declineTitle}
              text={wedding.rsvp.declineText}
            />
            <button
              type="button"
              onClick={resetAll}
              className="self-start text-[0.8rem] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Mudei de ideia, quero confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponentes                                                     */
/* ------------------------------------------------------------------ */

function peopleWord(n: number) {
  return n === 1 ? "1 pessoa" : `${n} pessoas`;
}

function Header({
  title,
  subtitle,
  step,
  total,
}: {
  title: string;
  subtitle?: string;
  step?: number;
  total?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {step && total && (
        <span className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Etapa {step} de {total}
        </span>
      )}
      <h3 className="font-display text-[length:var(--step-2)] text-ink">
        {title}
      </h3>
      {subtitle && <p className="text-[0.9rem] text-ink-soft">{subtitle}</p>}
    </div>
  );
}

function SuccessHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary text-[color:var(--wc-cream)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h3 className="font-display text-[length:var(--step-2)] text-ink">{title}</h3>
      <p className="max-w-md text-[0.9rem] text-ink-soft">{text}</p>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progresso">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "h-1 w-full rounded-full transition-colors duration-500",
              i <= current ? "bg-primary" : "bg-line",
            )}
          />
        </li>
      ))}
    </ol>
  );
}

function ChoiceCard({
  title,
  description,
  onClick,
  variant = "default",
  selected = false,
}: {
  title: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "muted";
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col items-start gap-1 rounded-[calc(var(--radius-base)+2px)] border p-5 text-left transition-all duration-300 ease-[var(--ease-fluid)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
        selected
          ? "border-secondary bg-secondary/10"
          : "border-line hover:border-ink/40 hover:bg-ink/[0.02]",
        variant === "muted" && !selected && "bg-[#ffffff08]",
      )}
    >
      <span className="flex w-full items-center justify-between font-display text-[length:var(--step-1)] text-ink">
        {title}
        <span
          aria-hidden="true"
          className="translate-x-0 text-secondary transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
      <span className="text-[0.85rem] text-ink-soft">{description}</span>
    </button>
  );
}

function Footer({
  onBack,
  onNext,
  nextLabel = "Continuar",
  submitLabel,
  submitting = false,
  hideNext = false,
}: {
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
  submitLabel?: string;
  submitting?: boolean;
  hideNext?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="ghost" type="button" onClick={onBack}>
        Voltar
      </Button>
      {submitLabel ? (
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      ) : (
        !hideNext &&
        onNext && (
          <Button type="button" onClick={onNext}>
            {nextLabel}
          </Button>
        )
      )}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-[0.82rem] text-[color:var(--wc-error)]">
      {children}
    </p>
  );
}

function Summary({
  values,
  onEdit,
}: {
  values: AttendingFormValues;
  onEdit: (step: Step) => void;
}) {
  const people = [
    { role: "Convidado principal", ...values.primary },
    ...(values.companions ?? []).map((c, i) => ({
      role: `Acompanhante ${i + 1}`,
      ...c,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[calc(var(--radius-base)+2px)] border border-line">
        <Row label="Pessoas" onEdit={() => onEdit("companions")}>
          {peopleWord(people.length)}
        </Row>
        <div className="divide-y divide-line border-t border-line">
          {people.map((p, i) => (
            <div key={i} className="flex flex-col gap-0.5 px-5 py-4">
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-secondary">
                {p.role}
              </span>
              <span className="text-ink">{p.fullName || "—"}</span>
              <span className="text-[0.82rem] text-ink-soft">
                {p.age ? `${p.age} anos` : "idade —"} · {p.phone || "telefone —"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[calc(var(--radius-base)+2px)] border border-line">
        <Row label="Comparecerá em" onEdit={() => onEdit("type")}>
          {values.attendanceType
            ? TYPE_LABEL[values.attendanceType]
            : "—"}
        </Row>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex flex-col">
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft">
          {label}
        </span>
        <span className="text-ink">{children}</span>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="rounded px-2 py-1 text-[0.78rem] text-secondary underline underline-offset-4 hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-secondary"
      >
        Editar
      </button>
    </div>
  );
}

function ReturningNotice({
  last,
  onViewAddresses,
  onDismiss,
}: {
  last: LastResult;
  onViewAddresses: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-[calc(var(--radius-base)+2px)] border border-secondary/40 bg-secondary/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[0.86rem] text-ink">
        {last.willAttend
          ? "Você já confirmou presença por este dispositivo."
          : "Você já registrou ausência por este dispositivo."}
      </p>
      <div className="flex gap-2">
        {last.willAttend && last.attendanceType && (
          <Button size="sm" variant="outline" onClick={onViewAddresses}>
            Ver endereços
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onDismiss}>
          Fazer nova
        </Button>
      </div>
    </div>
  );
}
