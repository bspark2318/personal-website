import { isValidElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { boldify } from "./boldify";

const strongsOf = (out: unknown) =>
  (out as unknown[])
    .filter((p) => isValidElement(p))
    .map((p) => (p as ReactElement<{ children: string }>).props.children);

describe("boldify", () => {
  it("returns the raw string when there are no markers", () => {
    expect(boldify("plain text")).toBe("plain text");
  });

  it("returns the raw string for a single unbalanced marker", () => {
    expect(boldify("a **b")).toBe("a **b");
  });

  it("bolds a single **term** pair, keeping the surrounding segments", () => {
    const out = boldify("a **b** c");
    expect(Array.isArray(out)).toBe(true);
    const parts = out as unknown[];
    expect(parts[0]).toBe("a ");
    expect(parts[2]).toBe(" c");
    expect(isValidElement(parts[1])).toBe(true);
    expect(strongsOf(out)).toEqual(["b"]);
  });

  it("bolds multiple pairs", () => {
    expect(strongsOf(boldify("**a** and **b**"))).toEqual(["a", "b"]);
  });

  it("does not throw on empty edge segments when text starts/ends with a pair", () => {
    const out = boldify("**b**") as unknown[];
    expect(out[0]).toBe("");
    expect(out[2]).toBe("");
    expect(strongsOf(out)).toEqual(["b"]);
  });

  it("bolds by even/odd index for an unbalanced trailing marker (pinned behavior)", () => {
    // A stray opening `**d` is currently bolded; lock it so copy edits can't
    // regress this silently.
    expect(strongsOf(boldify("a **b** c **d"))).toEqual(["b", "d"]);
  });
});
