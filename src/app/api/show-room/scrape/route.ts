import { checkPassword } from "@/lib/showroom";

const PRIVATE_HOST =
  /^(localhost|.*\.local|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$)/i;

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
  if (!/^https?:$/.test(parsed.protocol) || PRIVATE_HOST.test(parsed.hostname)) {
    return Response.json({ error: "blocked url" }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.href, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    const html = await res.text();

    const title =
      meta(html, "og:title") || (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim();
    const image = meta(html, "og:image") || meta(html, "twitter:image");
    const amount = meta(html, "og:price:amount") || meta(html, "product:price:amount");
    const currency = meta(html, "og:price:currency") || meta(html, "product:price:currency");
    const price =
      (amount ? `${currency} ${amount}`.trim() : "") || meta(html, "price") || jsonLdPrice(html);

    return Response.json({ title, image, price });
  } catch {
    return Response.json({ title: "", image: "", price: "" });
  }
}
