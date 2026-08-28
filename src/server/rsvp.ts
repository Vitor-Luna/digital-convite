import "server-only";
import type {
  ApprovalStatus,
  AttendanceType,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/server/db";
import type { ApprovalInput, RsvpInput } from "@/lib/validation";

/* -------------------------------------------------------------------------- */
/*  Tipos serializáveis (seguros para enviar a Client Components)             */
/* -------------------------------------------------------------------------- */

export interface PersonDTO {
  id: string;
  isCompanion: boolean;
  fullName: string;
  age: number;
  phone: string;
}

export interface SubmissionDTO {
  id: string;
  willAttend: boolean;
  attendanceType: AttendanceType | null;
  approvalStatus: ApprovalStatus;
  contactName: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  people: PersonDTO[];
  /** Total de pessoas do grupo (0 para recusas). */
  peopleCount: number;
}

type SubmissionWithPeople = Prisma.SubmissionGetPayload<{
  include: { people: true };
}>;

function toDTO(s: SubmissionWithPeople): SubmissionDTO {
  const people = [...s.people].sort(
    (a, b) => Number(a.isCompanion) - Number(b.isCompanion),
  );
  return {
    id: s.id,
    willAttend: s.willAttend,
    attendanceType: s.attendanceType,
    approvalStatus: s.approvalStatus,
    contactName: s.contactName,
    note: s.note,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    people: people.map((p) => ({
      id: p.id,
      isCompanion: p.isCompanion,
      fullName: p.fullName,
      age: p.age,
      phone: p.phone,
    })),
    peopleCount: s.people.length,
  };
}

/* -------------------------------------------------------------------------- */
/*  Escrita                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Cria uma confirmação a partir de um input já VALIDADO pelo servidor.
 * - Comparecerá: grava o convidado principal + acompanhantes como pessoas.
 * - Não comparecerá: grava apenas nome de contato e observação.
 * Toda confirmação nasce com approvalStatus = PENDING (default do schema).
 */
export async function createSubmission(input: RsvpInput): Promise<SubmissionDTO> {
  if (input.willAttend) {
    const created = await prisma.submission.create({
      data: {
        willAttend: true,
        attendanceType: input.attendanceType,
        contactName: input.primary.fullName,
        people: {
          create: [
            {
              isCompanion: false,
              fullName: input.primary.fullName,
              age: input.primary.age,
              phone: input.primary.phone,
            },
            ...input.companions.map((c) => ({
              isCompanion: true,
              fullName: c.fullName,
              age: c.age,
              phone: c.phone,
            })),
          ],
        },
      },
      include: { people: true },
    });
    return toDTO(created);
  }

  const created = await prisma.submission.create({
    data: {
      willAttend: false,
      attendanceType: null,
      contactName: input.contactName,
      note: input.note ?? null,
    },
    include: { people: true },
  });
  return toDTO(created);
}

/** Aprova / desaprova / volta para pendente. Fonte da verdade é o banco. */
export async function setApproval({
  submissionId,
  status,
}: ApprovalInput): Promise<SubmissionDTO> {
  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { approvalStatus: status },
    include: { people: true },
  });
  return toDTO(updated);
}

/* -------------------------------------------------------------------------- */
/*  Leitura                                                                   */
/* -------------------------------------------------------------------------- */

export async function listSubmissions(): Promise<SubmissionDTO[]> {
  const rows = await prisma.submission.findMany({
    include: { people: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toDTO);
}

export async function getSubmission(id: string): Promise<SubmissionDTO | null> {
  const row = await prisma.submission.findUnique({
    where: { id },
    include: { people: true },
  });
  return row ? toDTO(row) : null;
}
