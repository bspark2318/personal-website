"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/showroom";

export default function ItemCard({ item }: { item: Item }) {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    setCanDelete(Boolean(localStorage.getItem("showroom-password")));
  }, []);

  async function remove() {
    if (!confirm(`Remove "${item.title}"?`)) return;
    const res = await fetch(`/api/show-room/items/${item.id}`, {
      method: "DELETE",
      headers: {
        "x-showroom-password": localStorage.getItem("showroom-password") ?? "",
      },
    });
    if (res.status === 401) {
      localStorage.removeItem("showroom-password");
      setCanDelete(false);
      alert("Password no longer valid — re-enter it in the add form.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="group relative h-full">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="block h-full rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent p-6 transition-colors duration-500 hover:border-card-border-hover"
      >
        <div className="mb-6 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-card-from to-transparent">
          {item.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
        {item.price && <p className="mt-1 text-muted">{item.price}</p>}
        <p className="mt-2 text-xs text-muted">added by {item.added_by}</p>
      </a>
      {canDelete && (
        <button
          onClick={remove}
          aria-label="Remove item"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-nav-bg text-muted opacity-0 backdrop-blur-xl transition-opacity duration-300 hover:text-foreground group-hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
