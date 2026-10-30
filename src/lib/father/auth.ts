import { createHash, timingSafeEqual } from "node:crypto";

export const FATHER_COOKIE = "father_session";
export const FATHER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Digits only — "010-1234-5678", "+82 10 …", "(201) 555-0100" all compare equal. */
export function normalizePasscode(raw: string): string {
  return raw.replace(/\D/g, "");
}

function expected(): string | null {
  const env = process.env.FATHER_PASSCODE;
  if (!env) return null;
  const n = normalizePasscode(env);
  return n.length ? n : null;
}

/** Fail closed: unset env → never unlocks. */
export function checkPasscode(input: string): boolean {
  const want = expected();
  if (!want) return false;
  const got = normalizePasscode(input);
  if (got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

/** Opaque session value derived from the passcode; rotating the env logs everyone out. */
export function sessionToken(): string | null {
  const want = expected();
  if (!want) return null;
  return createHash("sha256").update(`father-session-v1:${want}`).digest("hex");
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const want = sessionToken();
  if (!want || !cookieValue || cookieValue.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(want));
}
