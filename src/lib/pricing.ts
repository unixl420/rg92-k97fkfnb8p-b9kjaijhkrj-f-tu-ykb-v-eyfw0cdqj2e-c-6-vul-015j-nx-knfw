export type PriceTiers = [number, number, number, number, number];

export const VOLUME_TIERS = [
  { id: 0, label: "1–9", unit: "kits", fullLabel: "1–9 kits", discount: "20% lower", min: 1, max: 9 },
  { id: 1, label: "10–99", unit: "kits", fullLabel: "10–99 kits", discount: "30% lower", min: 10, max: 99 },
  { id: 2, label: "100–249", unit: "kits", fullLabel: "100–249 kits", discount: "40% lower", min: 100, max: 249 },
  { id: 3, label: "250–499", unit: "kits", fullLabel: "250–499 kits", discount: "50% lower", min: 250, max: 499 },
  { id: 4, label: "500–1k", unit: "kits", fullLabel: "500–1,000 kits", discount: "60% lower", min: 500, max: 1000 },
] as const;

export type VolumeTier = (typeof VOLUME_TIERS)[number];

/** Base retail = Tier 1 / 0.8, then 30/40/50/60% off. Half-up to the nearest dollar. */
export function volumeTiers(tier1: number): PriceTiers {
  const base = (tier1 * 5) / 4;
  const round = (tenths: number) => Math.round((base * tenths) / 10);
  return [tier1, round(7), round(6), round(5), round(4)];
}

export function tierIndexForKits(kitCount: number): number {
  if (kitCount >= 500) return 4;
  if (kitCount >= 250) return 3;
  if (kitCount >= 100) return 2;
  if (kitCount >= 10) return 1;
  return 0;
}

export function nextTier(kitCount: number): VolumeTier | null {
  const idx = tierIndexForKits(kitCount);
  return idx < 4 ? VOLUME_TIERS[idx + 1] : null;
}

export function kitsToNextTier(kitCount: number): number | null {
  const next = nextTier(kitCount);
  if (!next) return null;
  return Math.max(0, next.min - kitCount);
}

export function savingsVsRetail(price: number, tier1: number): number {
  const retail = (tier1 * 5) / 4;
  return Math.round(retail - price);
}

export function savingsPct(tierIndex: number): number {
  return 20 + tierIndex * 10;
}
