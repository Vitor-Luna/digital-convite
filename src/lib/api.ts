import { NextResponse } from "next/server";
import { z } from "zod";

/** Resposta de sucesso padronizada. */
export function ok<T extends Record<string, unknown>>(
  data: T,
  init?: number | ResponseInit,
) {
  return NextResponse.json(
    { ok: true, ...data },
    typeof init === "number" ? { status: init } : init,
  );
}

/** Resposta de erro padronizada (não vaza detalhes internos). */
export function fail(
  message: string,
  status = 400,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/** Lê e valida o corpo JSON com um schema Zod. */
export async function readJson<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<
  | { success: true; data: z.infer<S> }
  | { success: false; response: NextResponse }
> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { success: false, response: fail("Corpo da requisição inválido.") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: fail("Dados inválidos.", 422, {
        issues: z.flattenError(parsed.error).fieldErrors,
      }),
    };
  }
  return { success: true, data: parsed.data };
}
