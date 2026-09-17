import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { tierIndexForKits, type PriceTiers } from "@/lib/pricing";
import { usd } from "@/lib/utils";

export type QuoteLine = {
  id: string;
  name: string;
  pack: string;
  qty: number;
  prices: PriceTiers | null;
  specialOrder?: boolean;
};

type QuoteCartValue = {
  picking: boolean;
  open: boolean;
  lines: QuoteLine[];
  count: number;
  kits: number;
  enablePicking: () => void;
  doneAdding: () => void;
  openTray: () => void;
  closeTray: () => void;
  add: (product: Product) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  lineQty: (id: string) => number;
  copyText: () => string;
};

const QuoteCartContext = createContext<QuoteCartValue | null>(null);
const CART_KEY = "cbg-cart-v1";

function readStoredLines(): QuoteLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line) =>
          line &&
          typeof line.id === "string" &&
          typeof line.name === "string" &&
          typeof line.pack === "string" &&
          Number.isFinite(line.qty) &&
          line.qty >= 1,
      )
      .map((line) => {
        const product = PRODUCTS.find((item) => item.id === line.id);
        if (!product) return line;
        return {
          ...line,
          name: product.name,
          pack: product.pack,
          prices: product.prices,
          specialOrder: product.specialOrder,
        };
      });
  } catch {
    return [];
  }
}

function lineTotal(line: QuoteLine): number | null {
  if (!line.prices) return null;
  return line.prices[tierIndexForKits(line.qty)] * line.qty;
}

function unitPrice(line: QuoteLine): number | null {
  if (!line.prices) return null;
  return line.prices[tierIndexForKits(line.qty)];
}

function lineSaved(line: QuoteLine): number | null {
  if (!line.prices) return null;
  const unit = unitPrice(line);
  if (unit == null) return null;
  const saved = (line.prices[0] - unit) * line.qty;
  return saved > 0 ? saved : null;
}

export function formatQuote(lines: QuoteLine[]): string {
  const rows = lines.map(
    (line) => `${line.name} ${line.pack} × ${line.qty} kit${line.qty === 1 ? "" : "s"}`,
  );
  const listed = lines.filter((line) => line.prices);
  const subtotal = listed.reduce((n, line) => n + (lineTotal(line) ?? 0), 0);
  const tail = listed.length ? ["", `Listed subtotal: ${usd(subtotal)} USD`] : [];
  return [...rows, ...tail].join("\n");
}

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [picking, setPicking] = useState(false);
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((product: Product) => {
    setPicking(true);
    setLines((prev) => {
      const existing = prev.find((line) => line.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          pack: product.pack,
          qty: product.specialOrder ? 100 : 1,
          prices: product.prices,
          specialOrder: product.specialOrder,
        },
      ];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const next = Math.max(1, Math.floor(qty) || 1);
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, qty: next } : line)));
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const value = useMemo<QuoteCartValue>(
    () => ({
      picking,
      open,
      lines,
      count: lines.length,
      kits: lines.reduce((n, line) => n + line.qty, 0),
      enablePicking: () => setPicking(true),
      doneAdding: () => setPicking(false),
      openTray: () => setOpen(true),
      closeTray: () => setOpen(false),
      add,
      setQty,
      remove,
      clear: () => setLines([]),
      lineQty: (id: string) => lines.find((line) => line.id === id)?.qty ?? 0,
      copyText: () => formatQuote(lines),
    }),
    [picking, open, lines, add, setQty, remove],
  );

  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>;
}

export function useQuoteCart() {
  const value = useContext(QuoteCartContext);
  if (!value) throw new Error("useQuoteCart must be used within QuoteCartProvider");
  return value;
}

export function useQuoteCartOptional() {
  return useContext(QuoteCartContext);
}

export { lineTotal, lineSaved, unitPrice };
