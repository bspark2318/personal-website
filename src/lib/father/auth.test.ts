import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkPasscode,
  isValidSession,
  normalizePasscode,
  sessionToken,
} from "./auth";

describe("father auth", () => {
  const original = process.env.FATHER_PASSCODE;
  beforeEach(() => {
    process.env.FATHER_PASSCODE = "010-1234-5678";
  });
  afterEach(() => {
    if (original === undefined) delete process.env.FATHER_PASSCODE;
    else process.env.FATHER_PASSCODE = original;
  });

  it("normalizes to digits", () => {
    expect(normalizePasscode("+82 (10) 1234-5678")).toBe("821012345678");
  });

  it("accepts any formatting of the same digits", () => {
    expect(checkPasscode("01012345678")).toBe(true);
    expect(checkPasscode("010 1234 5678")).toBe(true);
  });

  it("rejects wrong / partial / empty input", () => {
    expect(checkPasscode("01012345679")).toBe(false);
    expect(checkPasscode("0101234567")).toBe(false);
    expect(checkPasscode("")).toBe(false);
  });

  it("fails closed when env is unset", () => {
    delete process.env.FATHER_PASSCODE;
    expect(checkPasscode("01012345678")).toBe(false);
    expect(sessionToken()).toBeNull();
    expect(isValidSession("anything")).toBe(false);
  });

  it("session token round-trips and rejects tampering", () => {
    const t = sessionToken()!;
    expect(isValidSession(t)).toBe(true);
    expect(isValidSession(t.slice(0, -1) + "0")).toBe(false);
    expect(isValidSession(undefined)).toBe(false);
  });
});
