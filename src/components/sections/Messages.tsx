"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wedding } from "@/config/wedding";
import { messageSchema, type MessageInput } from "@/lib/validation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/utils";

interface MessageItem {
  id: string;
  guestName: string;
  messageText: string;
  createdAt: string;
}

export function Messages() {
  const { messages: cfg } = wedding;
  const [items, setItems] = React.useState<MessageItem[] | null>(null);
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageInput>({ resolver: zodResolver(messageSchema) });

  React.useEffect(() => {
    let alive = true;
    fetch("/api/messages")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (alive) setItems(data.messages ?? []);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = async (values: MessageInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems((prev) => [data.message, ...(prev ?? [])]);
      setSent(true);
      reset();
    } catch {
      setServerError("Não foi possível enviar seu recado. Tente novamente.");
    }
  };

  return (
    <Section id="recados" botanical>
      <SectionHeading
        eyebrow="Mural"
        title={cfg.title}
        description={cfg.intro}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col gap-4">
          {sent ? (
            <div className="animate-fade-in-up rounded-[calc(var(--radius-base)+4px)] border border-secondary/25 bg-[#ffffff08] backdrop-blur-sm p-8 text-center">
              <p className="font-display text-[length:var(--step-1)] text-ink">
                Recado enviado
              </p>
              <p className="mt-2 text-[0.85rem] text-ink-soft">
                Obrigado pelo carinho. Sua mensagem já está no mural.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => setSent(false)}
              >
                Escrever outro
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4 rounded-[calc(var(--radius-base)+4px)] border border-secondary/25 bg-[#ffffff08] backdrop-blur-sm p-6 sm:p-8"
            >
              <Field label="Seu nome" error={errors.guestName?.message}>
                <TextInput
                  {...register("guestName")}
                  autoComplete="name"
                  placeholder="Como você quer assinar"
                />
              </Field>
              <Field label="Mensagem" error={errors.messageText?.message}>
                <TextArea
                  {...register("messageText")}
                  rows={4}
                  placeholder={cfg.placeholder}
                />
              </Field>
              {serverError && (
                <p role="alert" className="text-[0.8rem] text-[color:var(--wc-error)]">
                  {serverError}
                </p>
              )}
              <Button type="submit" loading={isSubmitting} className="self-start">
                Enviar recado
              </Button>
            </form>
          )}
        </Reveal>

        <div className="flex flex-col gap-4">
          {items === null ? (
            <div className="flex items-center gap-3 text-ink-soft">
              <Spinner className="size-4" /> Carregando recados…
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-[var(--radius-base)] border border-dashed border-line p-8 text-center text-[0.85rem] text-ink-soft">
              Ainda não há recados. Seja o primeiro a deixar uma mensagem.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((m) => (
                <li
                  key={m.id}
                  className="animate-fade-in-up rounded-[calc(var(--radius-base)+2px)] border border-secondary/25 bg-[#ffffff08] backdrop-blur-sm p-5"
                >
                  <p className="text-ink">{m.messageText}</p>
                  <p className="mt-3 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
                    <span className="text-secondary">—</span>
                    {m.guestName}
                    <span aria-hidden="true">·</span>
                    <span className="tracking-normal normal-case">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
