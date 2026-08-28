import { approvalSchema } from "@/lib/validation";
import { ok, fail, readJson } from "@/lib/api";
import { isAdminRequest } from "@/lib/dal";
import { setApproval } from "@/server/rsvp";

/**
 * POST /api/rsvp/approval
 * Aprova / desaprova / volta para pendente uma confirmação. SOMENTE admin.
 * O banco é a fonte da verdade — o painel relê os dados após a resposta.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return fail("Não autorizado.", 401);
  }

  const parsed = await readJson(request, approvalSchema);
  if (!parsed.success) return parsed.response;

  try {
    const submission = await setApproval(parsed.data);
    return ok({ submission });
  } catch (error) {
    console.error("[rsvp/approval]", error);
    return fail("Confirmação não encontrada.", 404);
  }
}
