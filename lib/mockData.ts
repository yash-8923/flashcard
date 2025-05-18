import { Flashcard, Category, Badge, UserStats, AppSettings, FlashcardStats } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const categories: Category[] = [
  { id: "1", name: "Math" },
  { id: "2", name: "Science" },
  { id: "3", name: "History" },
  { id: "4", name: "Geography" },
  { id: "5", name: "Languages" },
];

export const flashcards: Flashcard[] = [
  // Math
  { id: "m1", question: "What is 2+2?", answer: "4", category: "1" },
  { id: "m2", question: "What is the square root of 16?", answer: "4", category: "1" },
  { id: "m3", question: "What is 7×8?", answer: "56", category: "1" },
  { id: "m4", question: "What is the formula for the area of a circle?", answer: "πr²", category: "1" },
  { id: "m5", question: "What is 3² + 4²?", answer: "25", category: "1" },
  { id: "m6", question: "What is the definition of a prime number?", answer: "A number greater than 1 that is only divisible by 1 and itself", category: "1" },
  { id: "m7", question: "What is the value of π (pi) to 2 decimal places?", answer: "3.14", category: "1" },
  { id: "m8", question: "What is the formula for the Pythagorean theorem?", answer: "a² + b² = c²", category: "1" },
  { id: "m9", question: "What is the derivative of x²?", answer: "2x", category: "1" },
  { id: "m10", question: "What is the sum of angles in a triangle?", answer: "180°", category: "1" },
  
  // Science
  { id: "s1", question: "What is the chemical symbol for water?", answer: "H₂O", category: "2" },
  { id: "s2", question: "What is the first element on the periodic table?", answer: "Hydrogen (H)", category: "2" },
  { id: "s3", question: "What gas do plants absorb from the atmosphere?", answer: "Carbon dioxide (CO₂)", category: "2" },
  { id: "s4", question: "What is the speed of light?", answer: "299,792,458 meters per second", category: "2" },
  { id: "s5", question: "What is the closest planet to the Sun?", answer: "Mercury", category: "2" },
  { id: "s6", question: "What is the chemical formula for table salt?", answer: "NaCl (Sodium Chloride)", category: "2" },
  { id: "s7", question: "What is the largest organ in the human body?", answer: "Skin", category: "2" },
  { id: "s8", question: "What are the building blocks of proteins?", answer: "Amino acids", category: "2" },
  { id: "s9", question: "What is Newton's First Law of Motion?", answer: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force", category: "2" },
  { id: "s10", question: "What type of radiation has the longest wavelength?", answer: "Radio waves", category: "2" },
  
  // History
  { id: "h1", question: "In what year did World War II end?", answer: "1945", category: "3" },
  { id: "h2", question: "Who was the first President of the United States?", answer: "George Washington", category: "3" },
  { id: "h3", question: "In what year did the Berlin Wall fall?", answer: "1989", category: "3" },
  { id: "h4", question: "Who wrote the Declaration of Independence?", answer: "Thomas Jefferson", category: "3" },
  { id: "h5", question: "What ancient civilization built the pyramids of Giza?", answer: "Ancient Egyptians", category: "3" },
  { id: "h6", question: "Who was the first Emperor of Rome?", answer: "Augustus (Octavian)", category: "3" },
  { id: "h7", question: "What year did Christopher Columbus first reach the Americas?", answer: "1492", category: "3" },
  { id: "h8", question: "Who was the leader of the Soviet Union during the Cuban Missile Crisis?", answer: "Nikita Khrushchev", category: "3" },
  { id: "h9", question: "What event started World War I?", answer: "The assassination of Archduke Franz Ferdinand", category: "3" },
  { id: "h10", question: "When was the Magna Carta signed?", answer: "1215", category: "3" },
  
  // Geography
  { id: "g1", question: "What is the capital of France?", answer: "Paris", category: "4" },
  { id: "g2", question: "What is the largest ocean on Earth?", answer: "Pacific Ocean", category: "4" },
  { id: "g3", question: "What is the longest river in the world?", answer: "Nile River", category: "4" },
  { id: "g4", question: "What is the tallest mountain in the world?", answer: "Mount Everest", category: "4" },
  { id: "g5", question: "What country has the largest population?", answer: "China", category: "4" },
  { id: "g6", question: "What is the largest country by land area?", answer: "Russia", category: "4" },
  { id: "g7", question: "What is the smallest country in the world?", answer: "Vatican City", category: "4" },
  { id: "g8", question: "What is the capital of Japan?", answer: "Tokyo", category: "4" },
  { id: "g9", question: "What mountain range separates Europe from Asia?", answer: "The Ural Mountains", category: "4" },
  { id: "g10", question: "What is the largest desert in the world?", answer: "Antarctic Desert", category: "4" },
  
  // Languages
  { id: "l1", question: "How do you say 'hello' in Spanish?", answer: "Hola", category: "5" },
  { id: "l2", question: "How do you say 'thank you' in French?", answer: "Merci", category: "5" },
  { id: "l3", question: "How do you say 'goodbye' in German?", answer: "Auf Wiedersehen", category: "5" },
  { id: "l4", question: "How do you say 'yes' in Japanese?", answer: "Hai", category: "5" },
  { id: "l5", question: "What is the most spoken language in the world?", answer: "Mandarin Chinese", category: "5" },
  { id: "l6", question: "What alphabet does Russian use?", answer: "Cyrillic", category: "5" },
  { id: "l7", question: "How many letters are in the English alphabet?", answer: "26", category: "5" },
  { id: "l8", question: "How do you say 'I love you' in Italian?", answer: "Ti amo", category: "5" },
  { id: "l9", question: "What language has the most native speakers?", answer: "Mandarin Chinese", category: "5" },
  { id: "l10", question: "How many official languages does the United Nations have?", answer: "6 (Arabic, Chinese, English, French, Russian, Spanish)", category: "5" },
];

export const badges: Badge[] = [
  {
    id: "1",
    name: "5 Cards Master",
    description: "Mark 5 'Know' cards in a row",
    icon: "award",
    isUnlocked: false,
    unlockCondition: "5 consecutive correct answers"
  },
  {
    id: "2",
    name: "Perfect Deck",
    description: "100% 'Know' in a deck",
    icon: "star",
    isUnlocked: false,
    unlockCondition: "Complete a full deck with no errors"
  },
  {
    id: "3",
    name: "Review Pro",
    description: "Complete 3 decks",
    icon: "trophy",
    isUnlocked: false,
    unlockCondition: "Complete 3 full decks"
  },
  {
    id: "4",
    name: "Speed Learner",
    description: "Answer 10 cards in under 5 seconds each",
    icon: "zap",
    isUnlocked: false,
    unlockCondition: "10 quick answers under 5 seconds each"
  },
  {
    id: "5",
    name: "Focus Master",
    description: "Study for 15 minutes straight",
    icon: "brain",
    isUnlocked: false,
    unlockCondition: "15 minutes of continuous study"
  }
];

export const defaultUserStats: UserStats = {
  points: 0,
  streak: 0,
  totalReviewed: 0,
  knownCount: 0,
  notKnownCount: 0,
  streakSaverTokens: 0,
  badges: badges,
  reviewHistory: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 7, notKnownCount: 3 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 8, notKnownCount: 2 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 6, notKnownCount: 4 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 9, notKnownCount: 1 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 5, notKnownCount: 5 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], knownCount: 10, notKnownCount: 0 },
    { date: new Date().toISOString().split('T')[0], knownCount: 0, notKnownCount: 0 }
  ]
};

