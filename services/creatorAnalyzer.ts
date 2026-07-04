const SCRAPECREATORS_KEY = process.env.EXPO_PUBLIC_SCRAPECREATORS_KEY ?? '';
const BASE_URL = 'https://api.scrapecreators.com';

export type Platform = 'youtube' | 'tiktok' | 'instagram';

export interface CreatorProfile {
  platform: Platform;
  handle: string;
  name: string;
  bio: string;
  followers: number;
  followersDisplay: string;
  avgViews?: number;
  avgViewsDisplay?: string;
  category?: string;
  thumbnailUrl?: string;
  verified?: boolean;
}

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

async function scrape(path: string): Promise<Record<string, unknown>> {
  if (!SCRAPECREATORS_KEY) throw new Error('Missing EXPO_PUBLIC_SCRAPECREATORS_KEY in .env.local');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-api-key': SCRAPECREATORS_KEY },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ScrapeCreators ${res.status}: ${err}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

function num(v: unknown): number {
  return parseInt(String(v ?? 0).replace(/\D/g, ''), 10) || 0;
}

function str(v: unknown): string {
  return v != null && v !== 'null' && v !== 'undefined' ? String(v) : '';
}

export async function analyzeYouTube(handle: string): Promise<CreatorProfile> {
  const clean = handle.startsWith('@') ? handle : `@${handle}`;
  const data = await scrape(`/v1/youtube/channel?handle=${encodeURIComponent(clean)}`);

  // Response is flat at top level.
  // data.channel is a URL string — do NOT use it as the channel object.
  // Fields: name, description, subscriberCount, subscriberCountText,
  //         viewCount, viewCountText, isVerified, handle
  //         avatar: { image: { sources: [{ url, width, height }] } }

  const followers = num(data.subscriberCount);
  const views = num(data.viewCount);

  // Avatar is nested, not a plain string
  type AvatarShape = { image?: { sources?: { url: string }[] } };
  const avatarSources = (data.avatar as AvatarShape)?.image?.sources ?? [];
  // Prefer the largest available source
  const thumbnailUrl = avatarSources[avatarSources.length - 1]?.url
    ?? avatarSources[0]?.url
    ?? '';

  return {
    platform: 'youtube',
    handle: clean,
    name: str(data.name) || clean,
    bio: str(data.description).slice(0, 300),
    followers,
    followersDisplay: str(data.subscriberCountText) || `${formatCount(followers)} subscribers`,
    avgViews: views || undefined,
    avgViewsDisplay: str(data.viewCountText) || (views ? `${formatCount(views)} total views` : undefined),
    category: '',
    thumbnailUrl,
    verified: Boolean(data.isVerified),
  };
}

export async function analyzeTikTok(handle: string): Promise<CreatorProfile> {
  const clean = handle.startsWith('@') ? handle.slice(1) : handle;
  const data = await scrape(`/v1/tiktok/profile?handle=${encodeURIComponent(clean)}`);

  // Response: { user: { ... }, stats: { ... }, statsV2: { ... } }
  const u = (data.user ?? {}) as Record<string, unknown>;
  // statsV2 has accurate string numbers; fall back to stats integers
  const sv2 = (data.statsV2 ?? data.stats ?? {}) as Record<string, unknown>;
  const s = (data.stats ?? {}) as Record<string, unknown>;

  const followers = num(sv2.followerCount ?? s.followerCount);
  const hearts = num(sv2.heartCount ?? sv2.heart ?? s.heart);

  return {
    platform: 'tiktok',
    handle: `@${clean}`,
    name: str(u.nickname ?? u.uniqueId) || clean,
    bio: str(u.signature).slice(0, 300),
    followers,
    followersDisplay: `${formatCount(followers)} followers`,
    avgViews: hearts || undefined,
    avgViewsDisplay: hearts ? `${formatCount(hearts)} total likes` : undefined,
    thumbnailUrl: str(u.avatarThumb ?? u.avatarMedium ?? u.avatarLarger),
    verified: Boolean(u.verified),
  };
}

export async function analyzeInstagram(handle: string): Promise<CreatorProfile> {
  const clean = handle.startsWith('@') ? handle.slice(1) : handle;
  const data = await scrape(`/v1/instagram/profile?handle=${encodeURIComponent(clean)}`);

  // Response: { success, data: { user: { ... } } }
  const root = (data.data ?? data) as Record<string, unknown>;
  const u = (root.user ?? root) as Record<string, unknown>;
  const edgeFollowedBy = u.edge_followed_by as { count?: number } | undefined;

  const followers = num(edgeFollowedBy?.count ?? u.followers ?? u.followerCount);

  // Instagram's CDN blocks cross-origin image loading — proxy via Supabase edge function
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const rawPic = str(u.profile_pic_url_hd ?? u.profile_pic_url ?? u.profilePicUrl ?? u.profilePicUrlHd);
  const thumbnailUrl = rawPic && supabaseUrl
    ? `${supabaseUrl}/functions/v1/avatar-proxy?url=${encodeURIComponent(rawPic)}`
    : rawPic;

  return {
    platform: 'instagram',
    handle: `@${clean}`,
    name: str(u.full_name ?? u.fullName ?? u.name) || clean,
    bio: str(u.biography ?? u.bio).slice(0, 300),
    followers,
    followersDisplay: `${formatCount(followers)} followers`,
    thumbnailUrl,
    category: str(u.category_name ?? u.business_category_name),
    verified: Boolean(u.is_verified ?? u.isVerified),
  };
}
