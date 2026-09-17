import { Factory, FlaskConical, Package, Palette, Search, ShieldCheck, Sticker } from "lucide-react";
import { AddToQuote } from "@/components/add-to-quote";
import { AssayPills } from "@/components/assay-pills";
import { CategoryTable } from "@/components/category-table";
import { ContactUsButton } from "@/components/contact-us-button";
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

  const oemQuery = /\b(oem|private\s*label|white\s*label|custom\s*(cap|label|sticker|brand)|branding)\b/i.test(
    q,
  );
  const showFactoryPair = printable || section === "all" || section === "special-order" || oemQuery;
  const specials = showFactoryPair ? SPECIAL_ORDER_PRODUCTS : [];
  const specialGroups = groupByName(specials);
  const matchCount = grouped.reduce((n, g) => n + groupByName(g.rows).length, 0);
  const totalCompounds = groupByName(PRODUCTS).length;

  return (
    <article id="print-root" className="mx-auto max-w-6xl px-[26px] pb-20 pt-6 lg:px-8">
      <header className="print-page pb-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <img
            src="/brand/cbp.png"
            alt="China Biotech Group"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="pointer-events-none -mb-3 size-[120px] shrink-0 select-none object-contain sm:mb-0 sm:size-[150px]"
          />
          <div className="min-w-0 w-full sm:flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 w-full sm:w-auto">
                <p className="hidden text-sm font-semibold uppercase tracking-wide text-cobalt sm:block">
                  {LIST_META.group}
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:mt-1 sm:text-4xl">
                  <span className="block font-semibold text-ink/40">{LIST_META.monthName}</span>
                  Peptide Price List
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                  <span className="block sm:inline">Last updated {LIST_META.month}</span>
                  <span aria-hidden="true" className="mx-2 hidden text-muted sm:inline">
                    ·
                  </span>
                  <span className="mt-0.5 block sm:mt-0 sm:inline">Prices in USD</span>
                </p>
              </div>
              <ContactUsButton tone="on-paper" className="no-print hidden shrink-0 sm:inline-flex" />
            </div>
          </div>
        </div>
        <ContactUsButton
          tone="on-paper"
          className="no-print mt-5 flex w-full justify-center sm:hidden"
        />
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

      {printable ? null : (
        <div id="peptide-finder" className="no-print mb-2 mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <label className="block" htmlFor="peptide-search">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold">
                <Search className="size-5" />
                Find a peptide
                <span className="font-medium text-ink-soft">
                  · {totalCompounds} total
                </span>
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

      {printable || !onSection ? null : (
        <div className="no-print mt-8">
          <p className="text-base font-semibold">Browse by section</p>
          <p className="mt-1 hidden text-sm text-ink-soft md:block">
            Tap a section to view it. All is selected by default.
          </p>
          <p className="mt-1 text-sm text-ink-soft md:hidden">Swipe to choose a section.</p>
          <SectionPills section={section} onSection={onSection} />
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

      {showFactoryPair ? (
        <>
        <section
          id="special-order"
          className="section-anchor print-page mt-14 rounded-2xl border-2 border-cobalt bg-cobalt/5 px-[26px] py-6 sm:px-8 sm:py-7"
        >
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
            <FlaskConical className="size-5" />
            Available via special order only
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Minimum order quantity 100 kits.{" "}
            <a
              href={LIST_META.contactPage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt underline"
            >
              Contact us
            </a>{" "}
            for custom pricing.
          </h2>
          <p className="mt-2 max-w-3xl text-base text-ink">
            Make-to-order items. Minimum 100 kits; pricing is quoted, not listed on the volume ladder.
            Ask our representative for a factory quote.
          </p>
          <p className="sr-only">quote · MOQ 100 kits · make-to-order</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {specialGroups.map((group) => (
              <article key={group.name} className="rounded-lg border border-cobalt/20 bg-card px-[22px] py-4">
                <p className="font-semibold">{group.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-2 text-base text-ink-soft">
                  {group.items.map((p, i) => (
                    <span key={p.id} className="inline-flex items-center">
                      {i > 0 ? <span className="mr-1">·</span> : null}
                      <AddToQuote product={p} accent="#1b4f8a" />
                      {p.pack}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="oem"
          className="section-anchor print-page mt-14 rounded-2xl border-2 border-cobalt bg-cobalt/5 px-[26px] py-6 sm:px-8 sm:py-7"
        >
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
            <Factory className="size-5" />
            OEM & private label
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Your logo on vials, boxes, and caps</h2>
          <p className="mt-2 max-w-3xl text-base text-ink">{LIST_META.oem}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Sticker,
                title: "Labels & stickers",
                body: "Your logo printed on vials and boxes.",
              },
              {
                icon: Palette,
                title: "Custom caps",
                body: "Cap color and branding to match your line.",
              },
              {
                icon: Package,
                title: "100 kits per SKU",
                body: "Minimum order for customized packaging.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-cobalt/20 bg-card px-[22px] py-4"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                  <item.icon className="size-5" strokeWidth={2.25} />
                </span>
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-1 text-base text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
        </>
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
          of analysis are available on request.
        </p>
        <AssayPills />
        <p className="mt-6 text-sm text-muted">{LIST_META.research}</p>
      </section>
    </article>
  );
}

function sectionItems() {
  return [
    { id: "all", label: "All", accent: "#1b4f8a" },
    ...CATEGORIES.map((cat) => ({ id: cat.id, label: cat.short, accent: cat.accent })),
    { id: "special-order", label: "Special order", accent: "#1b4f8a" },
  ];
}

function SectionPills({
  section,
  onSection,
}: {
  section: string;
  onSection: (id: string) => void;
}) {
  const items = sectionItems();
  const split = Math.ceil(items.length / 2);
  const go = (id: string) => {
    onSection(id);
    document.getElementById("price-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="-mx-[26px] mt-3 md:hidden">
        <div className="section-chip-row overflow-x-auto px-[26px] pb-1">
          <div className="flex w-max flex-col gap-2">
            <div className="flex gap-2">
              {items.slice(0, split).map((item) => (
                <SectionPill
                  key={item.id}
                  label={item.label}
                  active={section === item.id}
                  accent={item.accent}
                  onClick={() => go(item.id)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {items.slice(split).map((item) => (
                <SectionPill
                  key={item.id}
                  label={item.label}
                  active={section === item.id}
                  accent={item.accent}
                  onClick={() => go(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 hidden flex-wrap gap-2 md:flex">
        {items.map((item) => (
          <SectionPill
            key={item.id}
            label={item.label}
            active={section === item.id}
            accent={item.accent}
            onClick={() => go(item.id)}
          />
        ))}
      </div>
    </>
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
      className="h-10 shrink-0 snap-start rounded-full border px-3.5 text-sm font-semibold md:min-h-11 md:px-4"
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
