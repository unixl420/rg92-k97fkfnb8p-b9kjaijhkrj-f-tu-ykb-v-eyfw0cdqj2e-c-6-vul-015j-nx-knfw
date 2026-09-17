import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function groupIsOutOfStock<T extends { outOfStock?: boolean }>(items: T[]) {
  return items.length > 0 && items.every((item) => item.outOfStock);
}

export function OutOfStockFold({
  name,
  headerNote,
  accent,
  children,
}: {
  name: string;
  headerNote?: string;
  accent: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden border print:break-inside-avoid",
        open ? "rounded-2xl" : "rounded-full",
      )}
      style={{ backgroundColor: `${accent}18`, borderColor: `${accent}3d` }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-5 py-2.5 text-left"
      >
        <span className="min-w-0 truncate text-base font-semibold" style={{ color: accent }}>
          {name}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {headerNote ? (
            <span
              className="hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              {headerNote}
            </span>
          ) : null}
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            Out of stock
          </span>
          <ChevronDown
            className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
            style={{ color: accent }}
            aria-hidden
          />
        </span>
      </button>
      {open ? (
        <div className="border-t bg-card/80" style={{ borderColor: `${accent}28` }}>
          {children}
        </div>
      ) : (
        <div className="hidden print:block">{children}</div>
      )}
    </div>
  );
}
