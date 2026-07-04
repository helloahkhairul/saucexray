import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CreatorAnalysisResult } from './creatorStore';

export type CreatorHistoryItem = CreatorAnalysisResult & { saved_at: string };

const KEY = '@saucexray_creator_history';
const MAX = 30;

export async function addCreatorToHistory(result: CreatorAnalysisResult): Promise<void> {
  const existing = await loadCreatorHistory();
  const filtered = existing.filter(
    (h) => !(h.profile.handle === result.profile.handle && h.profile.platform === result.profile.platform),
  );
  const updated: CreatorHistoryItem[] = [
    { ...result, saved_at: new Date().toISOString() },
    ...filtered,
  ].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function loadCreatorHistory(): Promise<CreatorHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CreatorHistoryItem[];
  } catch {
    return [];
  }
}

export async function removeCreatorFromHistory(handle: string, platform: string): Promise<void> {
  const existing = await loadCreatorHistory();
  const updated = existing.filter(
    (h) => !(h.profile.handle === handle && h.profile.platform === platform),
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}
