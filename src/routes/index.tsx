import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackToTop } from "@/components/back-to-top";
import { PriceListBody } from "@/components/price-list-body";
import { QuoteTray } from "@/components/quote-tray";
import { SiteFooter } from "@/components/site-footer";
import { QuoteCartProvider } from "@/lib/quote-cart";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState(0);
  const [section, setSection] = useState("all");

  return (
    <QuoteCartProvider>
      <div className="min-h-screen">
        <BackToTop />
        <QuoteTray />
        <PriceListBody
          query={query}
          onQuery={setQuery}
          highlightTier={tier}
          onHighlight={setTier}
          section={section}
          onSection={setSection}
        />
        <SiteFooter />
      </div>
    </QuoteCartProvider>
  );
}
