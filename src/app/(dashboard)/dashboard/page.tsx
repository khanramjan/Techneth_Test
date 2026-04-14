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
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";
  const profileRole =
    (user.user_metadata?.role as string | undefined) ||
    dashboardData.currentUser.role;
  const profileAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ||
    dashboardData.currentUser.avatar;

  return (
    <DashboardScreen
      data={dashboardData}
      authUser={{
        name: fullName,
        role: profileRole,
        avatar: profileAvatar,
      }}
    />
  );
}
