import { useEffect } from "react";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

export function TabVisibility() {
  useEffect(() => {
    const sync = () => {
      document.documentElement.classList.toggle("tab-hidden", document.hidden);
    };
    sync();
    document.addEventListener("visibilitychange", sync);

    if (!document.querySelector(`link[href="${FONT_HREF}"]`)) {
      const font = document.createElement("link");
      font.rel = "stylesheet";
      font.href = FONT_HREF;
      document.head.appendChild(font);
    }

    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return null;
}
