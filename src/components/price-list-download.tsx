import { useRef, type ReactNode } from "react";
import { downloadPriceListXls } from "@/lib/price-list-xls";

export function PriceListDownload({ children }: { children: ReactNode }) {
  const lock = useRef(false);

  const save = () => {
    if (lock.current) return;
    lock.current = true;
    downloadPriceListXls();
    window.setTimeout(() => {
      lock.current = false;
    }, 800);
  };

  return (
    <button
      type="button"
      onClick={save}
      onDoubleClick={save}
      className="cursor-default bg-transparent p-0 font-[inherit] text-[inherit] leading-[inherit] tracking-[inherit]"
      aria-label="Download compound price list as Excel"
    >
      {children}
    </button>
  );
}