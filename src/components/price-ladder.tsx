import { VOLUME_TIERS, savingsPct } from "@/lib/pricing";
import type { PriceTiers } from "@/lib/pricing";
import { cn, usd } from "@/lib/utils";

export function PriceLadder({
  prices,
  activeIndex,
  onSelect,
}: {
  prices: PriceTiers;
  activeIndex: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 rounded-xl bg-mist p-1">
      {VOLUME_TIERS.map((tier) => {
        const active = activeIndex === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect?.(tier.id)}
            className={cn(
              "rounded-lg px-1 py-3 text-center transition-colors",
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper",
            )}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wide">
              {tier.label}
            </span>
            <span className="mt-1 block font-display text-lg font-semibold tabular-nums leading-none sm:text-xl">
              {usd(prices[tier.id])}
            </span>
            <span className={cn("mt-1 block text-[10px]", active ? "text-paper/70" : "text-muted")}>
              −{savingsPct(tier.id)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
