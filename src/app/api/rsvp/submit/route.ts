import { rsvpSchema } from "@/lib/validation";
import { ok, fail, readJson } from "@/lib/api";
import { createSubmission } from "@/server/rsvp";

/**
 * POST /api/rsvp/submit
 * Cria uma confirmação (comparecimento ou recusa). Público.
 * Tudo é revalidado no servidor com `rsvpSchema`.
 */
export async function POST(request: Request) {
  const parsed = await readJson(request, rsvpSchema);
  if (!parsed.success) return parsed.response;

  try {
    const submission = await createSubmission(parsed.data);
    return ok({ submission }, 201);
  } catch (error) {
    console.error("[rsvp/submit]", error);
    return fail("Não foi possível registrar a confirmação.", 500);
  }
}