export const defaultSettings: AppSettings = {
  soundEffects: true,
  timerEnabled: true,
  flipAnimationSpeed: 'medium',
  accentColor: '#6F3CFA'
};

// Function to get category name by id
export function getCategoryName(categoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : "Unknown";
}

// Function to get flashcards by category
export function getFlashcardsByCategory(categoryId: string): Flashcard[] {
  return flashcards.filter(card => card.category === categoryId);
}

// Mock flashcard stats for performance by category
const mockFlashcardStats: FlashcardStats[] = [
  // Math stats (m1-m10)
  ...Array.from({ length: 7 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `m${i + 1}`,
    isKnown: true,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `m${i + 8}`,
    isKnown: false,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),

  // Science stats (s1-s10)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `s${i + 1}`,
    isKnown: true,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `s${i + 9}`,
    isKnown: false,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),

  // History stats (h1-h10)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `h${i + 1}`,
    isKnown: true,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `h${i + 6}`,
    isKnown: false,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),

  // Geography stats (g1-g10)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `g${i + 1}`,
    isKnown: true,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),
  ...Array.from({ length: 1 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `g${i + 10}`,
    isKnown: false,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),

  // Languages stats (l1-l10)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `l${i + 1}`,
    isKnown: true,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: uuidv4(),
    flashcardId: `l${i + 7}`,
    isKnown: false,
    reviewDate: new Date().toISOString(),
    reviewTime: Math.floor(Math.random() * 15) + 5
  }))
];

// Function to get mock flashcard stats
export function getMockFlashcardStats(): FlashcardStats[] {
  return mockFlashcardStats;
}