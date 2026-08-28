import { wedding } from "@/config/wedding";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeartRule } from "@/components/ui/Botanical";

export function Verses() {
  const { verses } = wedding;

  return (
    <Section id="versiculos" container="narrow" botanical>
      <Reveal className="flex flex-col items-center gap-6 rounded-[calc(var(--radius-base)+8px)] border border-secondary/25 bg-cream px-8 py-14 text-center text-[color:var(--wc-cream-ink)] sm:px-14">
        <span className="text-[0.66rem] uppercase tracking-[0.32em] text-secondary">
          {verses.title}
        </span>
        <div className="flex flex-col gap-12">
          {verses.items.map((v, i) => (
            <figure key={i} className="flex flex-col items-center gap-5">
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-none text-secondary"
              >
                &ldquo;
              </span>
              <blockquote className="font-display text-[length:var(--step-2)] italic leading-snug text-[color:var(--wc-cream-ink)]">
                {v.text}
              </blockquote>
              <figcaption className="text-[0.72rem] uppercase tracking-[0.26em] text-[color:var(--wc-cream-ink-soft)]">
                — {v.reference}
              </figcaption>
            </figure>
          ))}
        </div>
        <HeartRule />
      </Reveal>
    </Section>
  );
}
