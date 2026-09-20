import { ArrowDown, ArrowUp, PenLine, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useQuoteCart } from "@/lib/quote-cart";
import { cn } from "@/lib/utils";

const FAB =
  "glass-fab relative inline-flex size-12 items-center justify-center rounded-full text-paper shadow-lg sm:size-14";

const FAB_MINI =
  "glass-fab glass-fab-x inline-flex size-8 items-center justify-center rounded-full text-paper shadow-lg sm:size-9";

const EDGE = 20;
const GAP = 16;
const HOLD_MS = 450;

function useFabOffset() {
  const [bottom, setBottom] = useState(EDGE);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (document.hidden) return;
      const footer = document.getElementById("site-footer");
      const fromBottom = footer
        ? window.innerHeight - footer.getBoundingClientRect().top
        : 0;
      const value = fromBottom > 0 ? fromBottom + GAP : EDGE;
      setBottom((prev) => (prev === value ? prev : value));
    };
    const update = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return bottom;
}

function scrollByPage(direction: "up" | "down") {
  const step = Math.round(window.innerHeight * 0.85);
  window.scrollBy({ top: direction === "up" ? -step : step, behavior: "smooth" });
}

function scrollToEnd(direction: "up" | "down") {
  if (direction === "up") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const footer = document.getElementById("site-footer");
  footer?.scrollIntoView({ behavior: "smooth", block: "end" });
}

function PageScrollFab({
  direction,
  label,
}: {
  direction: "up" | "down";
  label: string;
}) {
  const held = useRef(false);
  const timer = useRef(0);

  const clear = () => {
    window.clearTimeout(timer.current);
    timer.current = 0;
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    held.current = false;
    clear();
    timer.current = window.setTimeout(() => {
      held.current = true;
      scrollToEnd(direction);
    }, HOLD_MS);
  };

  const onPointerUp = () => {
    const wasHold = held.current;
    clear();
    if (!wasHold) scrollByPage(direction);
    held.current = false;
  };

  const onPointerCancel = () => {
    clear();
    held.current = false;
  };

  return (
    <button
      type="button"
      aria-label={`${label}. Hold to jump to the ${direction === "up" ? "top" : "bottom"}.`}
      className={`${FAB} select-none`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      {direction === "up" ? <ArrowUp className="size-5" /> : <ArrowDown className="size-5" />}
    </button>
  );
}

function CartFabHint({
  visible,
  leaving,
}: {
  visible: boolean;
  leaving: boolean;
}) {
  if (!visible) return null;
  return (
    <div
      id="quote-fab-tip"
      role="status"
      className={cn("glass-fab-tip", leaving && "is-leaving")}
    >
      <div className="glass-fab-tip-fill">Save your list and send it to us!</div>
    </div>
  );
}

function StopAddingButton({ onStop }: { onStop: () => void }) {
  const [red, setRed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setRed(true), 240);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <button
      type="button"
      aria-label="Stop adding"
      className={cn(FAB_MINI, red && "glass-fab-x-stop")}
      onClick={onStop}
    >
      <X className="size-3.5 sm:size-4" strokeWidth={2.5} />
    </button>
  );
}

function GlassSearch({
  query,
  onQuery,
}: {
  query: string;
  onQuery: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);

  const collapse = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => field.current?.focus(), 220);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    const onPointer = (event: Event) => {
      if (root.current && !root.current.contains(event.target as Node)) collapse();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={cn(
        "glass-search flex h-12 items-center overflow-hidden rounded-full text-paper shadow-lg sm:h-14",
        open ? "glass-search-open pl-3.5 pr-1" : "justify-center",
      )}
    >
      {open ? (
        <>
          <Search className="size-4 shrink-0 text-paper/55" strokeWidth={2} />
          <input
            ref={field}
            type="text"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Find a peptide"
            aria-label="Find a peptide"
            className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-paper outline-none placeholder:text-paper/45"
          />
          <button
            type="button"
            aria-label="Close search"
            className="grid size-10 shrink-0 place-items-center text-paper sm:size-12"
            onClick={collapse}
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </>
      ) : (
        <button
          type="button"
          aria-label="Find a peptide"
          className="relative grid size-12 place-items-center sm:size-14"
          onClick={() => setOpen(true)}
        >
          <Search className="size-5" strokeWidth={2} />
          {query.trim() ? (
            <span
              className="glass-indicator absolute right-1.5 top-1.5 size-2 rounded-full"
              aria-hidden
            />
          ) : null}
        </button>
      )}
    </div>
  );
}

export function BackToTop({
  query = "",
  onQuery,
}: {
  query?: string;
  onQuery?: (q: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState<"in" | "out" | "gone">("in");
  const bottom = useFabOffset();
  const cart = useQuoteCart();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (document.hidden) return;
      if (cart.count > 0) {
        setShow(true);
        return;
      }
      const volume = document.getElementById("volume-pricing");
      const reached = volume
        ? volume.getBoundingClientRect().top <= 120
        : window.scrollY > 220;
      setShow((prev) => (prev === reached ? prev : reached));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    const tick = window.setInterval(update, 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cart.count]);

  useEffect(() => {
    if (!show) return;
    if (cart.picking || cart.count > 0) {
      setTip("gone");
      return;
    }
    if (tip !== "in") return;
    const hide = window.setTimeout(() => setTip("out"), 30_000);
    return () => window.clearTimeout(hide);
  }, [show, cart.picking, cart.count, tip]);

  useEffect(() => {
    if (tip !== "out") return;
    const gone = window.setTimeout(() => setTip("gone"), 220);
    return () => window.clearTimeout(gone);
  }, [tip]);

  const fabBottom = `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`;
  const showTip = show && tip !== "gone" && !cart.picking && cart.count === 0;
  const showFabs = show || cart.count > 0;

  return (
    <>
      {showFabs ? (
        <div
          className="glass-fab-stack no-print fixed z-40 flex flex-col items-center gap-2"
          style={{
            bottom: fabBottom,
            left: "max(1rem, env(safe-area-inset-left, 0px))",
          }}
        >
          {cart.picking ? <StopAddingButton onStop={cart.doneAdding} /> : null}
          <div className="relative">
            <CartFabHint visible={showTip} leaving={tip === "out"} />
            <button
              type="button"
              aria-label={cart.picking ? "Open cart" : "Start adding"}
              aria-describedby={showTip ? "quote-fab-tip" : undefined}
              className={FAB}
              onClick={() => {
                setTip("gone");
                if (cart.picking) cart.openTray();
                else cart.enablePicking();
              }}
            >
              <span key={cart.picking ? "pen" : "plus"} className="glass-fab-icon">
                {cart.picking ? <PenLine className="size-5" /> : <Plus className="size-5" />}
              </span>
              {cart.count ? (
                <span className="glass-indicator absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-5 text-cobalt">
                  {cart.count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      ) : null}

      {showFabs ? (
        <div
          className="glass-fab-stack no-print fixed z-40 flex flex-col items-end gap-2.5"
          style={{
            bottom: fabBottom,
            right: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
        >
          {onQuery ? <GlassSearch query={query} onQuery={onQuery} /> : null}
          <PageScrollFab direction="up" label="Scroll up" />
          <PageScrollFab direction="down" label="Scroll down" />
        </div>
      ) : null}
    </>
  );
}
