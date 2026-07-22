import type { HistoryRecord, PredictionResponse } from "@/types/medical";

const STORAGE_KEY = "myeye-history";
const LATEST_KEY = "myeye-latest";

export function loadHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(records: HistoryRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveResult(result: PredictionResponse) {
  const history = loadHistory();
  const record: HistoryRecord = {
    ...result,
    id: `${Date.now()}`,
    createdAt: result.createdAt || new Date().toISOString(),
  };
  const next = [record, ...history].slice(0, 12);
  saveHistory(next);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(record));
  }
  return record;
}

export function loadLatestResult(): PredictionResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LATEST_KEY);
    return raw ? (JSON.parse(raw) as PredictionResponse) : null;
  } catch {
    return null;
  }
}

export function setLatestResult(result: PredictionResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LATEST_KEY, JSON.stringify(result));
}

export function deleteHistoryItem(id: string) {
  const next = loadHistory().filter((item) => item.id !== id);
  saveHistory(next);
}
