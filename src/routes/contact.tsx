import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LIST_META } from "@/lib/catalog";

export const Route = createFileRoute("/contact")({ component: ContactRedirect });

function ContactRedirect() {
  useEffect(() => {
    window.location.replace(LIST_META.contactPage);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-[26px] py-16 lg:px-8">
      <p className="text-base text-ink-soft">Opening our official contact page…</p>
      <a href={LIST_META.contactPage} className="mt-3 inline-block text-base font-medium text-cobalt underline">
        Continue to Shenzhen Peptide contact
      </a>
    </main>
  );
}
