import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/price-list")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
