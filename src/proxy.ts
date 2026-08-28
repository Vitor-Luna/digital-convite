import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSession } from "@/lib/session-config";

/**
 * Proxy (antigo "middleware"). Verificação otimista de sessão: protege as
 * páginas do painel antes mesmo de renderizar. A verificação definitiva
 * acontece de novo em cada página/rota (ver `@/lib/dal`).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  if (!isAdminArea) return NextResponse.next();

  const res = NextResponse.next();
  const session = await getIronSession<AdminSession>(req, res, sessionOptions);
  const authed = Boolean(session.isAdmin);

  if (!authed && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (authed && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
