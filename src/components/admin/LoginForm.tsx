"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ password }: LoginInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? "Não foi possível entrar.");
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4 rounded-[calc(var(--radius-base)+4px)] border border-line bg-surface p-6 shadow-[var(--shadow-sm)]"
    >
      <Field label="Senha" error={errors.password?.message}>
        <TextInput
          {...register("password")}
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="••••••••"
        />
      </Field>
      {serverError && (
        <p role="alert" className="text-[0.82rem] text-[color:var(--wc-error)]">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Entrar
      </Button>
    </form>
  );
}
