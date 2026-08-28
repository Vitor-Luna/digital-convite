import { wedding } from "@/config/wedding";
import { BotanicalCorner, HeartRule } from "@/components/ui/Botanical";

function dottedDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())} · ${p(d.getMonth() + 1)} · ${d.getFullYear()}`;
}

export function Footer() {
  const initials = `${wedding.couple.brideFirstName[0]}&${wedding.couple.groomFirstName[0]}`;

  return (
    <footer className="relative overflow-hidden border-t border-secondary/20 bg-bg">
      <BotanicalCorner corner="tl" size={240} className="opacity-70" />
      <BotanicalCorner corner="tr" size={240} className="opacity-70" />
      <div className="container-page flex flex-col items-center gap-5 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-secondary/40 font-display text-lg italic text-secondary">
          {initials}
        </span>
        <p className="font-display text-[length:var(--step-2)] italic text-ink">
          {wedding.couple.displayName}
        </p>
        <HeartRule />
        <p className="text-[0.8rem] uppercase tracking-[0.3em] text-secondary">
          {dottedDate(wedding.event.ceremonyIso)}
        </p>
        <p className="max-w-sm text-[0.9rem] italic text-ink-soft">
          {wedding.footer.text}
        </p>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-ink-soft/70">
          {wedding.event.city} — {wedding.event.state}
        </p>
        {wedding.couple.hashtag && (
          <p className="text-[0.75rem] tracking-[0.1em] text-secondary">
            #{wedding.couple.hashtag}
          </p>
        )}
      </div>
    </footer>
  );
}
