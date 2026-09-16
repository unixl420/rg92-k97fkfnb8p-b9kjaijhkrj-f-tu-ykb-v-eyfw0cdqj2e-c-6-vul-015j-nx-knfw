import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { tierIndexForKits } from "@/lib/pricing";

export type QuoteLine = { productId: string; qty: number };

type QuoteState = {
  lines: QuoteLine[];
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (productId, qty = 1) => {
        const existing = get().lines.find((l) => l.productId === productId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.productId === productId ? { ...l, qty: l.qty + qty } : l,
            ),
          });
          return;
        }
        set({ lines: [...get().lines, { productId, qty }] });
      },
      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.productId !== productId) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.productId === productId ? { ...l, qty } : l)),
        });
      },
      remove: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "cbg-quote",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function resolvedQuote(lines: QuoteLine[]) {
  const resolved = lines
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return null;
      return { product, qty: line.qty };
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const kitCount = resolved.reduce(
    (sum, l) => (l.product.excludeFromVolume || l.product.specialOrder ? sum : sum + l.qty),
    0,
  );
  const tierIndex = tierIndexForKits(kitCount);

  const subtotal = resolved.reduce((sum, l) => {
    if (!l.product.prices) return sum;
    return sum + l.product.prices[tierIndex] * l.qty;
  }, 0);

  const specialCount = resolved.filter((l) => l.product.specialOrder).length;

  return { resolved, kitCount, tierIndex, subtotal, specialCount };
}
