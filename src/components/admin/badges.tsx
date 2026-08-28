import type { ApprovalStatus, AttendanceType } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS: Record<ApprovalStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-400/15 text-amber-200 border-amber-300/30",
  },
  APPROVED: {
    label: "Aprovado",
    className: "bg-emerald-400/15 text-emerald-200 border-emerald-300/30",
  },
  DISAPPROVED: {
    label: "Desaprovado",
    className: "bg-red-400/15 text-red-200 border-red-300/30",
  },
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

const TYPE: Record<AttendanceType, string> = {
  CEREMONY_AND_RESTAURANT: "Cerimônia + restaurante",
  CEREMONY_ONLY: "Somente cerimônia",
};

export function TypeBadge({ type }: { type: AttendanceType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/[0.08] px-2.5 py-0.5 text-[0.7rem] text-ink-soft">
      {TYPE[type]}
    </span>
  );
}
