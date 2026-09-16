import { Link, useLocation } from "@tanstack/react-router";
import { Download, Menu, Search, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LIST_META } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SiteHeader({
  query,
  onQuery,
}: {
  query?: string;
  onQuery?: (q: string) => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });
  const showJump = pathname === "/";
  const showSearch = typeof onQuery === "function";

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  const searchField = showSearch ? (
    <form onSubmit={submitSearch} className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        name="q"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={query ?? ""}
        onChange={(e) => onQuery?.(e.target.value)}
        placeholder="Find a peptide"
        aria-label="Find a peptide"
        className="h-12 w-full rounded-md border border-line bg-card py-2 pl-11 pr-3 text-base outline-none focus:ring-2 focus:ring-cobalt"
      />
    </form>
  ) : null;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-[26px] py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/brand/cbp.png"
            alt=""
            className="size-12 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block text-base font-bold leading-tight">China Biotech Group</span>
            <span className="block truncate text-sm text-ink-soft">{LIST_META.title}</span>
          </span>
        </Link>

        {showJump ? (
          <label className="ml-4 hidden min-w-0 flex-1 md:block">
            <span className="sr-only">Jump to a section</span>
            <select
              className="h-12 w-full max-w-xs rounded-md border border-line bg-card px-3 text-base"
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;
                jump(id);
                e.currentTarget.selectedIndex = 0;
              }}
            >
              <option value="">Jump to a section</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
              <option value="special-order">Special order · MOQ 100</option>
              <option value="testing">Testing & guarantees</option>
            </select>
          </label>
        ) : (
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-md px-3 py-3 text-base text-ink-soft hover:bg-mist hover:text-ink"
            >
              Price list
            </Link>
            <Link
              to="/guarantees"
              className="rounded-md px-3 py-3 text-base text-ink-soft hover:bg-mist hover:text-ink"
              activeProps={{ className: "bg-mist text-ink font-semibold" }}
            >
              Testing
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <a href="/China-Biotech-September-Price-List.pdf" download className="hidden sm:block">
            <Button variant="outline">
              <Download />
              Download PDF
            </Button>
          </a>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-md md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {showSearch ? (
        <div className="border-t border-line px-[26px] py-2 lg:px-8">
          <div className="mx-auto max-w-6xl">{searchField}</div>
        </div>
      ) : null}

      <div className={cn("border-t border-line px-[26px] py-3 md:hidden", open ? "block" : "hidden")}>
        {showJump ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Jump to a section</span>
            <select
              className="h-12 w-full rounded-md border border-line bg-card px-3 text-base"
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;
                jump(id);
                setOpen(false);
                e.currentTarget.selectedIndex = 0;
              }}
            >
              <option value="">Choose a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
              <option value="special-order">Special order · MOQ 100</option>
              <option value="testing">Testing & guarantees</option>
            </select>
          </label>
        ) : (
          <nav className="flex flex-col">
            <Link to="/" className="rounded-md px-3 py-3 text-base" onClick={() => setOpen(false)}>
              Price list
            </Link>
            <Link
              to="/guarantees"
              className="rounded-md px-3 py-3 text-base"
              onClick={() => setOpen(false)}
            >
              Testing & guarantees
            </Link>
          </nav>
        )}
        <div className="mt-3">
          <a href="/China-Biotech-September-Price-List.pdf" download>
            <Button variant="outline" className="w-full">
              <Download />
              PDF
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
