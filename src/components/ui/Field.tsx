import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>;
  className?: string;
}

/** Rótulo + controle + mensagem de erro, com wiring de acessibilidade. */
export function Field({ label, error, hint, children, className }: FieldProps) {
  const reactId = React.useId();
  const id = children.props.id ?? `field-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;

  const control = React.cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft"
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-[0.78rem] text-ink-soft">
          {hint}
        </p>
      )}
      {control}
      {error && (
        <p id={errorId} role="alert" className="text-[0.78rem] text-[color:var(--wc-error)]">
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-[var(--radius-base)] border border-line bg-surface px-4 py-2.5 text-ink " +
  "placeholder:text-ink-soft/60 transition-colors duration-200 " +
  "focus:border-secondary focus:outline-2 focus:outline-offset-0 focus:outline-secondary/40 " +
  "aria-[invalid=true]:border-red-500";

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(controlBase, "h-11", className)} {...props} />
  );
});

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(controlBase, "resize-y", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(controlBase, "h-11 appearance-none pr-10", className)}
      {...props}
    >
      {children}
    </select>
  );
});
