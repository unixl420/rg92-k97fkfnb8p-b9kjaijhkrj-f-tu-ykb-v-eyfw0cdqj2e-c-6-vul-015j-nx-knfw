import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
  {
    variants: {
      variant: {
        new: "bg-cobalt/10 text-cobalt",
        special: "bg-cobalt/10 text-cobalt",
        mute: "bg-mist text-ink-soft",
        save: "bg-ink text-paper",
      },
    },
    defaultVariants: { variant: "mute" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
