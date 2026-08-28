import { wedding } from "@/config/wedding";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

export function Story() {
  const { story } = wedding;

  return (
    <Section id="historia" tone="cream" botanical>
      <SectionHeading
        eyebrow="Linha do tempo"
        title={story.title}
        description={story.intro}
      />

      <ol className="mt-16 flex flex-col gap-16 sm:gap-24">
        {story.milestones.map((m, i) => (
          <li key={m.date}>
            <Reveal
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>figure]:order-last" : ""
              }`}
            >
              <PhotoFrame
                photo={m.photo}
                sizes="(min-width: 1024px) 45vw, 90vw"
              />
              <div className="flex flex-col gap-3">
                <span className="text-[0.7rem] uppercase tracking-[0.28em] text-secondary">
                  {m.dateLabel}
                </span>
                <h3 className="text-[length:var(--step-2)] text-ink">
                  {m.title}
                </h3>
                <p className="text-ink-soft">{m.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
