import { wedding } from "@/config/wedding";

/**
 * Converte a paleta central (src/config/wedding.ts) em CSS custom properties.
 * É injetada no <html> pelo RootLayout — a configuração é a única fonte da
 * verdade para as cores. Nenhum componente conhece valores hex.
 */
export function themeCssVars(): string {
  const c = wedding.theme.colors;
  const vars: Record<string, string> = {
    "--wc-primary": c.primary,
    "--wc-primary-soft": c.primarySoft,
    "--wc-secondary": c.secondary,
    "--wc-bg": c.background,
    "--wc-surface": c.surface,
    "--wc-ink": c.ink,
    "--wc-ink-soft": c.inkSoft,
    "--wc-line": c.line,
    "--wc-cream": c.cream,
    "--wc-cream-2": c.cream2,
    "--wc-cream-ink": c.creamInk,
    "--wc-cream-ink-soft": c.creamInkSoft,
    "--wc-radius": `${wedding.theme.radius}px`,
  };
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return `:root{${body}}`;
}
