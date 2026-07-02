// Pure HTML/metadata parsing helpers for the scrape route. No I/O — unit-tested.

export function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

export function meta(html: string, name: string): string {
  // matches both <meta property="x" content="y"> and <meta content="y" property="x">
  const re = new RegExp(
    `<meta[^>]+(?:property|name|itemprop)=["']${name}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${name}["']`,
    "i"
  );
  const m = html.match(re);
  return m ? (m[1] ?? m[2] ?? "").trim() : "";
}

export function jsonLdPrice(html: string): string {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw);
      const nodes = Array.isArray(data) ? data : [data, ...(data["@graph"] ?? [])];
      for (const node of nodes) {
        const offers = node?.offers;
        const offer = Array.isArray(offers) ? offers[0] : offers;
        const price = offer?.price ?? offer?.lowPrice;
        if (price) {
          const currency = offer?.priceCurrency ?? "";
          return `${currency} ${price}`.trim();
        }
      }
    } catch {
      // malformed JSON-LD — skip block
    }
  }
  return "";
}
