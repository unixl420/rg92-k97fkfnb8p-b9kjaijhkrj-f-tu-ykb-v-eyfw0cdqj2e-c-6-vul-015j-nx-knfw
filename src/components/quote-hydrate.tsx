import { useEffect } from "react";
import { useQuoteStore } from "@/store/quote-store";

export function QuoteHydrate() {
  useEffect(() => {
    void useQuoteStore.persist.rehydrate();
  }, []);
  return null;
}
