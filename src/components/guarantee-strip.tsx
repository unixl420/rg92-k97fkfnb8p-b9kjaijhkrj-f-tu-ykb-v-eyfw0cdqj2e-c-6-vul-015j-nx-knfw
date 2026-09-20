import { useState } from "react";
import { ChevronDown, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALITY = {
  id: "quality" as const,
  title: "Quality Guarantee",
  icon: ShieldCheck,
  body: "We encourage you to test your received batch at any reputable laboratory. Should independent results fall below specification, we will provide a full refund or a replacement batch.",
  follow: (
    <>
      See{" "}
      <a href="#testing" className="font-semibold text-cobalt underline underline-offset-2">
        testing & written guarantees
      </a>{" "}
      below, or contact us for a public COA.
    </>
  ),
};

const SHIPPING = {
  id: "shipping" as const,
  title: "Shipping Guarantee",
  icon: Truck,
  body: "If a shipment is lost, damaged, incomplete, or delayed by a covered customs issue, we will provide a full refund or a replacement shipment.",
  follow: "Share the tracking number so we can open the case promptly, or contact us to file a claim.",
};

export function GuaranteeStrip() {
  const [open, setOpen] = useState<(typeof QUALITY)["id"] | (typeof SHIPPING)["id"] | null>(null);
  const active = open === "quality" ? QUALITY : open === "shipping" ? SHIPPING : null;

  return (
    <>
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <MobileGuaranteePill
            item={QUALITY}
            open={open === "quality"}
            onToggle={() => setOpen((v) => (v === "quality" ? null : "quality"))}
          />
          <MobileGuaranteePill
            item={SHIPPING}
            open={open === "shipping"}
            onToggle={() => setOpen((v) => (v === "shipping" ? null : "shipping"))}
          />
        </div>
        {active ? (
          <div className="mt-2 rounded-2xl border-2 border-cobalt/25 bg-cobalt/5 px-5 py-4">
            <p className="text-sm leading-relaxed text-ink">{active.body}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{active.follow}</p>
          </div>
        ) : null}
      </div>
      <div className="hidden grid-cols-2 items-stretch gap-4 md:grid">
        <GuaranteeCard item={QUALITY} tone="mist" />
        <GuaranteeCard item={SHIPPING} tone="paper" />
      </div>
    </>
  );
}

function GuaranteeIcon({ icon: Icon }: { icon: typeof ShieldCheck }) {
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
      <Icon className="size-5" strokeWidth={2.25} />
    </span>
  );
}

function GuaranteeCard({
  item,
  tone,
}: {
  item: typeof QUALITY | typeof SHIPPING;
  tone: "mist" | "paper";
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border-2 border-cobalt/25 px-[26px] py-6",
        tone === "mist" ? "bg-cobalt/5" : "bg-paper-deep",
      )}
    >
      <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wide text-cobalt">
        <GuaranteeIcon icon={item.icon} />
        {item.title}
      </p>
      <p className="mt-3 flex-1 text-base leading-relaxed text-ink">{item.body}</p>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.follow}</p>
    </article>
  );
}

function MobileGuaranteePill({
  item,
  open,
  onToggle,
}: {
  item: typeof QUALITY | typeof SHIPPING;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        "flex h-full flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3 text-center",
        open ? "border-cobalt bg-cobalt/10" : "border-cobalt/25 bg-cobalt/5",
      )}
    >
      <GuaranteeIcon icon={item.icon} />
      <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-cobalt">
        {item.title}
      </span>
      <ChevronDown
        className={cn("size-3.5 text-cobalt transition-transform", open && "rotate-180")}
      />
    </button>
  );
}
