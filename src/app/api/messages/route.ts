import { messageSchema } from "@/lib/validation";
import { ok, fail, readJson } from "@/lib/api";
import { listMessages, createMessage } from "@/server/messages";

/** GET /api/messages — mural público (mensagens aprovadas). */
export async function GET() {
  try {
    const messages = await listMessages();
    return ok({ messages });
  } catch (error) {
    console.error("[messages GET]", error);
    return fail("Não foi possível carregar os recados.", 500);
  }
}

/** POST /api/messages — cria um recado. Público. */
export async function POST(request: Request) {
  const parsed = await readJson(request, messageSchema);
  if (!parsed.success) return parsed.response;

  try {
    const message = await createMessage(parsed.data);
    return ok({ message }, 201);
  } catch (error) {
    console.error("[messages POST]", error);
    return fail("Não foi possível enviar o recado.", 500);
  }
}
