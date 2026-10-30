"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPasscode,
  FATHER_COOKIE,
  FATHER_COOKIE_MAX_AGE,
  sessionToken,
} from "@/lib/father/auth";

export type UnlockState = { error: string | null };

export async function unlock(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const input = String(formData.get("passcode") ?? "");
  if (!checkPasscode(input)) {
    // Slow down guessing. Serverless memory isn't shared, so this is per-instance only.
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "번호가 맞지 않습니다" };
  }
  const token = sessionToken();
  if (!token) return { error: "서버 설정 오류" };
  (await cookies()).set(FATHER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/father",
    maxAge: FATHER_COOKIE_MAX_AGE,
  });
  redirect("/father");
}

export async function lock() {
  (await cookies()).delete({ name: FATHER_COOKIE, path: "/father" });
  redirect("/father");
}
