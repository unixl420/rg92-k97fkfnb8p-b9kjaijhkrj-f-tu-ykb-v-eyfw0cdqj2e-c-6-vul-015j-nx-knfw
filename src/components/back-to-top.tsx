import { ArrowDown, ArrowUp, PenLine, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useQuoteCart } from "@/lib/quote-cart";
import { cn } from "@/lib/utils";

const FAB =
  "glass-fab relative inline-flex size-12 items-center justify-center rounded-full border border-paper/40 bg-ink/70 text-paper shadow-lg backdrop-blur-xl hover:bg-ink/85 sm:size-14";

const FAB_MINI =
  "glass-fab glass-fab-x inline-flex size-8 items-center justify-center rounded-full border text-paper shadow-lg backdrop-blur-xl sm:size-9";

const EDGE = 20;
const GAP = 16;
const HOLD_MS = 450;

function useFabOffset() {
  const [bottom, setBottom] = useState(EDGE);
  useEffect(() => {
    const update = () => {
      const footer = document.getElementById("site-footer");
      if (!footer) {
        setBottom(EDGE);
        return;
      }
      const fromBottom = window.innerHeight - footer.getBoundingClientRect().top;
      setBottom(fromBottom > 0 ? fromBottom + GAP : EDGE);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
      className={cn(
        FAB_MINI,
        red
          ? "border-red-100/45 bg-red-700/70 hover:bg-red-600/85"
          : "border-paper/40 bg-ink/70",
      )}
      onClick={onStop}
    >
      <X className="size-3.5 sm:size-4" strokeWidth={2.5} />
    </button>
  );
}

export function BackToTop() {
  const [showNav, setShowNav] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const bottom = useFabOffset();
  const cart = useQuoteCart();

  useEffect(() => {
    const update = () => {
      setShowNav(window.scrollY > 600);
      const finder = document.getElementById("peptide-finder");
      const reached = finder ? finder.getBoundingClientRect().top <= 96 : window.scrollY > 600;
      setShowCart(reached || cart.picking || cart.count > 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [cart.picking, cart.count]);

  const fabBottom = `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`;

  return (
    <>
      {showCart ? (
        <div
          className="glass-fab-stack no-print fixed z-40 flex flex-col items-center gap-2"
          style={{
            bottom: fabBottom,
            left: "max(1rem, env(safe-area-inset-left, 0px))",
          }}
        >
          {cart.picking ? <StopAddingButton onStop={cart.doneAdding} /> : null}
          <button
            type="button"
            aria-label={cart.picking ? "Open cart" : "Start adding"}
            className={FAB}
            onClick={() => {
              if (cart.picking) cart.openTray();
              else cart.enablePicking();
            }}
          >
            <span key={cart.picking ? "pen" : "plus"} className="glass-fab-icon">
              {cart.picking ? <PenLine className="size-5" /> : <Plus className="size-5" />}
            </span>
            {cart.count ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-bold leading-5 text-cobalt">
                {cart.count}
              </span>
            ) : null}
          </button>
        </div>
      ) : null}

      {showNav ? (
        <div
          className="glass-fab-stack no-print fixed z-40 flex flex-col gap-2.5"
          style={{
            bottom: fabBottom,
            right: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <button
            type="button"
            aria-label="Find a peptide"
            className={FAB}
            onClick={() => {
              const field = document.getElementById("peptide-search");
              field?.scrollIntoView({ behavior: "smooth", block: "center" });
              window.setTimeout(() => field?.focus(), 350);
            }}
          >
            <Search className="size-5" />
          </button>
          <PageScrollFab direction="up" label="Scroll up" />
          <PageScrollFab direction="down" label="Scroll down" />
        </div>
      ) : null}
    </>
  );
}
