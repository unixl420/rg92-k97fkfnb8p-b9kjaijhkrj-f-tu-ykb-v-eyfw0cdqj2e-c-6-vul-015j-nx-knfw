import { AddToQuote } from "@/components/add-to-quote";
import { useEffect, useRef, useState } from "react";
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
  const refs = useRef(new Map<string, HTMLElement>());
  const [stuck, setStuck] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const group of groups) {
        const el = refs.current.get(group.name);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 12) current = group.name;
      }
      const first = refs.current.get(groups[0]?.name ?? "");
      const show = Boolean(first && first.getBoundingClientRect().top < 8);
      setStuck(show ? current : null);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [products]);

  const stuckGroup = groups.find((g) => g.name === stuck);

  return (
    <div className="relative space-y-5">
      <div className="pointer-events-none sticky top-0 z-30 h-0 overflow-visible">
        <div
          className={cn(
            "compound-float flex items-center justify-between gap-2 rounded-b-xl px-[26px] py-3.5 text-white shadow-lg",
            stuck ? "compound-float-on" : "compound-float-off",
          )}
          style={{ backgroundColor: accent }}
          aria-hidden={!stuck}
        >
          {stuckGroup ? (
            <>
              <span key={stuckGroup.name} className="compound-float-name text-lg font-bold">
                {stuckGroup.name}
              </span>
              {stuckGroup.items[0]?.headerNote ? (
                <span className="shrink-0 rounded-full bg-paper/20 px-3 py-1 text-sm font-semibold">
                  {stuckGroup.items[0].headerNote}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-lg font-bold">&nbsp;</span>
          )}
        </div>
      </div>

      {groups.map((group) => (
        <section
          key={group.name}
          ref={(node) => {
            if (node) refs.current.set(group.name, node);
            else refs.current.delete(group.name);
          }}
          className="overflow-hidden rounded-xl border border-line bg-card"
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
          <div>
            {group.items.map((product, i) => (
              <MobileStrength
                key={product.id}
                product={product}
                highlightTier={highlightTier}
                accent={accent}
                lined={i > 0}
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
  lined,
}: {
  product: Product;
  highlightTier: number;
  accent: string;
  lined: boolean;
}) {
  return (
    <div
      className="px-[26px] py-5"
      style={lined ? { borderTop: `1px solid ${accent}2e` } : undefined}
    >
      <p className="flex items-center text-lg font-semibold" style={{ color: accent }}>
        <AddToQuote product={product} accent={accent} />
        {product.pack}
        {product.unitNote ? (
          <span className="ml-2 text-sm font-normal text-muted">{product.unitNote}</span>
        ) : null}
      </p>
      {product.prices ? (
        <ul
          className="mt-3 overflow-hidden rounded-lg border"
          style={{ borderColor: `${accent}33` }}
        >
          {VOLUME_TIERS.map((tier, i) => {
            const active = highlightTier === tier.id;
            return (
              <li
                key={tier.id}
                className="flex items-center justify-between gap-3 px-[22px] py-3"
                style={{
                  backgroundColor: active ? `${accent}1a` : undefined,
                  borderTop: i === 0 ? undefined : `1px solid ${accent}24`,
                }}
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
    </div>
  );
}
