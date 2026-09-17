import { Check, Copy, Minus, Plus, Share2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { LIST_META } from "@/lib/catalog";
import { tierIndexForKits } from "@/lib/pricing";
import { lineSaved, lineTotal, unitPrice, useQuoteCart } from "@/lib/quote-cart";
import { copyToClipboard, usd } from "@/lib/utils";

export function QuoteTray() {
  const cart = useQuoteCart();
  const [copied, setCopied] = useState(false);
  if (!cart.open) return null;

  const listedTotal = cart.lines.reduce((n, line) => n + (lineTotal(line) ?? 0), 0);
  const totalSaved = cart.lines.reduce((n, line) => n + (lineSaved(line) ?? 0), 0);
  const hasListed = cart.lines.some((line) => line.prices);
  const hasItems = cart.lines.length > 0;

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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const copyCart = async () => {
    const ok = await copyToClipboard(cart.copyText());
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="no-print fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close cart"
        onClick={cart.closeTray}
      />
      <aside className="cart-panel absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-paper shadow-[0_-16px_48px_rgba(20,32,51,0.2)] sm:inset-y-0 sm:left-0 sm:right-auto sm:mx-0 sm:max-h-none sm:max-w-[26rem] sm:rounded-none sm:rounded-r-2xl sm:border-r sm:border-line sm:shadow-[16px_0_48px_rgba(20,32,51,0.12)]">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden />

        <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-3 sm:pt-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">China Biotech Group</p>
            <h2 className="mt-0.5 text-2xl font-bold tracking-tight">Cart</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasItems ? (
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums text-ink-soft">
                {cart.count} item{cart.count === 1 ? "" : "s"} · {cart.kits} kit{cart.kits === 1 ? "" : "s"}
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Close"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink"
              onClick={cart.closeTray}
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        {cart.picking ? (
          <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-full bg-cobalt/8 py-1.5 pl-4 pr-1.5">
            <p className="min-w-0 text-sm font-medium text-cobalt">Adding from the list</p>
            <button
              type="button"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-cobalt px-3 text-sm font-semibold text-paper"
              onClick={cart.doneAdding}
            >
              <Check className="size-3.5" strokeWidth={2.5} />
              Done
            </button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
          {hasItems ? (
            <ul className="flex flex-col gap-2">
              {cart.lines.map((line) => {
                const unit = unitPrice(line);
                const total = lineTotal(line);
                const saved = lineSaved(line);
                const tier = line.qty >= 10 ? tierIndexForKits(line.qty) + 1 : null;
                return (
                  <li key={line.id} className="rounded-2xl border border-line bg-card px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">{line.name}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
                          <span>{line.pack}</span>
                          {tier ? (
                            <span className="rounded-full bg-cobalt/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cobalt">
                              Tier {tier}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} ${line.pack}`}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
                        onClick={() => cart.remove(line.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex h-9 items-center rounded-full border border-line bg-paper-deep">
                        <button
                          type="button"
                          aria-label="Decrease kits"
                          className="grid size-9 place-items-center text-cobalt"
                          onClick={() => cart.setQty(line.id, line.qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={line.qty}
                          onChange={(event) => cart.setQty(line.id, Number(event.target.value))}
                          className="w-10 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
                          aria-label={`${line.name} kit quantity`}
                        />
                        <button
                          type="button"
                          aria-label="Increase kits"
                          className="grid size-9 place-items-center text-cobalt"
                          onClick={() => cart.setQty(line.id, line.qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        {unit != null && total != null ? (
                          <>
                            <p className="text-base font-semibold tabular-nums tracking-tight">{usd(total)}</p>
                            {saved && saved > 0 ? (
                              <p className="mt-0.5 text-[11px] font-semibold text-cobalt">Saved {usd(saved)}</p>
                            ) : (
                              <p className="mt-0.5 text-[11px] text-muted">{usd(unit)} / kit</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm font-medium text-cobalt">On request</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-mist/40 px-6 text-center">
              <p className="text-base font-semibold">Your cart is empty</p>
              <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-ink-soft">
                Add strengths from the list, then copy and send this cart to our representative.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center rounded-full bg-cobalt px-4 text-sm font-semibold text-paper"
                onClick={() => {
                  cart.enablePicking();
                  cart.closeTray();
                }}
              >
                Add from the list
              </button>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-line bg-paper px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {hasListed ? (
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Listed subtotal</p>
                {totalSaved > 0 ? (
                  <p className="mt-1 text-sm font-semibold text-cobalt">You save {usd(totalSaved)}</p>
                ) : null}
              </div>
              <p className="text-2xl font-bold tabular-nums tracking-tight">{usd(listedTotal)}</p>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              disabled={!hasItems}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cobalt text-base font-semibold text-paper shadow-[0_8px_20px_rgba(27,79,138,0.22)] transition-opacity disabled:opacity-35"
              onClick={copyCart}
            >
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy cart"}
            </button>
            <button
              type="button"
              disabled={!hasItems}
              aria-label="Share cart"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-cobalt hover:text-cobalt disabled:opacity-35"
              onClick={shareCart}
            >
              <Share2 className="size-5" />
            </button>
          </div>

          {hasItems ? (
            <div className="mt-3 flex items-center justify-center gap-4 text-sm">
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
              <button type="button" className="font-medium text-muted hover:text-ink" onClick={cart.clear}>
                Clear
              </button>
            </div>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}
