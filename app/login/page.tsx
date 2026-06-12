"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginSchema, type LoginInput } from "@/lib/validators/auth";
import { login } from "@/lib/axios/auth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      router.push("/dashboard");
      router.refresh();
    } catch {
      // aspetta che il toast sia visibile prima di fare altro
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title text-2xl">Accedi</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                placeholder="mario@example.com"
                className={`input w-full ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="fieldset-label text-error">
                  {errors.email.message}
                </p>
              )}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="min. 8 caratteri"
                  className={`input w-full pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="fieldset-label text-error">
                  {errors.password.message}
                </p>
              )}
            </fieldset>
            <button type="submit" className="btn btn-primary mt-2">
              Accedi
            </button>
          </form>
          <p className="text-sm text-center text-base-content/60">
            Non hai un account?{" "}
            <a href="/register" className="link link-primary">
              Registrati
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
