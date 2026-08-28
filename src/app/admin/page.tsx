import { requireAdmin } from "@/lib/dal";
import { getDashboardStats } from "@/server/stats";
import { listSubmissions } from "@/server/rsvp";
import { Dashboard } from "@/components/admin/Dashboard";

// Sempre dinâmico: reflete o estado atual do banco a cada carregamento.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [stats, submissions] = await Promise.all([
    getDashboardStats(),
    listSubmissions(),
  ]);

  return <Dashboard stats={stats} submissions={submissions} />;
}
