"use client";

export default function NamePicker({
  crew,
  value,
  onChange,
}: {
  crew: string[];
  value: string | null;
  onChange: (name: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
        Who are you?
      </p>
      <div className="flex flex-wrap gap-2">
        {crew.map((name) => (
          <button
            key={name}
            onClick={() => onChange(name)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              value === name
                ? "border-foreground bg-foreground text-background"
                : "border-card-border text-muted hover:border-card-border-hover"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
