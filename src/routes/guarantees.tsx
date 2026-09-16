import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, FlaskConical, ShieldCheck, Truck } from "lucide-react";
import { GuaranteeStrip } from "@/components/guarantee-strip";
import { LIST_META } from "@/lib/catalog";

export const Route = createFileRoute("/guarantees")({ component: GuaranteesPage });

const QC = [
  { title: "HPLC purity", body: "Assay of the target peptide against specification before release." },
  { title: "Mass spectrometry identity", body: "Confirms the correct molecular mass of the lot." },
  { title: "Karl Fischer water", body: "Water content of lyophilized material, lot by lot." },
  { title: "Related substances", body: "Impurity profile reviewed against internal limits." },
  { title: "Residual solvents", body: "Solvent residues screened prior to release." },
  { title: "Micro & endotoxin", body: "Microbial and endotoxin checks on every batch." },
];

function GuaranteesPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-[26px] py-10 lg:px-8">
        <Link to="/" className="text-base font-medium text-cobalt underline">
          Back to the price list
        </Link>
        <p className="mt-6 text-sm font-bold uppercase tracking-wide text-cobalt">Written guarantees</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Testing & quality protocol</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink">{LIST_META.testing}</p>

        <div className="mt-8">
          <GuaranteeStrip />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">In-house QC — every batch</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {QC.map((item) => (
              <article key={item.title} className="rounded-xl border border-line bg-card p-4">
                <p className="flex items-center gap-2 text-base font-semibold">
                  <Check className="size-5 text-cobalt" />
                  {item.title}
                </p>
                <p className="mt-1 text-base text-ink-soft">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
              <FlaskConical className="size-5" />
              Third-party laboratories
            </p>
            <h3 className="mt-2 text-xl font-bold">Independent laboratories</h3>
            <p className="mt-2 text-base leading-relaxed text-ink">
              We send popular peptides to independent labs such as Janoshik, Freedom Diagnostics, and
              others. Reports are public. You may also test a received batch at any reputable lab.
            </p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
              <ShieldCheck className="size-5" />
              If a third-party result misses spec
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink">
              If verified independent results fall below our stated standards: full refund or a fresh
              replacement batch — your choice — under our written Quality Guarantee.
            </p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
              <Truck className="size-5" />
              Shipping guarantee
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink">{LIST_META.shipping}</p>
          </article>
        </section>

        <p className="mt-10 text-sm text-muted">{LIST_META.research}</p>
      </main>
    </div>
  );
}
