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
    <div className="w-full max-w-md rounded-[30px] bg-[#f9f9f4] p-8 shadow-[0_20px_60px_rgba(42,42,27,0.18)]">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-semibold text-[#23241f]">{title}</h1>
        <p className="text-sm text-[#66685f]">{subtitle}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#42453d]">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Emily King"
              className="h-12 w-full rounded-2xl border border-[#dedfd6] bg-white px-4 text-sm text-[#20211d] outline-none transition focus:border-[#d7cf4f]"
            />
          </label>
        )}
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#42453d]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@email.com"
            className="h-12 w-full rounded-2xl border border-[#dedfd6] bg-white px-4 text-sm text-[#20211d] outline-none transition focus:border-[#d7cf4f]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#42453d]">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            className="h-12 w-full rounded-2xl border border-[#dedfd6] bg-white px-4 text-sm text-[#20211d] outline-none transition focus:border-[#d7cf4f]"
          />
        </label>
        {error && <p className="text-sm text-[#d0463b]">{error}</p>}
        {message && <p className="text-sm text-[#4e7d2a]">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#23241f] text-sm font-semibold text-white transition hover:bg-[#12130f] disabled:cursor-not-allowed disabled:bg-[#8e9087]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#676960]">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-semibold text-[#20211d]"
        >
          {mode === "login" ? "Create one" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
