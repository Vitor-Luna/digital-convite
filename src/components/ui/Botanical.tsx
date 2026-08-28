import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

const flip: Record<Corner, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 -scale-x-100",
  bl: "bottom-0 left-0 -scale-y-100",
  br: "bottom-0 right-0 -scale-100",
};

/**
 * Ornamento botânico dourado em linha fina, no canto de uma seção.
 * Puramente decorativo.
 */
export function BotanicalCorner({
  corner = "tl",
  className,
  size = 220,
}: {
  corner?: Corner;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(
        "pointer-events-none absolute text-secondary/45",
        flip[corner],
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      {/* haste principal */}
      <path d="M4 4 C 40 26, 70 42, 92 78 C 108 104, 118 132, 122 168" />
      {/* haste secundária */}
      <path d="M8 8 C 34 40, 40 66, 44 96 C 47 118, 46 140, 40 160" opacity="0.7" />
      {/* folhas na haste principal */}
      <path d="M40 26 C 54 16, 66 18, 72 30 C 60 38, 46 38, 40 26 Z" />
      <path d="M62 44 C 78 36, 92 40, 96 54 C 82 60, 68 58, 62 44 Z" />
      <path d="M88 74 C 106 68, 120 74, 124 90 C 108 96, 92 92, 88 74 Z" />
      <path d="M108 106 C 126 102, 140 110, 142 126 C 126 130, 112 124, 108 106 Z" />
      {/* folhas na haste secundária */}
      <path d="M40 52 C 28 44, 16 46, 12 58 C 22 66, 36 64, 40 52 Z" opacity="0.7" />
      <path d="M44 84 C 32 78, 20 82, 18 94 C 30 100, 42 96, 44 84 Z" opacity="0.7" />
      {/* pequenas flores */}
      <g opacity="0.9">
        <circle cx="122" cy="168" r="2.4" />
        <path d="M122 160 L122 155 M122 176 L122 181 M114 168 L109 168 M130 168 L135 168 M116 162 L112 158 M128 174 L132 178 M128 162 L132 158 M116 174 L112 178" />
      </g>
      <g opacity="0.8">
        <circle cx="40" cy="160" r="2" />
        <path d="M40 153 L40 149 M40 167 L40 171 M33 160 L29 160 M47 160 L51 160" />
      </g>
    </svg>
  );
}

/** Filete dourado com coração, usado sob os títulos. */
export function HeartRule({ className }: { className?: string }) {
  return (
    <span className={cn("heart-rule", className)} aria-hidden="true">
      <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
        <path d="M7 11.5C7 11.5 0.5 7.7 0.5 3.9C0.5 2 2 0.6 3.9 0.6C5 0.6 6.1 1.1 7 2C7.9 1.1 9 0.6 10.1 0.6C12 0.6 13.5 2 13.5 3.9C13.5 7.7 7 11.5 7 11.5Z" />
      </svg>
    </span>
  );
}
