import { ChevronDown, Copy, Minus, Plus, Share2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { LIST_META } from "@/lib/catalog";
import { tierIndexForKits } from "@/lib/pricing";
import {
  lineSaved,
  lineTotal,
  shippingCost,
  SHIP_FREE_AT,
  SHIP_PRIORITY,
  SHIP_STANDARD,
  shippingTransit,
  unitPrice,
  useQuoteCart,
} from "@/lib/quote-cart";
import { cn, copyToClipboard, usd } from "@/lib/utils";

const COL = "grid grid-cols-[minmax(0,1fr)_5.75rem_4.75rem_1.5rem] items-center gap-x-2";
const PAD = "px-[21px]";
const TYPE = {
  kicker: "text-[13px] font-medium uppercase tracking-[0.08em] text-muted",
  title: "text-[21px] font-semibold leading-[34px] tracking-tight",
  body: "text-[13px] leading-[21px]",
  amount: "text-[13px] font-semibold tabular-nums leading-[21px]",
};

export function QuoteTray() {
  const cart = useQuoteCart();
  const [copied, setCopied] = useState(false);
  if (!cart.open) return null;

  const listedTotal = cart.lines.reduce((n, line) => n + (lineTotal(line) ?? 0), 0);
  const totalSaved = cart.lines.reduce((n, line) => n + (lineSaved(line) ?? 0), 0);
  const hasListed = cart.lines.some((line) => line.prices);
  const hasItems = cart.lines.length > 0;
  const ship = shippingCost(listedTotal, cart.shipDest, cart.shipMethod);
  const grand = listedTotal + ship;

  const shareCart = async () => {
    const text = cart.copyText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${LIST_META.group} cart`, text });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    const ok = await copyToClipboard(text);
    if (!ok) return;
    flashCopied(setCopied);
  };

  const copyCart = async () => {
    const ok = await copyToClipboard(cart.copyText());
    if (!ok) return;
    flashCopied(setCopied);
  };

  return (
    <div className="no-print fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-[#142033]/40 backdrop-blur-[3px]"
        aria-label="Close cart"
        onClick={cart.closeTray}
      />
      <aside className="cart-panel absolute inset-x-0 bottom-0 mx-auto flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-paper sm:inset-y-0 sm:left-0 sm:right-auto sm:mx-0 sm:max-h-none sm:max-w-[25rem] sm:rounded-none sm:border-r sm:border-line">
        <div className="mx-auto mt-[13px] h-1 w-[34px] rounded-full bg-line sm:hidden" aria-hidden />

        <header className={cn("flex items-start justify-between pb-[13px] pt-2 sm:pt-[21px]", PAD)}>
          <div>
            <p className={cn(TYPE.kicker, "hidden sm:block")}>Quote</p>
            <h2 className={cn("sm:mt-2", TYPE.title)}>Your list</h2>
            <p className={cn(TYPE.body, "text-ink-soft")}>
              {hasItems
                ? `${cart.count} ${cart.count === 1 ? "compound" : "compounds"} · ${cart.kits} ${cart.kits === 1 ? "kit" : "kits"}`
                : "Nothing added yet"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex size-[34px] items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink"
            onClick={cart.closeTray}
          >
            <X className="size-[13px]" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {hasItems ? (
            <div>
              <div
                className={cn(
                  COL,
                  "sticky top-0 z-10 hidden border-b border-line bg-paper py-2 sm:grid",
                  PAD,
                  TYPE.kicker,
                )}
              >
                <span>Compound</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Amount</span>
                <span className="sr-only">Remove</span>
              </div>
              <ul>
                {cart.lines.map((line) => {
                  const unit = unitPrice(line);
                  const total = lineTotal(line);
                  const saved = lineSaved(line);
                  const tier = line.qty >= 10 ? tierIndexForKits(line.qty) + 1 : null;
                  return (
                    <li key={line.id} className={cn(COL, "border-b border-line/80 py-[13px]", PAD)}>
                      <div className="min-w-0">
                        <p className={cn("truncate", TYPE.amount)}>{line.name}</p>
                        <p className={cn("truncate", TYPE.body, "text-ink-soft")}>
                          {line.pack}
                          {tier ? <span className="text-cobalt"> · Tier {tier}</span> : null}
                        </p>
                      </div>
                      <QtyStepper
                        value={line.qty}
                        name={`${line.name} ${line.pack}`}
                        onChange={(qty) => cart.setQty(line.id, qty)}
                      />
                      <div className="text-right">
                        {unit != null && total != null ? (
                          <>
                            <p className={TYPE.amount}>{usd(total)}</p>
                            <p className={cn(TYPE.body, "tabular-nums text-muted")}>
                              {saved && saved > 0 ? (
                                <span className="font-medium text-cobalt">−{usd(saved)}</span>
                              ) : (
                                `${usd(unit)} / kit`
                              )}
                            </p>
                          </>
                        ) : (
                          <p className={cn(TYPE.body, "font-medium text-cobalt")}>On request</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} ${line.pack}`}
                        className="justify-self-end self-center text-muted transition-colors hover:text-ink"
                        onClick={() => cart.remove(line.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center px-8 py-16 text-center">
              <p className="text-[15px] font-semibold">Your list is empty</p>
              <p className="mt-1 max-w-[15rem] text-[13px] leading-5 text-ink-soft">
                Tap Add beside a strength, then copy this list to our representative.
              </p>
              <button
                type="button"
                className="mt-5 text-[13px] font-semibold text-cobalt"
                onClick={() => {
                  cart.enablePicking();
                  cart.closeTray();
                }}
              >
                Browse the list
              </button>
            </div>
          )}
        </div>

        <footer className={cn("shrink-0 border-t border-line bg-paper pt-[13px] pb-[max(13px,env(safe-area-inset-bottom))]", PAD)}>
          <ShippingPicker subtotal={listedTotal} />

          {hasListed ? (
            <div className="mt-2 space-y-2">
              <Row label="Subtotal" value={usd(listedTotal)} />
              {totalSaved > 0 ? <Row label="Saved vs Tier 1" value={`−${usd(totalSaved)}`} accent /> : null}
              <div className="flex items-baseline justify-between border-t border-line pt-[13px]">
                <span className={TYPE.kicker}>Total</span>
                <span className={cn(TYPE.title, "tabular-nums")}>{usd(grand)}</span>
              </div>
            </div>
          ) : null}

          <div className="mt-[21px] flex gap-2">
            <button
              type="button"
              disabled={!hasItems}
              className="inline-flex h-[34px] flex-1 items-center justify-center gap-2 rounded-lg bg-cobalt text-[13px] font-semibold text-paper transition-opacity disabled:opacity-35"
              onClick={copyCart}
            >
              <Copy className="size-[13px]" />
              {copied ? "Copied" : "Copy list"}
            </button>
            <button
              type="button"
              disabled={!hasItems}
              aria-label="Share list"
              className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-cobalt hover:text-cobalt disabled:opacity-35"
              onClick={shareCart}
            >
              <Share2 className="size-[13px]" />
            </button>
          </div>

          {hasItems ? (
            <div className={cn("mt-[13px] flex justify-center gap-[21px]", TYPE.body)}>
              {!cart.picking ? (
                <button
                  type="button"
                  className="font-semibold text-cobalt"
                  onClick={() => {
                    cart.enablePicking();
                    cart.closeTray();
                  }}
                >
                  Add more
                </button>
              ) : null}
              <button type="button" className="text-muted hover:text-ink" onClick={cart.clear}>
                Clear list
              </button>
            </div>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-[13px]", TYPE.body, accent ? "font-medium text-cobalt" : "text-ink")}>
      <span className={accent ? undefined : "text-muted"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function QtyStepper({
  value,
  name,
  onChange,
}: {
  value: number;
  name: string;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="mx-auto inline-flex h-[34px] items-center rounded-md border border-line bg-paper">
      <button
        type="button"
        aria-label={`Decrease ${name}`}
        className="grid size-[34px] place-items-center text-ink-soft hover:text-ink"
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-[13px]" />
      </button>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="cart-qty w-[34px] bg-transparent text-center text-[13px] font-semibold tabular-nums outline-none"
        aria-label={`${name} quantity`}
      />
      <button
        type="button"
        aria-label={`Increase ${name}`}
        className="grid size-[34px] place-items-center text-ink-soft hover:text-ink"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-[13px]" />
      </button>
    </div>
  );
}

function ShippingPicker({ subtotal }: { subtotal: number }) {
  const cart = useQuoteCart();
  const us = cart.shipDest === "us";
  const standardFree = !us && subtotal >= SHIP_FREE_AT;
  const [open, setOpen] = useState(false);
  const price = us ? usd(SHIP_PRIORITY) : standardFree ? "Free" : usd(SHIP_STANDARD);
  const summary = us
    ? `US · Priority · ${shippingTransit("us", "priority")}`
    : `Worldwide · Standard · ${shippingTransit("row", "standard")}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1">
            <span className={TYPE.kicker}>Shipping</span>
            <span className={cn("inline-flex text-muted", open ? "rotate-180" : "ship-chevron-nudge")}>
              <ChevronDown className="size-[13px]" aria-hidden />
            </span>
          </span>
          {open ? null : <span className={cn("block", TYPE.body, "text-ink-soft")}>{summary}</span>}
        </span>
        <span className={cn("shrink-0", TYPE.amount)}>{price}</span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-2">
            <DestSlider us={us} ipUS={cart.ipUS} onChange={(dest) => cart.setShipDest(dest)} />
            <p className={cn("mt-2", TYPE.body, "text-ink-soft")}>
              {us
                ? "Standard is paused for Golden Week (Sept–Oct). Priority is the only lane we can book, so your parcel does not sit in a suspended queue."
                : standardFree
                  ? `7–12 days · complimentary over ${usd(SHIP_FREE_AT)}`
                  : `7–12 days · free over ${usd(SHIP_FREE_AT)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DestSlider({
  us,
  ipUS,
  onChange,
}: {
  us: boolean;
  ipUS: boolean;
  onChange: (dest: "row" | "us") => void;
}) {
  const [origin, setOrigin] = useState<number | null>(null);
  const worldwideOff = ipUS;

  return (
    <div
      className="relative grid grid-cols-2 rounded-full bg-mist p-0.5"
      onPointerDown={(event) => setOrigin(event.clientX)}
      onPointerUp={(event) => {
        if (origin == null) return;
        const delta = event.clientX - origin;
        setOrigin(null);
        if (delta > 24) onChange("us");
        else if (delta < -24 && !worldwideOff) onChange("row");
      }}
      onPointerCancel={() => setOrigin(null)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-1/2 rounded-full bg-paper shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: us || worldwideOff ? "translateX(calc(100% - 4px))" : "translateX(0)" }}
      />
      <button
        type="button"
        aria-pressed={!us && !worldwideOff}
        aria-disabled={worldwideOff}
        disabled={worldwideOff}
        onClick={() => onChange("row")}
        className={cn(
          "relative z-10 flex min-h-[34px] flex-col items-center justify-center py-1 leading-none transition-colors duration-200",
          worldwideOff ? "text-[#c45c4a]" : us ? "text-ink-soft" : "text-ink",
        )}
      >
        <span className="text-[13px] font-semibold">Worldwide</span>
        {worldwideOff ? (
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">Not applicable</span>
        ) : null}
      </button>
      <button
        type="button"
        aria-pressed={us || worldwideOff}
        onClick={() => onChange("us")}
        className={cn(
          "relative z-10 h-[34px] text-[13px] font-semibold transition-colors duration-200",
          us || worldwideOff ? "text-ink" : "text-ink-soft",
        )}
      >
        United States
      </button>
    </div>
  );
}

function flashCopied(setCopied: (v: boolean) => void) {
  setCopied(true);
  window.setTimeout(() => setCopied(false), 1600);
}
