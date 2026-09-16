import { createFileRoute } from "@tanstack/react-router";
import { PriceListBody } from "@/components/price-list-body";

export const Route = createFileRoute("/print")({ component: PrintPage });

function PrintPage() {
  return (
    <div className="bg-paper">
      <PriceListBody query="" highlightTier={-1} printable />
    </div>
  );
}
