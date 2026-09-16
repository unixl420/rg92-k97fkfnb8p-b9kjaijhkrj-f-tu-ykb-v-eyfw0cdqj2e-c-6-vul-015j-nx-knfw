import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackToTop } from "@/components/back-to-top";
import { PriceListBody } from "@/components/price-list-body";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState(0);
  const [section, setSection] = useState("all");

  return (
    <div className="min-h-screen">
      <PriceListBody
        query={query}
        onQuery={setQuery}
        highlightTier={tier}
        onHighlight={setTier}
        section={section}
        onSection={setSection}
      />
      <BackToTop />
    </div>
  );
}
