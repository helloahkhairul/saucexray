import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisResult } from './analyzer';

export type HistoryItem = AnalysisResult & { saved_at: string };

const KEY = '@saucexray_history';

export async function addToHistory(result: AnalysisResult): Promise<void> {
  const items = await loadHistory();
  const deduped = items.filter((h) => h.app_url !== result.app_url);
  const updated: HistoryItem[] = [
    { ...result, saved_at: new Date().toISOString() },
    ...deduped,
  ].slice(0, 50);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export async function removeFromHistory(appUrl: string): Promise<void> {
  const items = await loadHistory();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify(items.filter((h) => h.app_url !== appUrl))
  );
}
