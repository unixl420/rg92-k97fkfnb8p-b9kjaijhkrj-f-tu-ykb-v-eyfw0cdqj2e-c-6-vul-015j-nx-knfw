import { ContactUsButton } from "@/components/contact-us-button";
import { PriceListDownload } from "@/components/price-list-download";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="no-print bg-cobalt text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-[26px] py-8 sm:flex-row sm:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-paper/80">Talk to us</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">Need a quote, COA, or a claim?</p>
          <p className="mt-1 text-base text-paper/80">Contact us through our official channels.</p>
          <PriceListDownload />
        </div>
        <ContactUsButton tone="on-cobalt" className="w-full justify-center sm:w-auto" />
      </div>
    </footer>
  );
}
