import { redirect } from "next/navigation";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import dashboardData from "@/data/dashboard.json";
import { createClient } from "@/lib/supabase/server";
import type { DashboardData } from "@/types/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardScreen data={dashboardData as DashboardData} />
  );
}
