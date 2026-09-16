import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[×+]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
