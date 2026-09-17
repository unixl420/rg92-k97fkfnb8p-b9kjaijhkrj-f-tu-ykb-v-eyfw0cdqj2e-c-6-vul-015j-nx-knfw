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

  return (
    <div className="no-print fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close cart"
        onClick={cart.closeTray}
      />
      <aside className="cart-panel absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-paper shadow-[0_-12px_40px_rgba(20,32,51,0.18)] sm:inset-y-0 sm:left-0 sm:right-auto sm:mx-0 sm:max-h-none sm:max-w-[26rem] sm:rounded-none sm:rounded-r-2xl sm:border-r sm:border-line sm:shadow-[12px_0_40px_rgba(20,32,51,0.12)]">
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cart</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {cart.count
                ? `${cart.count} item${cart.count === 1 ? "" : "s"} · ${cart.kits} kit${cart.kits === 1 ? "" : "s"}`
                : "Empty"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-mist hover:text-ink"
            onClick={cart.closeTray}
          >
            <X className="size-5" />
          </button>
        </header>

        {cart.picking ? (
          <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-xl bg-cobalt/8 px-3 py-2.5">
            <p className="min-w-0 text-sm font-medium text-ink">Adding from the list</p>
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {cart.lines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center">
              <p className="text-base text-ink-soft">No items yet.</p>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-cobalt"
                onClick={() => {
                  cart.enablePicking();
                  cart.closeTray();
                }}
              >
                Add from the list
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-line rounded-xl border border-line">
              {cart.lines.map((line) => {
                const unit = unitPrice(line);
                const total = lineTotal(line);
                const saved = lineSaved(line);
                return (
                  <li key={line.id} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                          <span>{line.name}</span>
                          {line.qty >= 10 ? (
                            <span className="rounded-full bg-cobalt/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cobalt">
                              Started from Tier {tierIndexForKits(line.qty) + 1}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-sm text-ink-soft">{line.pack}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} ${line.pack}`}
                        className="rounded-full p-1.5 text-muted hover:bg-mist hover:text-ink"
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
                          className="px-2.5 text-cobalt"
                          onClick={() => cart.setQty(line.id, line.qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={line.qty}
                          onChange={(event) => cart.setQty(line.id, Number(event.target.value))}
                          className="w-14 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
                          aria-label={`${line.name} kit quantity`}
                        />
                        <button
                          type="button"
                          aria-label="Increase kits"
                          className="px-2.5 text-cobalt"
                          onClick={() => cart.setQty(line.id, line.qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-right">
                        {unit != null && total != null ? (
                          <>
                            <span className="block text-base font-semibold tabular-nums">{usd(total)}</span>
                            {saved && saved > 0 ? (
                              <span className="mt-1 inline-flex rounded-full bg-cobalt px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                                Saved {usd(saved)}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-sm font-medium text-cobalt">On request</span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-line px-5 py-4">
          {hasListed ? (
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <div className="text-right">
                <span className="block text-lg font-bold tabular-nums">{usd(listedTotal)} USD</span>
                {totalSaved > 0 ? (
                  <span className="mt-1 inline-flex rounded-full bg-cobalt px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                    Saved {usd(totalSaved)}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            {cart.lines.length ? (
              <button
                type="button"
                className="h-12 rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-mist"
                onClick={cart.clear}
              >
                Clear
              </button>
            ) : null}
            {!cart.picking && cart.lines.length ? (
              <button
                type="button"
                className="h-12 rounded-full px-4 text-sm font-semibold text-cobalt hover:bg-cobalt/10"
                onClick={() => {
                  cart.enablePicking();
                  cart.closeTray();
                }}
              >
                Add more
              </button>
            ) : null}
            <button
              type="button"
              disabled={!cart.lines.length}
              aria-label="Share cart"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-cobalt bg-paper text-cobalt disabled:opacity-40 hover:bg-cobalt/10"
              onClick={async () => {
                const text = cart.copyText();
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: `${LIST_META.group} cart`,
                      text,
                    });
                    return;
                  } catch (error) {
                    if (error instanceof Error && error.name === "AbortError") return;
                  }
                }
                const ok = await copyToClipboard(text);
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }}
            >
              <Share2 className="size-5" />
            </button>
            <button
              type="button"
              disabled={!cart.lines.length}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cobalt text-base font-semibold text-paper disabled:opacity-40"
              onClick={async () => {
                const ok = await copyToClipboard(cart.copyText());
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }}
            >
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy cart"}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
