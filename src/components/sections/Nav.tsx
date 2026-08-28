"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "contagem", label: "O dia" },
  { id: "historia", label: "História" },
  { id: "presentes", label: "Presentes" },
  { id: "versiculos", label: "Versículos" },
];

export function Nav() {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <motion.header
      initial={{ y: reduce ? 0 : -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
        scrolled
          ? "border-b border-secondary/20 bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="#inicio"
          onClick={go("inicio")}
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-secondary/50 font-display text-sm text-secondary">
            {wedding.couple.brideFirstName[0]}&amp;{wedding.couple.groomFirstName[0]}
          </span>
          <span className="hidden text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft sm:block">
            {wedding.event.dateLabel}
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className="rounded px-3 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#confirmar"
            onClick={go("confirmar")}
            className="rounded-[var(--radius-base)] border border-secondary/40 bg-primary px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--wc-cream)] transition-colors hover:border-secondary/70 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Confirmar presença
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
