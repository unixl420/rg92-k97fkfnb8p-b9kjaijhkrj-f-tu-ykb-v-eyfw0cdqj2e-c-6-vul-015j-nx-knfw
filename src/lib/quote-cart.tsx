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

export type ShipDest = "row" | "us";
export type ShipMethod = "standard" | "priority";

export const SHIP_STANDARD = 50;
export const SHIP_PRIORITY = 100;
export const SHIP_FREE_AT = 700;

export function shippingCost(subtotal: number, dest: ShipDest, method: ShipMethod): number {
  if (dest === "us") return SHIP_PRIORITY;
  if (subtotal >= SHIP_FREE_AT) return 0;
  return SHIP_STANDARD;
}

export function shippingTransit(dest: ShipDest, method: ShipMethod): string {
  if (dest === "us" && method === "priority") return "7–10 days";
  if (dest === "us") return "15–18 days";
  return "7–12 days";
}

export function shippingCopyLine(subtotal: number, dest: ShipDest, method: ShipMethod): string {
  const cost = shippingCost(subtotal, dest, method);
  const destLabel = dest === "us" ? "United States" : "Worldwide";
  const methodLabel = method === "priority" ? "Priority" : "Standard";
  const price = cost === 0 ? "Free" : `${usd(cost)}`;
  return `Shipping: ${methodLabel} · ${destLabel} · ${shippingTransit(dest, method)} · ${price}`;
}

type QuoteCartValue = {
  picking: boolean;
  open: boolean;
  lines: QuoteLine[];
  count: number;
  kits: number;
  shipDest: ShipDest;
  shipMethod: ShipMethod;
  ipUS: boolean;
  setShipDest: (dest: ShipDest) => void;
  setShipMethod: (method: ShipMethod) => void;
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
const SHIP_KEY = "cbg-ship-v1";

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

function readStoredShip(): { dest: ShipDest; method: ShipMethod } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SHIP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { dest?: string; method?: string };
    const dest: ShipDest = parsed.dest === "us" ? "us" : "row";
    return { dest, method: dest === "us" ? "priority" : "standard" };
  } catch {
    return null;
  }
}

function timezoneLooksUS(): boolean {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  return /^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Adak|Boise|Detroit|Indiana\/|Kentucky\/|North_Dakota\/)|Pacific\/Honolulu|US\/)/.test(
    tz,
  );
}

async function detectShipDest(): Promise<ShipDest> {
  try {
    const cached = window.sessionStorage.getItem("cbg-ip-dest");
    if (cached === "us" || cached === "row") return cached;
  } catch {
    /* ignore */
  }

  const readCode = async (url: string, pick: (data: unknown) => string | null) => {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 2200);
    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) return null;
      const data: unknown = res.headers.get("content-type")?.includes("json")
        ? await res.json()
        : await res.text();
      const code = pick(data);
      return code ? code.toUpperCase() : null;
    } catch {
      return null;
    } finally {
      window.clearTimeout(timer);
    }
  };

  const code =
    (await readCode("https://api.country.is/", (data) =>
      data && typeof data === "object" && "country" in data && typeof data.country === "string"
        ? data.country
        : null,
    )) ||
    (await readCode("https://ipwho.is/?fields=country_code", (data) =>
      data && typeof data === "object" && "country_code" in data && typeof data.country_code === "string"
        ? data.country_code
        : null,
    ));

  const dest: ShipDest = code === "US" ? "us" : code ? "row" : timezoneLooksUS() ? "us" : "row";
  try {
    window.sessionStorage.setItem("cbg-ip-dest", dest);
  } catch {
    /* ignore */
  }
  return dest;
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

export function formatQuote(lines: QuoteLine[], dest: ShipDest, method: ShipMethod): string {
  const rows = lines.map(
    (line) => `${line.name} ${line.pack} × ${line.qty} kit${line.qty === 1 ? "" : "s"}`,
  );
  const listed = lines.filter((line) => line.prices);
  const subtotal = listed.reduce((n, line) => n + (lineTotal(line) ?? 0), 0);
  const ship = shippingCost(subtotal, dest, method);
  const total = subtotal + ship;
  const tail = listed.length
    ? [
        "",
        `Listed subtotal: ${usd(subtotal)} USD`,
        shippingCopyLine(subtotal, dest, method),
        `Total: ${usd(total)} USD`,
      ]
    : ["", shippingCopyLine(0, dest, method)];
  return [...rows, ...tail].join("\n");
}

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [picking, setPicking] = useState(false);
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [shipDest, setShipDestState] = useState<ShipDest>("row");
  const [shipMethod, setShipMethodState] = useState<ShipMethod>("standard");
  const [ipUS, setIpUS] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStoredLines());
    let cancelled = false;
    void detectShipDest().then((detected) => {
      if (cancelled) return;
      const fromUS = detected === "us";
      setIpUS(fromUS);
      const stored = readStoredShip();
      const dest: ShipDest = fromUS ? "us" : stored?.dest ?? detected;
      setShipDestState(dest);
      setShipMethodState(dest === "us" ? "priority" : "standard");
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SHIP_KEY, JSON.stringify({ dest: shipDest, method: shipMethod }));
  }, [shipDest, shipMethod, hydrated]);

  const setShipDest = useCallback((dest: ShipDest) => {
    if (ipUS && dest === "row") return;
    setShipDestState(dest);
    setShipMethodState(dest === "us" ? "priority" : "standard");
  }, [ipUS]);

  const setShipMethod = useCallback((method: ShipMethod) => {
    setShipMethodState(method);
  }, []);

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
      shipDest,
      shipMethod,
      ipUS,
      setShipDest,
      setShipMethod,
      enablePicking: () => setPicking(true),
      doneAdding: () => setPicking(false),
      openTray: () => setOpen(true),
      closeTray: () => setOpen(false),
      add,
      setQty,
      remove,
      clear: () => setLines([]),
      lineQty: (id: string) => lines.find((line) => line.id === id)?.qty ?? 0,
      copyText: () => formatQuote(lines, shipDest, shipMethod),
    }),
    [picking, open, lines, shipDest, shipMethod, ipUS, setShipDest, setShipMethod, add, setQty, remove],
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
