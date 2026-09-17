import { AddToQuote } from "@/components/add-to-quote";
import { groupIsOutOfStock, OutOfStockFold } from "@/components/out-of-stock-fold";
import { categoryById, groupByName, type Product } from "@/lib/catalog";
import { VOLUME_TIERS } from "@/lib/pricing";
import { cn, usd } from "@/lib/utils";

export function CategoryTable({
  products,
  highlightTier,
}: {
  products: Product[];
  highlightTier: number;
}) {
  const groups = groupByName(products);
  const accent = products[0] ? (categoryById(products[0].category)?.accent ?? "#1b4f8a") : "#1b4f8a";

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const oos = groupIsOutOfStock(group.items);
        const table = (
          <CompoundTable group={group} highlightTier={highlightTier} accent={accent} oos={oos} />
        );
        if (oos) {
          return (
            <OutOfStockFold key={group.name} name={group.name} headerNote={group.items[0]?.headerNote} accent={accent}>
              {table}
            </OutOfStockFold>
          );
        }
        return (
          <div
            key={group.name}
            className="compound-block overflow-hidden rounded-xl border border-line print:break-inside-avoid"
          >
            <div
              className="flex flex-wrap items-center justify-between gap-2 px-[26px] py-3.5 text-white"
              style={{ backgroundColor: accent }}
            >
              <h3 className="text-lg font-bold">{group.name}</h3>
              {group.items[0]?.headerNote ? (
                <span className="shrink-0 rounded-full bg-paper/20 px-3 py-1 text-sm font-semibold">
                  {group.items[0].headerNote}
                </span>
              ) : null}
            </div>
            {table}
          </div>
        );
      })}
    </div>
  );
}

function CompoundTable({
  group,
  highlightTier,
  accent,
  oos,
}: {
  group: { name: string; items: Product[] };
  highlightTier: number;
  accent: string;
  oos: boolean;
}) {
  return (
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full min-w-table border-collapse text-base print:min-w-0 print:text-sm">
              <thead>
                <tr className="bg-paper-deep text-ink">
                  <th
                    className="px-[26px] py-3 text-left font-semibold text-ink/55"
                    style={{ borderBottom: `1px solid ${accent}33` }}
                  >
                    Strength
                  </th>
                  {VOLUME_TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      className={cn(
                        "px-4 py-3 text-right font-semibold tabular-nums",
                        !oos && highlightTier === tier.id && "text-white",
                      )}
                      style={{
                        borderBottom: `1px solid ${accent}33`,
                        ...(!oos && highlightTier === tier.id ? { backgroundColor: accent } : {}),
                      }}
                    >
                      <span className="block leading-tight">{tier.label}</span>
                      <span className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                        {tier.unit}
                      </span>
                      <span className="block text-xs font-medium opacity-75">{tier.discount}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.items.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? "bg-card" : "bg-paper-deep/80"}>
                    <td
                      className="px-[26px] py-2.5"
                      style={{
                        color: accent,
                        borderTop: i === 0 ? undefined : `1px solid ${accent}26`,
                      }}
                    >
                      <div className="flex min-w-[11rem] items-center justify-between gap-3">
                        <span className="font-semibold">
                          {p.pack}
                          {p.unitNote ? (
                            <span className="ml-2 text-sm font-normal text-muted">{p.unitNote}</span>
                          ) : null}
                        </span>
                        {oos ? null : <AddToQuote product={p} accent={accent} compact />}
                      </div>
                    </td>
                    {p.prices
                      ? p.prices.map((price, idx) => (
                          <td
                            key={idx}
                            className={cn(
                              "px-4 py-3 text-right tabular-nums",
                              !oos && highlightTier === idx && "font-bold",
                            )}
                            style={{
                              borderTop: i === 0 ? undefined : `1px solid ${accent}26`,
                              ...(!oos && highlightTier === idx
                                ? { backgroundColor: `${accent}1a`, color: accent }
                                : { color: oos ? "#5a6778" : undefined }),
                            }}
                          >
                            {usd(price)}
                          </td>
                        ))
                      : VOLUME_TIERS.map((tier) => (
                          <td
                            key={tier.id}
                            className="px-4 py-3 text-right text-sm"
                            style={{
                              color: accent,
                              borderTop: i === 0 ? undefined : `1px solid ${accent}26`,
                            }}
                          >
                            —
                          </td>
                        ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  );
}
