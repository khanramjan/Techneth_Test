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
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_14%,#822637_0%,transparent_40%),radial-gradient(circle_at_85%_88%,#3d7a59_0%,transparent_36%),linear-gradient(140deg,#120e18_0%,#1f1520_46%,#2a2017_100%)] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex min-h-[88vh] w-full max-w-[960px] items-center justify-center rounded-[36px] border border-[#eecf95]/25 bg-[#110f16]/55 p-5 shadow-[0_36px_110px_rgba(9,4,13,0.58)] backdrop-blur-sm lg:p-10">
        <section className="flex w-full items-center justify-center">
          <AuthForm mode="login" />
        </section>
      </div>
    </main>
  );
}
