"use client";

import * as React from "react";
import { wedding } from "@/config/wedding";
import { cn, formatDateTime, peopleLabel } from "@/lib/utils";
import type { SubmissionDTO } from "@/server/rsvp";
import type { DashboardStats, StatusBreakdown } from "@/server/stats";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SubmissionDrawer } from "@/components/admin/SubmissionDrawer";
import {
  StatusBadge,
  TypeBadge,
} from "@/components/admin/badges";

type Group = "ceremony" | "restaurant" | "declined";
type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "DISAPPROVED";

const GROUP_TABS: { id: Group; label: string }[] = [
  { id: "ceremony", label: "Cerimônia" },
  { id: "restaurant", label: "Restaurante" },
  { id: "declined", label: "Ausências" },
];

export function Dashboard({
  stats,
  submissions,
}: {
  stats: DashboardStats;
  submissions: SubmissionDTO[];
}) {
  const [group, setGroup] = React.useState<Group>("ceremony");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected =
    submissions.find((s) => s.id === selectedId) ?? null;

  const inGroup = React.useMemo(
    () => submissions.filter((s) => matchesGroup(s, group)),
    [submissions, group],
  );

  const visible = React.useMemo(() => {
    if (group === "declined") return inGroup;
    if (status === "ALL") return inGroup;
    return inGroup.filter((s) => s.approvalStatus === status);
  }, [inGroup, status, group]);

  const breakdown: StatusBreakdown =
    group === "ceremony"
      ? stats.ceremony
      : group === "restaurant"
        ? stats.restaurant
        : {
            approved: 0,
            pending: 0,
            disapproved: 0,
            total: stats.submissions.declined,
          };

  return (
    <div className="container-page py-10">
      {/* cabeçalho */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            {wedding.couple.displayName}
          </span>
          <h1 className="font-display text-[length:var(--step-3)] text-ink">
            Confirmações
          </h1>
          <p className="text-[0.85rem] text-ink-soft">
            {stats.lastSubmissionAt
              ? `Última confirmação em ${formatDateTime(stats.lastSubmissionAt)}`
              : "Ainda sem confirmações."}
          </p>
        </div>
        <LogoutButton />
      </header>

      {/* resumo geral — contagem de PESSOAS por evento */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryTile
          label="Cerimônia"
          value={stats.ceremony.approved}
          hint={`${stats.ceremony.total} pessoas no total`}
          emphasis
        />
        <SummaryTile
          label="Restaurante"
          value={stats.restaurant.approved}
          hint={`${stats.restaurant.total} pessoas no total`}
          emphasis
        />
        <SummaryTile
          label="Pendentes"
          value={stats.people.pending}
          hint={`${stats.submissions.attending} confirmações`}
        />
        <SummaryTile
          label="Ausências"
          value={stats.submissions.declined}
        />
      </div>

      {/* tabs de grupo */}
      <div
        role="tablist"
        aria-label="Evento"
        className="mt-10 flex gap-1 border-b border-line"
      >
        {GROUP_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={group === t.id}
            onClick={() => {
              setGroup(t.id);
              setStatus("ALL");
            }}
            className={cn(
              "relative px-4 py-3 text-[0.85rem] font-medium transition-colors",
              group === t.id
                ? "text-ink"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {t.label}
            <span
              className={cn(
                "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary transition-opacity duration-300",
                group === t.id ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {/* cards de status (clicáveis) */}
      {group !== "declined" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatusCard
            label="Aprovados"
            count={breakdown.approved}
            active={status === "APPROVED"}
            tone="approved"
            onClick={() =>
              setStatus((s) => (s === "APPROVED" ? "ALL" : "APPROVED"))
            }
          />
          <StatusCard
            label="Pendentes"
            count={breakdown.pending}
            active={status === "PENDING"}
            tone="pending"
            onClick={() =>
              setStatus((s) => (s === "PENDING" ? "ALL" : "PENDING"))
            }
          />
          <StatusCard
            label="Desaprovados"
            count={breakdown.disapproved}
            active={status === "DISAPPROVED"}
            tone="disapproved"
            onClick={() =>
              setStatus((s) => (s === "DISAPPROVED" ? "ALL" : "DISAPPROVED"))
            }
          />
        </div>
      )}

      {/* lista */}
      <div className="mt-6">
        {submissions.length === 0 ? (
          <EmptyState
            title="O painel começa vazio"
            text="Assim que um convidado preencher o RSVP, a confirmação aparece aqui automaticamente."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Nada neste filtro"
            text="Não há confirmações para a combinação de evento e status selecionada."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSelectedId(s.id)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-[calc(var(--radius-base)+2px)] border border-line bg-surface px-5 py-4 text-left transition-colors hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">
                      {s.contactName}
                    </span>
                    <span className="text-[0.78rem] text-ink-soft">
                      {s.willAttend
                        ? peopleLabel(s.peopleCount)
                        : "Não comparecerá"}{" "}
                      · {formatDateTime(s.createdAt)}
                    </span>
                  </span>
                  {s.attendanceType && <TypeBadge type={s.attendanceType} />}
                  {s.willAttend && <StatusBadge status={s.approvalStatus} />}
                  <span aria-hidden="true" className="text-ink-soft">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SubmissionDrawer
        key={selectedId ?? "none"}
        submission={selected}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

function matchesGroup(s: SubmissionDTO, group: Group) {
  if (group === "declined") return !s.willAttend;
  if (!s.willAttend) return false;
  // Cerimônia: todos que comparecem. Restaurante: só "Cerimônia e Restaurante".
  if (group === "ceremony") return true;
  return s.attendanceType === "CEREMONY_AND_RESTAURANT";
}

function SummaryTile({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: number;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-[calc(var(--radius-base)+2px)] border p-4",
        emphasis
          ? "border-secondary/40 bg-secondary/[0.08]"
          : "border-line bg-surface",
      )}
    >
      <span className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <span className="font-display text-[length:var(--step-2)] leading-none text-ink">
        {value}
      </span>
      {hint && <span className="text-[0.72rem] text-ink-soft">{hint}</span>}
    </div>
  );
}

function StatusCard({
  label,
  count,
  active,
  tone,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  tone: "approved" | "pending" | "disapproved";
  onClick: () => void;
}) {
  const dot = {
    approved: "bg-emerald-500",
    pending: "bg-amber-500",
    disapproved: "bg-red-500",
  }[tone];

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-between rounded-[calc(var(--radius-base)+2px)] border px-5 py-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
        active
          ? "border-secondary bg-secondary/10"
          : "border-line bg-surface hover:border-ink/30",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className={cn("size-2 rounded-full", dot)} />
        <span className="text-[0.85rem] text-ink">{label}</span>
      </span>
      <span className="font-display text-[length:var(--step-1)] text-ink">
        {count}
      </span>
    </button>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[calc(var(--radius-base)+4px)] border border-dashed border-line bg-surface px-6 py-16 text-center">
      <p className="font-display text-[length:var(--step-1)] text-ink">{title}</p>
      <p className="max-w-sm text-[0.85rem] text-ink-soft">{text}</p>
    </div>
  );
}
