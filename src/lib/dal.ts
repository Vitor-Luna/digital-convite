import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * Data Access Layer de autenticação.
 *
 * `getAdmin()` é memoizada por render (React `cache`) para não reler o cookie
 * várias vezes na mesma requisição. Use-a em Server Components, Route Handlers
 * e Server Actions — sempre o mais perto possível dos dados.
 */

export const getAdmin = cache(async () => {
  const session = await getSession();
  if (!session.isAdmin) return null;
  return { isAdmin: true as const, loggedInAt: session.loggedInAt ?? null };
});

/** Garante sessão de admin; redireciona para o login se não houver. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Versão para Route Handlers: retorna boolean em vez de redirecionar. */
export async function isAdminRequest() {
  return (await getAdmin()) !== null;
}
