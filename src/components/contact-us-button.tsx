import { ArrowUpRight } from "lucide-react";
import { LIST_META } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ContactUsButton({
  tone,
  className,
}: {
  tone: "on-paper" | "on-cobalt";
  className?: string;
}) {
  return (
    <a
      href={LIST_META.contactPage}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex h-12 items-center gap-2 rounded-full px-5 text-base font-semibold tracking-tight transition-all duration-150 sm:h-14 sm:px-6",
        tone === "on-paper"
          ? "bg-cobalt text-paper shadow-md hover:bg-cobalt-deep hover:shadow-lg"
          : "bg-paper text-cobalt hover:bg-paper-deep",
        className,
      )}
    >
      Contact Us
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          tone === "on-paper" ? "bg-paper/15" : "bg-cobalt/10",
        )}
      >
        <ArrowUpRight className="size-4" />
      </span>
    </a>
  );
}
