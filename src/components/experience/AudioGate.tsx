"use client";

import * as React from "react";
import { wedding } from "@/config/wedding";
import { Button } from "@/components/ui/Button";
import { BotanicalCorner } from "@/components/ui/Botanical";

type Phase = "idle" | "playing" | "paused" | "done";

/**
 * Portão de áudio. Enquanto o áudio não termina, é a ÚNICA coisa na tela.
 *
 * Regras:
 *  - o convidado precisa ouvir até o fim (sem botão de pular);
 *  - pausar/retomar é permitido;
 *  - avançar o áudio (media keys, etc.) é revertido para o ponto máximo já ouvido;
 *  - só ao terminar aparece o botão "Entrar no convite".
 *
 * Se `wedding.audio.src` estiver vazio, entra em modo de preparação (permite
 * entrar) — troque o arquivo em src/config/wedding.ts quando estiver pronto.
 */
export function AudioGate({ onComplete }: { onComplete: () => void }) {
  const { audio, couple } = wedding;
  const hasFile = audio.src.trim().length > 0 || audio.sources.length > 0;

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const maxReachedRef = React.useRef(0);

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  /* ---- controle do elemento <audio> --------------------------------- */
  const handleLoaded = () => {
    const el = audioRef.current;
    if (el && Number.isFinite(el.duration)) setDuration(el.duration);
  };

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    // impede avançar além do ponto já ouvido
    if (el.currentTime > maxReachedRef.current + 1.5) {
      el.currentTime = maxReachedRef.current;
      return;
    }
    maxReachedRef.current = Math.max(maxReachedRef.current, el.currentTime);
    setCurrent(el.currentTime);
  };

  const handleEnded = () => {
    setPhase("done");
    setCurrent(duration);
  };

  const handleSeeking = () => {
    const el = audioRef.current;
    if (el && el.currentTime > maxReachedRef.current + 1.5) {
      el.currentTime = maxReachedRef.current;
    }
  };

  const start = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      setError(null);
      await el.play();
      setPhase("playing");
    } catch {
      setError("Não foi possível iniciar o áudio. Toque novamente.");
    }
  };

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPhase("playing");
      } catch {
        setError("Não foi possível retomar o áudio.");
      }
    } else {
      el.pause();
      setPhase("paused");
    }
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  /* ---- modo preparação (sem arquivo) -------------------------------- */
  if (!hasFile) {
    return (
      <GateShell>
        <Monogram initials={`${couple.brideFirstName[0]}${couple.groomFirstName[0]}`} />
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft">
          {couple.displayName}
        </p>
        <h1 className="text-[length:var(--step-3)] text-ink">{audio.title}</h1>
        <p className="max-w-md text-ink-soft">{audio.placeholderNote}</p>
        <Button size="lg" onClick={onComplete} className="mt-2">
          {audio.continueLabel}
        </Button>
      </GateShell>
    );
  }

  /* ---- gate real --------------------------------------------------- */
  return (
    <GateShell>
      <audio
        ref={audioRef}
        preload="auto"
        aria-label={`Mensagem de ${couple.displayName}`}
        onLoadedMetadata={handleLoaded}
        onDurationChange={handleLoaded}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={handleEnded}
        onError={() =>
          setError("O arquivo de áudio não pôde ser carregado.")
        }
      >
        {audio.src && <source src={audio.src} />}
        {audio.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </audio>

      <Monogram initials={`${couple.brideFirstName[0]}${couple.groomFirstName[0]}`} />
      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft">
        {couple.displayName}
      </p>
      <h1 className="text-[length:var(--step-3)] text-ink">{audio.title}</h1>

      {phase === "idle" ? (
        <p
          key="intro"
          className="animate-fade-in max-w-md text-balance text-ink-soft"
        >
          {audio.intro}
        </p>
      ) : (
        <p
          key="status"
          className="animate-fade-in text-[0.8rem] uppercase tracking-[0.2em] text-ink-soft"
        >
          {phase === "done"
            ? "Mensagem concluída"
            : phase === "paused"
              ? "Pausado"
              : "Ouvindo…"}
        </p>
      )}

      <div className="mt-2 flex flex-col items-center gap-6">
        <ProgressRing
          progress={progress}
          phase={phase}
          onStart={start}
          onToggle={togglePlay}
        />

        <div className="flex items-center gap-4 text-[0.75rem] tabular-nums text-ink-soft">
          <span>{formatTime(current)}</span>
          <span aria-hidden="true">·</span>
          <span>{duration ? formatTime(duration) : "--:--"}</span>
          {phase !== "idle" && (
            <button
              type="button"
              onClick={toggleMute}
              className="ml-2 rounded px-2 py-1 uppercase tracking-[0.15em] hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-secondary"
            >
              {muted ? "sem som" : "som"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-[0.8rem] text-[color:var(--wc-error)]">
          {error}
        </p>
      )}

      {phase === "done" && (
        <div className="animate-fade-in-up mt-2">
          <Button size="lg" onClick={onComplete}>
            {audio.continueLabel}
          </Button>
        </div>
      )}
    </GateShell>
  );
}

/* ------------------------------------------------------------------ */

function GateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center gap-5 overflow-hidden bg-bg px-6 py-16 text-center">
      <BotanicalCorner corner="tl" size={260} className="opacity-70" />
      <BotanicalCorner corner="tr" size={260} className="opacity-70" />
      <BotanicalCorner corner="bl" size={260} className="opacity-60" />
      <BotanicalCorner corner="br" size={260} className="opacity-60" />
      <div className="relative flex max-w-lg flex-col items-center gap-5">
        {children}
      </div>
    </div>
  );
}

function Monogram({ initials }: { initials: string }) {
  return (
    <span className="mb-2 flex size-16 items-center justify-center rounded-full border border-secondary/50 font-display text-xl text-secondary">
      {initials}
    </span>
  );
}

function ProgressRing({
  progress,
  phase,
  onStart,
  onToggle,
}: {
  progress: number;
  phase: Phase;
  onStart: () => void;
  onToggle: () => void;
}) {
  const size = 132;
  const stroke = 2;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  const isIdle = phase === "idle";
  const isPlaying = phase === "playing";
  const label = isIdle
    ? wedding.audio.startLabel
    : isPlaying
      ? "Pausar"
      : "Continuar";

  return (
    <button
      type="button"
      onClick={isIdle ? onStart : onToggle}
      disabled={phase === "done"}
      aria-label={label}
      className="group relative grid place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary disabled:opacity-70"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--wc-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--wc-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s linear" }}
        />
      </svg>
      <span className="flex size-[86px] items-center justify-center rounded-full bg-primary text-[color:var(--wc-cream)] transition-transform duration-300 ease-[var(--ease-fluid)] group-hover:scale-105 group-active:scale-95">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </span>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
