"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SHOWROOM_HEADER, STORAGE_PASSWORD, type Item } from "@/lib/showroom";

export default function ItemCard({ item }: { item: Item }) {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    setCanDelete(Boolean(localStorage.getItem(STORAGE_PASSWORD)));
  }, []);

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm(`"${item.title}" 를 삭제할까요?`)) return;
    try {
      const res = await fetch(`/api/show-room/items/${item.id}`, {
        method: "DELETE",
        headers: { [SHOWROOM_HEADER]: localStorage.getItem(STORAGE_PASSWORD) ?? "" },
      });
      if (res.status === 401) {
        localStorage.removeItem(STORAGE_PASSWORD);
        setCanDelete(false);
        alert("비밀번호가 만료됐어요 — 추가 폼에서 다시 입력해주세요.");
        return;
      }
      if (!res.ok) {
        alert("삭제에 실패했어요 — 다시 시도해주세요.");
        return;
      }
      router.refresh();
    } catch {
      alert("삭제에 실패했어요 — 다시 시도해주세요.");
    }
  }

  return (
    <div className="group relative">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent transition-all duration-500 hover:-translate-y-1 hover:border-card-border-hover"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-card-from to-transparent">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted">
              이미지 없음
            </div>
          )}
          {item.price && (
            <span className="absolute bottom-3 left-3 rounded-full border border-card-border bg-nav-bg px-3 py-1 text-sm font-semibold backdrop-blur-xl">
              {item.price}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
            {item.title}
          </h3>
          <p className="mt-2 text-xs text-muted">{item.added_by} 추천</p>
        </div>
      </a>
      {canDelete && (
        <button
          onClick={remove}
          aria-label="삭제"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-nav-bg text-muted opacity-0 backdrop-blur-xl transition-opacity duration-300 hover:text-foreground group-hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
