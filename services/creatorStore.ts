import type { CreatorProfile } from './creatorAnalyzer';
import type { AppIdea } from './monetizationIdeas';

export interface CreatorAnalysisResult {
  profile: CreatorProfile;
  ideas: AppIdea[];
}

let _result: CreatorAnalysisResult | null = null;

export function setCreatorResult(r: CreatorAnalysisResult): void { _result = r; }
export function getCreatorResult(): CreatorAnalysisResult | null { return _result; }
export function clearCreatorResult(): void { _result = null; }
