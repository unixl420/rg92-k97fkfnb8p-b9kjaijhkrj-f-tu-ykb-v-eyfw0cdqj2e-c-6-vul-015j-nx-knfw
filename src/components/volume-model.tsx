import type { ReactNode } from "react";
import { MousePointerClick } from "lucide-react";
import { VOLUME_TIERS } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PLAIN = [
  "Listed starting price",
  "Better wholesale rate",
  "Strong volume rate",
  "Half of market retail",
  "Best published price",
];

export function VolumeModel({
  highlightTier,
  onSelect,
}: {
  highlightTier: number;
  onSelect?: (i: number) => void;
}) {
  const interactive = Boolean(onSelect);

  return (
    <section className="overflow-hidden rounded-xl border-2 border-cobalt/30 bg-card">
      <div className="border-b border-line bg-cobalt px-[26px] py-4 text-paper">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {interactive ? <MousePointerClick className="size-5 shrink-0" /> : null}
          How volume pricing works
        </h2>
        <p className="mt-1 text-sm text-paper/85">
          Prices are per kit. The more kits you buy, the lower the price per kit — from 20% to 60%
          below market retail.
        </p>
        {interactive ? (
          <p className="mt-2 text-sm font-semibold text-paper">
            Tap a box below to highlight that volume on the price list.
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 print:grid-cols-5">
        {VOLUME_TIERS.map((tier, index) => {
          const active = highlightTier === tier.id;
          const inner: ReactNode = (
            <>
              {interactive ? (
                <p
                  className={cn(
                    "mb-2 text-xs font-bold uppercase tracking-wider",
                    active ? "text-paper" : "text-cobalt",
                  )}
                >
                  {active ? "Showing this column" : "Tap to highlight"}
                </p>
              ) : null}
              <p className="text-xl font-bold leading-none">{tier.label}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-80">{tier.unit}</p>
              <p className={cn("mt-2 text-lg font-bold", active ? "text-paper" : "text-cobalt")}>
                {tier.discount}
              </p>
              <p className={cn("mt-1 text-sm", active ? "text-paper/85" : "text-ink-soft")}>
                {PLAIN[tier.id]}
              </p>
            </>
          );
          const cls = cn(
            "min-h-28 border-t border-line px-[22px] py-5 text-left md:border-t-0 md:border-l print:border-t-0 print:border-l",
            index === 0 && "md:border-l-0 print:border-l-0",
            index === 4 && "max-md:col-span-2",
            active ? "bg-cobalt text-paper" : "bg-card text-ink",
            interactive && !active && "cursor-pointer hover:bg-mist",
            interactive && "focus-visible:z-10",
          );
          if (!onSelect) {
            return (
              <div key={tier.id} className={cls}>
                {inner}
              </div>
            );
          }
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              aria-pressed={active}
              className={cls}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </section>
  );
}
