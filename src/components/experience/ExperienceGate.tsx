"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { wedding } from "@/config/wedding";
import { useIsClient } from "@/lib/client-hooks";
import { AudioGate } from "@/components/experience/AudioGate";

const STORAGE_KEY = "bes:experience-unlocked:v1";

/** Assinatura do áudio atual: muda se o arquivo mudar, invalidando a memória. */
function audioSignature(): string {
  const { src, sources } = wedding.audio;
  return [src, ...sources.map((s) => s.src)].filter(Boolean).join("|");
}

function hasAudioFile(): boolean {
  return audioSignature().length > 0;
}

/** Em desenvolvimento o portão sempre aparece (facilita testar o áudio). */
const REMEMBERS =
  process.env.NODE_ENV === "production" && !wedding.audio.replayEveryVisit;

function readInitialUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  const replay =
    new URLSearchParams(window.location.search).get("replay") === "1";
  if (replay) return false;
  // Áudio desligado nas configs -> nunca há portão.
  if (!wedding.audio.enabled) return true;
  // Sem arquivo (modo preparação) -> o portão SEMPRE aparece, nunca é lembrado.
  // Assim, quando o áudio real for adicionado, todos os convidados o ouvem.
  if (!hasAudioFile()) return false;
  if (!REMEMBERS) return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === audioSignature();
  } catch {
    return false;
  }
}

/**
 * Orquestra a experiência do convidado:
 *  1. mostra APENAS o portão de áudio;
 *  2. quando o áudio termina (ou não há arquivo), libera o restante do site.
 *
 * O estado "já ouviu" é lembrado em localStorage. Use `?replay=1` para rever.
 */
export function ExperienceGate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const isClient = useIsClient();

  const storedUnlocked = React.useMemo(
    () => (isClient ? readInitialUnlocked() : false),
    [isClient],
  );
  const [completedNow, setCompletedNow] = React.useState(false);
  const unlocked = isClient && (storedUnlocked || completedNow);
  const locked = isClient && !unlocked;

  // trava a rolagem enquanto o portão está ativo (efeito de sincronização legítimo)
  React.useEffect(() => {
    if (locked) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked, lenis]);

  // Quando o conteúdo é montado após o portão, o Lenis precisa remedir a
  // altura real da página (antes ela era só a do overlay fixo).
  React.useEffect(() => {
    if (!unlocked || !lenis) return;
    const raf = requestAnimationFrame(() => lenis.resize());
    const t1 = window.setTimeout(() => lenis.resize(), 250);
    const t2 = window.setTimeout(() => lenis.resize(), 800);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [unlocked, lenis]);

  const handleComplete = React.useCallback(() => {
    // Só memoriza em produção, quando havia um arquivo de áudio real.
    if (REMEMBERS && hasAudioFile()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, audioSignature());
      } catch {
        /* ignora */
      }
    }
    setCompletedNow(true);
    window.scrollTo({ top: 0 });
  }, []);

  // servidor + 1º render no cliente: splash neutro (nada de conteúdo)
  if (!isClient) {
    return <Splash />;
  }

  if (!unlocked) {
    return <AudioGate onComplete={handleComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduce ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function Splash() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-bg">
      <span className="flex size-16 items-center justify-center rounded-full border border-secondary/50 font-display text-xl text-secondary">
        {wedding.couple.brideFirstName[0]}
        {wedding.couple.groomFirstName[0]}
      </span>
    </div>
  );
}
