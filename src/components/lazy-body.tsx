import { useEffect, useRef, useState, type ReactNode } from "react";

export function LazyBody({
  eager,
  minHeight,
  children,
}: {
  eager?: boolean;
  minHeight: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(Boolean(eager));

  useEffect(() => {
    if (eager || near) {
      setNear(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "1400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, near]);

  return <div ref={ref}>{near ? children : <div style={{ minHeight }} aria-hidden />}</div>;
}
