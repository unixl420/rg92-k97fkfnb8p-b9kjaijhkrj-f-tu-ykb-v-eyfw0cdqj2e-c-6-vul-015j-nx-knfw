import { VOLUME_TIERS } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function TierBar({
  value,
  onChange,
  compact = false,
}: {
  value: number;
  onChange: (i: number) => void;
  compact?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Volume pricing tier"
      className="flex gap-1 overflow-x-auto rounded-lg bg-mist p-1"
    >
      {VOLUME_TIERS.map((tier) => {
        const active = value === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tier.id)}
            className={cn(
              "min-w-[4.5rem] flex-1 rounded-md px-2 py-2 text-center transition-colors",
              active ? "bg-ink text-paper shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            <span className="block text-xs font-semibold tabular-nums">{tier.label}</span>
            {compact ? null : (
              <span className={cn("block text-[10px]", active ? "text-paper/70" : "text-muted")}>
                {tier.discount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
