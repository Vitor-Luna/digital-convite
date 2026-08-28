import Image from "next/image";
import { cn } from "@/lib/utils";
import { wedding, type PhotoSlot } from "@/config/wedding";

const aspectClass: Record<NonNullable<PhotoSlot["aspect"]>, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

interface PhotoFrameProps {
  photo: PhotoSlot;
  className?: string;
  /** Passe as `sizes` corretas para o layout (otimização de imagem). */
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}

/**
 * Slot de foto. Enquanto `photo.src` estiver vazio, mostra um placeholder
 * elegante (moldura + monograma) que já ocupa o espaço final da imagem.
 * Para adicionar a foto real, basta apontar `src` em src/config/wedding.ts.
 */
export function PhotoFrame({
  photo,
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
  rounded = true,
}: PhotoFrameProps) {
  const aspect = aspectClass[photo.aspect ?? "landscape"];
  const hasImage = photo.src.trim().length > 0;

  return (
    <figure className={cn("group relative", className)}>
      <div
        className={cn(
          "relative isolate overflow-hidden border border-line bg-surface",
          rounded && "rounded-[calc(var(--radius-base)+4px)]",
          aspect,
        )}
      >
        {hasImage ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-fluid)] group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder label={photo.alt} />
        )}
      </div>
      {photo.caption && (
        <figcaption className="mt-3 text-center text-[0.8rem] italic text-ink-soft">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  const initials = `${wedding.couple.brideFirstName[0]}&${wedding.couple.groomFirstName[0]}`;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--wc-secondary)_22%,var(--wc-surface)),var(--wc-surface))]"
    >
      <div className="absolute inset-3 rounded-[var(--radius-base)] border border-dashed border-secondary/40" />
      <span className="font-display text-[clamp(2rem,6vw,3.25rem)] italic leading-none text-secondary">
        {initials}
      </span>
      <span className="max-w-[75%] text-center text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
        {label}
      </span>
      <span className="absolute bottom-4 right-4 text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft/70">
        foto
      </span>
    </div>
  );
}
