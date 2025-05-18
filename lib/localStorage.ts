import { Flashcard, FlashcardStats, UserStats, AppSettings } from "@/types";
import { defaultUserStats, defaultSettings, getMockFlashcardStats } from "./mockData";

// Keys
const CUSTOM_FLASHCARDS_KEY = "flashcard-frenzy-custom-cards";
const FLASHCARD_STATS_KEY = "flashcard-frenzy-stats";
const USER_STATS_KEY = "flashcard-frenzy-user-stats";
const SETTINGS_KEY = "flashcard-frenzy-settings";
const REVIEW_QUEUE_KEY = "flashcard-frenzy-review-queue";

// Custom Flashcards
export function getCustomFlashcards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(CUSTOM_FLASHCARDS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCustomFlashcard(flashcard: Flashcard): void {
  if (typeof window === "undefined") return;
  
  const current = getCustomFlashcards();
  localStorage.setItem(
    CUSTOM_FLASHCARDS_KEY,
    JSON.stringify([...current, flashcard])
  );
}

// Flashcard Stats
export function getFlashcardStats(): FlashcardStats[] {
  // For demo purposes, always return mock data
  return getMockFlashcardStats();
}

export function saveFlashcardStat(stat: FlashcardStats) {
  if (typeof window === "undefined") return;
  
  const stats = getFlashcardStats();
  stats.push(stat);
  localStorage.setItem(FLASHCARD_STATS_KEY, JSON.stringify(stats));
}

// User Stats
export function getUserStats(): UserStats {
  if (typeof window === "undefined") return defaultUserStats;
  
  const stored = localStorage.getItem(USER_STATS_KEY);
  return stored ? JSON.parse(stored) : defaultUserStats;
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}

// App Settings
export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : defaultSettings;
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Review Queue
export function getReviewQueue(): string[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(REVIEW_QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveReviewQueue(cardIds: string[]): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(cardIds));
}

// Clear all storage (for testing)
export function clearAllStorage(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(CUSTOM_FLASHCARDS_KEY);
  localStorage.removeItem(FLASHCARD_STATS_KEY);
  localStorage.removeItem(USER_STATS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(REVIEW_QUEUE_KEY);
}