import type { ReactNode } from "react";
import { Check, MousePointerClick } from "lucide-react";
import { VOLUME_TIERS } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PLAIN = [
  "Listed starting price",
  "Better wholesale rate",
  "Strong volume rate",
  "Half of market retail",
  "Best published price",
];

function SelectMark({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
        active ? "border-paper bg-paper text-cobalt" : "border-cobalt/35 bg-transparent",
      )}
      aria-hidden
    >
      {active ? <Check className="size-3 stroke-[3]" /> : null}
    </span>
  );
}

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
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {interactive ? <MousePointerClick className="size-5 shrink-0" /> : null}
            How volume pricing works
          </h2>
          <span className="shrink-0 rounded-full bg-paper/15 px-2.5 py-1 text-xs font-bold tracking-wider">
            USD
          </span>
        </div>
        <p className="mt-1 text-sm text-paper/85">
          Prices are per kit. The more kits you buy, the lower the price per kit — from 20% to 60%
          below market retail.
        </p>
      </div>

      <div className="md:hidden print:hidden">
        {VOLUME_TIERS.map((tier) => {
          const active = highlightTier === tier.id;
          const cls = cn(
            "flex w-full items-center gap-3 border-t px-5 py-3.5 text-left transition-colors duration-150",
            active
              ? "border-cobalt bg-cobalt text-paper shadow-[inset_3px_0_0_0_#fff]"
              : "border-line bg-card text-ink",
            interactive && !active && "hover:bg-cobalt/10",
          );
          const inner = (
            <>
              {interactive ? <SelectMark active={active} /> : null}
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold leading-none">{tier.label}</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider opacity-75">
                  {tier.unit}
                </span>
              </span>
              <span className={cn("text-base font-bold", active ? "text-paper" : "text-cobalt")}>
                {tier.discount}
              </span>
            </>
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

      <div className="hidden md:grid md:grid-cols-5 print:grid print:grid-cols-5">
        {VOLUME_TIERS.map((tier, index) => {
          const active = highlightTier === tier.id;
          const inner: ReactNode = (
            <>
              {interactive ? (
                <span className="mb-3 flex">
                  <SelectMark active={active} />
                </span>
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
            "min-h-28 border-t px-[22px] py-5 text-left transition-colors duration-150 md:border-t-0 md:border-l print:border-t-0 print:border-l",
            index === 0 && "md:border-l-0 print:border-l-0",
            active
              ? "border-cobalt bg-cobalt text-paper shadow-[inset_0_4px_0_0_#fff]"
              : "border-line bg-card text-ink",
            interactive && !active && "cursor-pointer hover:bg-cobalt/10",
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
