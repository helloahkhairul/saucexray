const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BROWSER_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
};

interface PlayMetadata {
  iconUrl: string | null;
  name: string | null;
  developer: string | null;
  rating: number | null;
  price: string | null;
  category: string | null;
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i,
    /"(https:\/\/play-lh\.googleusercontent\.com\/[^"\\]+)"/,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]?.startsWith('https://')) return m[1];
  }
  return null;
}

function cleanCategory(raw: string): string {
  // e.g. "GAME_BOARD" → "Board", "APPLICATION_UTILITIES" → "Utilities"
  return raw
    .replace(/^GAME_/, '')
    .replace(/^APPLICATION_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function extractMetadata(html: string): PlayMetadata {
  let name: string | null = null;
  let developer: string | null = null;
  let rating: number | null = null;
  let price: string | null = null;
  let category: string | null = null;

  // ── JSON-LD structured data (most reliable) ──────────────────────────────
  const ldMatches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of ldMatches) {
    try {
      const ld = JSON.parse(match[1]) as Record<string, unknown>;
      if (ld['@type'] === 'SoftwareApplication' || ld['@type'] === 'MobileApplication') {
        if (!name && ld.name) name = String(ld.name).replace(/\s*[-–|].*$/, '').trim();

        const agg = ld.aggregateRating as Record<string, unknown> | undefined;
        if (!rating && agg?.ratingValue) {
          const r = parseFloat(String(agg.ratingValue));
          if (!isNaN(r)) rating = Math.round(r * 10) / 10;
        }

        const offers = Array.isArray(ld.offers) ? ld.offers[0] : ld.offers;
        if (!price && offers) {
          const p = parseFloat(String((offers as Record<string, unknown>).price ?? ''));
          price = p === 0 || isNaN(p) ? 'Free' : `$${p.toFixed(2)}`;
        }

        if (!category && ld.applicationCategory) {
          category = cleanCategory(String(ld.applicationCategory));
        }

        const author = (ld.author ?? ld.publisher) as Record<string, unknown> | undefined;
        if (!developer && author?.name) developer = String(author.name);
      }
    } catch { /* skip malformed */ }
  }

  // ── Developer from Play Store link (fallback) ─────────────────────────────
  if (!developer) {
    // <a href="/store/apps/developer?id=Gametion" ...>Gametion</a>
    const devM =
      html.match(/href="\/store\/apps\/dev(?:eloper)?\?[^"]*"\s[^>]*>\s*([^<]{2,60})\s*</i) ??
      html.match(/href="\/store\/apps\/dev(?:eloper)?\?[^"]*">([^<]{2,60})</i);
    if (devM?.[1]) developer = devM[1].trim();
  }

  // ── og:title fallback for name ────────────────────────────────────────────
  if (!name) {
    const titleM =
      html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ??
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i);
    if (titleM?.[1]) name = titleM[1].replace(/\s*[-–|].*$/, '').trim();
  }

  return { iconUrl: extractOgImage(html), name, developer, rating, price, category };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { searchParams } = new URL(req.url);
  const pkg = searchParams.get('pkg');

  const empty: PlayMetadata = { iconUrl: null, name: null, developer: null, rating: null, price: null, category: null };

  if (!pkg) {
    return new Response(JSON.stringify(empty), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const urls = [
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=en&gl=US`,
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=en`,
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS, redirect: 'follow' });
      if (res.status === 200) {
        const html = await res.text();
        const meta = extractMetadata(html);
        if (meta.iconUrl || meta.name) {
          return new Response(JSON.stringify(meta), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    } catch { continue; }
  }

  return new Response(JSON.stringify(empty), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
