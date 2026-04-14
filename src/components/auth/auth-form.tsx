"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const title = mode === "login" ? "Welcome Back" : "Create Account";
  const subtitle =
    mode === "login"
      ? "Access your real estate dashboard"
      : "Start managing deals with precision";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email || !password || (mode === "signup" && !name.trim())) {
      setError("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMessage("Account created. Check your email for verification.");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md rounded-[30px] border border-[#f0dca4]/30 bg-[linear-gradient(145deg,#fff8e8_0%,#f4ecda_48%,#eadfca_100%)] p-8 shadow-[0_28px_90px_rgba(41,22,10,0.32)]">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-semibold text-[#20150f]">{title}</h1>
        <p className="text-sm text-[#6d5144]">{subtitle}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#4e3427]">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Emily King"
              className="h-12 w-full rounded-2xl border border-[#d9be89] bg-[#fff8ed] px-4 text-sm font-medium text-[#2a1b13] outline-none transition focus:border-[#b27b34] focus:ring-2 focus:ring-[#edc267]/45"
            />
          </label>
        )}
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[#4e3427]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@email.com"
            className="h-12 w-full rounded-2xl border border-[#d9be89] bg-[#fff8ed] px-4 text-sm font-medium text-[#2a1b13] outline-none transition focus:border-[#b27b34] focus:ring-2 focus:ring-[#edc267]/45"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[#4e3427]">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            className="h-12 w-full rounded-2xl border border-[#d9be89] bg-[#fff8ed] px-4 text-sm font-medium text-[#2a1b13] outline-none transition focus:border-[#b27b34] focus:ring-2 focus:ring-[#edc267]/45"
          />
        </label>
        {error && <p className="text-sm font-medium text-[#b2302f]">{error}</p>}
        {message && <p className="text-sm font-medium text-[#4f7424]">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#3e0f1a_0%,#6e2228_45%,#a67022_100%)] text-sm font-semibold text-[#fff7e8] shadow-[0_12px_30px_rgba(63,19,14,0.36)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6d5144]">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-semibold text-[#5a1f24]"
        >
          {mode === "login" ? "Create one" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
