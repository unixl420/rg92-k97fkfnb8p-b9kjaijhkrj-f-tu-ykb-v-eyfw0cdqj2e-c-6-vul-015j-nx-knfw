import { Link } from "@tanstack/react-router";
import { LIST_META } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-[26px] py-12 sm:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold">China Biotech Group</p>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">{LIST_META.research}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Sister companies</p>
          <p className="mt-3 text-base text-ink-soft">
            <a
              href={LIST_META.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink underline decoration-cobalt/40 underline-offset-2"
            >
              {LIST_META.company}
            </a>{" "}
            (“SPB”)
            <br />
            <a
              href={LIST_META.sisterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink underline decoration-cobalt/40 underline-offset-2"
            >
              {LIST_META.sister}
            </a>{" "}
            (“GPB” or “G”)
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">Written guarantees</p>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            Independent labs such as Janoshik, Freedom Diagnostics, and others on popular batches.
            Full refund or a fresh replacement if results fall below our standard. Covered shipping
            losses replaced or refunded.
          </p>
          <Link to="/guarantees" className="mt-4 inline-block text-base font-medium text-cobalt underline">
            Read the full testing protocol
          </Link>
        </div>
      </div>
    </footer>
  );
}
