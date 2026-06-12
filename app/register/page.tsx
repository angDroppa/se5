"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { register as registerApi } from "@/lib/axios/auth";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/auth";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const RegisterFormSchema = RegisterSchema.extend({
  confirmPassword: z.string().min(8, "Deve contenere almeno 8 caratteri"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof RegisterFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...payload } = data;
    try {
      await registerApi(payload);
      toast.success("Registrazione completata!");
      router.push("/login?registered=true");
    } catch {}
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title text-2xl">Crea account</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nome</legend>
              <input
                type="text"
                placeholder="Mario"
                className={`input w-full ${errors.firstName ? "input-error" : ""}`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="fieldset-label text-error">
                  {errors.firstName.message}
                </p>
              )}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Cognome</legend>
              <input
                type="text"
                placeholder="Rossi"
                className={`input w-full ${errors.lastName ? "input-error" : ""}`}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="fieldset-label text-error">
                  {errors.lastName.message}
                </p>
              )}
            </fieldset>
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
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Conferma password</legend>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="ripeti la password"
                  className={`input w-full pr-10 ${errors.confirmPassword ? "input-error" : ""}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="fieldset-label text-error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </fieldset>
            <button type="submit" className="btn btn-primary mt-2">
              Registrati
            </button>
          </form>
          <p className="text-sm text-center text-base-content/60">
            Hai già un account?{" "}
            <a href="/login" className="link link-primary">
              Accedi
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
