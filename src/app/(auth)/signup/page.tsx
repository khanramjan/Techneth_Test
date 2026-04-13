import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#efe97d_0%,#ece8de_32%,#ced0c5_100%)] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[88vh] w-full max-w-[1240px] gap-8 rounded-[36px] border border-[#e1e3d7] bg-[#f0f1ea]/90 p-5 shadow-[0_30px_80px_rgba(39,40,30,0.2)] lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <section className="flex items-center justify-center">
          <AuthForm mode="signup" />
        </section>

        <section className="flex flex-col justify-between rounded-[30px] bg-[#23241f] p-7 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ece54d]">Create Your Space</p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">
              Build a clear operating picture across every contact and deal.
            </h2>
            <p className="mt-4 max-w-md text-sm text-[#c4c7bc]">
              Signup takes less than a minute. Once in, your team can start from the dashboard template and live metrics immediately.
            </p>
          </div>
          <div className="space-y-3 text-sm text-[#d0d3c8]">
            <div className="rounded-xl bg-white/10 px-4 py-3">Live Supabase authentication flow</div>
            <div className="rounded-xl bg-white/10 px-4 py-3">Responsive dashboard for mobile, tablet, and desktop</div>
            <div className="rounded-xl bg-white/10 px-4 py-3">Chart-driven analytics from a single JSON source</div>
          </div>
        </section>
      </div>
    </main>
  );
}
