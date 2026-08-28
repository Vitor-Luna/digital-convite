import "server-only";
import { prisma } from "@/server/db";

/**
 * Estatísticas do painel.
 *
 * REGRA CENTRAL: as métricas de presença contam PESSOAS, não submissões.
 * Uma confirmação com 4 pessoas aprovadas soma 4 (não 1).
 *
 * Separação por evento:
 *  - Cerimônia : TODAS as pessoas que comparecem (ambas as opções vão à igreja)
 *  - Restaurante: apenas pessoas de submissões CEREMONY_AND_RESTAURANT
 */

export interface StatusBreakdown {
  approved: number;
  pending: number;
  disapproved: number;
  total: number;
}

export interface DashboardStats {
  submissions: {
    total: number;
    attending: number;
    declined: number;
  };
  /** Pessoas que marcaram "comparecerei" (qualquer status). */
  people: StatusBreakdown;
  /** Pessoas na cerimônia = todas que comparecem. */
  ceremony: StatusBreakdown;
  /** Pessoas no restaurante = só as de "Cerimônia e Restaurante". */
  restaurant: StatusBreakdown;
  lastSubmissionAt: string | null;
}

const empty = (): StatusBreakdown => ({
  approved: 0,
  pending: 0,
  disapproved: 0,
  total: 0,
});

function add(bucket: StatusBreakdown, status: string, n: number) {
  if (status === "APPROVED") bucket.approved += n;
  else if (status === "PENDING") bucket.pending += n;
  else if (status === "DISAPPROVED") bucket.disapproved += n;
  bucket.total += n;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [attending, declinedCount, latest] = await Promise.all([
    prisma.submission.findMany({
      where: { willAttend: true },
      select: {
        approvalStatus: true,
        attendanceType: true,
        _count: { select: { people: true } },
      },
    }),
    prisma.submission.count({ where: { willAttend: false } }),
    prisma.submission.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const people = empty();
  const ceremony = empty();
  const restaurant = empty();

  for (const s of attending) {
    const n = s._count.people;
    add(people, s.approvalStatus, n);
    // Todo mundo que comparece vai à cerimônia.
    add(ceremony, s.approvalStatus, n);
    if (s.attendanceType === "CEREMONY_AND_RESTAURANT") {
      add(restaurant, s.approvalStatus, n);
    }
  }

  return {
    submissions: {
      total: attending.length + declinedCount,
      attending: attending.length,
      declined: declinedCount,
    },
    people,
    ceremony,
    restaurant,
    lastSubmissionAt: latest?.createdAt.toISOString() ?? null,
  };
}
