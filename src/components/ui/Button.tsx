import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-base)] font-medium " +
  "tracking-[0.02em] transition-[transform,background-color,color,border-color,box-shadow] duration-300 " +
  "ease-[var(--ease-fluid)] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-55 " +
  "active:translate-y-px select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-[color:var(--wc-cream)] border border-secondary/30 hover:bg-primary-soft hover:border-secondary/60 shadow-[var(--shadow-sm)]",
  secondary:
    "bg-secondary text-[#0f2b1f] hover:brightness-105 shadow-[var(--shadow-sm)]",
  outline:
    "border border-secondary/55 text-secondary hover:border-secondary hover:bg-secondary/10",
  ghost: "text-ink-soft hover:text-ink hover:bg-ink/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-6 text-[0.9rem]",
  lg: "h-14 px-8 text-[0.95rem]",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps & { className?: string }) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonStyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      disabled={loading || disabled}
      {...rest}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}

type LinkButtonProps = ButtonStyleProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    external?: boolean;
  };

export function LinkButton({
  variant,
  size,
  className,
  href,
  external = false,
  children,
  ...rest
}: LinkButtonProps) {
  const classes = buttonClasses({ variant, size, className });
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
