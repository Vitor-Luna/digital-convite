"use client";

import * as React from "react";

const noopSubscribe = () => () => {};

/**
 * `true` somente após a hidratação no cliente. Evita divergência de SSR sem
 * chamar setState dentro de efeito.
 */
export function useIsClient() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* -------------------------------------------------------------------------- */
/*  Relógio global compartilhado (1 tick/segundo para toda a página)          */
/* -------------------------------------------------------------------------- */

let sharedNow = 0;
const clockListeners = new Set<() => void>();
let clockInterval: number | undefined;

function startClock() {
  if (clockInterval !== undefined) return;
  sharedNow = Date.now();
  clockInterval = window.setInterval(() => {
    sharedNow = Date.now();
    clockListeners.forEach((l) => l());
  }, 1000);
}

function subscribeClock(onChange: () => void) {
  clockListeners.add(onChange);
  startClock();
  onChange();
  return () => {
    clockListeners.delete(onChange);
    if (clockListeners.size === 0 && clockInterval !== undefined) {
      window.clearInterval(clockInterval);
      clockInterval = undefined;
    }
  };
}

/** Timestamp reativo (ms). Atualiza a cada segundo; 0 no servidor. */
export function useNow() {
  return React.useSyncExternalStore(
    subscribeClock,
    () => sharedNow,
    () => 0,
  );
}
