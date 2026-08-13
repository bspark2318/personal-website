export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <div className="h-3 w-40 animate-pulse rounded bg-card-from" />
      <div className="mt-4 h-10 w-64 animate-pulse rounded bg-card-from" />
      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-9 w-36 animate-pulse rounded-full bg-card-from" />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row">
        {[0, 1].map((col) => (
          <div key={col} className="flex flex-1 flex-col gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-card-from" />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
