import type { AnalysisResult } from './analyzer';

let _lastResult: AnalysisResult | null = null;

export function setLastResult(r: AnalysisResult): void {
  _lastResult = r;
}

export function getLastResult(): AnalysisResult | null {
  return _lastResult;
}

export function clearLastResult(): void {
  _lastResult = null;
}
