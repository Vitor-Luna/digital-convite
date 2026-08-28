import type { SessionOptions } from "iron-session";

/**
 * Configuração do cookie de sessão do admin.
 *
 * Fica num módulo separado (sem `server-only` nem `next/headers`) para poder
 * ser importado tanto pelos helpers de servidor quanto pelo `proxy.ts`.
 */

export interface AdminSession {
  isAdmin?: boolean;
  loggedInAt?: number;
}

export const SESSION_COOKIE = "bes_admin_session";

const ttlDays = Math.max(1, Number(process.env.SESSION_TTL_DAYS ?? "30") || 30);
const ttlSeconds = ttlDays * 24 * 60 * 60;

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "",
  cookieName: SESSION_COOKIE,
  ttl: ttlSeconds,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds,
  },
};
