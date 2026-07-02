import { checkPassword } from "@/lib/showroom";
import { decode, jsonLdPrice, meta } from "@/lib/showroom-scrape";

const PRIVATE_HOST =
  /^(localhost|.*\.local|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$)/i;

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
