import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { usd } from "@/lib/utils";
import { useQuoteStore } from "@/store/quote-store";

export function ProductCard({ product, tierIndex }: { product: Product; tierIndex: number }) {
  const add = useQuoteStore((s) => s.add);
  const price = product.prices ? product.prices[tierIndex] : null;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <Link to="/product/$slug" params={{ slug: product.id }} className="min-w-0">
          <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{product.pack}</p>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {product.specialOrder ? <Badge variant="special">MOQ 100</Badge> : null}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        {product.specialOrder ? (
          <p className="text-sm font-medium text-cobalt">Custom pricing</p>
        ) : (
          <p className="font-display text-2xl font-semibold tabular-nums leading-none">{usd(price ?? 0)}</p>
        )}
        <Button
          size="sm"
          variant={product.specialOrder ? "cobalt" : "default"}
          onClick={() => add(product.id, product.specialOrder ? 100 : 1)}
        >
          <Plus />
          {product.specialOrder ? "Enquire" : "Add"}
        </Button>
      </div>
      {product.excludeFromVolume ? (
        <p className="mt-2 text-[11px] text-muted">Does not count toward volume tier</p>
      ) : null}
    </article>
  );
}
