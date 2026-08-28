import { loginSchema } from "@/lib/validation";
import { ok, fail, readJson } from "@/lib/api";
import {
  assertSessionConfig,
  verifyPassword,
  createAdminSession,
} from "@/lib/session";

/** POST /api/admin/login — cria a sessão dos noivos. */
export async function POST(request: Request) {
  try {
    assertSessionConfig();
  } catch (error) {
    console.error("[admin/login] config", error);
    return fail("Autenticação indisponível. Verifique as variáveis de ambiente.", 500);
  }

  const parsed = await readJson(request, loginSchema);
  if (!parsed.success) return parsed.response;

  // pequeno atraso para dificultar força bruta
  await new Promise((r) => setTimeout(r, 350));

  if (!verifyPassword(parsed.data.password)) {
    return fail("Senha incorreta.", 401);
  }

  await createAdminSession();
  return ok({});
}
