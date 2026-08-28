import { wedding, type AttendanceType } from "@/config/wedding";
import { mapsUrl } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";

type LocationEntry = {
  label: string;
  name: string;
  address: string;
  timeLabel?: string;
  note?: string;
  mapsQuery: string;
};

function LocationCard({ entry }: { entry: LocationEntry }) {
  return (
    <article className="flex flex-col gap-3 rounded-[calc(var(--radius-base)+4px)] border border-line bg-surface p-7 text-left">
      <span className="text-[0.68rem] uppercase tracking-[0.26em] text-secondary">
        {entry.label}
      </span>
      <h4 className="font-display text-[length:var(--step-1)] text-ink">
        {entry.name}
      </h4>
      {entry.timeLabel && (
        <p className="text-[0.8rem] uppercase tracking-[0.14em] text-ink-soft">
          {entry.timeLabel}
        </p>
      )}
      <p className="text-ink-soft">{entry.address}</p>
      {entry.note && (
        <p className="rounded-[var(--radius-base)] bg-[#ffffff0d] px-4 py-3 text-[0.82rem] text-ink">
          {entry.note}
        </p>
      )}
      {entry.mapsQuery && (
        <LinkButton
          href={mapsUrl(entry.mapsQuery)}
          external
          variant="outline"
          size="sm"
          className="mt-1 self-start"
        >
          Abrir no mapa
        </LinkButton>
      )}
    </article>
  );
}

/**
 * Revela os endereços aplicáveis SOMENTE após a confirmação concluída.
 *  - CEREMONY_AND_RESTAURANT -> cerimônia + restaurante
 *  - CEREMONY_ONLY           -> apenas cerimônia
 */
export function LocationReveal({ type }: { type: AttendanceType }) {
  const { ceremony, restaurant } = wedding.locations;
  const showRestaurant = type === "CEREMONY_AND_RESTAURANT";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <LocationCard entry={ceremony} />
      {showRestaurant && <LocationCard entry={restaurant} />}
    </div>
  );
}
