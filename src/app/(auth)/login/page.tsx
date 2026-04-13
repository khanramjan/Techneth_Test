import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#ece54d_0%,#ece8de_34%,#cfd1c5_100%)] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[88vh] w-full max-w-[1240px] gap-8 rounded-[36px] border border-[#e1e3d7] bg-[#f0f1ea]/90 p-5 shadow-[0_30px_80px_rgba(39,40,30,0.2)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <section className="flex flex-col justify-between rounded-[30px] bg-[#23241f] p-7 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ece54d]">Techneth CRM</p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">
              Precision dashboarding for modern real-estate teams.
            </h2>
            <p className="mt-4 max-w-md text-sm text-[#c4c7bc]">
              Manage contacts, monitor pipelines, and collaborate with your team in one visually rich workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-2xl font-semibold">430</p>
              <p className="text-xs text-[#bec2b6]">Avg score</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-2xl font-semibold">24</p>
              <p className="text-xs text-[#bec2b6]">Won deals</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-2xl font-semibold">8</p>
              <p className="text-xs text-[#bec2b6]">Hot leads</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <AuthForm mode="login" />
        </section>
      </div>
    </main>
  );
}
