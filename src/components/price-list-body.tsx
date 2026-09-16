import { FlaskConical, Search, ShieldCheck } from "lucide-react";
import { CategoryTable } from "@/components/category-table";
import { GuaranteeStrip } from "@/components/guarantee-strip";
import { MobileCategoryList } from "@/components/mobile-price-card";
import { VolumeModel } from "@/components/volume-model";
import {
  CATEGORIES,
  groupByName,
  LIST_META,
  PRODUCTS,
  SPECIAL_ORDER_PRODUCTS,
  productMatches,
} from "@/lib/catalog";

export function PriceListBody({
  query,
  onQuery,
  highlightTier,
  onHighlight,
  section = "all",
  onSection,
  printable = false,
}: {
  query: string;
  onQuery?: (q: string) => void;
  highlightTier: number;
  onHighlight?: (i: number) => void;
  section?: string;
  onSection?: (id: string) => void;
  printable?: boolean;
}) {
  const q = query.trim();
  const grouped = CATEGORIES.map((cat) => ({
    cat,
    rows: PRODUCTS.filter((p) => {
      if (p.category !== cat.id || p.specialOrder) return false;
      return productMatches(p, q);
    }),
  })).filter((g) => {
    if (!g.rows.length) return false;
    if (printable || section === "all") return true;
    return g.cat.id === section;
  });

  const specials = SPECIAL_ORDER_PRODUCTS.filter((p) => {
    if (!productMatches(p, q)) return false;
    if (printable || section === "all" || section === "special-order") return true;
    return false;
  });
  const specialGroups = groupByName(specials);
  const matchCount = grouped.reduce((n, g) => n + groupByName(g.rows).length, 0);

  return (
    <article id="print-root" className="mx-auto max-w-6xl px-[26px] pb-20 pt-6 lg:px-8">
      <header className="print-page pb-6">
        <div className="flex items-center gap-4">
            <img
              src="/brand/cbp.png"
              alt="China Biotech Group"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="pointer-events-none size-[120px] select-none object-contain sm:size-[150px]"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cobalt">
                {LIST_META.group}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{LIST_META.title}</h1>
              <p className="mt-1 text-sm text-ink-soft">Last updated {LIST_META.month}</p>
            </div>
          </div>
      </header>

      <section className="print-page mb-8 max-w-4xl text-base leading-relaxed text-ink">
        <p>
          <a
            href={LIST_META.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ink underline decoration-cobalt/40 underline-offset-2 hover:decoration-cobalt"
          >
            {LIST_META.company}
          </a>{" "}
          (“SPB”) and{" "}
          <a
            href={LIST_META.sisterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ink underline decoration-cobalt/40 underline-offset-2 hover:decoration-cobalt"
          >
            {LIST_META.sister}
          </a>{" "}
          (“GPB” or “G”) are the official storefront of China Biotech Group. We have been producing
          peptides continuously since 2010. We supply B2B partners around the world, and our
          storefront also serves individual research customers at factory-direct prices with a low
          minimum order. Every batch is tested in our own laboratory before release, and every order
          is protected by our written Quality Guarantee and Shipping Guarantee.
        </p>
      </section>

      {printable ? null : (
        <div className="no-print mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <label className="block" htmlFor="peptide-search">
              <span className="flex items-center gap-2 text-base font-semibold">
                <Search className="size-5" />
                Find a peptide
              </span>
            </label>
            <input
              id="peptide-search"
              type="search"
              name="q"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(e) => onQuery?.(e.target.value)}
              placeholder="Type a name or topic, for example Semaglutide, sleep, or tendon"
              className="mt-2 h-14 w-full rounded-md border border-line bg-card px-4 text-lg outline-none focus:ring-2 focus:ring-cobalt"
            />
          </form>
          {q ? (
            <p className="mt-2 text-base text-ink-soft">
              Showing <strong>{matchCount}</strong> {matchCount === 1 ? "compound" : "compounds"}
              {specials.length ? ` and ${specialGroups.length} special-order items` : ""} matching “{query}”
              {grouped.length
                ? ` in ${grouped.map((g) => g.cat.short).join(", ")}`
                : ""}
              .
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">
              Search a compound name or a topic tag — for example sleep, tendon, collagen, or fertility.
            </p>
          )}
        </div>
      )}

      <div className="print-page mt-2">
        <GuaranteeStrip />
      </div>

      <div className="print-page mt-6">
        <VolumeModel highlightTier={highlightTier} onSelect={printable ? undefined : onHighlight} />
        <p className="mt-3 text-base text-ink-soft">
          Volume prices apply to each <strong className="font-semibold text-ink">individual SKU</strong>.
          Only kits of the same product and the same strength count toward a better price. Different
          products are not added together.
        </p>
      </div>

      {printable || !onSection ? null : (
        <div className="no-print mt-8">
          <p className="text-base font-semibold">Browse by section</p>
          <p className="mt-1 text-sm text-ink-soft">Tap a section to view it. All is selected by default.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <SectionPill
              label="All"
              active={section === "all"}
              accent="#1b4f8a"
              onClick={() => {
                onSection("all");
                document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            {CATEGORIES.map((cat) => (
              <SectionPill
                key={cat.id}
                label={cat.short}
                active={section === cat.id}
                accent={cat.accent}
                onClick={() => {
                  onSection(cat.id);
                  document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            ))}
            <SectionPill
              label="Special order"
              active={section === "special-order"}
              accent="#1b4f8a"
              onClick={() => {
                onSection("special-order");
                document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </div>
        </div>
      )}

      <div id="price-results" className="mt-10 space-y-14">
        {grouped.length === 0 && specials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-lg text-ink-soft">
            No peptides match “{query}”. Try a shorter name.
          </p>
        ) : (
          grouped.map(({ cat, rows }) => {
            const compounds = groupByName(rows);
            return (
            <section key={cat.id} id={cat.id} className="section-anchor print-page">
              <div className="mb-5 rounded-xl border px-[26px] py-4" style={{ borderColor: cat.accent, backgroundColor: `${cat.accent}14` }}>
                <p className="text-sm font-bold uppercase tracking-wide" style={{ color: cat.accent }}>
                  {cat.short}
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{cat.label}</h2>
                <p className="mt-2 text-base text-ink">{cat.blurb}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {cat.tags.join(" · ")}
                  <span className="mx-2 text-line">·</span>
                  {compounds.length} {compounds.length === 1 ? "compound" : "compounds"}
                </p>
              </div>
              {printable ? (
                <CategoryTable products={rows} highlightTier={highlightTier} />
              ) : (
                <>
                  <div className="md:hidden print:hidden">
                    <MobileCategoryList products={rows} highlightTier={highlightTier} />
                  </div>
                  <div className="hidden md:block print:block">
                    <CategoryTable products={rows} highlightTier={highlightTier} />
                  </div>
                </>
              )}
            </section>
            );
          })
        )}
      </div>

      {specials.length ? (
        <section
          id="special-order"
          className="section-anchor print-page mt-14 rounded-2xl border-2 border-cobalt bg-cobalt/5 px-[26px] py-6 sm:px-8 sm:py-7"
        >
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
            <FlaskConical className="size-5" />
            Available via special order only
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Minimum order quantity 100 kits. Contact us for custom pricing.
          </h2>
          <p className="mt-2 max-w-3xl text-base text-ink">
            Make-to-order items. Minimum 100 kits; pricing is quoted, not listed on the volume ladder.
            Ask your China Biotech Group representative for a factory quote.
          </p>
          <p className="mt-2 text-sm text-ink-soft">quote · MOQ 100 kits · make-to-order</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {specialGroups.map((group) => (
              <article key={group.name} className="rounded-lg border border-cobalt/20 bg-card px-[22px] py-4">
                <p className="font-semibold">{group.name}</p>
                <p className="mt-1 text-base text-ink-soft">
                  {group.items.map((p) => p.pack).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="testing" className="section-anchor print-page mt-14 border-t border-line pt-8">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
          <ShieldCheck className="size-5" />
          Testing & written guarantees
        </p>
        <h2 className="mt-2 text-2xl font-bold">Independent verification and in-house QC</h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink">
          Every lot is released only after in-house QC. Selected commercial lots are also submitted
          to independent laboratories, including Janoshik, Freedom Diagnostics, and other accredited
          facilities. Customers are encouraged to commission their own assay. Should verified results
          fall below specification, we will refund the order or replace the batch. Public certificates
          of analysis are available on request — please contact us.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[
            "HPLC purity",
            "Mass spectrometry identity",
            "Karl Fischer water content",
            "Related substances",
            "Residual solvents",
            "Micro & endotoxin",
          ].map((item) => (
            <li key={item} className="rounded-lg border border-line bg-paper-deep px-[22px] py-3.5 text-base font-medium">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">{LIST_META.research}</p>
      </section>
    </article>
  );
}

function SectionPill({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="min-h-11 rounded-full border px-4 text-sm font-semibold"
      style={
        active
          ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
          : { backgroundColor: "#fff", borderColor: "#d5deea", color: "#142033" }
      }
    >
      {label}
    </button>
  );
}
