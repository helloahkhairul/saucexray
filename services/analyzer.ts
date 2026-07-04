import type { AnalysisRow } from './supabase';

export type AnalysisResult = Omit<AnalysisRow, 'id' | 'user_id' | 'created_at'>;

const DEEPSEEK_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_KEY ?? '';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export function extractAppName(url: string): string {
  try {
    const m = url.match(/\/app\/([^/]+)\//);
    if (m) return decodeURIComponent(m[1]).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const p = url.match(/id=([^&]+)/);
    if (p) { const parts = p[1].split('.'); const n = parts[parts.length - 1] ?? 'App'; return n.charAt(0).toUpperCase() + n.slice(1); }
  } catch {}
  return 'Unknown App';
}

function toDifficulty(s: string): 'Easy' | 'Medium' | 'Hard' {
  const l = (s ?? '').toLowerCase();
  if (l.includes('easy') || l.includes('low')) return 'Easy';
  if (l.includes('hard') || l.includes('high') || l.includes('complex')) return 'Hard';
  return 'Medium';
}

interface StoreMetadata {
  iconUrl?: string;
  name?: string;
  developer?: string;
  rating?: number;
  price?: string;
  category?: string;
}

async function fetchStoreMetadata(appUrl: string): Promise<StoreMetadata> {
  try {
    // App Store — iTunes lookup (official API, CORS-friendly)
    const appStoreId = appUrl.match(/\/id(\d+)/)?.[1];
    if (appStoreId) {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${appStoreId}`);
      const data = await res.json();
      const app = data.results?.[0];
      if (app) {
        const rawRating = parseFloat(app.averageUserRating);
        return {
          iconUrl: (app.artworkUrl512 ?? app.artworkUrl100) as string | undefined,
          name: app.trackName as string | undefined,
          developer: app.artistName as string | undefined,
          rating: isNaN(rawRating) ? undefined : Math.round(rawRating * 10) / 10,
          price: app.formattedPrice === '0' || app.formattedPrice === '$0.00'
            ? 'Free'
            : (app.formattedPrice as string | undefined),
          category: app.primaryGenreName as string | undefined,
        };
      }
    }

    // Play Store — Supabase edge function (returns icon + metadata)
    const pkg = appUrl.match(/[?&]id=([^&]+)/)?.[1];
    if (pkg) {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/play-icon?pkg=${encodeURIComponent(pkg)}`,
        );
        if (res.ok) {
          const data = await res.json() as {
            iconUrl?: string | null;
            name?: string | null;
            developer?: string | null;
            rating?: number | null;
            price?: string | null;
            category?: string | null;
          };
          return {
            iconUrl: data.iconUrl ?? undefined,
            name: data.name ?? undefined,
            developer: data.developer ?? undefined,
            rating: data.rating ?? undefined,
            price: data.price ?? undefined,
            category: data.category ?? undefined,
          };
        }
      }
    }
  } catch {}
  return {};
}

function mapAiToResult(url: string, ai: Record<string, unknown>): AnalysisResult {
  return {
    app_url: url,
    app_name: (ai.appName as string) ?? extractAppName(url),
    developer: (ai.developer as string) ?? '',
    category: (ai.category as string) ?? '',
    rating: parseFloat(ai.rating as string) || 0,
    price: (ai.price as string) ?? 'Free',
    screen_count: parseInt(ai.screenCount as string) || 0,
    difficulty: toDifficulty((ai.difficulty as string) ?? 'Medium'),
    overview: (ai.overview as string) ?? '',
    target_audience: (ai.targetAudience as string) ?? '',
    monetization: (ai.monetization as string) ?? '',
    complaints: Array.isArray(ai.complaints) ? (ai.complaints as string[]) : [],
    screen_flow: Array.isArray(ai.screenFlow) ? (ai.screenFlow as string[]) : [],
    must_have_features: Array.isArray(ai.mustHaveFeatures) ? (ai.mustHaveFeatures as string[]) : [],
    nice_to_have_features: Array.isArray(ai.niceToHaveFeatures) ? (ai.niceToHaveFeatures as string[]) : [],
    tech_stack: Array.isArray(ai.techStack) ? (ai.techStack as string[]) : [],
    improvement_opportunities: Array.isArray(ai.improvements) ? (ai.improvements as string[]) : [],
    build_steps: Array.isArray(ai.buildSteps)
      ? (ai.buildSteps as { step?: string; label?: string; time: string }[]).map((s) => ({
          label: s.step ?? s.label ?? '',
          time: s.time ?? '',
        }))
      : [],
  };
}

const PROMPT = (url: string, real?: StoreMetadata) => {
  const facts = real?.name
    ? `\nVERIFIED store facts (copy these EXACTLY into your JSON — do NOT change them):
- appName: "${real.name}"
- developer: "${real.developer ?? ''}"
- rating: "${real.rating != null ? real.rating.toFixed(1) : ''}"
- price: "${real.price ?? 'Free'}"
- category: "${real.category ?? ''}"\n`
    : '';
  return `Analyze this app store URL: ${url}${facts}
Reply with ONLY this JSON, no extra text:
{"appName":"","developer":"","category":"","rating":"4.0","price":"Free","overview":"1-2 sentences","targetAudience":"","monetization":"","complaints":["","",""],"screenCount":10,"screenFlow":["Home","Detail"],"mustHaveFeatures":[""],"niceToHaveFeatures":[""],"techStack":[""],"difficulty":"Easy","improvements":["","",""],"buildSteps":[{"step":"Auth","time":"1hr"},{"step":"Core","time":"2hrs"},{"step":"Polish","time":"1hr"}]}
Rules: difficulty must be exactly one of: Easy, Medium, Hard. screenCount must be an integer.`;
};

export async function analyzeApp(url: string): Promise<AnalysisResult> {
  if (!DEEPSEEK_KEY) throw new Error('Missing EXPO_PUBLIC_DEEPSEEK_KEY in .env.local');

  // Fetch real store metadata in parallel with nothing (before AI so we can anchor the prompt)
  const real = await fetchStoreMetadata(url);

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: PROMPT(url, real) }],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw: string = data.choices[0].message.content;
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const result = mapAiToResult(url, JSON.parse(json));

  // Override AI values with verified store data — these are facts, not estimates
  if (real.iconUrl) result.icon_url = real.iconUrl;
  if (real.name) result.app_name = real.name;
  if (real.developer) result.developer = real.developer;
  if (real.rating != null) result.rating = real.rating;
  if (real.price) result.price = real.price;
  if (real.category) result.category = real.category;

  return result;
}
