import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const url = process.argv[2] || "http://127.0.0.1:8080/print";
const out = resolve(process.argv[3] || "/workspace/public/China-Biotech-September-Price-List.pdf");

await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "12mm", bottom: "16mm", left: "10mm", right: "10mm" },
});
await browser.close();
console.log(`Wrote ${out}`);
