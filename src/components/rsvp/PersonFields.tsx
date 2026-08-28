import type {
  FieldErrors,
  UseFormRegister,
  Path,
} from "react-hook-form";
import { Field, TextInput } from "@/components/ui/Field";
import type { AttendingFormValues } from "@/lib/validation";

type Prefix = "primary" | `companions.${number}`;

/**
 * Trio de campos (nome / idade / telefone) reutilizado para o convidado
 * principal e para cada acompanhante.
 */
export function PersonFields({
  prefix,
  register,
  errors,
  namePlaceholder = "Nome e sobrenome",
}: {
  prefix: Prefix;
  register: UseFormRegister<AttendingFormValues>;
  errors: FieldErrors<AttendingFormValues>;
  namePlaceholder?: string;
}) {
  const err = resolveErrors(errors, prefix);
  const path = (f: "fullName" | "age" | "phone") =>
    `${prefix}.${f}` as Path<AttendingFormValues>;

  return (
    <div className="grid gap-4 sm:grid-cols-[5rem_1fr] sm:gap-x-4">
      <Field label="Nome completo" error={err.fullName} className="sm:col-span-2">
        <TextInput
          {...register(path("fullName"))}
          autoComplete="name"
          placeholder={namePlaceholder}
        />
      </Field>
      <Field label="Idade" error={err.age}>
        <TextInput
          {...register(path("age"))}
          inputMode="numeric"
          maxLength={3}
          placeholder="00"
        />
      </Field>
      <Field label="Telefone" error={err.phone}>
        <TextInput
          {...register(path("phone"))}
          type="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
        />
      </Field>
    </div>
  );
}

function resolveErrors(
  errors: FieldErrors<AttendingFormValues>,
  prefix: Prefix,
) {
  if (prefix === "primary") {
    return {
      fullName: errors.primary?.fullName?.message,
      age: errors.primary?.age?.message,
      phone: errors.primary?.phone?.message,
    };
  }
  const idx = Number(prefix.split(".")[1]);
  const c = errors.companions?.[idx];
  return {
    fullName: c?.fullName?.message,
    age: c?.age?.message,
    phone: c?.phone?.message,
  };
}
