import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes condicionais e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Conta apenas os dígitos de uma string (para validar telefone). */
export function countDigits(value: string) {
  return (value.match(/\d/g) ?? []).length;
}

/** Formata um inteiro como "1 pessoa" / "N pessoas". */
export function peopleLabel(count: number) {
  return count === 1 ? "1 pessoa" : `${count} pessoas`;
}

/** Link para o Google Maps a partir de um texto de busca. */
export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Data legível em pt-BR a partir de um Date ou ISO string. */
export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
