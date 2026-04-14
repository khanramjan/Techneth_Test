import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { readDashboardData } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dashboardData = await readDashboardData();

  return <DashboardScreen data={dashboardData} />;
}
