import { Download } from "lucide-react";
import { downloadPriceListXls } from "@/lib/price-list-xls";

export function PriceListDownload() {
  return (
    <button
      type="button"
      onClick={downloadPriceListXls}
      className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-paper opacity-0 transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-70 max-sm:opacity-25"
      aria-label="Download compound price list as Excel"
    >
      <Download className="size-3.5" strokeWidth={2.25} />
      Download
    </button>
  );
}
