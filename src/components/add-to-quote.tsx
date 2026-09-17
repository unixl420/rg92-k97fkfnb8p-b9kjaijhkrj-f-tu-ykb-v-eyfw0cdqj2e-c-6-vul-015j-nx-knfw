import { Plus } from "lucide-react";
import { type Product } from "@/lib/catalog";
import { useQuoteCartOptional } from "@/lib/quote-cart";
import { cn } from "@/lib/utils";

export function AddToQuote({
  product,
  accent,
  compact = false,
}: {
  product: Product;
  accent?: string;
  compact?: boolean;
}) {
  const cart = useQuoteCartOptional();
  if (!cart?.picking) return null;
  const qty = cart.lineQty(product.id);
  const color = accent ?? "#1b4f8a";
  const added = qty > 0;

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} ${product.pack} to cart`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        cart.add(product);
      }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-1 rounded-full font-semibold print:hidden transition-[filter,transform] hover:brightness-95 active:scale-95",
        compact ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
      )}
      style={{
        border: `1px solid ${color}`,
        backgroundColor: added ? color : `${color}14`,
        color: added ? "#fff" : color,
      }}
    >
      {added ? (
        <span>{qty} kit{qty === 1 ? "" : "s"}</span>
      ) : (
        <>
          <Plus className={compact ? "size-3" : "size-3.5"} strokeWidth={2.5} />
          Add
        </>
      )}
    </button>
  );
}
