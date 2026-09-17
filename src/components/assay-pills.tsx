import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ASSAYS = [
  { label: "HPLC Purity", kind: "hplc", tone: "text-assay-hplc border-assay-hplc/25 bg-assay-hplc/8" },
  { label: "Mass Spectrometry Identity", kind: "ms", tone: "text-assay-ms border-assay-ms/25 bg-assay-ms/8" },
  { label: "Karl Fischer Water Content", kind: "water", tone: "text-assay-water border-assay-water/25 bg-assay-water/8" },
  { label: "Related Substances", kind: "related", tone: "text-assay-related border-assay-related/25 bg-assay-related/8" },
  { label: "Residual Solvents", kind: "solvent", tone: "text-assay-solvent border-assay-solvent/25 bg-assay-solvent/8" },
  { label: "Micro & Endotoxin", kind: "micro", tone: "text-assay-micro border-assay-micro/25 bg-assay-micro/8" },
] as const;

export function AssayPills() {
  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
      {ASSAYS.map((item) => (
        <li
          key={item.label}
          className={cn(
            "assay-pill relative overflow-hidden rounded-full border px-[22px] py-3.5 text-base font-semibold leading-tight",
            item.tone,
          )}
        >
          <VisibleFx>
            <AssayFx kind={item.kind} />
          </VisibleFx>
          <span className="relative z-10">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function VisibleFx({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (visible: boolean) => setOn(visible && !document.hidden);
    const io = new IntersectionObserver(([entry]) => apply(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    const onVis = () => {
      if (document.hidden) setOn(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <span ref={ref} className="pointer-events-none absolute inset-0">
      {on ? children : null}
    </span>
  );
}

function AssayFx({ kind }: { kind: (typeof ASSAYS)[number]["kind"] }) {
  if (kind === "hplc") {
    return (
      <span className="assay-fx assay-fx-hplc" aria-hidden>
        <svg className="hplc-svg" viewBox="0 0 400 48" preserveAspectRatio="none">
          <path
            className="hplc-line"
            d="M0 40 C 40 40 56 40 72 40 S 96 8 118 40 S 160 40 182 40 S 210 4 238 40 S 280 40 304 22 S 328 40 400 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hplc-drop" />
      </span>
    );
  }

  if (kind === "ms") {
    return (
      <span className="assay-fx assay-fx-ms" aria-hidden>
        <span className="ms-circle c1" />
        <span className="ms-circle c2" />
        <span className="ms-circle c3" />
        <span className="ms-circle c4" />
        <span className="ms-circle c5" />
        <span className="ms-circle c6" />
        <span className="ms-circle c7" />
        <span className="ms-circle c8" />
      </span>
    );
  }

  if (kind === "water") {
    return (
      <span className="assay-fx assay-fx-water" aria-hidden>
        <svg className="wave wave-a" viewBox="0 0 800 80" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 38 Q100 8 200 38 T400 38 T600 38 T800 38 V80 H0Z" />
        </svg>
        <svg className="wave wave-b" viewBox="0 0 800 80" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 48 Q100 24 200 48 T400 48 T600 48 T800 48 V80 H0Z" />
        </svg>
      </span>
    );
  }

  if (kind === "related") {
    return (
      <span className="assay-fx assay-fx-related" aria-hidden>
        <span className="rel-dot d1" />
        <span className="rel-dot d2" />
        <span className="rel-dot d3" />
      </span>
    );
  }

  if (kind === "solvent") {
    return (
      <span className="assay-fx assay-fx-solvent" aria-hidden>
        <span className="vap v1" />
        <span className="vap v2" />
        <span className="vap v3" />
        <span className="vap v4" />
        <span className="vap v5" />
      </span>
    );
  }

  return (
    <span className="assay-fx assay-fx-micro" aria-hidden>
      <span className="cell c1" />
      <span className="cell c2" />
      <span className="cell c3" />
    </span>
  );
}
