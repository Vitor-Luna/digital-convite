"use client";

import * as React from "react";
import { wedding } from "@/config/wedding";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeartRule } from "@/components/ui/Botanical";
import { useNow } from "@/lib/client-hooks";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

function diff(targetMs: number, nowMs: number): Parts {
  const delta = targetMs - nowMs;
  if (delta <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const s = Math.floor(delta / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    past: false,
  };
}

export function Countdown() {
  const target = React.useMemo(
    () => new Date(wedding.event.ceremonyIso).getTime(),
    [],
  );
  const now = useNow();
  const parts: Parts | null = now === 0 ? null : diff(target, now);

  const units: { label: string; value: number | null }[] = [
    { label: "Dias", value: parts?.days ?? null },
    { label: "Horas", value: parts?.hours ?? null },
    { label: "Minutos", value: parts?.minutes ?? null },
    { label: "Segundos", value: parts?.seconds ?? null },
  ];

  return (
    <Section id="contagem" container="page" botanical>
      <div className="flex flex-col items-center gap-9 text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <span className="text-[0.7rem] uppercase tracking-[0.34em] text-secondary">
            Contagem regressiva
          </span>
          <h2 className="font-display text-[length:var(--step-3)] italic text-ink">
            {parts?.past ? "Hoje é o grande dia" : "Faltam"}
          </h2>
          <HeartRule />
        </Reveal>

        {parts?.past ? (
          <Reveal>
            <p className="max-w-md text-ink-soft">
              O grande dia chegou. Obrigado por celebrar com a gente.
            </p>
          </Reveal>
        ) : (
          <Reveal className="flex w-full max-w-2xl items-stretch justify-center divide-x divide-secondary/25 rounded-[var(--radius-base)] border border-secondary/20 bg-[#ffffff08] px-2 py-7 backdrop-blur-sm">
            {units.map((u) => (
              <div
                key={u.label}
                className="flex flex-1 flex-col items-center gap-2 px-1"
              >
                <span className="font-display text-[clamp(2rem,7vw,3.2rem)] leading-none tabular-nums text-ink">
                  {u.value === null ? "--" : String(u.value).padStart(2, "0")}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
                  {u.label}
                </span>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
