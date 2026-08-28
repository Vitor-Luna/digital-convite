import { ok } from "@/lib/api";
import { destroyAdminSession } from "@/lib/session";

/** POST /api/admin/logout — encerra a sessão. */
export async function POST() {
  await destroyAdminSession();
  return ok({});
}
