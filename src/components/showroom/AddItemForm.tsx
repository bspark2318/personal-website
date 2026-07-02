"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ROOMS } from "@/lib/showroom";

const inputCls =
  "w-full rounded-xl border border-card-border bg-transparent px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-card-border-hover";

const empty = { url: "", title: "", price: "", imageUrl: "", room: "" };

export default function AddItemForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [fields, setFields] = useState(empty);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNeedsPassword(!localStorage.getItem("showroom-password"));
    setAddedBy(localStorage.getItem("showroom-name") ?? "");
  }, []);

  function set(key: keyof typeof empty, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function currentPassword() {
    return localStorage.getItem("showroom-password") ?? password;
  }

  function handleUnauthorized() {
    localStorage.removeItem("showroom-password");
    setNeedsPassword(true);
    setError("비밀번호가 틀렸어요.");
  }

  async function fetchDetails() {
    if (!fields.url) return;
    setFetching(true);
    setError("");
    const res = await fetch("/api/show-room/scrape", {
      method: "POST",
      headers: { "x-showroom-password": currentPassword() },
      body: JSON.stringify({ url: fields.url }),
    });
    setFetching(false);
    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) return setError("해당 링크를 읽을 수 없어요 — 직접 입력해주세요.");
    localStorage.setItem("showroom-password", currentPassword());
    setNeedsPassword(false);
    const data = await res.json();
    setFields((f) => ({
      ...f,
      title: f.title || data.title,
      price: f.price || data.price,
      imageUrl: f.imageUrl || data.image,
    }));
    if (!data.title && !data.image) {
      setError("페이지에서 정보를 찾지 못했어요 — 직접 입력해주세요.");
    }
  }

  async function save() {
    setError("");
    if (!fields.url || !fields.title || !fields.room || !addedBy) {
      setError("링크, 상품명, 공간, 이름은 필수예요.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/show-room/items", {
      method: "POST",
      headers: { "x-showroom-password": currentPassword() },
      body: JSON.stringify({
        url: fields.url,
        title: fields.title,
        price: fields.price,
        imageUrl: fields.imageUrl,
        room: fields.room,
        addedBy,
      }),
    });
    setSaving(false);
    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) return setError("저장에 실패했어요 — 다시 시도해주세요.");
    localStorage.setItem("showroom-password", currentPassword());
    localStorage.setItem("showroom-name", addedBy);
    setNeedsPassword(false);
    setFields(empty);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-auto flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity duration-300 hover:opacity-80"
      >
        {open ? "닫기" : "+ 가구 추가"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent p-6">
              {needsPassword && (
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                />
              )}

              <div className="flex gap-2">
                <input
                  placeholder="상품 링크 붙여넣기"
                  value={fields.url}
                  onChange={(e) => set("url", e.target.value)}
                  className={inputCls}
                />
                <button
                  onClick={fetchDetails}
                  disabled={fetching || !fields.url}
                  className="shrink-0 rounded-xl border border-card-border px-4 text-sm text-muted transition-colors hover:border-card-border-hover hover:text-foreground disabled:opacity-40"
                >
                  {fetching ? "불러오는 중…" : "정보 가져오기"}
                </button>
              </div>

              <input
                placeholder="상품명"
                value={fields.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
              />
              <div className="flex gap-3">
                <input
                  placeholder="가격 (선택)"
                  value={fields.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputCls}
                />
                <input
                  placeholder="이름"
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value)}
                  className={inputCls}
                />
              </div>
              <input
                placeholder="이미지 URL (선택)"
                value={fields.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                className={inputCls}
              />
              {fields.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fields.imageUrl}
                  alt="Preview"
                  className="h-32 w-32 rounded-2xl object-cover"
                />
              )}

              <div className="flex flex-wrap gap-2">
                {ROOMS.map((r) => (
                  <button
                    key={r}
                    onClick={() => set("room", r)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      fields.room === r
                        ? "border-card-border-hover text-foreground"
                        : "border-card-border text-muted hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                placeholder="공간"
                value={fields.room}
                onChange={(e) => set("room", e.target.value)}
                className={inputCls}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={save}
                disabled={saving}
                className="mt-2 rounded-xl border border-card-border-hover py-2.5 text-sm font-semibold transition-colors hover:bg-card-from disabled:opacity-40"
              >
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
