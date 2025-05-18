export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface FlashcardStats {
  id: string;
  flashcardId: string;
  isKnown: boolean;
  reviewDate: string;
  reviewTime: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockCondition: string;
}

export interface UserStats {
  points: number;
  streak: number;
  totalReviewed: number;
  knownCount: number;
  notKnownCount: number;
  streakSaverTokens: number;
  badges: Badge[];
  reviewHistory: {
    date: string;
    knownCount: number;
    notKnownCount: number;
  }[];
}

export interface AppSettings {
  soundEffects: boolean;
  timerEnabled: boolean;
  flipAnimationSpeed: 'fast' | 'medium' | 'slow';
  accentColor: string;
}