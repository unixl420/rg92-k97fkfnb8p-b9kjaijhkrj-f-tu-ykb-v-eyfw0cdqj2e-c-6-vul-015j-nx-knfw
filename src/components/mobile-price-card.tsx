import { categoryById, groupByName, type Product } from "@/lib/catalog";
import { VOLUME_TIERS } from "@/lib/pricing";
import { cn, usd } from "@/lib/utils";

export function MobileCategoryList({
  products,
  highlightTier,
}: {
  products: Product[];
  highlightTier: number;
}) {
  const groups = groupByName(products);
  const accent = products[0] ? (categoryById(products[0].category)?.accent ?? "#1b4f8a") : "#1b4f8a";

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.name} className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="px-[26px] py-3.5 text-white" style={{ backgroundColor: accent }}>
            <h3 className="text-lg font-bold">{group.name}</h3>
          </div>
          <div className="divide-y divide-line">
            {group.items.map((product) => (
              <MobileStrength
                key={product.id}
                product={product}
                highlightTier={highlightTier}
                accent={accent}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MobileStrength({
  product,
  highlightTier,
  accent,
}: {
  product: Product;
  highlightTier: number;
  accent: string;
}) {
  return (
    <div className="px-[26px] py-5">
      <p className="text-lg font-semibold text-ink/55">
        {product.pack}
        {product.unitNote ? (
          <span className="ml-2 text-sm font-normal text-muted">{product.unitNote}</span>
        ) : null}
      </p>
      {product.prices ? (
        <ul className="mt-3 overflow-hidden rounded-lg border border-line">
          {VOLUME_TIERS.map((tier) => {
            const active = highlightTier === tier.id;
            return (
              <li
                key={tier.id}
                className="flex items-center justify-between gap-3 px-[22px] py-3"
                style={active ? { backgroundColor: `${accent}1a` } : undefined}
              >
                <span className={cn("text-sm leading-tight", active ? "font-semibold text-ink" : "text-ink-soft")}>
                  {tier.label} {tier.unit}
                  <span className="block text-xs text-muted">{tier.discount}</span>
                </span>
                <span
                  className="text-xl font-bold tabular-nums"
                  style={{ color: active ? accent : undefined }}
                >
                  {usd(product.prices![tier.id])}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-base font-medium" style={{ color: accent }}>
          Custom pricing · MOQ 100 kits
        </p>
      )}
      {product.excludeFromVolume ? (
        <p className="mt-2 text-sm text-muted">Does not count toward the volume discount tier.</p>
      ) : null}
    </div>
  );
}
