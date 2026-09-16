import { ArrowUp, Search } from "lucide-react";
import { useEffect, useState } from "react";

const FAB =
  "inline-flex size-12 items-center justify-center rounded-full border border-paper/20 bg-ink/20 text-paper shadow-md backdrop-blur-xl hover:bg-ink/35 sm:size-14";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
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
      <button
        type="button"
        aria-label="Back to top"
        className={FAB}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
