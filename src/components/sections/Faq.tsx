"use client";

import * as React from "react";
import { wedding } from "@/config/wedding";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  const { faq } = wedding;
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <Section id="faq" container="narrow" tone="cream2" botanical>
      <SectionHeading eyebrow="Dúvidas" title={faq.title} align="left" />
      <div className="mt-10 divide-y divide-line border-y border-line">
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.04}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-ink transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <span className="text-[length:var(--step-0)] font-medium">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg text-secondary transition-transform duration-300 ease-[var(--ease-fluid)]"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div className="collapse-grid" data-open={isOpen}>
                <div>
                  <p className="pb-6 pr-10 text-ink-soft">{item.a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
