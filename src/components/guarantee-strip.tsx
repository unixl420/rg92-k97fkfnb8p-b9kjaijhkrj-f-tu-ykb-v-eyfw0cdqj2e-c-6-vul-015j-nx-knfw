import { ShieldCheck, Truck } from "lucide-react";

export function GuaranteeStrip() {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-2">
      <article className="flex h-full flex-col rounded-xl border-2 border-cobalt/25 bg-cobalt/5 px-[26px] py-6">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
          <ShieldCheck className="size-5" />
          Quality Guarantee
        </p>
        <p className="mt-3 flex-1 text-base leading-relaxed text-ink">
          We encourage you to test your received batch at any reputable laboratory. Should
          independent results fall below specification, we will provide a full refund or a
          replacement batch.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          See{" "}
          <a href="#testing" className="font-semibold text-cobalt underline underline-offset-2">
            Testing & written guarantees
          </a>{" "}
          below, or contact us for a public COA.
        </p>
      </article>
      <article className="flex h-full flex-col rounded-xl border-2 border-cobalt/25 bg-paper-deep px-[26px] py-6">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cobalt">
          <Truck className="size-5" />
          Shipping Guarantee
        </p>
        <p className="mt-3 flex-1 text-base leading-relaxed text-ink">
          If a shipment is lost, damaged, incomplete, or delayed by a covered customs issue, we will
          provide a full refund or a replacement shipment.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Share the tracking number so we can open the case promptly, or contact us to file a claim.
        </p>
      </article>
    </div>
  );
}
