"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { wedding } from "@/config/wedding";
import { BotanicalCorner, HeartRule } from "@/components/ui/Botanical";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const name = wedding.couple.displayName;
  const heroPhoto = wedding.hero.photo;
  const hasPhoto = heroPhoto.src.trim().length > 0;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.9, ease: EASE, delay },
  });

  return (
    <header
      id="inicio"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      {/* foto de fundo (opcional) + véu escuro */}
      {hasPhoto ? (
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div
        aria-hidden="true"
        className={
          hasPhoto
            ? "absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg"
            : "absolute inset-0 bg-bg"
        }
      />

      <BotanicalCorner corner="tl" size={280} className="opacity-80" />
      <BotanicalCorner corner="tr" size={280} className="opacity-80" />
      <BotanicalCorner corner="bl" size={280} className="opacity-70" />
      <BotanicalCorner corner="br" size={280} className="opacity-70" />

      <div className="relative flex flex-col items-center gap-6">
        <motion.span
          {...rise(0.05)}
          className="text-[0.7rem] uppercase tracking-[0.4em] text-secondary"
        >
          {wedding.hero.eyebrow}
        </motion.span>

        <motion.h1
          {...rise(0.14)}
          className="font-display text-[length:var(--step-5)] italic leading-[1] text-ink"
        >
          {name}
        </motion.h1>

        <motion.div {...rise(0.24)}>
          <HeartRule />
        </motion.div>

        <motion.p
          {...rise(0.3)}
          className="text-[0.85rem] uppercase tracking-[0.34em] text-ink-soft"
        >
          {wedding.event.dateLabel}
        </motion.p>

        <motion.p
          {...rise(0.38)}
          className="mt-2 max-w-md text-balance text-ink-soft"
        >
          {wedding.hero.subhead}
        </motion.p>
      </div>

      <motion.div
        {...rise(0.6)}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-ink-soft"
      >
        <span>role para descobrir</span>
        <motion.span
          aria-hidden="true"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-secondary"
        >
          ↓
        </motion.span>
      </motion.div>
    </header>
  );
}
