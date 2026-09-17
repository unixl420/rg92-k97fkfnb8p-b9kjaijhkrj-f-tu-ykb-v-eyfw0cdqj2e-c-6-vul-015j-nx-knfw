import { Plus } from "lucide-react";
import { type Product } from "@/lib/catalog";
import { useQuoteCartOptional } from "@/lib/quote-cart";
import { cn } from "@/lib/utils";

export function AddToQuote({ product, accent }: { product: Product; accent?: string }) {
  const cart = useQuoteCartOptional();
  if (!cart?.picking) return null;
  const qty = cart.lineQty(product.id);
  const color = accent ?? "#1b4f8a";

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} ${product.pack} to quote`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        cart.add(product);
      }}
      className={cn(
        "relative mr-2 inline-flex size-7 shrink-0 items-center justify-center rounded-full border print:hidden",
        qty ? "text-paper" : "bg-paper",
      )}
      style={{
        borderColor: color,
        backgroundColor: qty ? color : undefined,
        color: qty ? "#fff" : color,
      }}
    >
      <Plus className="size-3.5" strokeWidth={2.5} />
      {qty ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-4 rounded-full bg-ink px-1 text-[10px] font-bold leading-4 text-paper">
          {qty}
        </span>
      ) : null}
    </button>
  );
}
