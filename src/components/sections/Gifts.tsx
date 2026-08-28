import { wedding } from "@/config/wedding";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeartRule } from "@/components/ui/Botanical";
import { LinkButton } from "@/components/ui/Button";

export function Gifts() {
  const { gifts } = wedding;
  const hasUrl = gifts.url.trim().length > 0;

  return (
    <Section id="presentes" container="narrow">
      <Reveal className="on-cream flex flex-col items-center gap-6 rounded-[calc(var(--radius-base)+10px)] border border-secondary/25 p-10 text-center sm:p-14">
        <span className="text-[0.68rem] uppercase tracking-[0.3em] text-secondary">
          {gifts.title}
        </span>
        <h2 className="font-display text-[length:var(--step-3)] text-ink">
          Se quiser nos presentear
        </h2>
        <HeartRule />
        <p className="max-w-md text-ink-soft">{gifts.text}</p>
        {hasUrl ? (
          <>
            <LinkButton href={gifts.url} external size="lg" className="mt-2">
              {gifts.ctaLabel} →
            </LinkButton>
            <span className="break-all text-[0.72rem] text-ink-soft/70">
              {gifts.url.replace(/^https?:\/\//, "")}
            </span>
          </>
        ) : (
          <p className="mt-2 rounded-[var(--radius-base)] border border-dashed border-line px-5 py-3 text-[0.82rem] text-ink-soft">
            O link da lista de presentes será adicionado aqui em breve.
          </p>
        )}
      </Reveal>
    </Section>
  );
}
