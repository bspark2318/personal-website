import { describe, expect, it } from "vitest";
import { decode, jsonLdPrice, meta } from "./showroom-scrape";

describe("decode", () => {
  it("decodes named entities", () => {
    expect(decode("Sofa &quot;white&quot;")).toBe('Sofa "white"');
    expect(decode("Tom &amp; Jerry")).toBe("Tom & Jerry");
    expect(decode("a &lt;b&gt; c")).toBe("a <b> c");
    expect(decode("it&#39;s")).toBe("it's");
    expect(decode("a&nbsp;b")).toBe("a b");
  });

  it("decodes numeric entities", () => {
    expect(decode("caf&#233;")).toBe("café");
  });

  it("does not over-decode double-encoded input", () => {
    // &amp;lt; must become &lt;, not <
    expect(decode("&amp;lt;")).toBe("&lt;");
  });

  it("trims surrounding whitespace", () => {
    expect(decode("  hello  ")).toBe("hello");
  });
});

describe("meta", () => {
  it("reads property-before-content order", () => {
    const html = `<meta property="og:title" content="KALLAX">`;
    expect(meta(html, "og:title")).toBe("KALLAX");
  });

  it("reads content-before-property order", () => {
    const html = `<meta content="MALM" property="og:title">`;
    expect(meta(html, "og:title")).toBe("MALM");
  });

  it("handles single quotes and name= / itemprop= variants", () => {
    expect(meta(`<meta name='twitter:image' content='x.jpg'>`, "twitter:image")).toBe("x.jpg");
    expect(meta(`<meta itemprop="price" content="99">`, "price")).toBe("99");
  });

  it("returns empty string when the tag is absent", () => {
    expect(meta(`<meta property="og:image" content="x">`, "og:title")).toBe("");
  });

  it("does not match across unrelated meta tags", () => {
    const html = `<meta property="og:site" content="Shop"><meta property="og:title" content="Chair">`;
    expect(meta(html, "og:title")).toBe("Chair");
  });
});

describe("jsonLdPrice", () => {
  const wrap = (obj: unknown) =>
    `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

  it("reads offers as an object", () => {
    const html = wrap({ "@type": "Product", offers: { price: "179.99", priceCurrency: "USD" } });
    expect(jsonLdPrice(html)).toBe("USD 179.99");
  });

  it("reads offers as an array", () => {
    const html = wrap({ offers: [{ price: "50", priceCurrency: "EUR" }] });
    expect(jsonLdPrice(html)).toBe("EUR 50");
  });

  it("reads a @graph node", () => {
    const html = wrap({ "@graph": [{ "@type": "Thing" }, { offers: { price: "12" } }] });
    expect(jsonLdPrice(html)).toBe("12");
  });

  it("falls back to lowPrice", () => {
    const html = wrap({ offers: { lowPrice: "30", priceCurrency: "USD" } });
    expect(jsonLdPrice(html)).toBe("USD 30");
  });

  it("skips a malformed block without throwing", () => {
    const html = `<script type="application/ld+json">{ not json }</script>`;
    expect(jsonLdPrice(html)).toBe("");
  });

  it("returns empty string when no price is present", () => {
    expect(jsonLdPrice(wrap({ "@type": "Product", name: "Chair" }))).toBe("");
  });
});
