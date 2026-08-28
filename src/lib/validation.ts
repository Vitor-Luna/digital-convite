/**
 * Schemas de validação.
 *
 *  - *Form schemas  (…FormSchema)  -> usados no cliente (react-hook-form).
 *    Trabalham com strings vindas dos inputs.
 *  - *Wire schemas  (rsvpSchema…)  -> usados no SERVIDOR. O servidor NUNCA
 *    confia na validação do navegador e revalida tudo aqui.
 */
import { z } from "zod";
import { wedding } from "@/config/wedding";
import { countDigits } from "@/lib/utils";

const { minAge, maxAge, maxPeoplePerSubmission } = wedding.rsvp;
const maxCompanions = maxPeoplePerSubmission - 1;

const fullName = z
  .string()
  .trim()
  .min(3, "Informe o nome completo.")
  .max(120, "Nome muito longo.");

const phone = z
  .string()
  .trim()
  .min(8, "Informe um telefone válido.")
  .max(20, "Telefone muito longo.")
  .refine((v) => countDigits(v) >= 8 && countDigits(v) <= 13, {
    message: "Informe um telefone com DDD.",
  });

export const attendanceTypeSchema = z.enum([
  "CEREMONY_AND_RESTAURANT",
  "CEREMONY_ONLY",
]);

/* ========================================================================== */
/*  CLIENTE (formulário)                                                       */
/* ========================================================================== */

export const personFormSchema = z.object({
  fullName,
  age: z
    .string()
    .trim()
    .min(1, "Informe a idade.")
    .refine((v) => /^\d{1,3}$/.test(v), "Use apenas números.")
    .refine(
      (v) => Number(v) >= minAge && Number(v) <= maxAge,
      "Idade inválida.",
    ),
  phone,
});
export type PersonFormValues = z.infer<typeof personFormSchema>;

export const attendingFormSchema = z.object({
  attendanceType: attendanceTypeSchema,
  primary: personFormSchema,
  companions: z
    .array(personFormSchema)
    .max(maxCompanions, `Máximo de ${maxPeoplePerSubmission} pessoas.`),
});
export type AttendingFormValues = z.infer<typeof attendingFormSchema>;

export const decliningFormSchema = z.object({
  contactName: fullName,
  note: z.string().trim().max(500, "Mensagem muito longa.").optional(),
});
export type DecliningFormValues = z.infer<typeof decliningFormSchema>;

/* ========================================================================== */
/*  SERVIDOR (payload da API)                                                  */
/* ========================================================================== */

export const personSchema = z.object({
  fullName,
  age: z
    .number({ error: "Idade obrigatória." })
    .int("Idade inválida.")
    .min(minAge, "Idade inválida.")
    .max(maxAge, "Idade inválida."),
  phone,
});
export type PersonInput = z.infer<typeof personSchema>;

const attendingSchema = z.object({
  willAttend: z.literal(true),
  attendanceType: attendanceTypeSchema,
  primary: personSchema,
  companions: z.array(personSchema).max(maxCompanions),
});

const decliningSchema = z.object({
  willAttend: z.literal(false),
  contactName: fullName,
  note: z.string().trim().max(500).optional(),
});

export const rsvpSchema = z.discriminatedUnion("willAttend", [
  attendingSchema,
  decliningSchema,
]);
export type RsvpInput = z.infer<typeof rsvpSchema>;

/* ========================================================================== */
/*  Aprovação (painel)                                                         */
/* ========================================================================== */

export const approvalSchema = z.object({
  submissionId: z.string().min(1, "ID inválido."),
  status: z.enum(["APPROVED", "DISAPPROVED", "PENDING"]),
});
export type ApprovalInput = z.infer<typeof approvalSchema>;

/* ========================================================================== */
/*  Recados                                                                    */
/* ========================================================================== */

export const messageSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(80, "Nome muito longo."),
  messageText: z
    .string()
    .trim()
    .min(3, "Escreva uma mensagem.")
    .max(600, "Mensagem muito longa."),
});
export type MessageInput = z.infer<typeof messageSchema>;

/* ========================================================================== */
/*  Login do admin                                                             */
/* ========================================================================== */

export const loginSchema = z.object({
  password: z.string().min(1, "Informe a senha."),
});
export type LoginInput = z.infer<typeof loginSchema>;
