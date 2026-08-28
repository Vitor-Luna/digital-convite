import { Suspense } from "react";
import { wedding } from "@/config/wedding";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-secondary/50 font-display text-lg text-secondary">
            {wedding.couple.brideFirstName[0]}
            {wedding.couple.groomFirstName[0]}
          </span>
          <h1 className="font-display text-[length:var(--step-2)] text-ink">
            Painel dos noivos
          </h1>
          <p className="text-[0.85rem] text-ink-soft">
            Acesso restrito. Informe a senha para continuar.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
