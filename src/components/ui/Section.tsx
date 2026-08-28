import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { BotanicalCorner, HeartRule } from "@/components/ui/Botanical";

interface SectionProps {
  id?: string;
  className?: string;
  container?: "page" | "narrow" | "none";
  /** Fundo da seção. "dark" = verde base; "cream"/"cream2" = seção clara. */
  tone?: "dark" | "cream" | "cream2";
  /** Ornamentos botânicos nos cantos. */
  botanical?: boolean;
  children: React.ReactNode;
}

/** Seção padrão com espaçamento vertical generoso e âncora para navegação. */
export function Section({
  id,
  className,
  container = "page",
  tone = "dark",
  botanical = false,
  children,
}: SectionProps) {
  const inner =
    container === "none" ? (
      children
    ) : (
      <div
        className={
          container === "narrow" ? "container-narrow" : "container-page"
        }
      >
        {children}
      </div>
    );

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 overflow-hidden py-[clamp(4rem,10vw,9rem)]",
        tone === "cream" && "on-cream",
        tone === "cream2" && "on-cream-2",
        className,
      )}
    >
      {botanical && (
        <>
          <BotanicalCorner corner="tl" className="opacity-70" />
          <BotanicalCorner corner="br" className="opacity-70" />
        </>
      )}
      <div className="relative">{inner}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-secondary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-[length:var(--step-3)] text-ink">
        {title}
      </h2>
      <HeartRule />
      {description && (
        <p
          className={cn(
            "mt-1 text-ink-soft",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
