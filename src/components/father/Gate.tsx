"use client";

import { motion } from "framer-motion";
import { useActionState } from "react";
import { unlock, type UnlockState } from "@/app/father/actions";

export default function Gate() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, { error: null });
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="aurora absolute inset-0 -z-10" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xs">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Private</p>
        <h1 className="display mb-2 text-3xl font-semibold">아버지 건강 기록</h1>
        <p className="mb-8 text-sm text-muted">가족만 볼 수 있습니다</p>
        <form action={action} className="flex flex-col gap-3">
          <input
            name="passcode"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="전화번호"
            className="rounded-xl border border-card-border bg-transparent px-4 py-3 text-center tracking-widest outline-none focus:border-card-border-hover"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-foreground px-4 py-3 font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {pending ? "확인 중…" : "열기"}
          </button>
        </form>
        {state.error && <p className="mt-4 text-sm text-red-500">{state.error}</p>}
      </motion.div>
    </main>
  );
}
