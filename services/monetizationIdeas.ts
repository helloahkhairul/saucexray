import type { CreatorProfile } from './creatorAnalyzer';

const DEEPSEEK_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_KEY ?? '';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export interface AppIdea {
  name: string;
  tagline: string;
  description: string;
  targetAudience: string;
  revenueModel: string;
  estimatedRevenue: string;
  buildDifficulty: 'Easy' | 'Medium' | 'Hard';
  keyFeatures: string[];
}

const PROMPT = (p: CreatorProfile) =>
  `You are an app monetization strategist. A ${p.platform} creator "${p.name}" has ${p.followersDisplay}.
Bio: "${p.bio || 'N/A'}"

Generate exactly 3 app business ideas this creator could build to monetize their audience.
Reply with ONLY a JSON array, no extra text:
[{"name":"","tagline":"","description":"","targetAudience":"","revenueModel":"","estimatedRevenue":"","buildDifficulty":"Easy","keyFeatures":["","",""]},...]
Rules: buildDifficulty must be Easy, Medium, or Hard. Make ideas specific to this creator's niche. Keep descriptions to 2 sentences.`;

export async function generateMonetizationIdeas(profile: CreatorProfile): Promise<AppIdea[]> {
  if (!DEEPSEEK_KEY) throw new Error('Missing EXPO_PUBLIC_DEEPSEEK_KEY');

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: PROMPT(profile) }],
      max_tokens: 700,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw: string = data.choices[0].message.content;
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(json) as AppIdea[];
}
