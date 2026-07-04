type ScreenComplexity = 'simple' | 'medium' | 'hard';

export interface BuildTimeResult {
  vibecoding: string;
  hybrid: string;
  manual: string;
  disclaimer: string;
  breakdown: string;
  stepTimings: string[]; // per-step times that sum to the VibeCoding total
}

const MULTIPLIERS: Record<ScreenComplexity, number> = {
  simple: 0.5, // 30 mins per screen (static UI)
  medium: 1,   // 1 hr per screen (API + state)
  hard: 2,     // 2 hrs per screen (realtime, complex logic)
};

function formatTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  if (hours < 24) return `${Math.round(hours)} hrs`;
  const days = Math.round(hours / 8); // 8hr workday
  return `${days} days`;
}

// Step weight by position: first (setup) and last (polish) are lighter than core middle steps
function stepWeight(index: number, total: number): number {
  if (total === 1) return 1;
  if (index === 0) return 1.0;           // auth/onboarding — lighter
  if (index === total - 1) return 0.75;  // polish/testing — lightest
  return 1.5;                            // core screens — heaviest
}

export function estimateBuildTime(
  screenCount: number,
  complexityScore: string,
  stepCount = 0,
): BuildTimeResult {
  const lc = (complexityScore ?? '').toLowerCase();
  const complexity: ScreenComplexity =
    lc === 'easy' ? 'simple' : lc === 'medium' ? 'medium' : 'hard';

  const baseHours = screenCount * MULTIPLIERS[complexity];

  // Manual = base (1×)
  // Hybrid = base ÷ 4  (AI handles ~75% of work)
  // VibeCoding = base ÷ 8  (AI handles ~87% of work)
  const manualHours = baseHours;
  const hybridHours = baseHours / 4;
  const vibeHours = baseHours / 8;

  // Distribute vibeHours across build steps proportionally so they sum correctly
  const stepTimings: string[] = [];
  if (stepCount > 0) {
    const weights = Array.from({ length: stepCount }, (_, i) => stepWeight(i, stepCount));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    for (const w of weights) {
      stepTimings.push(formatTime((vibeHours * w) / totalWeight));
    }
  }

  return {
    vibecoding: formatTime(vibeHours),
    hybrid: formatTime(hybridHours),
    manual: formatTime(manualHours),
    breakdown: `Based on ${screenCount} screens × ${MULTIPLIERS[complexity]}hr/${complexity} complexity`,
    disclaimer: `Estimates based on screen complexity analysis. Actual time varies by developer experience and tooling.`,
    stepTimings,
  };
}
