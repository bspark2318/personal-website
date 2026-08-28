import type { ReactNode } from "react";

// Renders **term** segments in trip copy as <strong>.
export function boldify(text: string): ReactNode {
  const parts = text.split("**");
  if (parts.length < 3) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}
