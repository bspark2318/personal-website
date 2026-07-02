import { checkPassword } from "@/lib/showroom";

const PRIVATE_HOST =
  /^(localhost|.*\.local|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$)/i;

function decode(s: string): string {
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

function isBlocked(u: URL): boolean {
  return !/^https?:$/.test(u.protocol) || PRIVATE_HOST.test(u.hostname);
}

// Follow redirects manually, re-validating every hop against the private-host
// blocklist so a public URL can't 30x into an internal address (SSRF).
async function fetchFollowing(start: URL): Promise<Response> {
  let current = start;
  for (let hop = 0; hop < 5; hop++) {
    if (isBlocked(current)) throw new Error("blocked");
    const res = await fetch(current.href, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "manual",
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res;
      current = new URL(loc, current);
      continue;
    }
    return res;
  }
  throw new Error("too many redirects");
}

function meta(html: string, name: string): string {
  // matches both <meta property="x" content="y"> and <meta content="y" property="x">
  const re = new RegExp(
    `<meta[^>]+(?:property|name|itemprop)=["']${name}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${name}["']`,
    "i"
  );
  const m = html.match(re);
  return m ? (m[1] ?? m[2] ?? "").trim() : "";
}

function jsonLdPrice(html: string): string {
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

export async function POST(req: Request) {
  if (!checkPassword(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { url } = await req.json().catch(() => ({}));
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json({ error: "invalid url" }, { status: 400 });
  }
  if (isBlocked(parsed)) {
    return Response.json({ error: "blocked url" }, { status: 400 });
  }

  try {
    const res = await fetchFollowing(parsed);
    const html = await res.text();

    const title = decode(
      meta(html, "og:title") || (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim()
    );
    const image = decode(meta(html, "og:image") || meta(html, "twitter:image"));
    const amount = meta(html, "og:price:amount") || meta(html, "product:price:amount");
    const currency = meta(html, "og:price:currency") || meta(html, "product:price:currency");
    const price = decode(
      (amount ? `${currency} ${amount}`.trim() : "") || meta(html, "price") || jsonLdPrice(html)
    );

    return Response.json({ title, image, price });
  } catch {
    return Response.json({ title: "", image: "", price: "" });
  }
}
