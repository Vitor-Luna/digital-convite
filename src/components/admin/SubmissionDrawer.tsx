"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ApprovalStatus } from "@prisma/client";
import { formatDateTime, peopleLabel } from "@/lib/utils";
import type { SubmissionDTO } from "@/server/rsvp";
import { Button } from "@/components/ui/Button";
import { StatusBadge, TypeBadge } from "@/components/admin/badges";

export function SubmissionDrawer({
  submission,
  onClose,
}: {
  submission: SubmissionDTO | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!submission) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [submission, onClose]);

  if (!submission) return null;
  const s = submission;

  const decide = (status: ApprovalStatus) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/rsvp/approval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId: s.id, status }),
        });
        if (!res.ok) throw new Error();
        router.refresh();
      } catch {
        setError("Não foi possível atualizar. Tente novamente.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />
      <aside
        aria-label={`Confirmação de ${s.contactName}`}
        className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-bg shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[length:var(--step-2)] text-ink">
              {s.contactName}
            </h2>
            <p className="text-[0.8rem] text-ink-soft">
              {formatDateTime(s.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded p-2 text-ink-soft hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {s.willAttend ? (
              <>
                <StatusBadge status={s.approvalStatus} />
                {s.attendanceType && <TypeBadge type={s.attendanceType} />}
                <span className="text-[0.78rem] text-ink-soft">
                  {peopleLabel(s.peopleCount)}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-0.5 text-[0.72rem] text-ink-soft">
                Não comparecerá
              </span>
            )}
          </div>

          {s.note && (
            <p className="rounded-[var(--radius-base)] border border-line bg-surface p-4 text-[0.86rem] text-ink">
              “{s.note}”
            </p>
          )}

          {s.people.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
                Pessoas do grupo
              </h3>
              <ul className="flex flex-col gap-2">
                {s.people.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-[var(--radius-base)] border border-line bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink">{p.fullName}</span>
                      <span className="text-[0.68rem] uppercase tracking-[0.14em] text-secondary">
                        {p.isCompanion ? "Acompanhante" : "Principal"}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.82rem] text-ink-soft">
                      {p.age} anos · {p.phone}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {s.willAttend && (
          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-line bg-bg p-6">
            {error && (
              <p role="alert" className="text-[0.8rem] text-[color:var(--wc-error)]">
                {error}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => decide("APPROVED")}
                loading={pending}
                disabled={s.approvalStatus === "APPROVED"}
              >
                Aprovar
              </Button>
              <Button
                variant="outline"
                onClick={() => decide("DISAPPROVED")}
                loading={pending}
                disabled={s.approvalStatus === "DISAPPROVED"}
              >
                Desaprovar
              </Button>
            </div>
            {s.approvalStatus !== "PENDING" && (
              <button
                onClick={() => decide("PENDING")}
                disabled={pending}
                className="text-[0.78rem] text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                Voltar para pendente
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
