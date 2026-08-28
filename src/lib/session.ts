import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type AdminSession } from "@/lib/session-config";

/**
 * Sessão do painel administrativo (apenas os noivos).
 *
 * Estratégia: sessão *stateless* em cookie cifrado (iron-session).
 *  - httpOnly     -> inacessível ao JavaScript do navegador
 *  - secure       -> apenas HTTPS em produção
 *  - sameSite lax -> mitiga CSRF em navegação cross-site
 *  - TTL longo     -> os noivos podem ficar dias logados sem re-login
 *
 * A senha vem de ADMIN_PASSWORD e o segredo do cookie de SESSION_SECRET.
 */

export type { AdminSession };
export { sessionOptions };

export function assertSessionConfig() {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < 32) {
    throw new Error(
      "SESSION_SECRET ausente ou com menos de 32 caracteres. Gere um novo segredo.",
    );
  }
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD não configurada.");
  }
}

/** Lê/escreve a sessão a partir dos cookies da requisição atual. */
export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}

/** Compara a senha informada com ADMIN_PASSWORD em tempo ~constante. */
export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createAdminSession() {
  const session = await getSession();
  session.isAdmin = true;
  session.loggedInAt = Date.now();
  await session.save();
}

export async function destroyAdminSession() {
  const session = await getSession();
  session.destroy();
}
